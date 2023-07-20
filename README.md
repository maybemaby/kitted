# svelte-ts-starter

My personal opinionated SvelteKit starter.

Features:
- [open-props](https://open-props.style/) for styling
- [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) for unit testing
- Components:
  - ThemeSwitcher (dark, light, system)
  - Card
  - Button
  - Visually Hidden
  - Input
  - Portal
- Server stuff:
  - [pino](https://github.com/pinojs/pino) for logging
  - [inngest](https://www.inngest.com/) for serverless queueing
  - [oauth4webapi](https://github.com/panva/oauth4webapi) and some wrapper code for OAuth.
    - Github and Google providers included


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

To run Inngest local dev:

```bash
npx inngest-cli@latest dev

# pnpm
pnpm dlx inngest-cli@latest dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Design Decisions

## Why use Open Props and not Tailwind?

There's a lot of starters with Tailwind at this point. I don't mind Tailwind but I think the main part I liked about Tailwind was the nice defaults it gave me while being easy to customize. Open props also provides nice defaults but uses normal CSS (which I like).

### Why not use Auth library xyz? (i.e NextAuth, Lucia, Supabase, etc.)
Personal preference, I don't like the APIs these libraries that require integrating with an ORM/Database have. Too much abstraction if all you want is sessions, OAuth, and want custom logic.

Trying to avoid creating a starter kit that requires signing up for too many services. (See reasoning for [inngest](#why-use-inngest) below.) Anyway, my auth decisions are pretty easy to rip out and override so go wild.


### Why use Inngest?
If you go the node hosting route, there's plenty of queueing options available (SQS, bullmq, RabbitMq, etc.) Although you'll have to add a separate worker process.

Of the serverless options, Inngest seemed to be nicest to integrate with, offers a generous free plan, works fine even if you're not serverless, and has local development.