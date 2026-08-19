export const POPULAR_CATEGORIES = [
    "action",
    "adventure",
    "arcade",
    "puzzle",
    "match-3",
    "brain",
    "racing",
    "sports",
    "shooting",
    "casual",
    "cards",
    "io",
    "farming",
    "cooking",
    "driving",
    "escape",
    "board",
    "dress-up",
];

export function formatCategoryLabel(tag: string) {
    return tag
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export type Category = {
    tagNamespace: string;
    title: string;
};

const GAMEPIX_CATEGORIES_URL =
    "https://partners.gamepix.com/_next/data/2aTdxp-K76lnMHc5HVjex/rss-feed.json";

const FALLBACK_CATEGORIES: Category[] = POPULAR_CATEGORIES.map((tag) => ({
    tagNamespace: tag,
    title: formatCategoryLabel(tag),
}));

export async function fetchCategories(): Promise<Category[]> {
    try {
        const res = await fetch(GAMEPIX_CATEGORIES_URL, {
            headers: { Accept: "application/json" },
            next: { revalidate: 3600 },
        });

        if (!res.ok) return FALLBACK_CATEGORIES;

        const data = await res.json();
        const categories = data?.pageProps?.categories as Category[] | undefined;

        if (!categories || categories.length === 0) return FALLBACK_CATEGORIES;

        return categories;
    } catch (error) {
        console.warn("[categories] fetch failed, using fallback list", error);
        return FALLBACK_CATEGORIES;
    }
}
