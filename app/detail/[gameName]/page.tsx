import Link from "next/link";
import { notFound } from "next/navigation";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import { getMergedGameDetail } from "@/lib/game-data";
import type { Metadata } from "next";

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

    return (
        <div className="min-h-screen bg-[#08152d] text-white">
            <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                    <h1 className="text-2xl font-semibold text-white">{details.title ?? gameName}</h1>
                    <span className="hidden h-4 w-px bg-slate-600 sm:block" />
                    <div className="flex items-center gap-2">
                        <span className="text-amber-400">★★★★★</span>
                        <span>{ratingLabel}</span>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-[#0b2044] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/20">
                                {details.dbUrl ? (
                                    <iframe
                                        title={details.title ? `${details.title} game` : "Game"}
                                        src={details.dbUrl}
                                        className="absolute inset-0 h-full w-full"
                                        allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-300">
                                        Play URL unavailable for this game.
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-slate-300">
                                <span>👍 {formatNumber(upVotes)}</span>
                                <span>🗳️ {totalVotes} votes</span>
                                <span>⏱️ {details.orientation ?? "Not specified"}</span>
                                <Link
                                    className="rounded-md border border-slate-500 px-2 py-1 text-[10px] text-slate-200 hover:bg-white/10"
                                    href={`/play/${gameName}`}
                                >
                                    Open Full Screen
                                </Link>
                            </div>
                        </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
}
