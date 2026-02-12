import Image from "next/image";
import Link from "next/link";
import { getPaginationRange } from "@/lib/pagination";
import type { Metadata } from "next";

type Game = {
    id?: string;
    namespace: string;
    title: string;
    category?: string | null;
    banner_image?: string | null;
};

type PageProps = {
    searchParams?: Promise<{
        page?: string;
        q?: string;
        device?: string;
    }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = (await searchParams) ?? {};
    const query = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? "1") || 1);

    if (query) {
        const title = `Search: ${query} | GamePix`;
        return {
            title,
            description: `Browse search results for "${query}" on GamePix.`,
            openGraph: {
                title,
                description: `Browse search results for "${query}" on GamePix.`,
                url: `/?q=${encodeURIComponent(query)}&device=desktop`,
            },
        };
    }

    const title = page > 1 ? `GamePix - Page ${page}` : "GamePix";
    const description =
        page > 1
            ? `Discover browser games on GamePix. Viewing page ${page}.`
            : "Play 10k+ games without installation.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: page > 1 ? `/?page=${page}` : "/",
        },
    };
}

async function fetchSearchResults(query: string, device: "desktop" | "mobile") {
    const res = await fetch(
        `https://api.gamepix.com/v3/games/search?ts=${encodeURIComponent(query)}&device=${device}`,
        {
            next: { revalidate: 300 },
            headers: { Accept: "application/json" },
        }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? data.games ?? data.results ?? data.data ?? []) as Game[];
}

async function fetchGamesPage(page: number) {
    const url = `https://feeds.gamepix.com/v2/json/?order=quality&page=${page}&pagination=48&sid=0E766`;
    const res = await fetch(url, {
        next: { revalidate: 600 },
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        return { items: [] as Game[], totalPages: 1 };
    }

    const data = await res.json();
    const lastPage = data?.last_page_url
        ? Number(new URL(data.last_page_url).searchParams.get("page") ?? "1")
        : 1;

    return {
        items: (data.items ?? []) as Game[],
        totalPages: Number.isFinite(lastPage) && lastPage > 0 ? Math.ceil(lastPage) : 1,
    };
}

function buildPageHref(page: number) {
    return `/?page=${page}`;
}

export default async function GameList({ searchParams }: PageProps) {
    const params = (await searchParams) ?? {};
    const page = Math.max(1, Number(params.page ?? "1") || 1);
    const query = (params.q ?? "").trim();
    const device = params.device === "mobile" ? "mobile" : "desktop";
    const isSearching = query.length > 0;

    const { items: pageItems, totalPages } = await fetchGamesPage(page);
    const games = isSearching ? await fetchSearchResults(query, device) : pageItems;
    const pages = getPaginationRange({ currentPage: page, totalPages });

    return (
        <div className="mt-12">
            <div className="m-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {games.map((game, index) => (
                    <Link
                        key={game.id ?? `${game.namespace}-${index}`}
                        href={`/detail/${game.namespace}`}
                        className="relative group block"
                    >
                        <Image
                            src={game.banner_image || "/next.svg"}
                            width={640}
                            height={360}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                            priority={index < 2}
                            loading={index < 2 ? "eager" : "lazy"}
                            alt={game.title}
                            className="h-auto w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-muted p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-95">
                            <p className="text-center font-semibold">{game.title}</p>
                            <p className="text-center text-sm">{game.category}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {!isSearching && (
                <div className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-3 py-3 sm:gap-2">
                        <Link
                            href={buildPageHref(1)}
                            className={`hidden rounded-md border px-3 py-1 text-sm sm:inline-flex ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                        >
                            First
                        </Link>
                        <Link
                            href={buildPageHref(Math.max(1, page - 1))}
                            className={`hidden rounded-md border px-3 py-1 text-sm sm:inline-flex ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
                        >
                            Prev
                        </Link>
                        <div className="flex items-center gap-1">
                            {pages.map((p, i) =>
                                p === "…" ? (
                                    <span key={i} className="px-2 text-sm text-muted-foreground">
                                        …
                                    </span>
                                ) : (
                                    <Link
                                        key={`${p}-${i}`}
                                        href={buildPageHref(p as number)}
                                        className={`min-w-9 rounded-md border px-3 py-1 text-center text-sm ${p === page ? "pointer-events-none bg-primary text-primary-foreground" : ""}`}
                                    >
                                        {p}
                                    </Link>
                                )
                            )}
                        </div>
                        <Link
                            href={buildPageHref(Math.min(totalPages, page + 1))}
                            className={`hidden rounded-md border px-3 py-1 text-sm sm:inline-flex ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                        >
                            Next
                        </Link>
                        <Link
                            href={buildPageHref(totalPages)}
                            className={`hidden rounded-md border px-3 py-1 text-sm sm:inline-flex ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
                        >
                            Last
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
