import { NextResponse } from "next/server";
import { fetchGamepixDetail } from "@/lib/gamepix";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get("namespace");

    if (!namespace) {
        return NextResponse.json({ error: "Missing namespace" }, { status: 400 });
    }

    const data = await fetchGamepixDetail(namespace);

    if (!data) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" },
    });
}
