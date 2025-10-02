FROM node:latest

RUN ["npm", "i", "-g", "pnpm"]

WORKDIR /app

COPY ./package.json .
COPY ./pnpm-lock.yaml .

RUN ["pnpm", "install", "--frozen-lockfile"]

COPY . .

RUN ["pnpm", "run", "build"]

ENTRYPOINT ["pnpm", "run", "preview"]
