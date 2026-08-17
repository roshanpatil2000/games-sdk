import { NextResponse } from "next/server";
import { fetchGamepixSearch } from "@/lib/gamepix";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const device = searchParams.get("device") === "mobile" ? "mobile" : "desktop";

    const data = await fetchGamepixSearch(q, device);

    return NextResponse.json(data, {
        headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" },
    });
}
