import { ConvexError, v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { fileTypes } from './schema';

// This is where we interact with server (GET, POST)
// We are defining mutations function for POST request

// What are we doing here is to make requests for files and files should belong to a organization
// Therefore, we need to get the orgId from the user
// Default identity lacks of the organization id, so we have to do it on our own.

export const getUserBelongToOrg = async (
  ctx: MutationCtx | QueryCtx,
  orgId: string
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', q =>
      q.eq('tokenIdentifier', identity.tokenIdentifier)
    )
    .first();

  if (!user) {
    return null;
  }

  // orgId can be either the orgId or the userId (this userId is included in tokenIdentifier)
  const hasAccess =
    user.orgIds.some(item => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);
  if (!hasAccess) return null;
  return { user };
};

export const createFile = mutation({
  // args are the arguments passed to when we invoke createFile()
  args: {
    name: v.string(),
    storageId: v.id('_storage'),
    type: fileTypes,
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const userBelongToOrg = await getUserBelongToOrg(ctx, args.orgId);
    if (!userBelongToOrg) {
      throw new ConvexError('You do not belong to the organization');
    }
    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      type: args.type,
      storageId: args.storageId,
      userId: userBelongToOrg.user._id,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.string(),
    pathName: v.string(),
  },
  async handler(ctx, args) {
    // We are getting files by orgId
    // So we need to check if the logged in user has access to that org
    const userBelongToOrg = await getUserBelongToOrg(ctx, args.orgId);
    if (!userBelongToOrg) {
      return [];
    }
    let files = await ctx.db
      .query('files')
      .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
      .collect();

    if (args.query) {
      files = files.filter(file =>
        file.name.toLowerCase().includes(args.query.toLowerCase())
      );
    }

    if (args.pathName.includes('favorites')) {
      const favorites = await ctx.db
        .query('favorites')
        .withIndex('by_userId_orgId_fileId', q =>
          q.eq('userId', userBelongToOrg.user._id).eq('orgId', args.orgId)
        )
        .collect();
      files = files.filter(file => favorites.some(f => f.fileId === file._id));
    } else if (args.pathName.includes('trash')) {
      files = files.filter(file => file.isDeleted);
    } else {
      files = files.filter(file => !file.isDeleted);
    }

    const filesWithUrl = await Promise.all(
      files.map(async file => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );

    return filesWithUrl;
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
    const fileAndUser = await getFileBelongToUser(ctx, args.fileId);

    if (!fileAndUser) {
      throw new ConvexError('Cannot access to the file');
    }

    if (canModifyFile(fileAndUser)) {
      await ctx.db.patch(args.fileId, {
        isDeleted: true,
      });
    }
  },
});

export const deleteAllFiles = internalMutation({
  args: {},
  async handler(ctx) {
    const allFiles = await ctx.db
      .query('files')
      .withIndex('by_isDeleted', q => q.eq('isDeleted', true))
      .collect();

    const allDeleteRequests = allFiles.map(async file => {
      await ctx.storage.delete(file.storageId);
      await ctx.db.delete(file._id);
    });

    await Promise.all(allDeleteRequests);
  },
});

export const restoreFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const fileAndUser = await getFileBelongToUser(ctx, args.fileId);

    if (!fileAndUser) {
      throw new ConvexError('Cannot access to the file');
    }

    if (canModifyFile(fileAndUser)) {
      await ctx.db.patch(args.fileId, {
        isDeleted: false,
      });
    }
  },
});

export const toggleFavorite = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const fileAndUser = await getFileBelongToUser(ctx, args.fileId);

    if (!fileAndUser) {
      throw new ConvexError('Cannot access to the file');
    }

    const { file, user } = fileAndUser;

    const favorites = await ctx.db
      .query('favorites')
      .withIndex('by_userId_orgId_fileId', q =>
        q.eq('userId', user._id).eq('orgId', file.orgId).eq('fileId', file._id)
      )
      .first();

    if (!favorites) {
      await ctx.db.insert('favorites', {
        fileId: file._id,
        orgId: file.orgId,
        userId: user._id,
      });
    } else {
      await ctx.db.delete(favorites._id);
    }
  },
});

export const getAllFavorites = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const userBelongToOrg = await getUserBelongToOrg(ctx, args.orgId);
    if (!userBelongToOrg) {
      return [];
    }

    const favorites = await ctx.db
      .query('favorites')
      .withIndex('by_userId_orgId_fileId', q =>
        q.eq('userId', userBelongToOrg.user._id).eq('orgId', args.orgId)
      )
      .collect();

    return favorites;
  },
});

async function getFileBelongToUser(
  ctx: MutationCtx | QueryCtx,
  fileId: Id<'files'>
) {
  const file = await ctx.db.get(fileId);
  if (!file) {
    return null;
  }

  // Because each file belongs to an org, we need to check if the user has access to that org
  const userBelongToOrg = await getUserBelongToOrg(ctx, file.orgId);

  if (!userBelongToOrg) {
    return null;
  }

  return { file, user: userBelongToOrg.user };
}

function canModifyFile({
  user,
  file,
}: {
  user: Doc<'users'>;
  file: Doc<'files'>;
}) {
  const canModifyFile =
    user.orgIds.find(org => org.orgId === file.orgId)?.role === 'admin';

  if (!canModifyFile) {
    throw new ConvexError('You have no access to modify or delete this file');
  }
  return true;
}
