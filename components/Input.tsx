"use client"

import { Field } from "@/components/ui/field"
import { SearchIcon } from "@/components/ui/search"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type DbGame = {
    namespace: string;
    title: string;
    bannerImage?: string | null;
    image?: string | null;
    url?: string | null;
    category?: string | null;
    description?: string | null;
};


export function InputInputGroup() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<DbGame[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setResults([]);
            setError(null);
        }
    }, [open]);

    const handleSearch = async () => {
        const query = value.trim();
        if (!query) {
            setOpen(false);
            return;
        }
        setOpen(true);
        setLoading(true);
        setError(null);
        try {
            const searchRes = await fetch(
                `/api/searchGames?q=${encodeURIComponent(query)}&limit=20`
            );
            const searchData = await searchRes.json();
            const items: DbGame[] = Array.isArray(searchData.items) ? searchData.items : [];
            setResults(items);
        } catch (err) {
            setError("Search failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <Field>
        //     <InputGroup>
        //         <InputGroupInput id="input-group-url" placeholder="Search" />

        //         <InputGroupAddon align="inline-start">
        //             <Search />
        //         </InputGroupAddon>
        //     </InputGroup>
        // </Field>


        <Field>
            <ButtonGroup className="">
                <Input
                    id="input-button-group"
                    placeholder="Type to search game..."
                    className="text-primary placeholder:text-primary/50"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <Button variant="secondary" size="icon" onClick={handleSearch} aria-label="Search">
                    <SearchIcon />
                </Button>
            </ButtonGroup>
            <SearchModal
                open={open}
                onClose={() => setOpen(false)}
                results={results}
                loading={loading}
                error={error}
                onSelect={(namespace) => {
                    setOpen(false);
                    router.push(`/detail/${namespace}`);
                }}
            />
        </Field>
    )
}

export function SearchModal({
    open,
    onClose,
    results,
    loading,
    error,
    onSelect,
}: {
    open: boolean;
    onClose: () => void;
    results: DbGame[];
    loading: boolean;
    error: string | null;
    onSelect: (namespace: string) => void;
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
                        <div className="text-sm font-semibold">Search results</div>
                        <button
                            className="rounded-md px-2 py-1 text-sm text-slate-300 hover:text-white"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto p-4">
                        {loading && (
                            <div className="text-sm text-slate-300">Loading...</div>
                        )}
                        {error && (
                            <div className="text-sm text-red-300">{error}</div>
                        )}
                        {!loading && !error && results.length === 0 && (
                            <div className="text-sm text-slate-300">No results.</div>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {results.map((item) => (
                                <button
                                    key={item.namespace}
                                    className="flex w-full flex-col items-start gap-2 rounded-xl bg-[#122a54] p-3 text-left hover:bg-[#143060]"
                                    onClick={() => onSelect(item.namespace)}
                                >
                                    <div className="w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                                        {item.bannerImage && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={item.bannerImage}
                                                alt={item.title ?? "Game"}
                                                className="h-24 w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="line-clamp-2 text-xs font-semibold text-white">
                                            {item.title ?? item.namespace}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
