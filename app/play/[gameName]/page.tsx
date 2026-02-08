"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DbGame = {
    title?: string | null;
    url?: string | null;
};

export default function PlayPage() {
    const { gameName } = useParams<{ gameName: string }>();
    const router = useRouter();
    const [game, setGame] = useState<DbGame | null>(null);




    useEffect(() => {
        async function load() {
            if (!gameName) return;
            const res = await fetch(`/api/gameDetail?namespace=${gameName}`);
            if (!res.ok) return;
            const data = await res.json();
            if (data?.url) {
                console.log(`[play] url=${data.url} namespace=${gameName}`);
            }
            setGame(data);
        }
        load();
    }, [gameName]);

    return (
        <div className="fixed inset-0 z-50 bg-black">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                <button
                    className="rounded-md bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20"
                    onClick={() => router.back()}
                >
                    Back
                </button>
                <div className="text-xs text-white/80">{game?.title ?? gameName}</div>
            </div>

            <div className="h-full w-full">
                <iframe
                    title={game?.title ?? "Game"}
                    src={game?.url ?? null}
                    className="h-full w-full"
                    allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                    allowFullScreen
                    onLoad={() => {
                        if (game?.url) {
                            console.log(`[play iframe] url=${game.url} namespace=${gameName}`);
                        }
                    }}
                />
            </div>
        </div>
    );
}
