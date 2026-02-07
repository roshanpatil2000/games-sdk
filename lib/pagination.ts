export function getPaginationRange({
    currentPage,
    totalPages,
    siblingCount = 1,
}: {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
}) {
    const totalNumbers = siblingCount * 2 + 3;
    if (totalNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const pages: (number | string)[] = [];

    if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
        pages.push(...leftRange, "…", totalPages);
    } else if (showLeftEllipsis && !showRightEllipsis) {
        pages.push(
            1,
            "…",
            ...Array.from(
                { length: 3 + siblingCount * 2 },
                (_, i) => totalPages - (32 + siblingCount * 2) + i + 1
            )
        );
    } else {
        pages.push(
            1,
            "…",
            ...Array.from(
                { length: siblingCount * 2 + 1 },
                (_, i) => leftSibling + i
            ),
            "…",
            totalPages
        );
    }

    return pages;
}