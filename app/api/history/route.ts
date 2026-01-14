import { db } from "@/utils/db/db";
import { tweetsHistoryTable } from "@/utils/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch history for a visitor
export async function GET(request: NextRequest) {
    try {
        const visitorId = request.nextUrl.searchParams.get("visitorId");

        if (!visitorId) {
            return NextResponse.json(
                { error: "visitorId is required" },
                { status: 400 }
            );
        }

        const history = await db
            .select()
            .from(tweetsHistoryTable)
            .where(eq(tweetsHistoryTable.visitorId, visitorId))
            .orderBy(desc(tweetsHistoryTable.createdAt))
            .limit(20);

        return NextResponse.json({ history });
    } catch (error: any) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}

// POST - Save a new improvement to history
export async function POST(request: NextRequest) {
    try {
        const { visitorId, originalText, improvedText, isThread, mode } = await request.json();

        if (!visitorId || !originalText || !improvedText) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const [inserted] = await db
            .insert(tweetsHistoryTable)
            .values({
                visitorId,
                originalText,
                improvedText,
                isThread: isThread || false,
                mode: mode || "auto",
            })
            .returning();

        return NextResponse.json({ success: true, id: inserted.id });
    } catch (error: any) {
        console.error("Error saving to history:", error);
        return NextResponse.json(
            { error: "Failed to save to history" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a specific history item
export async function DELETE(request: NextRequest) {
    try {
        const { id, visitorId } = await request.json();

        if (!id || !visitorId) {
            return NextResponse.json(
                { error: "id and visitorId are required" },
                { status: 400 }
            );
        }

        await db
            .delete(tweetsHistoryTable)
            .where(eq(tweetsHistoryTable.id, id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting history:", error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 }
        );
    }
}
