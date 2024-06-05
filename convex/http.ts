import { httpRouter } from 'convex/server';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// What are we doing here is to connect Clerk and Convex
// We utilize the Clerk webhook, which allow you to receive event notifications from Clerk, such as when a user is created or updated. When an event occurs, Clerk will send a POST request to your webhook endpoint configured for the event type
// This file includes all the definition of Convex HTTP actions, which is what we will do when Clerk send a request.
// The flow is as follows: Trigger Clerk event (create, update user...) => send POST request to Clerk webhook endpoint which is Convex HTTP actions URL => Convex will handle the request in 'handler' callback

http.route({
  path: '/clerk',
  method: 'POST',
  // This function will be used to respond to HTTP requests if the requests matches the path and method where this action is routed
  // The URL of HTTP actions are https://<your deployment name>.convex.site
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;

    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          'svix-id': headerPayload.get('svix-id')!,
          'svix-timestamp': headerPayload.get('svix-timestamp')!,
          'svix-signature': headerPayload.get('svix-signature')!,
        },
      });

      switch (result.type) {
        // When user created, we run an internalMutaion 'createUser', which is defined in users.ts
        // process.env.CLERK_HOSTNAME is read from convex dashboard, we cannot read it directly in the .env.local file
        case 'user.created':
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.id}`,
          });
          break;
        // `organizationMembership.created` will be triggered when an user create an organization or an member is added to an organization
        case 'organizationMembership.created':
          await ctx.runMutation(internal.users.addOrgIdToUser, {
            tokenIdentifier: `${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: result.data.role === 'org:admin' ? 'admin' : 'member',
          });
          break;
        case 'organizationMembership.updated':
          await ctx.runMutation(internal.users.updateRoleInOrgForUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: result.data.role === 'org:admin' ? 'admin' : 'member',
          });
          break;
      }

      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      return new Response('Webhook Error', {
        status: 400,
      });
    }
  }),
});

export default http;
