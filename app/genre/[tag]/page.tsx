import { type GameGridItem } from "@/components/GameGrid";
import InfiniteLoadGrid from "@/components/InfiniteLoadGrid";
import { fetchGamepixTag } from "@/lib/gamepix";
import { formatCategoryLabel } from "@/lib/categories";
import type { Metadata } from "next";

const PAGE_SIZE = 48;

type GenreItem = {
    gameNamespace: string;
    gameId?: string;
    title: string;
};

type GenrePageProps = {
    params: Promise<{ tag: string }>;
    searchParams?: Promise<{ device?: string }>;
};

function mapGenreItems(items: GenreItem[]): GameGridItem[] {
    return items.map((item) => ({
        id: item.gameId,
        namespace: item.gameNamespace,
        title: item.title,
        banner_image: `https://img.gamepix.com/games/${item.gameNamespace}/cover/${item.gameNamespace}.png?w=320`,
    }));
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
    const { tag } = await params;
    const label = formatCategoryLabel(tag);
    const title = `${label} Games | GamePix`;
    const description = `Play the best free ${label.toLowerCase()} games online on GamePix.`;

    return {
        title,
        description,
        alternates: { canonical: `/genre/${tag}` },
        openGraph: { title, description, url: `/genre/${tag}` },
    };
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
    const { tag } = await params;
    const sp = (await searchParams) ?? {};
    const device = sp.device === "mobile" ? "mobile" : "desktop";

    const data = await fetchGamepixTag(tag, device, PAGE_SIZE, 0);
    const items = (data.items ?? []) as GenreItem[];
    const games = mapGenreItems(items);

    async function loadMoreGenreGames(offset: number) {
        "use server";
        const nextData = await fetchGamepixTag(tag, device, PAGE_SIZE, offset);
        const nextItems = (nextData.items ?? []) as GenreItem[];
        return {
            games: mapGenreItems(nextItems),
            done: nextItems.length < PAGE_SIZE,
        };
    }

    return (
        <div className="mt-12">
            <h1 className="m-4 text-2xl font-bold">{formatCategoryLabel(tag)} Games</h1>

            {games.length > 0 ? (
                <div className="m-4">
                    <InfiniteLoadGrid
                        initialGames={games}
                        initialOffset={games.length}
                        initialDone={items.length < PAGE_SIZE}
                        loadMore={loadMoreGenreGames}
                    />
                </div>
            ) : (
                <p className="m-4 text-sm text-muted-foreground">No games found for this genre.</p>
            )}
        </div>
    );
}
