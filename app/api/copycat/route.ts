import OpenAI from "openai";
import { NextRequest } from "next/server";

export const maxDuration = 60; // Allow 60 seconds for processing

// Initialize OpenRouter client
const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000",
        "X-Title": "CopyCat Detector",
    },
});

// Grok 4.1 Fast with X search enabled via :online suffix
const GROK_MODEL = "x-ai/grok-4.1-fast:online";

// Prompt for OPEN SEARCH (search all of X)
const OPEN_SEARCH_PROMPT = `You are a Twitter/X plagiarism detective. Find ANYONE who copied the original tweet.
**SPEED IS CRITICAL. DO NOT PAGINATE DEEPLY.**

**YOUR TASK:**
1. Extract content/date from the original tweet URL (if provided).
2. Search for unique phrases from the original text.
3. **STOP** as soon as you find **5 strong matches** or if 10 seconds pass.
4. Only return the most relevant "exact copies".

**SEARCH GUARDRAILS:**
- **MAX RESULTS:** Return maximum 5 top copycats.
- **DEPTH:** Do not look past the first page of search results.
- **FILTER:** Only finding tweets posted AFTER original date.
- **IGNORE:** Retweets, replies, and quote tweets. Find original posts.

**OUTPUT FORMAT (JSON ONLY):**
Respond with ONLY valid JSON:
{
  "originalTweetInfo": {
    "content": "Original content",
    "date": "YYYY-MM-DD",
    "url": "url"
  },
  "searchMode": "open",
  "results": [
    {
      "suspect": "@username",
      "isCopycat": true,
      "confidence": "high/medium/low",
      "matchedTweet": {
        "content": "Copied content",
        "url": "https://twitter.com/...",
        "date": "YYYY-MM-DD",
        "similarity": "95%"
      },
      "explanation": "Brief reasoning"
    }
  ],
  "summary": "Found X accounts that appear to have copied this tweet"
}

If no copycats are found anywhere on X, return an empty results array with a summary saying "No copycats found".`;

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const { originalTweet, originalDate, tweetUrl } = await request.json();

        // Validation
        if (!originalTweet && !tweetUrl) {
            return new Response(
                JSON.stringify({ error: "Either original tweet text or tweet URL is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return new Response(
                JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Build the prompt for open search
        let prompt = OPEN_SEARCH_PROMPT + "\n\n---\n";

        if (tweetUrl) {
            prompt += `** ORIGINAL TWEET URL:** ${tweetUrl} \n`;
            prompt += `Please search X to find this tweet and extract its content and date.\n\n`;
        }

        if (originalTweet) {
            prompt += `** ORIGINAL TWEET CONTENT:**\n${originalTweet} \n\n`;
        }

        if (originalDate) {
            prompt += `** ORIGINAL TWEET DATE:** ${originalDate} \n\n`;
        }

        prompt += `\n-- -\n\nNow search across ALL of X for anyone who may have copied this tweet.Find up to 10 potential copycats.Remember: Output ONLY valid JSON.`;

        console.log(`[CopyCat API] Starting OPEN SEARCH with streaming...`);

        // Create streaming response from OpenRouter
        const stream = await openrouter.chat.completions.create({
            model: GROK_MODEL,
            messages: [{ role: "user", content: prompt }],
            stream: true,
        });

        // Create a TransformStream to convert OpenRouter chunks to SSE format
        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller) {
                let fullContent = "";

                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            fullContent += content;
                            // Send progress chunk to keep connection alive
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ type: "chunk", content })}\n\n`)
                            );
                        }
                    }

                    // Parse the accumulated JSON response
                    const cleanedText = fullContent
                        .replace(/^```json\s*/i, "")
                        .replace(/^```\s*/i, "")
                        .replace(/\s*```$/i, "")
                        .trim();

                    let parsedResult;
                    try {
                        parsedResult = JSON.parse(cleanedText);
                    } catch {
                        // Fallback if JSON parsing fails
                        parsedResult = {
                            rawResponse: cleanedText,
                            parseWarning: "Response was not valid JSON, showing raw output",
                        };
                    }

                    // Send final result
                    const finalData = {
                        type: "done",
                        success: true,
                        searchMode: "open",
                        ...parsedResult,
                        processingTime: Date.now() - startTime,
                    };

                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(finalData)}\n\n`)
                    );

                    console.log(`[CopyCat API] Streaming completed in ${Date.now() - startTime}ms`);
                } catch (err: any) {
                    console.error("[CopyCat API] Stream error:", err);
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "error", error: err?.message || "Stream failed" })}\n\n`)
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error: any) {
        console.error("[CopyCat API] Error:", error);
        return new Response(
            JSON.stringify({ error: `Failed to detect copycats: ${error?.message || "Unknown error"}` }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
