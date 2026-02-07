"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaginationRange } from "@/lib/pagination";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function StickyPagination({
    page,
    totalPages,
    onPageChange,
}: Props) {
    const pages = getPaginationRange({
        currentPage: page,
        totalPages,
    });

    return (
        <div className="sticky bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-3 py-3 sm:gap-2">
                {/* First */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(1)}
                    className="hidden sm:inline-flex"
                >
                    First
                </Button>

                {/* Prev */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className="hidden sm:inline-flex"

                >
                    Prev
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pages.map((p, i) =>
                        p === "…" ? (
                            <span
                                key={i}
                                className="px-2 text-sm text-muted-foreground"
                            >
                                …
                            </span>
                        ) : (
                            <Button
                                key={(i)}
                                size="sm"
                                variant={p === page ? "default" : "outline"}
                                onClick={() => onPageChange(p as number)}
                                className={cn(
                                    "min-w-9",
                                    p === page && "pointer-events-none"
                                )}
                            >
                                {p}
                            </Button>
                        )
                    )}
                </div>

                {/* Next */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="hidden sm:inline-flex"
                >
                    Next
                </Button>

                {/* Last */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className="hidden sm:inline-flex"
                >
                    Last
                </Button>
            </div>
        </div>
    );
}