import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const limitParam = Number(searchParams.get("limit") ?? 20);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;

    if (!q) {
        return NextResponse.json({ items: [] });
    }

    const pattern = `%${q}%`;

    const items = await db
        .select()
        .from(gamesTable)
        .where(
            or(
                ilike(gamesTable.title, pattern),
                ilike(gamesTable.namespace, pattern),
                ilike(gamesTable.category, pattern),
                ilike(gamesTable.description, pattern)
            )
        )
        .limit(limit);

    return NextResponse.json({ items }, {
        headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
        },
    });
}
