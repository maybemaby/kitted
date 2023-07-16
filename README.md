# svelte-ts-starter

My personal opinionated SvelteKit starter.

Features:
- [open-props](https://open-props.style/) for styling
- [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) for unit testing
- 
- Components:
  - ThemeSwitcher (dark, light, system)
- Server stuff:
  - [pino](https://github.com/pinojs/pino) for logging
  - [inngest](https://www.inngest.com/) for serverless queueing


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
