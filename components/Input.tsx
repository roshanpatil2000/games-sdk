"use client"

import { Field } from "@/components/ui/field"
import { SearchIcon } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

type SearchResult = {
    namespace: string;
    title: string;
    image?: string | null;
    category?: string | null;
};

type GamepixSearchItem = {
    gameNamespace: string;
    title: string;
    tags?: string[];
};

type DbSearchItem = {
    namespace: string;
    title: string;
    bannerImage?: string | null;
    category?: string | null;
};

const DEBOUNCE_MS = 300;

async function searchGames(query: string): Promise<SearchResult[]> {
    const gpRes = await fetch(`/api/gamepix/search?q=${encodeURIComponent(query)}&device=desktop`);
    const gpData = gpRes.ok ? await gpRes.json() : { items: [] };
    const gpItems = (gpData.items ?? []) as GamepixSearchItem[];

    if (gpItems.length > 0) {
        return gpItems.map((item) => ({
            namespace: item.gameNamespace,
            title: item.title,
            category: item.tags?.[0] ?? null,
            image: `https://img.gamepix.com/games/${item.gameNamespace}/cover/${item.gameNamespace}.png?w=160`,
        }));
    }

    const dbRes = await fetch(`/api/searchGames?q=${encodeURIComponent(query)}&limit=20`);
    const dbData = dbRes.ok ? await dbRes.json() : { items: [] };
    const dbItems = (dbData.items ?? []) as DbSearchItem[];

    return dbItems.map((item) => ({
        namespace: item.namespace,
        title: item.title,
        category: item.category,
        image: item.bannerImage,
    }));
}

export function InputInputGroup() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const requestIdRef = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const runSearch = async (query: string) => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setError(null);
        try {
            const items = await searchGames(query);
            if (requestId === requestIdRef.current) {
                setResults(items);
                setActiveIndex(-1);
            }
        } catch {
            if (requestId === requestIdRef.current) setError("Search failed. Please try again.");
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    };

    useEffect(() => {
        const query = value.trim();
        if (!query) {
            setOpen(false);
            setResults([]);
            setError(null);
            requestIdRef.current++;
            return;
        }

        setOpen(true);
        const timeout = setTimeout(() => runSearch(query), DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [value]);

    const goToDetail = (namespace: string) => {
        setOpen(false);
        router.push(`/detail/${namespace}`);
    };

    const viewAllHref = `/?q=${encodeURIComponent(value.trim())}`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
            return;
        }
        if (!open || results.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < results.length) {
                goToDetail(results[activeIndex].namespace);
            } else {
                setOpen(false);
                router.push(viewAllHref);
            }
        }
    };

    return (
        <Field>
            <ButtonGroup className="relative">
                <Input
                    ref={inputRef}
                    id="input-button-group"
                    placeholder="Search games..."
                    className="text-foreground placeholder:text-muted-foreground"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value.trim() && setOpen(true)}
                    autoComplete="off"
                />
                <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Search"
                    onClick={() => value.trim() && router.push(viewAllHref)}
                >
                    <SearchIcon />
                </Button>
            </ButtonGroup>
            <SearchModal
                open={open}
                query={value.trim()}
                onClose={() => setOpen(false)}
                results={results}
                loading={loading}
                error={error}
                activeIndex={activeIndex}
                onHover={setActiveIndex}
                onSelect={goToDetail}
                viewAllHref={viewAllHref}
            />
        </Field>
    )
}

function SearchModal({
    open,
    query,
    onClose,
    results,
    loading,
    error,
    activeIndex,
    onHover,
    onSelect,
    viewAllHref,
}: {
    open: boolean;
    query: string;
    onClose: () => void;
    results: SearchResult[];
    loading: boolean;
    error: string | null;
    activeIndex: number;
    onHover: (index: number) => void;
    onSelect: (namespace: string) => void;
    viewAllHref: string;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl rounded-2xl bg-[#0b2044] text-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div className="text-sm font-semibold">
                            {query ? `Results for "${query}"` : "Search results"}
                        </div>
                        <button
                            className="rounded-md px-2 py-1 text-sm text-slate-300 hover:text-white"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto p-4">
                        {loading && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-32 animate-pulse rounded-xl bg-[#122a54]"
                                    />
                                ))}
                            </div>
                        )}
                        {!loading && error && (
                            <div className="text-sm text-red-300">{error}</div>
                        )}
                        {!loading && !error && results.length === 0 && (
                            <div className="text-sm text-slate-300">
                                No games found for &ldquo;{query}&rdquo;.
                            </div>
                        )}
                        {!loading && !error && results.length > 0 && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {results.map((item, index) => (
                                        <button
                                            key={item.namespace}
                                            className={`flex w-full flex-col items-start gap-2 rounded-xl p-3 text-left transition ${
                                                index === activeIndex ? "bg-[#143060]" : "bg-[#122a54] hover:bg-[#143060]"
                                            }`}
                                            onMouseEnter={() => onHover(index)}
                                            onClick={() => onSelect(item.namespace)}
                                        >
                                            <div className="relative h-24 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        sizes="200px"
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="line-clamp-2 text-xs font-semibold text-white">
                                                    {item.title}
                                                </div>
                                                {item.category && (
                                                    <div className="mt-0.5 text-[10px] capitalize text-slate-400">
                                                        {item.category}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <Link
                                    href={viewAllHref}
                                    onClick={onClose}
                                    className="mt-4 block text-center text-sm font-medium text-blue-300 hover:text-blue-200"
                                >
                                    View all results for &ldquo;{query}&rdquo; →
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
