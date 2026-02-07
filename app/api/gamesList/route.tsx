import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * Fetch GamePix with timeout
 */
async function fetchGamePix(url: string, timeoutMs = 15000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal: controller.signal,
        });

        if (!res.ok) {
            throw new Error(`GamePix responded with ${res.status}`);
        }

        return await res.json();
    } finally {
        clearTimeout(timeout);
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? 1);
    const PAGE_SIZE = 48;

    const url = `https://feeds.gamepix.com/v2/json/?order=quality&page=${page}&pagination=${PAGE_SIZE}&sid=0E766`;

    try {
        // 1️⃣ Try GamePix first
        const data = await fetchGamePix(url);

        // 2️⃣ Persist snapshot to DB (best-effort)
        if (Array.isArray(data.items) && data.items.length > 0) {
            try {
                console.log(`🟡 DB insert started (page=${page}, items=${data.items.length})`);

                await db
                    .insert(gamesTable)
                    .values(
                        data.items.map((game: any) => ({
                            gameID: game.id,
                            title: game.title,
                            namespace: game.namespace,
                            description: game.description ?? null,
                            category: game.category ?? null,
                            orientation: game.orientation ?? null,
                            qualityScore: String(game.quality_score ?? ""),
                            width: game.width ? String(game.width) : null,
                            height: game.height ? String(game.height) : null,
                            dateModified: game.date_modified ?? null,
                            datePublished: game.date_published ?? null,
                            bannerImage: game.banner_image ?? null,
                            image: game.image ?? null,
                            url: game.url,
                        }))
                    )
                    .onConflictDoUpdate({
                        target: gamesTable.gameID,
                        set: {
                            title: sql`excluded.title`,
                            namespace: sql`excluded.namespace`,
                            description: sql`excluded.description`,
                            category: sql`excluded.category`,
                            orientation: sql`excluded.orientation`,
                            qualityScore: sql`excluded."qualityScore"`,
                            width: sql`excluded.width`,
                            height: sql`excluded.height`,
                            dateModified: sql`excluded.date_modified`,
                            datePublished: sql`excluded.date_published`,
                            bannerImage: sql`excluded.banner_image`,
                            image: sql`excluded.image`,
                            url: sql`excluded.url`,
                        },
                    });

                console.log(`🟢 DB insert completed (page=${page})`);
            } catch (dbError) {
                console.error(`🔴 DB insert failed (page=${page})`, dbError);
            }
        }

        return NextResponse.json(
            {
                source: "gamepix",
                ...data,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
                },
            }
        );
    } catch (error) {
        console.warn("⚠️ GamePix failed, falling back to DB", error);

        // 3️⃣ Fallback → DB
        const offset = (page - 1) * PAGE_SIZE;

        const games = await db
            .select()
            .from(gamesTable)
            .limit(PAGE_SIZE)
            .offset(offset);

        if (games.length === 0) {
            return NextResponse.json(
                { error: "No cached data available" },
                { status: 503 }
            );
        }

        return NextResponse.json({
            source: "db",
            page,
            items: games,
        });
    }
}