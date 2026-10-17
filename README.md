# Cleanlink: Your Home's Best Friend

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://cleanlink-easy-home.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8755f2b4-3e91-4add-b278-6cea9f0105c6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Operations MVP

Before deploying the admin, payment, or cleaner-approval workflows, apply
[`drizzle/migrations/0005_simple_operations.sql`](./drizzle/migrations/0005_simple_operations.sql)
in the connected Supabase project's SQL Editor after migrations `0000`–`0004`.
This adds editable room prices, manual payment confirmation, and cleaner
applications that require admin approval. After creating your admin account,
grant it the admin role once in the SQL Editor (replace the phone number):

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from public.profiles
where phone = '0905123456'
on conflict (user_id, role) do nothing;
```

Configure the receiving bank details in the admin dashboard. Payments are
tracked manually; no payment gateway is connected.

## Deploying from GitHub

The root [`render.yaml`](./render.yaml) configures a Render Node web service
that deploys commits pushed to `main`. Create a Render Blueprint from this
repository, provide the four Supabase environment variable values when
prompted, and sync the Blueprint. Render free web services may sleep when idle.

Import the same GitHub repository into Vercel. The root [`vercel.json`](./vercel.json)
builds with Nitro's Vercel preset. Add the same four Supabase variables to the
Vercel project's Production, Preview, and Development environments, then
deploy. Once the repository is linked, pushes to `main` create deployments
automatically on both platforms.

Use the same Supabase project on both hosts:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Only use the publishable key in `VITE_` variables. Never add a Supabase
service-role key to client-exposed variables.
