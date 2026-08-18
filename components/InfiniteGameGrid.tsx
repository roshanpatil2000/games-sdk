"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameGrid, { type GameGridItem } from "@/components/GameGrid";
import NativeAd from "@/components/ads/NativeAd";

type InfiniteGameGridProps = {
    initialGames: GameGridItem[];
    initialPage: number;
    totalPages: number;
};

export default function InfiniteGameGrid({ initialGames, initialPage, totalPages }: InfiniteGameGridProps) {
    const [games, setGames] = useState(initialGames);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(initialPage >= totalPages);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef(false);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || done) return;
        loadingRef.current = true;
        setLoading(true);

        try {
            const nextPage = page + 1;
            const res = await fetch(`/api/gamesList?page=${nextPage}`);
            if (!res.ok) {
                setDone(true);
                return;
            }

            const data = await res.json();
            const items = (data.items ?? []) as GameGridItem[];

            if (items.length === 0) {
                setDone(true);
                return;
            }

            const lastPage = data?.last_page_url
                ? Number(new URL(data.last_page_url).searchParams.get("page") ?? nextPage)
                : nextPage;

            setGames((prev) => {
                const seen = new Set(prev.map((game) => game.namespace));
                const newItems = items.filter((game) => !seen.has(game.namespace));
                return [...prev, ...newItems];
            });
            setPage(nextPage);
            if (nextPage >= lastPage) setDone(true);
        } catch {
            setDone(true);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [page, done]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || done) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) loadMore();
            },
            { rootMargin: "600px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore, done]);

    return (
        <>
            <GameGrid games={games} adEvery={12} renderAd={() => <NativeAd />} />

            {!done && (
                <div ref={sentinelRef} className="flex items-center justify-center py-8">
                    {loading && <p className="text-sm text-muted-foreground">Loading more games…</p>}
                </div>
            )}
        </>
    );
}
