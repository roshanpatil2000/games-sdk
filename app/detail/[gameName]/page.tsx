'use client'

import formatDate from '@/utils/formatDate';
import formatNumber from '@/utils/formatNumber';
import axios from 'axios';
import { details } from 'framer-motion/client';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';


export default function gameGameDetails() {
    const { gameName } = useParams<{ gameName: string }>();
    const searchParams = useSearchParams();
    
    const [datails, setDetails] = useState<any>(null);
    const [tags, setTags] = useState<{ name: string, tagNamespace: string, tagNSLocale: string, title: string }[]>([]);

    const fetchGameDetail = async (gameName: string) => {
        const res = await axios.get(
            `https://api.gamepix.com/v3/games/ns/${gameName}`
        );
        const data = res.data;
        setDetails(data);
        setTags(data.tags);
        // setDetail(data);
    };

    // console.log(gameName)
    useEffect(() => {
        fetchGameDetail(gameName)
    }, [])

    const votes = formatNumber(datails?.desktopUpVote + datails?.mobileUpVote)
    const totalVotes = formatNumber(datails?.desktopUpVote + datails?.mobileUpVote)

    const rawScore =
        ((datails?.scoreRanking + datails?.topDesktopScore + datails?.topMobileScore) / 3) * 10;

    const score = Math.round(rawScore * 10) / 10;


    const ReleaseDate = formatDate(datails?.pubDate)
    const UpdateDate = formatDate(datails?.updatedAt)



    return (
        datails && (
            <div className='p-2 md:p-4 border'>
                <section className='flex flex-col '>
                    <h1 className="text-2xl font-bold">{datails?.title}</h1>
                    <h1 className="text-2xl font-bold">{totalVotes}</h1>
                    <h1 className="text-2xl font-bold">{score}</h1>
                    <h1 className="text-2xl font-bold">{ReleaseDate}</h1>
                    <h1 className="text-2xl font-bold">{UpdateDate}</h1>

                </section>


                {tags.length > 0 && (
                    <div className='mt-4 flex gap-5'>
                        <h2 className='text-lg font-semibold mb-2'>Tags:</h2>
                        <div className='flex flex-wrap gap-2'>
                            {tags.map((tag) => (
                                <span
                                    key={tag.tagNamespace}
                                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                >
                                    {tag.title}
                                </span>
                            ))}
                        </div>
                    </div>
                )}


                {/* <div className='relative h-dvh max-w-10/12' dangerouslySetInnerHTML={{ __html: datails?.embedCode }} /> */}
                <div className='w-full lg:w-1/2'>
                    {/* <Image src={det} */}

                </div>

            </div>
        )
    );
}

