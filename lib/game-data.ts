import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";
import { fetchGamepixDetail } from "@/lib/gamepix";
import { cache } from "react";

type GamePixTag = {
    title?: string;
    tagNamespace?: string;
};

export type GameDetailData = {
    title?: string;
    description?: string;
    orientation?: string;
    platforms?: string;
    image?: string;
    banner_image?: string;
    pubDate?: string;
    updatedAt?: string;
    desktopUpVote?: number;
    mobileUpVote?: number;
    scoreRanking?: number;
    topDesktopScore?: number;
    topMobileScore?: number;
    playTotal?: number;
    tags?: GamePixTag[];
    dbUrl?: string | null;
    embedCode?: string;
};

function extractEmbedUrl(embedCode?: string): string | null {
    if (!embedCode) return null;
    const match = embedCode.match(/src=['"]([^'"]+)['"]/);
    return match?.[1] ?? null;
}

export const getDbGame = cache(async (namespace: string) => {
    const rows = await db
        .select()
        .from(gamesTable)
        .where(eq(gamesTable.namespace, namespace))
        .limit(1);

    return rows[0] ?? null;
});

export const getMergedGameDetail = cache(async (namespace: string): Promise<GameDetailData | null> => {
    const [dbGame, gamePixData] = await Promise.all([
        getDbGame(namespace),
        fetchGamepixDetail(namespace),
    ]);

    if (!gamePixData && !dbGame) return null;

    return {
        ...(gamePixData ?? {}),
        dbUrl: dbGame?.url ?? extractEmbedUrl(gamePixData?.embedCode),
    };
});
