import { db } from "@/db/drizzle";
import { gamesTable } from "@/db/schema";
import { desc, ilike, or } from "drizzle-orm";

export async function searchGamesInDb(query: string, limit: number) {
    const pattern = `%${query}%`;

    return db
        .select()
        .from(gamesTable)
        .where(
            or(
                ilike(gamesTable.title, pattern),
                ilike(gamesTable.namespace, pattern),
                ilike(gamesTable.category, pattern),
                ilike(gamesTable.description, pattern)
            )
        )
        .limit(limit);
}

export async function getTopGamesFromDb(limit: number, offset = 0) {
    return db
        .select()
        .from(gamesTable)
        .orderBy(desc(gamesTable.qualityScore))
        .limit(limit)
        .offset(offset);
}
