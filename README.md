# 🚀 **Cimerat**

### _Manage life with your roommates. Smarter, simpler, and stress-free._

Cimerat is a full-stack web application built with **React +
TypeScript** on the frontend and **Node.js + Express + TypeScript** on
the backend.\
The goal is simple. Make living together easier by tracking everything
that matters inside an apartment.

Whether it's shared bills, balances, monthly expenses, or simple
reminders, **Cimerat keeps everyone synced without awkward
conversations**.

---

## 🌟 **Features (Current & Planned)**

### 🧾 **Shared Bills & Expenses**

- Add, split, and track bills among roommates.
- Automatically calculate balances.
- Keep a clear history of who paid what.

### 🤝 **Roommate Dashboard**

- A clean shared space where everyone sees:
   - Total balance\
   - Individual debts\
   - Monthly spending summary

### 💬 **Notes & Announcements**

- Quickly pin shared info.\
  Example. _"Don't forget to pay rent by the 5th!"_

### 🏠 **Apartment Management**

- Track recurring expenses (rent, utilities, subscriptions).
- Track things like cleaning schedule or shopping lists. _(planned)_

---

## 🛠️ **Tech Stack**

### **Frontend**

- ⚛️ React\
- 🧩 TypeScript\
- ⚡ Vite

### **Backend**

- 🟦 Node.js\
- 🚂 Express\
- 🧩 TypeScript\
- 🌱 dotenv

### **Monorepo Structure**

    Cimerat/
      client/     → React + TypeScript
      server/     → Node Express + TypeScript
      eslint.config.cjs
      package.json
      README.md

---

## 📦 **Installation & Setup**

Clone the project:

```bash
git clone https://github.com/yourusername/Cimerat.git
cd Cimerat
```

Install dependencies:

```bash
npm install
```

### ▶️ Run client

```bash
cd client
npm run dev
```

### ▶️ Run server

```bash
cd server
npm run dev
```

---

## 🧪 **Environment Variables**

Create a `.env` file in the **server** root:

    PORT=4000
    DATABASE_HOST=your_database_host_here
    DATABASE_USER=your_database_user_here
    DATABASE_PASSWORD=your_database_password_here
    DATABASE_NAME=your_database_name_here

---

## 📁 **Folder Structure**

    Cimerat/
    │
    ├── client/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   └── App.tsx
    │   └── vite.config.ts
    │
    ├── server/
    │   ├── src/
    │   │   ├── routes/
    │   │   ├── controllers/
    │   │   └── index.ts
    │   └── tsconfig.json
    │
    └── eslint.config.cjs

---

## 🧭 **Roadmap**

### ✔️ Phase 1. Core Features

- User login / authentication
- Add & split bills
- Personal & shared balances

### ⏳ Phase 2. Smart Tools

- Monthly analytics
- Shared notes & to-do lists
- Auto reminders for rent + bills

### 🔮 Phase 3. Premium Extras (future)

- Push notifications\
- Real-time updates\
- Shared calendar\
- Mobile app version

---

## 🤝 **Contributing**

Pull requests are welcome.\
Make sure your code is clean, typed, and linted using:

```bash
npm run lint
npm run lint:fix
```

---

## 🎨 **Brand Vision**

Cimerat is not just a bill-splitting app.\
It's a **shared home assistant** for everyone living together.

Modern. Friendly. Transparent.\
No more confusion. No more "who owes what?".\
Just good vibes and clear balances.

---

## 📜 **License**

MIT License --- free to use, modify, and improve.
