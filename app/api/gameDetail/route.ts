import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get("namespace");
    const gameId = searchParams.get("gameId");

    if (!namespace && !gameId) {
        return NextResponse.json(
            { error: "Missing namespace or gameId" },
            { status: 400 }
        );
    }

    const rows = await db
        .select()
        .from(gamesTable)
        .where(namespace ? eq(gamesTable.namespace, namespace) : eq(gamesTable.gameID, String(gameId)))
        .limit(1);

    if (!rows.length) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], {
        headers: {
            "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        },
    });
}
