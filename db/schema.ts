import { pgTable, text } from "drizzle-orm/pg-core";

export const gamesTable = pgTable("games", {
    gameID: text("game_id").notNull().primaryKey(),

    title: text().notNull(),
    namespace: text().notNull(),

    description: text(),
    category: text(),
    orientation: text(),

    qualityScore: text(),
    width: text(),
    height: text(),

    dateModified: text("date_modified"),
    datePublished: text("date_published"),

    bannerImage: text("banner_image"),
    image: text(),

    url: text().notNull(),
    dataSyncedAt: text("data_synced_at"),

});
// export const gameDetailsTable = pgTable("game_details", {
//     gameID: integer("game_id")
//         .notNull()
//         .primaryKey()
//         .references(() => gamesTable.gameID, { onDelete: "cascade" }),
//     longDescription: text("long_description"),
//     instructions: text(),
//     developer: text(),
//     publisher: text(),
//     tags: text(),
//     controls: text(),
//     languages: text(),
//     rating: text(),
//     upvotes: integer(),
//     downvotes: integer(),
//     views: integer(),
//     updatedAt: timestamp("updated_at").defaultNow()
// });