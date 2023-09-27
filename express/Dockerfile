FROM node:20.6.1-bullseye-slim
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm run build

FROM node:20.6.1-bullseye-slim
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]