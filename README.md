# Online file storage

This is a demo where I want to try new libraries: for authentication and data storage.

## Techstack

- Framework: NextJs
- Authentication: Clerk. Alternatively, you can use 'next-auth'. I'm using it because it works well with Convex
- Backennd service: Convex. This is all-in-one backend service: database, file storages. TODO: replace this with a self-hosted backend.
- Styling: Tailwind and shadcn ui

## How to setup

- `pnpm install`: install the package
- Create Convex account, then create a project
- Run `npx convex dev` to connect to your convex database. It will also create a `.env.local` in your root directory
- Create Clerk account, create new app then go to 'API keys', insert those keys into `.env.local`
- Create Clerk webhook. When we trigger an event on Clerk, like create, update user, create organization, we send a request to Convex
  - Go to Clerk dashboard -> Webhook
  - Add Endpoint
  - Enter Endpoint URL. This will be something like: `https://<your deployment name>.convex.site`. Go to <https://docs.convex.dev/functions/http-actions> for more details.
  - Copy Signing secret and paste it as `CLERK_WEBHOOK_SECRET` environment variable
  - Create 'CLERK_HOSTNAME' environment variable, its value can be found in 'Domain' section in Clerk dashboard
