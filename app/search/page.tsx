import GameGrid, { type GameGridItem } from "@/components/GameGrid";
import NativeAd from "@/components/ads/NativeAd";
import ResponsiveBannerAd from "@/components/ads/ResponsiveBannerAd";
import { fetchGamepixSearch } from "@/lib/gamepix";
import { searchGamesInDb } from "@/lib/local-games";
import type { Metadata } from "next";

type Game = GameGridItem;

type PageProps = {
    searchParams?: Promise<{
        q?: string;
        device?: string;
    }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = (await searchParams) ?? {};
    const query = (params.q ?? "").trim();

    const title = query ? `Search: ${query} | GamePix` : "Search | GamePix";
    const description = query
        ? `Browse search results for "${query}" on GamePix.`
        : "Search 10k+ browser games on GamePix.";

    return {
        title,
        description,
        robots: { index: false, follow: true },
        openGraph: {
            title,
            description,
            url: query ? `/search?q=${encodeURIComponent(query)}` : "/search",
        },
    };
}

type SearchItem = {
    gameNamespace: string;
    title: string;
    tags?: string[];
};

async function fetchSearchResults(query: string, device: "desktop" | "mobile"): Promise<Game[]> {
    const data = await fetchGamepixSearch(query, device);
    const items = (data.items ?? []) as SearchItem[];

    if (items.length === 0) {
        console.warn(`[search] GamePix returned no results for "${query}", falling back to DB`);
        const dbGames = await searchGamesInDb(query, 20);
        return dbGames.map((game) => ({
            namespace: game.namespace,
            title: game.title,
            category: game.category,
            banner_image: game.bannerImage,
        }));
    }

    return items.map((item) => ({
        namespace: item.gameNamespace,
        title: item.title,
        category: item.tags?.[0] ?? null,
        banner_image: `https://img.gamepix.com/games/${item.gameNamespace}/cover/${item.gameNamespace}.png?w=320`,
    }));
}

export default async function SearchPage({ searchParams }: PageProps) {
    const params = (await searchParams) ?? {};
    const query = (params.q ?? "").trim();
    const device = params.device === "mobile" ? "mobile" : "desktop";

    const games = query ? await fetchSearchResults(query, device) : [];

    return (
        <div className="mt-12">
            <h1 className="mb-3 px-4 text-lg font-semibold">
                {query ? `Search results for "${query}"` : "Search"}
            </h1>

            <div className="m-4 mt-6">
                <ResponsiveBannerAd />
            </div>

            <div className="m-4 mt-6">
                {query && games.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No games found for &ldquo;{query}&rdquo;.
                    </div>
                ) : (
                    <GameGrid games={games} adEvery={6} renderAd={() => <NativeAd />} />
                )}
            </div>

            <div className="m-4 mt-8">
                <ResponsiveBannerAd />
            </div>
        </div>
    );
}
