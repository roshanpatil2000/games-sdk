import { NextResponse } from "next/server";
import { searchGamesInDb } from "@/lib/local-games";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const limitParam = Number(searchParams.get("limit") ?? 20);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;

    if (!q) {
        return NextResponse.json({ items: [] });
    }

    const items = await searchGamesInDb(q, limit);

    return NextResponse.json({ items }, {
        headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
        },
    });
}
