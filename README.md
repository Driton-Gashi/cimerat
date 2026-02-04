<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MySQL-8-4479a1?style=flat-square&logo=mysql" alt="MySQL" />
</p>

<h1 align="center">Cimerat</h1>
<p align="center">
  <strong>Manage life with your roommates. Smarter, simpler, stress-free.</strong>
</p>
<p align="center">
  A full-stack app for shared apartments: track payments, loans, complaints, and spending—all in one place.
</p>

---

## What is Cimerat?

Cimerat is a **shared-home assistant** for everyone living under one roof. Instead of spreadsheets and awkward “who paid what?” chats, you get a single dashboard per apartment: **payments**, **loans**, **complaints**, and **spending analytics**—scoped to your apartment and visible only to your roommates (and platform admins when needed).

- **Per-apartment data** — Each user sees only their current apartment’s data.
- **Platform admin** — Admins can switch between any apartment and view that apartment’s dashboard and data.
- **Roommate-focused** — Invite members, track who paid what, and keep balances clear.

---

## Features

| Area                    | Description                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Dashboard**           | Overview cards (members, payments, loans, complaints) and a spending chart by member for the current year. |
| **Payments**            | Create and filter payments (Bills, Personal, Product), track paid/unpaid, view by date and type.           |
| **Loans**               | Track loans between roommates, filter by status and date.                                                  |
| **Complaints**          | Log and view complaints with optional image, complainer and suspect.                                       |
| **Apartment & members** | One apartment per user; invite by link or email; switch apartment (admin sees all).                        |
| **Auth**                | Sign up, login, onboarding (create or join apartment), JWT-based sessions.                                 |
| **Settings**            | Manage apartment members, invite link, send invite by email (optional SMTP).                               |
| **Admin**               | Platform admin dashboard: list apartments, members, delete apartments (for `platform_admin` only).         |

---

## Tech stack

| Layer        | Technologies                                                           |
| ------------ | ---------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite, React Router, ApexCharts, React DatePicker |
| **Backend**  | Node.js, Express 5, TypeScript, JWT, bcrypt                            |
| **Data**     | MySQL (e.g. MySQL 8), `mysql2` driver                                  |
| **Tooling**  | ESLint, Prettier, Nodemon (dev)                                        |

---

## Project structure

```
cimerat/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Shared UI (auth, dashboard, header, sidebar, filters, etc.)
│   │   ├── context/        # AuthContext
│   │   ├── libs/           # api, types, utils
│   │   ├── pages/          # Home, Payments, Loans, Complaints, Settings, Admin, Auth
│   │   └── main.tsx
│   ├── public/
│   └── vite.config.ts
├── server/                  # Express API
│   ├── src/
│   │   ├── controllers/    # auth, payment, loan, complaint, apartment, admin, etc.
│   │   ├── middleware/     # auth (requireAuth, requireApartment, requirePlatformAdmin)
│   │   ├── models/         # DB access (auth, payment, loan, complaint, apartment, etc.)
│   │   ├── routes/         # REST routes
│   │   ├── lib/            # email (nodemailer)
│   │   ├── db.ts
│   │   ├── database.sql    # Schema reference
│   │   └── index.ts
│   └── .env.example
├── package.json            # Root scripts: lint, lint:fix, format
├── eslint.config.cjs
└── README.md
```

---

## Quick start

### Prerequisites

- **Node.js** (v18+)
- **MySQL** (e.g. 8.x) — create a database and user

### 1. Clone and install

```bash
git clone https://github.com/yourusername/cimerat.git
cd cimerat
npm install
```

### 2. Backend

```bash
cd server
cp .env.example .env
# Edit .env with your DATABASE_*, JWT_SECRET, FRONTEND_ORIGIN, optional SMTP
npm install
npm run dev
```

Server runs at `http://localhost:4000` by default.

### 3. Frontend

```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000 (or your API URL)
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Database

Use the schema in `server/src/database.sql` to create tables (apartments, cimerat, apartment_members, payments, loans, complaints, user_preferences, etc.) in your MySQL database.

---

## Environment variables

### Server (`server/.env`)

| Variable               | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `DATABASE_HOST`        | MySQL host                                                            |
| `DATABASE_USER`        | MySQL user                                                            |
| `DATABASE_PASSWORD`    | MySQL password                                                        |
| `DATABASE_NAME`        | MySQL database name                                                   |
| `JWT_SECRET`           | Secret for JWT signing (use a long random string in production)       |
| `JWT_EXPIRES_IN`       | e.g. `7d`                                                             |
| `FRONTEND_ORIGIN`      | Frontend URL (e.g. `http://localhost:5173`) for CORS and invite links |
| `PORT`                 | API port (default `4000`)                                             |
| `SMTP_*` / `MAIL_FROM` | Optional; for “Send invite by email” in Settings                      |

### Client (`client/.env`)

| Variable       | Description                                         |
| -------------- | --------------------------------------------------- |
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) |

---

## Scripts

| Command                       | Where     | Description                     |
| ----------------------------- | --------- | ------------------------------- |
| `npm run dev`                 | `client/` | Start Vite dev server           |
| `npm run dev`                 | `server/` | Start Express with Nodemon      |
| `npm run build`               | `client/` | Production build                |
| `npm run build` / `npm start` | `server/` | Build and run production server |
| `npm run lint`                | root      | Lint client + server            |
| `npm run lint:fix`            | root      | Lint with auto-fix              |
| `npm run format`              | root      | Prettier format                 |

---

## Roadmap

- **Done:** Auth, apartments, members, payments, loans, complaints, dashboard, spending chart, platform admin, invitations, settings.
- **Next:** Monthly analytics, shared notes/reminders, recurring expenses.
- **Later:** Notifications, real-time updates, shared calendar, mobile.

---

## Contributing

1. Fork the repo and create a branch.
2. Keep code typed (TypeScript) and run:

   ```bash
   npm run lint
   npm run lint:fix
   npm run format
   ```

3. Open a pull request.

---

## License

MIT — use, modify, and share freely.
