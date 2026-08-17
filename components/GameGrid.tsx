import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export type GameGridItem = {
    id?: string;
    namespace: string;
    title: string;
    category?: string | null;
    banner_image?: string | null;
};

type GameGridProps = {
    games: GameGridItem[];
    className?: string;
    imageSizes?: string;
    priorityCount?: number;
    adEvery?: number;
    renderAd?: () => ReactNode;
};

export default function GameGrid({
    games,
    className = "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6",
    imageSizes = "(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw",
    priorityCount = 2,
    adEvery,
    renderAd,
}: GameGridProps) {
    return (
        <div className={className}>
            {games.map((game, index) => (
                <Fragment key={`${game.namespace}-${index}`}>
                    <Link href={`/detail/${game.namespace}`} className="relative group block">
                        <Image
                            src={game.banner_image || "/next.svg"}
                            width={640}
                            height={360}
                            sizes={imageSizes}
                            priority={index < priorityCount}
                            loading={index < priorityCount ? "eager" : "lazy"}
                            alt={game.title}
                            className="h-auto w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-muted p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-95">
                            <p className="text-center font-semibold">{game.title}</p>
                            {game.category && <p className="text-center text-sm">{game.category}</p>}
                        </div>
                    </Link>
                    {adEvery && renderAd && (index + 1) % adEvery === 0 && (
                        <div className="col-span-full flex items-center justify-center">{renderAd()}</div>
                    )}
                </Fragment>
            ))}
        </div>
    );
}
