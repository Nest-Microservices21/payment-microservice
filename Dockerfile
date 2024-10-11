

ARG NODE_VERSION=22.3.0
ARG PNPM_VERSION=9.12.0

FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

FROM base as deps

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml tsconfig.*.json ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts

FROM deps as build

RUN  --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM base as dev-final

WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./
EXPOSE ${PORT}
CMD ["pnpm", "start:dev"]


FROM base as final

WORKDIR /usr/src/app
ENV NODE_ENV production
# Use --chown on COPY commands to set file permissions
USER node
COPY --from=deps --chown=node:node /usr/src/app/package.json ./
COPY --from=deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist

# Switch to root user to perform cleanup
USER root
RUN apk del --purge libc6-compat && rm -rf /var/cache/apk/* /tmp/* /usr/src/app/.pnpm-store

# Switch back to node user
USER node
EXPOSE ${PORT}
CMD ["pnpm", "start:prod"]
