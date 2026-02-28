FROM node:24-alpine AS base

# Enable Corepack to use pnpm
RUN corepack enable

WORKDIR /app

FROM base AS development
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]
