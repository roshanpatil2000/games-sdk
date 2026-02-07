import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";
import { sql } from "drizzle-orm";

const PAGE_SIZE = 48;
const MAX_PAGES_SAFE = 2000; // hard safety limit

export async function GET() {
    console.log("🔁 GamePix cron sync started");

    let page = 1;
    let totalInserted = 0;

    try {
        while (page <= MAX_PAGES_SAFE) {
            const url = `https://feeds.gamepix.com/v2/json/?order=quality&page=${page}&pagination=${PAGE_SIZE}&sid=0E766`;

            const res = await fetch(url, {
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                console.error(`❌ Failed at page ${page}`);
                break;
            }

            const data = await res.json();
            const items = Array.isArray(data.items) ? data.items : [];

            if (items.length === 0) {
                console.log("✅ No more items, stopping");
                break;
            }

            // filter invalid rows (important)
            const safeItems = items.filter(
                (g: any) => g.id && g.title && g.namespace && g.url
            );

            if (safeItems.length === 0) {
                console.log(`⚠️ Page ${page} had no valid items`);
                page++;
                continue;
            }

            await db
                .insert(gamesTable)
                .values(
                    safeItems.map((game: any) => ({
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
                        dataSyncedAt: new Date().toISOString(),
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
                        dataSyncedAt: sql`excluded.data_synced_at`,
                    },
                });

            totalInserted += safeItems.length;
            console.log(`✅ Page ${page} synced (${safeItems.length} games)`);

            // stop if last page reached
            if (data.last_page_url && page >= Number(data.last_page_url.split("page=")[1])) {
                break;
            }

            page++;
        }

        console.log(`🎉 Sync finished. Total games processed: ${totalInserted}`);

        return NextResponse.json({
            success: true,
            pagesProcessed: page - 1,
            totalGames: totalInserted,
        });
    } catch (error) {
        console.error("🔥 Cron sync failed:", error);
        return NextResponse.json(
            { error: "Cron sync failed" },
            { status: 500 }
        );
    }
}