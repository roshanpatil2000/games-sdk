import { getMergedGameDetail } from "@/lib/game-data";
import { fetchGamepixDiscovery } from "@/lib/gamepix";
import { getTopGamesFromDb } from "@/lib/local-games";
import formatNumber from "@/utils/formatNumber";

type DiscoveryItem = {
    gameNamespace: string;
    gameId?: string;
    title: string;
};

export type EnrichedGame = {
    id?: string;
    namespace: string;
    title: string;
    banner_image: string;
    description?: string;
    tags?: string[];
    orientation?: string;
    ratingLabel?: string;
    playTotal?: number;
};

async function fetchDiscoveryItems(
    device: "desktop" | "mobile",
    limit: number,
    offset: number
): Promise<DiscoveryItem[]> {
    const data = await fetchGamepixDiscovery(device, limit, offset);
    const items = (data.items ?? []) as DiscoveryItem[];

    if (items.length === 0) {
        console.warn("[discovery] GamePix returned no results, falling back to DB");
        const dbGames = await getTopGamesFromDb(limit, offset);
        return dbGames.map((game) => ({
            gameNamespace: game.namespace,
            gameId: game.gameID,
            title: game.title,
        }));
    }

    return items;
}

export async function getEnrichedDiscoveryGames(
    device: "desktop" | "mobile",
    limit: number,
    offset = 0
): Promise<EnrichedGame[]> {
    const items = await fetchDiscoveryItems(device, limit, offset);

    return Promise.all(
        items.map(async (item) => {
            const details = await getMergedGameDetail(item.gameNamespace);
            const upVotes = (details?.desktopUpVote ?? 0) + (details?.mobileUpVote ?? 0);
            const rawScore =
                (((details?.scoreRanking ?? 0) +
                    (details?.topDesktopScore ?? 0) +
                    (details?.topMobileScore ?? 0)) /
                    3) *
                10;
            const score = Number.isFinite(rawScore) ? Math.round(rawScore * 10) / 10 : 0;

            return {
                id: item.gameId,
                namespace: item.gameNamespace,
                title: details?.title ?? item.title,
                banner_image: `https://img.gamepix.com/games/${item.gameNamespace}/cover/${item.gameNamespace}.png?w=1280`,
                tags: (details?.tags ?? []).map((tag) => tag.title).filter(Boolean) as string[],
                orientation: details?.orientation,
                ratingLabel: score > 0 ? `${score} (${formatNumber(upVotes)} votes)` : undefined,
                playTotal: details?.playTotal ?? 0,
            };
        })
    );
}

export function sortByMostPlayed(games: EnrichedGame[]): EnrichedGame[] {
    return [...games].sort((a, b) => (b.playTotal ?? 0) - (a.playTotal ?? 0));
}
