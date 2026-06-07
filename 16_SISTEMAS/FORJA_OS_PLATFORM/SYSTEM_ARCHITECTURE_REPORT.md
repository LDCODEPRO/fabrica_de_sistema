# SYSTEM_ARCHITECTURE_REPORT

Mission: FACTORY_PLATFORM_PRODUCTION_READY_V1
Date: 2026-06-05

## Folder Structure

```text
FORJA_OS_PLATFORM/
├── Factory OS - Monitor 1.html
├── css/
│   ├── app.css
│   ├── centers.css
│   └── tokens.css
├── js/
│   ├── app.jsx
│   ├── centers_a.jsx
│   ├── centers_b.jsx
│   ├── centers_c.jsx
│   ├── copilot.jsx
│   ├── data.js
│   ├── explorer.jsx
│   ├── shared.jsx
│   └── shell.jsx
├── scripts/
│   ├── build.mjs
│   ├── generated-entry.jsx
│   ├── serve.mjs
│   ├── shutdown.ps1
│   └── startup.ps1
├── tests/
│   └── static-audit.mjs
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── package.json
└── .env.example
```

## Modules

| Module | Responsibility |
|---|---|
| `data.js` | Static FORJA dashboard dataset |
| `shared.jsx` | React hooks, icons, mini charts, shared UI primitives |
| `shell.jsx` | Menubar, activity bar, status bar |
| `explorer.jsx` | Sidebar navigation |
| `copilot.jsx` | Local UI-only copilot panel and command palette |
| `centers_a.jsx` | Command center and project center |
| `centers_b.jsx` | Mission, agent, and LLM centers |
| `centers_c.jsx` | Deploy, costs, audit, knowledge, and settings centers |
| `app.jsx` | App root, state, view routing |

## Services

| Service | Status |
|---|---|
| Frontend static app | Implemented |
| Static HTTP server | Implemented for local validation |
| nginx production server | Configured |
| Backend API | Missing from supplied ZIP |
| Database | Missing from supplied ZIP |
| Authentication | Missing from supplied ZIP |

## APIs

No real API client or backend routes are present in the supplied package. All platform data is static in `js/data.js`.

## Database

No schema, migrations, persistence layer, or database client is present in the supplied package.

## Dependencies

Runtime:

```text
react 18.3.1
react-dom 18.3.1
```

Build:

```text
esbuild 0.27.1
```
