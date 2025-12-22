FROM node:20-alpine

WORKDIR /app

RUN npm install turbo --global
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml turbo.json ./

COPY . .

RUN pnpm install

CMD ["pnpm", "turbo", "run", "dev", "--filter=tymble-ui"]