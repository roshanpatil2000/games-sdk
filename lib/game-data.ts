import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";

type GamePixTag = {
    title?: string;
    tagNamespace?: string;
};

export type GameDetailData = {
    title?: string;
    description?: string;
    orientation?: string;
    platforms?: string;
    pubDate?: string;
    updatedAt?: string;
    desktopUpVote?: number;
    mobileUpVote?: number;
    scoreRanking?: number;
    topDesktopScore?: number;
    topMobileScore?: number;
    tags?: GamePixTag[];
    dbUrl?: string | null;
};

export async function getDbGame(namespace: string) {
    const rows = await db
        .select()
        .from(gamesTable)
        .where(eq(gamesTable.namespace, namespace))
        .limit(1);

    return rows[0] ?? null;
}

export async function getMergedGameDetail(namespace: string): Promise<GameDetailData | null> {
    const [dbGame, gamePixRes] = await Promise.all([
        getDbGame(namespace),
        fetch(`https://api.gamepix.com/v3/games/ns/${namespace}`, {
            next: { revalidate: 300 },
            headers: { Accept: "application/json" },
        }),
    ]);

    if (!gamePixRes.ok && !dbGame) return null;

    const gamePixData = gamePixRes.ok ? await gamePixRes.json() : {};

    return {
        ...gamePixData,
        dbUrl: dbGame?.url ?? null,
    };
}
