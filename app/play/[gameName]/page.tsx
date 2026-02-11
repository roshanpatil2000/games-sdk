import PlayBackButton from "@/components/PlayBackButton";
import { getDbGame } from "@/lib/game-data";
import { notFound } from "next/navigation";

type PlayPageProps = {
    params: Promise<{ gameName: string }>;
};

export default async function PlayPage({ params }: PlayPageProps) {
    const { gameName } = await params;
    const game = await getDbGame(gameName);

    if (!game) notFound();

    return (
        <div className="fixed inset-0 z-50 bg-black">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                <PlayBackButton />
                <div className="text-xs text-white/80">{game.title ?? gameName}</div>
            </div>

            <div className="h-full w-full">
                {game.url ? (
                    <iframe
                        title={game.title ?? "Game"}
                        src={game.url}
                        className="h-full w-full"
                        allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                        allowFullScreen
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/80">
                        Play URL unavailable for this game.
                    </div>
                )}
            </div>
        </div>
    );
}
