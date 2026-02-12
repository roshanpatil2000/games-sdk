import type { MetadataRoute } from "next";
import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";

function getBaseUrl() {
    const envUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

    const base = envUrl || "http://localhost:3000";
    return base.endsWith("/") ? base.slice(0, -1) : base;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getBaseUrl();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/about.html`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact.html`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy.html`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.4,
        },
    ];

    try {
        const games = await db
            .select({
                namespace: gamesTable.namespace,
                dateModified: gamesTable.dateModified,
                dataSyncedAt: gamesTable.dataSyncedAt,
            })
            .from(gamesTable);

        const gameRoutes: MetadataRoute.Sitemap = games
            .filter((game) => Boolean(game.namespace))
            .map((game) => {
                const rawDate = game.dateModified || game.dataSyncedAt;
                const parsedDate = rawDate ? new Date(rawDate) : undefined;
                const validLastModified =
                    parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined;

                return {
                    url: `${baseUrl}/detail/${game.namespace}`,
                    lastModified: validLastModified,
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                };
            });

        return [...staticRoutes, ...gameRoutes];
    } catch {
        return staticRoutes;
    }
}
