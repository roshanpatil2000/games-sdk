'use client'

import formatDate from '@/utils/formatDate';
import formatNumber from '@/utils/formatNumber';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react';


export default function gameGameDetails() {
    const { gameName } = useParams<{ gameName: string }>();
    const router = useRouter();

    const [datails, setDetails] = useState<any>(null);
    const [tags, setTags] = useState<{ name: string, tagNamespace: string, tagNSLocale: string, title: string }[]>([]);

    const fetchGameDetail = async (gameName: string) => {
        const [detailRes, dbRes] = await Promise.all([
            axios.get(`https://api.gamepix.com/v3/games/ns/${gameName}`),
            axios.get(`/api/gameDetail?namespace=${gameName}`),
        ]);

        const detailData = detailRes.data;
        const dbData = dbRes.data;

        if (dbData?.url) {
            console.log(`[detail] url=${dbData.url} namespace=${gameName}`);
        }
        setDetails({ ...detailData, dbUrl: dbData?.url });
        setTags(detailData.tags ?? []);
    };

    // console.log(gameName)
    useEffect(() => {
        if (gameName) {
            fetchGameDetail(gameName);
        }
    }, [gameName])

    const votes = formatNumber(datails?.desktopUpVote + datails?.mobileUpVote)
    const totalVotes = formatNumber(datails?.desktopUpVote + datails?.mobileUpVote)

    const rawScore =
        ((datails?.scoreRanking + datails?.topDesktopScore + datails?.topMobileScore) / 3) * 10;

    const score = Math.round(rawScore * 10) / 10;


    const ReleaseDate = formatDate(datails?.pubDate)
    const UpdateDate = formatDate(datails?.updatedAt)

    const ratingLabel = useMemo(() => {
        if (!datails) return "N/A";
        return Number.isFinite(score) ? `${score} (${totalVotes} votes)` : "N/A";
    }, [datails, score, totalVotes]);

    console.log("datails?.dbUrl", datails?.dbUrl)

    return (
        datails && (
            <div className="min-h-screen bg-[#08152d] text-white">
                <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                        <h1 className="text-2xl font-semibold text-white">{datails?.title}</h1>
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
                                    <iframe
                                        title={datails?.title ? `${datails.title} game` : "Game"}
                                        src={datails?.dbUrl ?? ""}
                                        className="absolute inset-0 h-full w-full"
                                        allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                                        allowFullScreen
                                        onLoad={() => {
                                            if (datails?.dbUrl) {
                                                console.log(`[detail iframe] url=${datails.dbUrl} namespace=${gameName}`);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-slate-300">
                                    <span>👍 {formatNumber(datails?.desktopUpVote + datails?.mobileUpVote)}</span>
                                    <span>🗳️ {totalVotes} votes</span>
                                    <span>⏱️ {datails?.orientation ?? "Not specified"}</span>
                                    <button
                                        className="rounded-md border border-slate-500 px-2 py-1 text-[10px] text-slate-200 hover:bg-white/10"
                                        onClick={() => router.push(`/play/${gameName}`)}
                                    >
                                        Open Full Screen
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#0b2044] p-5">
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.slice(0, 6).map((tag) => (
                                            <span
                                                key={tag.tagNamespace}
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
                                        <span>{datails?.platforms ?? "Browser (Desktop & Mobile)"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Orientation</span>
                                        <span>{datails?.orientation ?? "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Release date</span>
                                        <span>{ReleaseDate}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Last update</span>
                                        <span>{UpdateDate}</span>
                                    </div>
                                </div>

                                {datails?.description && (
                                    <div className="mt-5 text-sm text-slate-300 leading-6">
                                        {datails.description}
                                    </div>
                                )}
                            </div>
                        </div>

                        {false && <aside className="space-y-4">
                            <div className="rounded-2xl bg-[#0b2044] p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-400">Sponsored</div>
                                <div className="mt-3">
                                    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-500 bg-[#0f264d] text-xs text-slate-300">
                                        Ad placeholder (300 x 250)
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-[#0b2044] p-4">
                                <div className="text-sm font-semibold">More games</div>
                                <div className="mt-3 grid gap-3">
                                    {[
                                        { title: "Flying Motorbike Real", gradient: "from-emerald-400 to-blue-500" },
                                        { title: "Battle Simulator - Sandbox", gradient: "from-pink-500 to-amber-400" },
                                        { title: "Ninja Parkour Multiplayer", gradient: "from-cyan-400 to-indigo-500" },
                                        { title: "Merge Mine - Idle Click", gradient: "from-lime-400 to-emerald-600" },
                                        { title: "Crazy Shooters 2", gradient: "from-orange-400 to-rose-500" },
                                        { title: "Bodybuilder Karate Fight", gradient: "from-purple-500 to-fuchsia-500" },
                                    ].map((game) => (
                                        <div
                                            key={`rec-${game.title}`}
                                            className="flex items-center gap-3 rounded-xl bg-[#122a54] p-3"
                                        >
                                            <div className={`h-12 w-16 rounded-lg bg-gradient-to-br ${game.gradient}`} />
                                            <div className="text-xs text-slate-200">{game.title}</div>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 w-full rounded-md border border-slate-600 py-2 text-xs text-slate-200">
                                    View more
                                </button>
                            </div>
                        </aside>}
                    </div>
                </div>
            </div>
        )
    );
}
