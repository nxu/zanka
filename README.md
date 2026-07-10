# Zanka

Express + Vue 3 + Tailwind, running on Bun, backed by SQLite.

## Development

Install everything from the root (Bun workspaces):

```
bun install
```

Run the server and client dev servers in separate terminals:

```
cd server && bun run dev
```

```
cd client && bun run dev
```

The client dev server runs on `http://localhost:5173` and proxies `/api` to the Express server on port 3000.

## Production (Docker)

```
docker compose up --build
```

Builds the Vue client, serves it as static files from Express, and persists the SQLite database to `./data` on the host via a mounted volume.
