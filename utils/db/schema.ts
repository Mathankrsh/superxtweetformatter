import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

// Tweet history table - stores improvements for anonymous visitors
export const tweetsHistoryTable = pgTable('tweets_history', {
    id: uuid('id').primaryKey().defaultRandom(),
    visitorId: text('visitor_id').notNull(),
    originalText: text('original_text').notNull(),
    improvedText: text('improved_text').notNull(),
    isThread: boolean('is_thread').default(false),
    mode: text('mode').default('auto'), // 'auto', 'single', 'thread'
    createdAt: timestamp('created_at').defaultNow(),
});

export type InsertTweetHistory = typeof tweetsHistoryTable.$inferInsert;
export type SelectTweetHistory = typeof tweetsHistoryTable.$inferSelect;
