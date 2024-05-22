import { httpRouter } from 'convex/server';

import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const http = httpRouter();

// What are we doing is to send a webhook from Clerk to the Convex server
// when we create, update user or attach the user to an organization

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
        case 'user.created':
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `https://${process.env.CLERK_HOSTNAME}|${result.data.id}`,
            name: `${result.data.first_name ?? ''} ${
              result.data.last_name ?? ''
            }`,
            image: result.data.image_url,
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
