import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query,
} from './_generated/server';
import { roles } from './schema';

export const getUser = async (
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) => {
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', q =>
      q.eq('tokenIdentifier', tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError('expected user to be defined');
  }

  return user;
};

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      image: args.image,
      orgs: [], // This is an empty array, we will fill it later with addOrgIdToUser mutation
    });
  },
});

export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query('users')
      .withIndex('by_tokenIdentifier', q =>
        q.eq('tokenIdentifier', args.tokenIdentifier)
      )
      .first();

    if (!user) {
      throw new ConvexError('no user with this token found');
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    });
  },
});

// When we create an ogranization, we need to add the orgId to the current logged in user
export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roles,
  },
  handler: async (ctx, args) => {
    // Query the user from ctx
    const user = await getUser(ctx, args.tokenIdentifier);
    await ctx.db.patch(user._id, {
      tokenIdentifier: args.tokenIdentifier,
      orgs: [...user.orgs, { orgId: args.orgId, role: args.role }],
    });
  },
});

export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    const org = user.orgs.find(org => org.orgId === args.orgId);

    if (!org) {
      throw new ConvexError(
        'expected an org on the user but was not found when updating'
      );
    }

    // Cause 'org' variable and the original org from orgs have the same reference
    // So, update 'org' will update the original org as well
    org.role = args.role;

    await ctx.db.patch(user._id, {
      orgs: user.orgs,
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.id('users') },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
    };
  },
});
