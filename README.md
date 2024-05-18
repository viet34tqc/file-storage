# Online file storage

This is a demo where I want to try new libraries:  for authentication and data storage.

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
