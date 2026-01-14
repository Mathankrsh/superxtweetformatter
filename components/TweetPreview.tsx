"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TweetPreviewProps {
    tweets: string[];
    isThread: boolean;
}

export function TweetPreview({ tweets, isThread }: TweetPreviewProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const copyAllTweets = async () => {
        const allText = tweets.join("\n\n---\n\n");
        try {
            await navigator.clipboard.writeText(allText);
            setCopiedIndex(-1);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const getCharacterColor = (length: number) => {
        if (length <= 200) return "text-green-500";
        if (length <= 250) return "text-yellow-500";
        if (length <= 280) return "text-primary";
        return "text-destructive";
    };

    if (tweets.length === 0 || !tweets[0]) {
        return (
            <Card className="p-6 bg-card border-border">
                <div className="text-center py-12 text-muted-foreground">
                    <div className="text-4xl mb-4">✍️</div>
                    <p>Your improved tweet will appear here</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    {isThread ? `Thread (${tweets.length} tweets)` : "Preview"}
                </h3>
                {isThread && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyAllTweets}
                        className="text-sm"
                    >
                        {copiedIndex === -1 ? "✓ Copied!" : "Copy all"}
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {tweets.map((tweet, index) => (
                    <div
                        key={index}
                        className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                        {/* Tweet header mockup */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary text-lg">🔥</span>
                            </div>
                            <div>
                                <div className="font-semibold text-sm">Your Tweet</div>
                                <div className="text-xs text-muted-foreground">@you</div>
                            </div>
                            {isThread && (
                                <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {index + 1}/{tweets.length}
                                </span>
                            )}
                        </div>

                        {/* Tweet content */}
                        <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                            {tweet}
                        </div>

                        {/* Footer with character count and copy */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            <span className={`text-sm font-medium ${getCharacterColor(tweet.length)}`}>
                                {tweet.length}/280
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(tweet, index)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {copiedIndex === index ? "✓ Copied!" : "📋 Copy"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
