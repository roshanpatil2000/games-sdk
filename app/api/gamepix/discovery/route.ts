import { NextResponse } from "next/server";
import { fetchGamepixDiscovery } from "@/lib/gamepix";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const device = searchParams.get("device") === "mobile" ? "mobile" : "desktop";
    const limitParam = Number(searchParams.get("limit") ?? 24);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 48) : 24;

    const data = await fetchGamepixDiscovery(device, limit);

    return NextResponse.json(data, {
        headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" },
    });
}
