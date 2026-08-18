import Link from "next/link";
import NativeAd from "@/components/ads/NativeAd";
import ResponsiveBannerAd from "@/components/ads/ResponsiveBannerAd";
import HeroBanner from "@/components/HeroBanner";
import GameGrid, { type GameGridItem } from "@/components/GameGrid";
import InfiniteGameGrid from "@/components/InfiniteGameGrid";
import CategoryChips from "@/components/CategoryChips";
import { fetchGamepixFeed, fetchGamepixSearch } from "@/lib/gamepix";
import { searchGamesInDb } from "@/lib/local-games";
import { getEnrichedDiscoveryGames, sortByMostPlayed } from "@/lib/trending";
import type { Metadata } from "next";

type Game = GameGridItem;

type PageProps = {
    searchParams?: Promise<{
        page?: string;
        q?: string;
        device?: string;
    }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = (await searchParams) ?? {};
    const query = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? "1") || 1);

    if (query) {
        const title = `Search: ${query} | GamePix`;
        return {
            title,
            description: `Browse search results for "${query}" on GamePix.`,
            robots: { index: false, follow: true },
            openGraph: {
                title,
                description: `Browse search results for "${query}" on GamePix.`,
                url: `/?q=${encodeURIComponent(query)}&device=desktop`,
            },
        };
    }

    const title = page > 1 ? `GamePix - Page ${page}` : "GamePix";
    const description =
        page > 1
            ? `Discover browser games on GamePix. Viewing page ${page}.`
            : "Play 10k+ games without installation.";

    return {
        title,
        description,
        alternates: {
            canonical: page > 1 ? `/?page=${page}` : "/",
        },
        robots: page > 1 ? { index: false, follow: true } : undefined,
        openGraph: {
            title,
            description,
            url: page > 1 ? `/?page=${page}` : "/",
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

async function fetchGamesPage(page: number) {
    const data = await fetchGamepixFeed(page, 48);

    if (!data) {
        return { items: [] as Game[], totalPages: 1 };
    }

    const lastPage = data?.last_page_url
        ? Number(new URL(data.last_page_url).searchParams.get("page") ?? "1")
        : 1;

    return {
        items: (data.items ?? []) as Game[],
        totalPages: Number.isFinite(lastPage) && lastPage > 0 ? Math.ceil(lastPage) : 1,
    };
}

export default async function GameList({ searchParams }: PageProps) {
    const params = (await searchParams) ?? {};
    const page = Math.max(1, Number(params.page ?? "1") || 1);
    const query = (params.q ?? "").trim();
    const device = params.device === "mobile" ? "mobile" : "desktop";
    const isSearching = query.length > 0;

    const { items: pageItems, totalPages } = await fetchGamesPage(page);
    const games = isSearching ? await fetchSearchResults(query, device) : pageItems;
    const enrichedDiscoveryGames = !isSearching ? await getEnrichedDiscoveryGames(device, 18) : [];
    const heroGames = enrichedDiscoveryGames.slice(0, 6);
    const mostPlayed = sortByMostPlayed(enrichedDiscoveryGames);
    const trendingGames = mostPlayed.slice(0, 12);

    return (
        <div className={heroGames.length > 0 ? "" : "mt-12"}>
            <h1 className="sr-only">
                {isSearching
                    ? `Search results for "${query}"`
                    : "Play Free Online Games – 10,000+ Titles on GamePix"}
            </h1>

            {heroGames.length > 0 && <HeroBanner games={heroGames} />}

            {!isSearching && <CategoryChips />}

            <div className="m-4 mt-6">
                <ResponsiveBannerAd />
            </div>

            {trendingGames.length > 0 && (
                <div className="m-4 mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">🔥 Most Played</h2>
                        <Link href="/most-played" className="text-sm font-medium text-primary hover:underline">
                            View More →
                        </Link>
                    </div>
                    <GameGrid games={trendingGames} adEvery={8} renderAd={() => <NativeAd />} />
                </div>
            )}

            <div className="m-4 mt-8">
                <h2 className="mb-3 text-lg font-semibold">Discover</h2>
                {isSearching ? (
                    <GameGrid games={games} />
                ) : (
                    <InfiniteGameGrid initialGames={games} initialPage={page} totalPages={totalPages} />
                )}
            </div>
        </div>
    );
}
