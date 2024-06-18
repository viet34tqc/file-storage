# Online file storage

This is a demo where I want to try new libraries: for authentication and data storage.

## Techstack

- Framework: NextJs
- Authentication: Clerk. Alternatively, you can use 'next-auth'. I'm using Clerk because it works well with Convex
- Backennd service: Convex. This is an all-in-one backend service: database, file storages. TODO: replace this with a self-hosted backend.
- Styling: Tailwind and shadcn ui
- Storybook: For component UI demo

## How to setup

- `pnpm install`: install the package
- Create Convex account, then create a project
- Run `npx convex dev` to connect to your convex database. It will also create a `.env.local` in your root directory
- Create Clerk account, create new app then go to 'API keys', insert those keys into `.env.local`
- Create Clerk webhook. When we trigger an event on Clerk, like create, update user, create organization, we send a request to Convex.
  - Go to Clerk dashboard -> Webhook
  - Add Endpoint
  - Enter Endpoint URL. This is where the HTTP actions are exposed and it will be something like: `https://<your deployment name>.convex.site/clerk`. You can replace the path 'clerk' with anything you want but in this project I'm using 'clerk'. Go to <https://docs.convex.dev/functions/http-actions> for more details.
  - Select the 'Subscribed Event' for this webhook. When an event in the list happens, Clerk will send a POST Request to this endpoint URL. Please check `organizationMembership.created`, `organizationMembership.updated`, `user.updated`, `user.created`
  - Copy Signing secret and paste it as `CLERK_WEBHOOK_SECRET` environment variable
  - Create 'CLERK_HOSTNAME' environment variable, its value can be found in 'Domain' section in Clerk dashboard
  - Go to Convex dashboard -> Settings, create `CLERK_WEBHOOK_SECRET` and `CLERK_HOSTNAME` variables with value like above

## Features

### Authentication

This is the default feature of Clerk

- An user can login via email or social medias (Facebook, Github)
- Once logged in, user can create a organization and will be the admin of that organization by default
- Admin can send invitation to other users. User can have role of 'admin' or 'user'
- An user can join in multiple organization and an organization can have multiple users

### Member invitation

You can add new member to your organization by sending invitation to their email. You can search for this invitation in 'spam' folder

### Convex and Clerk Authentication

This feature is setup in `auth.config.ts`. For further information, go to <https://docs.convex.dev/auth/clerk>.

### Clerk webhooks

In this project, we will try to connect Convext and Clerk. Specifically, we will update the database in Convex when we trigger an event in Clerk (create, update user, orgarnization...)

Clerk webhooks allow you to receive event notifications from Clerk, such as when a user is created or updated. When an event occurs, Clerk will send a POST request to your webhook endpoint URL. This endpoint is configured in the 'Webhook' section in Clerk Dashboard. You can also select the events which trigger this webhook

The flow is as follows: Trigger Clerk event (create, update user...) => send POST request to Clerk webhook endpoint which is Convex HTTP actions URL => Convex will handle the request in HTTP actions 'handler' callback

The definition of Convex HTTP actions is in 'http.ts' file

### Upload, delete file

Convex allow us to store uploaded file. First, we upload files to Convex. Each file have a `storage id` which is the value for `fileId` field of `files` schema.

A file URL can be generated from a storage ID by the `storage.getUrl` (I'm calling it in the `getFiles.ts`)

In an organization:

- Admin can upload file and delete all files
- Member can upload file and delete his files only

### File deletion cronjob

If files are in the trash, they will be deleted in an hour, periodically.

### Real-time update

This is the default feature of Convex, it using web socket to update the data in real time. When you add, update or delete a file, the update are reflected instantly.

## What I learn after building this project

- How to setup authentication with Clerk
- How webhook works via using Clerk event and Convex
