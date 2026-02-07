"use client";
type Props = {
    params: {
        gameName: string;
    };
};

import { formatDate } from '@/app/utils/dateFormater';
import axios from 'axios';
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react';

export default function PlayGame() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { gameName } = useParams<{ gameName: string }>()
    useEffect(() => {
        fetchGameData();
    }, []);
    const GAMEPIX_SID = "0E766";

    const gameUrl = `https://play.gamepix.com/${gameName}/embed?sid=${GAMEPIX_SID}`;
    const apiUrl = `https://api.gamepix.com/v3/games/ns/${gameName}?sid=${GAMEPIX_SID}`;


    const fetchGameData = async () => {
        try {
            const response = await axios.get(apiUrl);
            // console.log("response--", response)
            setData(response?.data || null);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };


    // const gameDetail = await axios.get(apiUrl);
    // console.log("gameDetail.data:", gameDetail.data);

    // console.log("gameUrl:", gameUrl);
    // console.log("apiUrl:", apiUrl);

    // console.log("data--", data)
    console.log("data.description--", data?.description)




    if (!data) return <p>...loading</p>
    return (
        <div className="">
            {/* title */}
            <div>
                this is game detail page for {gameName}
            </div>

            {/* votes */}
            <p> Likes:- 👍{(data.desktopUpVote + data.mobileUpVote)}</p>
            <p> dis-likes:- 👎{(data.desktopDownVote + data.mobileDownVote)}</p>

            {/* tags */}
            <div>
                {data.tags.map((tag: any) => (
                    <span key={tag?.tagNamespace} className="inline-block bg-muted text-primary px-2 py-1 rounded-xl mr-2 mb-2">
                        {tag?.name}
                    </span>

                ))}
            </div>

            {/* rating */}
            <div>
                rating: {(((data.todivDesktopScore + data.topMobileScore) / 2) * 10).toFixed(1)}
            </div>

            {/* engine */}
            <div>
                engine: {data?.gameEngine}
            </div>

            {/* Platform */}
            <div>
                platform: Browser ({data?.desktopFriendly === true ? "Desktop" : ""} {data?.mobileFriendly === true ? "Mobile" : ""})
            </div>

            {/* Orientation */}
            <div>
                orientation: {data?.orientation === "all"
                    ? "Landscape and Portrait"
                    : data?.orientation === "landscape"
                        ? "Landscape"
                        : data?.orientation === "portrait"
                            ? "Portrait"
                            : ""}
            </div>

            {/* Release date */}
            <div>
                release date: {formatDate(data?.pubDate)}
            </div>

            {/* Last update */}
            <div>
                last update: {formatDate(data?.updatedAt)}
            </div>

            {/* description */}
            <div>
                <pre>description: {data?.description}</pre>
            </div>


            {/* Rewarded Ads */}
            <div>
                <h1>{data.descriptionItems?.[0]?.title}</h1>
                {data?.descriptionItems?.[0]?.content}
            </div>



            {/* how to play */}
            <div>
                <h1>how to play</h1>
                <pre>{data.howToPlay}</pre>
            </div>




            {/* embeded link */}
            {/* <div className="w-200 h-200">
                <canvas  width={"700px"} height={"700px"} className='border' dangerouslySetInnerHTML={{ __html: data.embedCode }} />
            </div> */}


            {/* <div className='relative h-dvh max-w-10/12 rounded-3xl' dangerouslySetInnerHTML={{ __html: data.embedCode }} /> */}
            <div className="" dangerouslySetInnerHTML={{ __html: data.embedCode }} />



        </div>

    );
}