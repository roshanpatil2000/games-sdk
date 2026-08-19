import Link from "next/link";
import NativeAd from "@/components/ads/NativeAd";
import ResponsiveBannerAd from "@/components/ads/ResponsiveBannerAd";
import HeroBanner from "@/components/HeroBanner";
import GameGrid, { type GameGridItem } from "@/components/GameGrid";
import InfiniteGameGrid from "@/components/InfiniteGameGrid";
import CategoryChips from "@/components/CategoryChips";
import { fetchGamepixFeed } from "@/lib/gamepix";
import { getEnrichedDiscoveryGames, sortByMostPlayed } from "@/lib/trending";
import type { Metadata } from "next";

type Game = GameGridItem;

type PageProps = {
    searchParams?: Promise<{
        page?: string;
    }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = (await searchParams) ?? {};
    const page = Math.max(1, Number(params.page ?? "1") || 1);

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
    const device = "desktop";

    const { items: pageItems, totalPages } = await fetchGamesPage(page);
    const enrichedDiscoveryGames = await getEnrichedDiscoveryGames(device, 18);
    const heroGames = enrichedDiscoveryGames.slice(0, 6);
    const mostPlayed = sortByMostPlayed(enrichedDiscoveryGames);
    const trendingGames = mostPlayed.slice(0, 12);

    return (
        <div className={heroGames.length > 0 ? "" : "mt-12"}>
            <h1 className="sr-only">Play Free Online Games – 10,000+ Titles on GamePix</h1>

            {heroGames.length > 0 && <HeroBanner games={heroGames} />}

            <CategoryChips />

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
                    <GameGrid games={trendingGames} adEvery={12} renderAd={() => <NativeAd />} />
                </div>
            )}

            <div className="m-4 mt-8">
                <h2 className="mb-3 text-lg font-semibold">Discover</h2>
                <InfiniteGameGrid initialGames={pageItems} initialPage={page} totalPages={totalPages} />
            </div>
        </div>
    );
}
