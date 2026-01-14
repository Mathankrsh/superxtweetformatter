"use client";

import { useEffect, useState } from "react";

const VISITOR_ID_KEY = "tweet_improver_visitor_id";

// Generate a UUID v4
function generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function useVisitorId() {
    const [visitorId, setVisitorId] = useState<string | null>(null);

    useEffect(() => {
        // Only run on client
        let id = localStorage.getItem(VISITOR_ID_KEY);

        if (!id) {
            id = generateUUID();
            localStorage.setItem(VISITOR_ID_KEY, id);
        }

        setVisitorId(id);
    }, []);

    return visitorId;
}
