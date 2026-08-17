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
