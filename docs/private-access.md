# Private viewer access

Only invited viewers can browse movies, series, watch pages, and request pages. Catalog and player APIs return HTTP 401 without a valid session. There is no public signup. Administrator actions still require the separate existing admin credentials as well as a viewer session.

## Create or update a viewer

Run `node scripts/add-viewer.cjs username` from the project directory. Each viewer has a separate username and a generated random password. The script updates the private `.env.local` with a scrypt password hash and creates `viewer-credentials.local.txt` containing the password for you to share with that viewer. Both files are excluded from Git. Add `--rotate` to replace an existing viewer's password. Never commit either file or add their contents to frontend code.

Restart the local server after changing accounts. To deploy, set `AUTH_SESSION_SECRET` and `VIEWER_ACCOUNTS` in Vercel's Production environment variables using the values from `.env.local` (omit the surrounding single quotes on the JSON array), then redeploy. Repeat this after adding, changing, or removing viewers. Existing TMDB and admin environment variables remain required for those features.

Remove a viewer's object from `VIEWER_ACCOUNTS` and restart/redeploy to revoke access. Changing a password hash, removing a viewer, or rotating the signing secret invalidates the corresponding sessions. Sessions last eight hours, use signed HttpOnly SameSite cookies, and are Secure in production. Sign out clears the current browser's session; password rotation revokes sessions on other devices too. The session contains no password.

Missing or malformed auth settings block access. Login attempts have per-username, per-server-instance throttling (eight attempts per 15 minutes); serverless instances do not share rate counters. This configuration-backed system supports up to 200 invited accounts and has no public registration, self-service password reset, or account-management database. Account changes take effect on the next deployment, rather than immediately across existing Vercel deployments.

Validation: `node test-auth.cjs`, `node test-tmdb.cjs`, `node test-players.cjs`, `node test-streaming.cjs`, and `node node_modules/next/dist/bin/next build`. Then run `node test-auth-server.cjs` for a real production-server login and access-control check with isolated test credentials.
