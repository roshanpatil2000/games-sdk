"use client"
import { useState, useEffect, Fragment } from "react";
import dynamic from 'next/dynamic'
import axios from "axios";
import { useRouter } from 'next/navigation'
import { Spline } from "lucide-react";
import SkeletonGrid from "@/components/SkeletonGrid";
import Script from "next/script";

const StickyPagination = dynamic(
    () =>
        import("@/components/ui/sticky-pagination").then(
            (mod) => mod.StickyPagination
        ),
    {
        ssr: false, // important for client-only UI
        loading: () => (
            <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
        ),
    }
)

export default function GameList() {
    const router = useRouter()
    const [loading, setLoading] = useState(true);
    const [games, setGames] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    function getRandomIndices(total: number, count = 6): number[] {
        if (total <= 0) return [];

        const max = Math.min(count, total);
        const indices = new Set<number>();

        while (indices.size < max) {
            indices.add(Math.floor(Math.random() * total));
        }

        return Array.from(indices);
    }

    const totalGames = games.length;
    const adIndices = getRandomIndices(totalGames, 6);

    // const fetchGames = async (page: number) => {
    //     const res = await fetch(
    //         `https://feeds.gamepix.com/v2/json/?order=quality&page=${page}&pagination=48&sid=0E766`
    //     );
    //     const data = await res.json();
    //     const lastPage = Number(new URL(data?.last_page_url).searchParams.get("page"));
    //     setGames(data.items);
    //     setTotalPages(Math.ceil(lastPage)); // from last_page_url or metadata
    // };

    const fetchGames = async (page: number) => {
        setLoading(true);
        const res = await axios.get(`/api/gamesList?page=${page}`);

        const data = res.data
        const lastPage = Number(new URL(data?.last_page_url).searchParams.get("page"));
        setGames(data.items);
        setTotalPages(Math.ceil(lastPage)); // from last_page_url or metadata
        setLoading(false);
    }

    useEffect(() => {
        fetchGames(page);
    }, [page]);


    // const handleClick = (nameSpace: string) => {
    //     router.push(`/detail/${nameSpace}`)
    //     // console.log("nameSpace", nameSpace)
    // }

    const handleClick = (nameSpace: string) => {
        router.push(`/detail/${nameSpace}`)
    }





    if (loading) {
        return <SkeletonGrid count={12} />
    }

    return (

        <div className="mt-12">
            {/* TODO- Discover  */}


            {/* Feeds */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6  gap-4 m-4">

                {games?.map((game: any, index: number) => (
                    <Fragment key={game.id ?? index}>
                        {adIndices.includes(index) && games.length > index && (() => {
                            const containerId = `container-38fffe0d1714cf5ac3cc0455e8dd63de`;
                            // const containerId = `container-38fffe0d1714cf5ac3cc0455e8dd63de`;

                            return (
                                <div
                                    key={`ad-slot-${index}`}
                                    className=""
                                >
                                    <div className="ad-slot">
                                        <Script
                                            async
                                            data-cfasync="false"
                                            src="https://pl28670306.effectivegatecpm.com/38fffe0d1714cf5ac3cc0455e8dd63de/invoke.js"
                                            strategy="afterInteractive"
                                        />
                                        <div
                                            id={containerId}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                            );
                        })()}

                        <div
                            key={game.id ?? index}
                            className="relative group cursor-pointer"
                            onClick={() => handleClick(game.namespace)}
                        >
                            <img
                                src={game?.banner_image}
                                alt="Event cover"
                                className="rounded-lg mb-2 hover:opacity-50 transition-opacity duration-300"
                            />

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-95 bg-muted bg-opacity-75 rounded-lg transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                                <p className="text-center font-semibold">{game.title}</p>
                                <p className="text-center text-sm">{game.category}</p>
                            </div>
                        </div>
                    </Fragment>
                ))}
            </div>


            {
                (games && !loading) && <StickyPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            }
        </div >
    );
}