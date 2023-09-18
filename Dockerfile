FROM node:lts-alpine as base

FROM base as deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build:node
RUN npm i -g pm2

ENV NODE_ENV production
EXPOSE 3000

CMD ["pm2", "start", "build/index.js", "-i", "max", "--attach"]


# FROM base as runner
# WORKDIR /app

# ENV NODE_ENV production
# RUN npm i -g pm2

# COPY --from=builder /app/build ./build
# COPY --from=deps /app/package.json ./
# COPY .env.local ./.env

# EXPOSE 3000

# CMD ["pm2", "start", "build/index.js", "-i", "max", "--attach"]