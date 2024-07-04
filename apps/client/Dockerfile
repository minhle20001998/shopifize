ARG NODE_IMAGE=node:16-alpine

FROM $NODE_IMAGE

RUN npm i -g pnpm
RUN npm i -g turbo

WORKDIR /usr/src/app

COPY ./ ./
RUN turbo prune --scope=client --docker
RUN pnpm i
RUN pnpm build --filter=client

CMD ["pnpm", "--filter", "client", "start"]