const GAMEPIX_API_BASE = "https://api.gamepix.com/v3/games";
const GAMEPIX_FEED_URL = "https://feeds.gamepix.com/v2/json/";
const GAMEPIX_SID = "0E766";

async function safeFetchJson(url: string, revalidate: number) {
    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate },
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.warn(`[gamepix] fetch failed for ${url}`, error);
        return null;
    }
}

export async function fetchGamepixFeed(page: number, pagination = 48) {
    const url = `${GAMEPIX_FEED_URL}?order=quality&page=${page}&pagination=${pagination}&sid=${GAMEPIX_SID}`;
    return safeFetchJson(url, 600);
}

export async function fetchGamepixDiscovery(device: "desktop" | "mobile", limit: number, offset = 0) {
    const data = await safeFetchJson(
        `${GAMEPIX_API_BASE}/device/${device}/discovery?limit=${limit}&offset=${offset}`,
        600
    );
    return data ?? { items: [] };
}

export async function fetchGamepixSearch(query: string, device: "desktop" | "mobile") {
    if (!query) return { items: [] };

    const data = await safeFetchJson(
        `${GAMEPIX_API_BASE}/search?ts=${encodeURIComponent(query)}&device=${device}`,
        300
    );
    return data ?? { items: [] };
}

export async function fetchGamepixTag(
    tag: string,
    device: "desktop" | "mobile",
    limit: number,
    offset = 0
) {
    const data = await safeFetchJson(
        `${GAMEPIX_API_BASE}/tag/${encodeURIComponent(tag)}?limit=${limit}&offset=${offset}&device=${device}`,
        600
    );
    return data ?? { items: [] };
}

export async function fetchGamepixDetail(namespace: string) {
    return safeFetchJson(`${GAMEPIX_API_BASE}/ns/${namespace}`, 300);
}
