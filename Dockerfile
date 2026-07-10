FROM oven/bun:1 AS client-build
WORKDIR /app/client
COPY client/package.json ./
RUN bun install
COPY client/ ./
RUN bun run build

FROM oven/bun:1
WORKDIR /app/server
COPY server/package.json ./
RUN bun install --production
COPY server/ ./
COPY --from=client-build /app/client/dist ./public

EXPOSE 3000
VOLUME /app/server/data

CMD ["bun", "run", "index.js"]
