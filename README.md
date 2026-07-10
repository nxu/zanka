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

- `/` — public results dashboard (team standings, top 3 players, latest score entry). No login required; reloads itself every 5 minutes.
- `/admin` — password-gated admin panel for managing teams, players, and scores.

## Production (Docker)

1. Create a `.env` file next to `docker-compose.yml` (same directory) with real secrets:

   ```
   ADMIN_PASSWORD=<a real password>
   SESSION_SECRET=<a long random string>
   COOKIE_SECURE=false
   ```

   Generate a strong `SESSION_SECRET` with:

   ```
   openssl rand -hex 32
   ```

   Set `COOKIE_SECURE=true` only once the app is served over HTTPS (e.g. behind a TLS-terminating reverse proxy) — otherwise the admin login cookie won't be sent and login will silently fail.

2. Build and start:

   ```
   docker compose up --build -d
   ```

3. Visit `http://<host>:3000/` for the public dashboard and `http://<host>:3000/admin` for the admin panel.

The container restarts automatically (`unless-stopped`) if it crashes or the host reboots. The Vue client is built and served as static files from Express, and the SQLite database is persisted to `./data` on the host via a mounted volume — back it up by copying `./data/app.db`.

To stop: `docker compose down` (data in `./data` is untouched). To update after pulling new code: `docker compose up --build -d` again.
