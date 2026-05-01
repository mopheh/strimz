import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";

export const screeningTypeEnum = pgEnum("screening_type", ["PUBLIC", "PRIVATE", "INVITE_ONLY"]);
export const mediaTypeEnum = pgEnum("media_type", ["MOVIE", "TV"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  universityId: text("university_id"), // Kept from previous context if needed
  role: text("role", { enum: ["USER", "ADMIN"] }).default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const screenings = pgTable("screenings", {
  id: uuid("id").primaryKey().defaultRandom(),
  movieId: integer("movie_id").notNull(),
  mediaType: mediaTypeEnum("media_type").default("MOVIE").notNull(),
  title: text("title").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  roomName: text("room_name").notNull(),
  capacity: integer("capacity").default(50),
  type: screeningTypeEnum("type").default("PUBLIC"),
  price: integer("price").default(0), // For future monetization
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).references(() => users.clerkId),
  screeningId: uuid("screening_id").references(() => screenings.id),
  seatNumber: text("seat_number"),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

export const watchlists = pgTable("watchlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).references(() => users.clerkId),
  movieId: integer("movie_id").notNull(),
  mediaType: mediaTypeEnum("media_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
