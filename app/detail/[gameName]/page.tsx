import { notFound } from "next/navigation";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import { getMergedGameDetail } from "@/lib/game-data";
import { fetchGamepixTag } from "@/lib/gamepix";
import AdSlot from "@/components/ads/AdSlot";
import NativeAd from "@/components/ads/NativeAd";
import BannerAd from "@/components/ads/BannerAd";
import ResponsiveBannerAd from "@/components/ads/ResponsiveBannerAd";
import GamePlayer from "@/components/GamePlayer";
import GameGrid, { type GameGridItem } from "@/components/GameGrid";
import type { Metadata } from "next";

type RelatedItem = {
    gameNamespace: string;
    gameId?: string;
    title: string;
};

async function fetchRelatedGames(tagNamespace: string, currentNamespace: string): Promise<GameGridItem[]> {
    const data = await fetchGamepixTag(tagNamespace, "desktop", 9);
    const items = (data.items ?? []) as RelatedItem[];

    return items
        .filter((item) => item.gameNamespace !== currentNamespace)
        .slice(0, 8)
        .map((item) => ({
            id: item.gameId,
            namespace: item.gameNamespace,
            title: item.title,
            banner_image: `https://img.gamepix.com/games/${item.gameNamespace}/cover/${item.gameNamespace}.png?w=320`,
        }));
}

type DetailPageProps = {
    params: Promise<{ gameName: string }>;
};

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
    const { gameName } = await params;
    const details = await getMergedGameDetail(gameName);
    const title = details?.title ? `${details.title} | GamePix` : `${gameName} | GamePix`;
    const description =
        details?.description?.slice(0, 160) ||
        `Play ${details?.title ?? gameName} online on GamePix.`;
    const image = details?.banner_image || details?.image || "/og.png";

    return {
        title,
        description,
        alternates: {
            canonical: `/detail/${gameName}`,
        },
        openGraph: {
            title,
            description,
            url: `/detail/${gameName}`,
            images: [
                {
                    url: image,
                    alt: details?.title ?? gameName,
                },
            ],
        },
    };
}

export default async function GameDetailsPage({ params }: DetailPageProps) {
    const { gameName } = await params;
    const details = await getMergedGameDetail(gameName);

    if (!details) notFound();

    const upVotes = (details.desktopUpVote ?? 0) + (details.mobileUpVote ?? 0);
    const totalVotes = formatNumber(upVotes);
    const rawScore =
        (((details.scoreRanking ?? 0) + (details.topDesktopScore ?? 0) + (details.topMobileScore ?? 0)) / 3) * 10;
    const score = Number.isFinite(rawScore) ? Math.round(rawScore * 10) / 10 : 0;
    const ratingLabel = Number.isFinite(score) ? `${score} (${totalVotes} votes)` : "N/A";

    const releaseDate = details.pubDate ? formatDate(details.pubDate) : "N/A";
    const updateDate = details.updatedAt ? formatDate(details.updatedAt) : "N/A";
    const tags = Array.isArray(details.tags) ? details.tags : [];
    const firstTagNamespace = tags[0]?.tagNamespace;
    const relatedGames = firstTagNamespace
        ? await fetchRelatedGames(firstTagNamespace, gameName)
        : [];

    const gameJsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: details.title ?? gameName,
        description: details.description || `Play ${details.title ?? gameName} online on GamePix.`,
        image: details.banner_image || details.image,
        genre: tags.map((tag) => tag.title).filter(Boolean),
        applicationCategory: "Game",
        operatingSystem: "Any",
        ...(score > 0 && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: score,
                bestRating: 10,
                ratingCount: Math.max(upVotes, 1),
            },
        }),
        offers: {
            "@type": "Offer",
            price: 0,
            priceCurrency: "USD",
        },
    };

    return (
        <div className="min-h-screen bg-[#08152d] text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(gameJsonLd) }}
            />
            <div className="px-3 py-6 sm:px-28 lg:py-10">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                    <h1 className="text-2xl font-semibold text-white">{details.title ?? gameName}</h1>
                    <span className="hidden h-4 w-px bg-slate-600 sm:block" />
                    <div className="flex items-center gap-2">
                        <span className="text-amber-400">★★★★★</span>
                        <span>{ratingLabel}</span>
                    </div>
                </div>

                <div className="mt-6 flex gap-6">
                    <aside className="sticky top-6 hidden h-fit w-40 shrink-0 xl:block">
                        <AdSlot className="p-2" minHeightClassName="min-h-75">
                            <BannerAd unit="banner_160x300" />
                        </AdSlot>
                    </aside>

                    <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-6">
                        <GamePlayer
                            title={details.title ? `${details.title} game` : "Game"}
                            src={details.dbUrl}
                            upVotes={upVotes}
                            totalVotes={totalVotes}
                            orientation={details.orientation}
                        />

                        <AdSlot minHeightClassName="min-h-30">
                            <NativeAd />
                        </AdSlot>

                        <div className="rounded-2xl bg-[#0b2044] p-5">
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.slice(0, 6).map((tag, index) => (
                                        <span
                                            key={tag.tagNamespace ?? `${tag.title ?? "tag"}-${index}`}
                                            className="rounded-full bg-[#143060] px-3 py-1 text-xs font-medium text-slate-200"
                                        >
                                            {tag.title}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-5 grid gap-3 text-sm text-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Rating</span>
                                    <span>{ratingLabel}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Platform</span>
                                    <span>{details.platforms ?? "Browser (Desktop & Mobile)"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Orientation</span>
                                    <span>{details.orientation ?? "Not specified"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Release date</span>
                                    <span>{releaseDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Last update</span>
                                    <span>{updateDate}</span>
                                </div>
                            </div>

                            {details.description && (
                                <div className="mt-5 text-sm leading-6 text-slate-300">
                                    {details.description}
                                </div>
                            )}
                        </div>

                        <ResponsiveBannerAd />
                    </div>

                    <div className="space-y-6">
                        <AdSlot minHeightClassName="min-h-75">
                            <BannerAd unit="banner_160x300" />
                        </AdSlot>

                        {relatedGames.length > 0 && (
                            <div className="rounded-2xl bg-[#0b2044] p-5">
                                <h2 className="mb-4 text-sm font-semibold text-slate-200">More like this</h2>
                                <GameGrid
                                    games={relatedGames}
                                    className="grid grid-cols-2 gap-4"
                                />
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
