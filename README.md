# svelte-ts-starter

My personal opinionated SvelteKit starter.

Features:
- [open-props](https://open-props.style/) for styling
- [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) for unit testing
- [class-variance-authority](https://github.com/joe-bell/cva) for design systems
- Dark/light themes
- Server stuff:
  - [pino](https://github.com/pinojs/pino) for logging
  - [inngest](https://www.inngest.com/) for serverless queueing
  - [bullmq](https://github.com/taskforcesh/bullmq) for serverful queueing
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

# Node Adapter
npm run build:node
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

To build the bullmq worker:

```bash
npm run build:worker
```

## Running

Node app:
```bash
npm run start:node
```

Worker:
```bash
npm run start:worker
```

## Theming
Theming is done using CSS variables. You can find global variables in routes/+layout.svelte

## Environment Variables
SESSION_KEY<br>
GITHUB_CLIENT_ID<br>
GITHUB_CLIENT_SECRET<br>
INNGEST_EVENT_KEY<br>
NODE_ENV<br>
USE_NODE - Flag for using node adapter<br>

## Design Decisions

### Why use Open Props and not Tailwind?

There's a lot of starters with Tailwind at this point. I don't mind Tailwind but I think the main part I liked about Tailwind was the nice defaults it gave me while being easy to customize. Open props also provides nice defaults but uses normal CSS (which I like).

### Why not use Auth library xyz? (i.e NextAuth, Lucia, Supabase, etc.)
Personal preference, I don't like the APIs these libraries that require integrating with an ORM/Database have. Too much abstraction if all you want is sessions, OAuth, and want custom logic.

Trying to avoid creating a starter kit that requires signing up for too many services. (See reasoning for [inngest](#why-use-inngest) below.) Anyway, my auth decisions are pretty easy to rip out and override so go wild.


### Why use Inngest?
If you go the node hosting route, there's plenty of queueing options available (SQS, bullmq, RabbitMq, etc.) Although you'll have to add a separate worker process.

Of the serverless options, Inngest seemed to be nicest to integrate with, offers a generous free plan, works fine even if you're not serverless, and has local development.