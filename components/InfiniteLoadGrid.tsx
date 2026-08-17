"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameGrid, { type GameGridItem } from "@/components/GameGrid";

type LoadMoreResult = { games: GameGridItem[]; done: boolean };

type InfiniteLoadGridProps = {
    initialGames: GameGridItem[];
    initialOffset: number;
    initialDone?: boolean;
    loadMore: (offset: number) => Promise<LoadMoreResult>;
};

export default function InfiniteLoadGrid({
    initialGames,
    initialOffset,
    initialDone = false,
    loadMore,
}: InfiniteLoadGridProps) {
    const [games, setGames] = useState(initialGames);
    const [offset, setOffset] = useState(initialOffset);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(initialDone);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const loadingRef = useRef(false);

    const handleLoadMore = useCallback(async () => {
        if (loadingRef.current || done) return;
        loadingRef.current = true;
        setLoading(true);

        try {
            const result = await loadMore(offset);

            if (result.games.length === 0) {
                setDone(true);
                return;
            }

            setGames((prev) => {
                const seen = new Set(prev.map((game) => game.namespace));
                const newGames = result.games.filter((game) => !seen.has(game.namespace));
                return [...prev, ...newGames];
            });
            setOffset((prev) => prev + result.games.length);
            if (result.done) setDone(true);
        } catch {
            setDone(true);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [offset, done, loadMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || done) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) handleLoadMore();
            },
            { rootMargin: "600px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [handleLoadMore, done]);

    return (
        <>
            <GameGrid games={games} />

            {!done && (
                <div ref={sentinelRef} className="flex items-center justify-center py-8">
                    {loading && <p className="text-sm text-muted-foreground">Loading more games…</p>}
                </div>
            )}
        </>
    );
}
