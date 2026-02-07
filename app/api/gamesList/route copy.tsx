import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get("page") ?? "1";

        const url = `https://feeds.gamepix.com/v2/json/?order=quality&page=${page}&pagination=48&sid=0E766`;

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            // ✅ Cache for 10 minutes
            next: {
                revalidate: 600,
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch games list" },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}