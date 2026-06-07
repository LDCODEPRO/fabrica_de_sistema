# FACTORY_PLATFORM_PRODUCTION_WALKTHROUGH

Date: 2026-06-05

## Local Validation

```powershell
cd D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\FORJA_OS_PLATFORM
npm install
npm run validate
npm run serve
```

## Docker Validation

```powershell
cd D:\FABRICA_DE_SISTEMAS\16_SISTEMAS\FORJA_OS_PLATFORM
docker compose config
docker compose up --build
curl http://127.0.0.1:8080/health.json
```

## Production Notes

- The app is a hardened static frontend.
- Runtime data is currently static in `js/data.js`.
- Backend, database, authentication, and real API integrations must be supplied before full platform production certification.
- Certification remains `NOT_READY_FOR_PRODUCTION` until Docker runtime and missing backend/database layers are validated.
