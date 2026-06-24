# Monorepo CI/CD Test

This repository contains a small monorepo with:

- `src/frontend` — static frontend example
- `src/backend` — Node.js backend example with a simple test
- `.github/workflows/ci.cd.yml` — CI/CD automation workflow
- `docker-compose.sonar.yml` — local SonarQube stack for analysis

## What the GitHub Actions workflow does

The workflow runs on:

- Pull requests targeting `main`
- Pushes to `main`
- Version tags such as `v1.0.0`

It is path-filtered so normal branch/PR runs only start when files under `src/**` or `.github/workflows/ci.cd.yml` change.

Jobs:

1. `test_matrix`
   - Tests the backend on Node.js `18.x`, `20.x`, and `22.x` in parallel.
   - Uses npm cache plus a `node_modules` cache keyed by Node version and `src/backend/package-lock.json`.

2. `sonarqube_analysis`
   - Runs in parallel with the test matrix.
   - Uses `fetch-depth: 0` so SonarQube can access full Git history/blame information.
   - Reads `SONAR_TOKEN` and `SONAR_HOST_URL` from GitHub Repository Secrets.

3. `simulate_deployment`
   - Runs only after both tests and SonarQube analysis pass.
   - Simulates secure deployment without touching real infrastructure.

4. `create_release`
   - Runs only for version tag pushes such as `v1.0.0`.
   - Uses `contents: write` permission and auto-generates release notes.

## Run local SonarQube

On Linux, SonarQube may require a higher Elasticsearch map count:

```bash
sudo sysctl -w vm.max_map_count=262144
```

Start SonarQube:

```bash
docker compose -f docker-compose.sonar.yml up -d
```

Open:

```text
http://localhost:9000
```

Default login:

```text
admin / admin
```

SonarQube will ask you to change the password on first login.

## Create the SonarQube project token

Inside SonarQube:

1. Create a project with this key:

```text
github_task_monorepo
```

2. Generate a project analysis token.
3. Add it to GitHub repository secrets as:

```text
SONAR_TOKEN
```

## Expose local SonarQube to GitHub Actions

GitHub-hosted runners cannot access your laptop directly, so expose local port `9000` through a temporary tunnel.

Option A — localtunnel:

```bash
npx localtunnel --port 9000
```

Option B — ngrok:

```bash
ngrok http 9000
```

Copy the generated public HTTPS URL and add it to GitHub repository secrets as:

```text
SONAR_HOST_URL
```

Example value:

```text
https://your-temporary-url.loca.lt
```

Keep the tunnel running while the GitHub Actions workflow executes.

## Push a release tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release job will run only after tests, SonarQube analysis, and deployment simulation pass.
