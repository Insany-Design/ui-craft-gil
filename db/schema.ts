import {sqliteTable,integer,text,index} from 'drizzle-orm/sqlite-core';
export const courseConfig=sqliteTable('course_config',{
 id:integer('id').primaryKey(),ownerId:text('owner_id').notNull(),
 passwordHash:text('password_hash').notNull(),epoch:text('epoch').notNull(),
});
export const courseSessions=sqliteTable('course_sessions',{
 tokenHash:text('token_hash').primaryKey(),epoch:text('epoch').notNull(),expires:integer('expires').notNull(),
},table=>[index('course_sessions_expires_idx').on(table.expires)]);
export const courseRate=sqliteTable('course_rate',{
 key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull(),
});
