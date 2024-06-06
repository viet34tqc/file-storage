import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fileTypes = v.union(
  v.literal('image'),
  v.literal('csv'),
  v.literal('pdf')
);

export const roles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    orgId: v.string(),
    type: fileTypes,
    storageId: v.id('_storage'),
    userId: v.id('users'),
    isDeleted: v.optional(v.boolean()),
  }).index('by_orgId', ['orgId']).index('by_isDeleted', ['isDeleted']),
  // We need userId and orgId columns because a file can be markes as favorite by multiple users from multiple organizations
  favorites: defineTable({
    userId: v.id('users'),
    fileId: v.id('files'),
    orgId: v.string(),
  }).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roles,
      })
    ),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
