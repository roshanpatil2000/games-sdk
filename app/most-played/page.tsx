import InfiniteLoadGrid from "@/components/InfiniteLoadGrid";
import ResponsiveBannerAd from "@/components/ads/ResponsiveBannerAd";
import { getEnrichedDiscoveryGames, sortByMostPlayed } from "@/lib/trending";
import type { Metadata } from "next";

const PAGE_SIZE = 48;

type MostPlayedPageProps = {
    searchParams?: Promise<{ device?: string }>;
};

export const metadata: Metadata = {
    title: "Most Played Games | GamePix",
    description: "Browse the most played browser games on GamePix, ranked by total plays.",
    alternates: { canonical: "/most-played" },
    openGraph: {
        title: "Most Played Games | GamePix",
        description: "Browse the most played browser games on GamePix, ranked by total plays.",
        url: "/most-played",
    },
};

export default async function MostPlayedPage({ searchParams }: MostPlayedPageProps) {
    const sp = (await searchParams) ?? {};
    const device = sp.device === "mobile" ? "mobile" : "desktop";

    const enriched = await getEnrichedDiscoveryGames(device, PAGE_SIZE, 0);
    const games = sortByMostPlayed(enriched);

    async function loadMoreMostPlayed(offset: number) {
        "use server";
        const nextEnriched = await getEnrichedDiscoveryGames(device, PAGE_SIZE, offset);
        return {
            games: sortByMostPlayed(nextEnriched),
            done: nextEnriched.length < PAGE_SIZE,
        };
    }

    return (
        <div className="mt-12">
            <h1 className="m-4 text-2xl font-bold">🔥 Most Played Games</h1>

            <div className="m-4">
                <ResponsiveBannerAd />
            </div>

            {games.length > 0 ? (
                <div className="m-4">
                    <InfiniteLoadGrid
                        initialGames={games}
                        initialOffset={enriched.length}
                        initialDone={enriched.length < PAGE_SIZE}
                        loadMore={loadMoreMostPlayed}
                    />
                </div>
            ) : (
                <p className="m-4 text-sm text-muted-foreground">No games found.</p>
            )}
        </div>
    );
}
