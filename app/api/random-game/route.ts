import { fetchGamepixFeed } from "@/lib/gamepix";
import { NextResponse } from "next/server";

type FeedItem = {
    namespace: string;
};

export async function GET() {
    const randomPage = Math.max(1, Math.floor(Math.random() * 40) + 1);
    const data = await fetchGamepixFeed(randomPage, 48);
    const items = (data?.items ?? []) as FeedItem[];

    if (items.length === 0) {
        return NextResponse.json({ namespace: null }, { status: 404 });
    }

    const pick = items[Math.floor(Math.random() * items.length)];
    return NextResponse.json({ namespace: pick.namespace });
}
