FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm
RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "server:dev"]