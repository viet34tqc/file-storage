import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

// This is where we interact with server (GET, POST)
// We are defining mutations function for POST request

export const createFile = mutation({
  // args are the arguments passed to when we invoke createFile()
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('logged in please');
    }
    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    // We are getting files by orgId
    // So we need to check if the logged in user has access to that org
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return ctx.db
      .query('files')
      .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
      .collect();
  },
});
