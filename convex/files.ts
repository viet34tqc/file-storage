import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// This is where we interact with server (GET, POST)
// We are defining mutations function for POST request

export const createFile = mutation({
  // args are the arguments passed to when we invoke createFile()
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('files', {
      name: args.name,
    });
  },
});

export const getFiles = query({
  args: {},
  async handler(ctx, args) {
    return ctx.db.query('files').collect();
  },
});
