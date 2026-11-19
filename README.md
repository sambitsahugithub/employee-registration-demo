# Employee Registration App

A simple full-stack app for registering employees.

- **frontend/** — React 19 + Vite UI (registration form + list of registered employees)
- **backend/** — Node.js + Express 5 REST API, with data kept in SQLite (Node's built-in `node:sqlite`, so there are no native dependencies)

## Prerequisites

Node.js 22.13 or later (built and tested on Node 26 LTS).

## Run locally

In two terminals:

```bash
# Terminal 1 – API on http://localhost:5000
cd backend
npm install
npm start

# Terminal 2 – UI on http://localhost:5173
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` to the backend.

Data is stored in `backend/data/employees.db`. Set `DB_FILE` or `PORT` to change the database location or the API port.

## API

| Method | Path                  | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/health`         | Health check                    |
| GET    | `/api/departments`    | Allowed departments             |
| GET    | `/api/employees`      | List employees (newest first)   |
| GET    | `/api/employees/:id`  | Get one employee                |
| POST   | `/api/employees`      | Register an employee            |
| DELETE | `/api/employees/:id`  | Remove an employee              |

`POST /api/employees` body:

```json
{
  "firstName": "Asha",
  "lastName": "Rao",
  "email": "asha.rao@example.com",
  "phone": "+91 98765 43210",
  "department": "Engineering",
  "designation": "Software Engineer",
  "dateOfJoining": "2026-11-01"
}
```

Responses: `201` returns the created employee with a generated `employeeCode` (e.g. `EMP00001`), `400` returns field-level `errors`, and `409` means the email is already registered.

## Tests

```bash
cd backend
npm test
```
