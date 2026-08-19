"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroGame = {
    id?: string;
    namespace: string;
    title: string;
    banner_image?: string | null;
    description?: string;
    tags?: string[];
    orientation?: string;
    ratingLabel?: string;
};

type HeroBannerProps = {
    games: HeroGame[];
};

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

export default function HeroBanner({ games }: HeroBannerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStartX = useRef<number | null>(null);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        clearTimer();
        if (games.length <= 1) return;
        timerRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % games.length);
        }, AUTO_ADVANCE_MS);
    }, [clearTimer, games.length]);

    useEffect(() => {
        startTimer();
        return clearTimer;
    }, [startTimer, clearTimer]);

    const goToPrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
    }, [games.length]);

    const goToNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % games.length);
    }, [games.length]);

    const handleTouchStart = (event: React.TouchEvent) => {
        clearTimer();
        touchStartX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: React.TouchEvent) => {
        const startX = touchStartX.current;
        touchStartX.current = null;
        if (startX === null) {
            startTimer();
            return;
        }

        const deltaX = event.changedTouches[0].clientX - startX;
        if (deltaX > SWIPE_THRESHOLD_PX) {
            goToPrev();
        } else if (deltaX < -SWIPE_THRESHOLD_PX) {
            goToNext();
        }
        startTimer();
    };

    if (games.length === 0) return null;

    return (
        <section
            className="relative h-[52vh] min-h-[380px] w-full touch-pan-y overflow-hidden sm:h-[62vh] lg:h-[70vh]"
            onMouseEnter={clearTimer}
            onMouseLeave={startTimer}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {games.map((game, index) => (
                <div
                    key={game.id ?? game.namespace}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                >
                    <Image
                        src={game.banner_image || "/next.svg"}
                        alt={game.title}
                        fill
                        priority={index === 0}
                        fetchPriority={index === 0 ? "high" : undefined}
                        sizes="100vw"
                        className="object-cover"
                        unoptimized={!!game.banner_image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-10 lg:max-w-2xl">
                        {game.tags && game.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {game.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm sm:text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h2 className="text-2xl font-bold text-white drop-shadow sm:text-4xl lg:text-5xl">
                            {game.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 sm:text-sm">
                            {game.ratingLabel && (
                                <span className="flex items-center gap-1">
                                    <span className="text-amber-400">★</span>
                                    {game.ratingLabel}
                                </span>
                            )}
                            {game.orientation && (
                                <>
                                    <span className="h-3 w-px bg-white/30" />
                                    <span className="capitalize">{game.orientation}</span>
                                </>
                            )}
                        </div>

                        {game.description && (
                            <p className="hidden max-w-xl text-sm leading-6 text-slate-200/90 sm:line-clamp-3 sm:block">
                                {game.description}
                            </p>
                        )}

                        <div>
                            <Link
                                href={`/detail/${game.namespace}`}
                                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 sm:text-base"
                            >
                                ▶ Play Now
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {games.length > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Previous"
                        onClick={goToPrev}
                        className="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl leading-none text-white transition hover:bg-black/60 sm:flex"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        aria-label="Next"
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-xl leading-none text-white transition hover:bg-black/60 sm:flex"
                    >
                        ›
                    </button>
                </>
            )}

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6">
                {games.map((game, index) => (
                    <button
                        key={game.id ?? game.namespace}
                        type="button"
                        aria-label={`Show ${game.title}`}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                            index === activeIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
