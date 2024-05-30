import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { fileTypes } from './schema';
import { getUser } from './users';

// This is where we interact with server (GET, POST)
// We are defining mutations function for POST request

// What are we doing here is to make requests for files and files should belong to a organization
// Therefore, we need to get the orgId from the user
// Default identity lacks of the organization id, so we have to do it on our own.

export const hasAccessToOrg = async (
  ctx: MutationCtx | QueryCtx,
  tokenIdentifier: string,
  orgId: string
) => {
  const user = await getUser(ctx, tokenIdentifier);

  // orgId can be either the orgId or the userId (this userId is included in tokenIdentifier)
  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
  return hasAccess;
};

export const createFile = mutation({
  // args are the arguments passed to when we invoke createFile()
  args: {
    name: v.string(),
    fileId: v.id('_storage'),
    type: fileTypes,
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError('logged in please');
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      throw new ConvexError('You are not allow to do this');
    }
    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      type: args.type,
      fileId: args.fileId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    // We are getting files by orgId
    // So we need to check if the logged in user has access to that org
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      return [];
    }
    return ctx.db
      .query('files')
      .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
      .collect();
  },
});

export const generateUploadUrl = mutation(async ctx => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError('you must be logged in to upload a file');
  }

  return await ctx.storage.generateUploadUrl();
});

export const deleteFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError('you must be logged in to upload a file');
    }
    const file = await ctx.db.get(args.fileId);
    if (!file) throw new ConvexError('File does not exist');

    // Because each file belongs to an org, we need to check if the user has access to that org
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );

    if (!hasAccess) {
      throw new ConvexError('You do not have access to delete the file');
    }

    await ctx.db.delete(args.fileId);
  },
});
