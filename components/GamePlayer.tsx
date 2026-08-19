"use client";

import { useState } from "react";
import formatNumber from "@/utils/formatNumber";

type GamePlayerProps = {
    title: string;
    src?: string | null;
    upVotes: number;
    totalVotes: string;
    orientation?: string | null;
};

export default function GamePlayer({ title, src, upVotes, totalVotes, orientation }: GamePlayerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const iframe = src ? (
        <iframe
            title={title}
            src={src}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
            allowFullScreen
        />
    ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Play URL unavailable for this game.
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-black">
                <button
                    type="button"
                    onClick={() => setIsFullscreen(false)}
                    className="absolute left-4 top-4 z-10 rounded-md border border-slate-500 bg-black/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
                >
                    ✕ Exit Full Screen
                </button>
                <div className="relative h-full w-full">{iframe}</div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-card shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/20">
                {iframe}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-muted-foreground">
                <span>👍 {formatNumber(upVotes)}</span>
                <span>🗳️ {totalVotes} votes</span>
                <span>⏱️ {orientation ?? "Not specified"}</span>
                <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="rounded-md border border-border px-2 py-1 text-[10px] text-foreground hover:bg-accent"
                >
                    Open Full Screen
                </button>
            </div>
        </div>
    );
}
