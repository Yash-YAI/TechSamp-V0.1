# TechSamp Portal (V0.1)

A modern apparel production management web portal featuring role-based module navigation, multilingual localization (English, Khmer, Chinese), dark/light theme switching, and secure JWT-based authentication.

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Project Architecture](#-project-architecture)
- [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Generate SSL Certificates](#4-generate-ssl-certificates)
  - [5. Start the Application](#5-start-the-application)
- [Available Scripts](#-available-scripts)
- [Default Ports & Endpoints](#-default-ports--endpoints)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## ✨ Features

- **Module Management Dashboard**: Displays production operational modules (Marker Order, Marker Ratio, Fabric/Thread Consumption, GSD/SAM, etc.) with custom status colors (Completed: Green, Developing: Orange, Coming Soon: Gray with Sold-Out style sash).
- **Role-Based Access Control (RBAC)**: Centralized module permissions defined in `src/config/modulesConfig.js` with instant Super Admin / Developer access.
- **Multilingual Support**: Real-time language switching across English (`en`), Khmer (`kh`), and Chinese (`ch`) via `i18next`.
- **Theme Modes**: Full Tailwind CSS v4 Dark and Light mode support.
- **Secure Backend API**: Node.js/Express server over HTTPS with MongoDB Mongoose schemas, JWT authentication, and SSL self-generation.

---

## 🛠️ Prerequisites

Before you start, ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or higher (Recommended: `v20.x` or `v22.x`)
- **npm**: `v9.x` or higher (packaged with Node.js)
- **MongoDB**: A running MongoDB instance (local or accessible remote database server)
- **Git**: For version control
- *(Optional)* **mkcert** or **OpenSSL**: For SSL certificates (the backend will automatically generate fallback certificates if not already present).

---

## 📂 Project Architecture

```text
TechSamp-V0.1/
├── backend/
│   ├── certs/                 # SSL key and certificate files (key.pem, cert.pem)
│   ├── config/                # Environment and database connection configurations
│   ├── controllers/           # Auth and Home controllers
│   ├── models/                # MongoDB Mongoose models (User, RoleManagement)
│   ├── routes/                # API routes (authRoutes, homeRoutes)
│   ├── scripts/               # SSL certificate generator script
│   └── server.js              # Express HTTPS server entry point
├── public/
│   └── assets/                # 3D module icons, illustrations, and logos
├── src/
│   ├── api/                   # Axios client and API services (auth, home)
│   ├── components/            # Reusable UI components (Navbar, Modals, ModuleCard)
│   ├── config/                # modulesConfig.js (Centralized modules & RBAC)
│   ├── context/               # ThemeContext (Dark/Light mode)
│   ├── lang/                  # i18n setup and translation JSON files (en, kh, ch)
│   ├── pages/                 # Main routed pages (Login, Home, Feature pages)
│   ├── App.jsx                # React router & authentication wrapper
│   └── main.jsx               # React DOM entry point
├── .env.example               # Template environment configuration
├── package.json               # Root dependencies and automation scripts
├── vite.config.js             # Vite configuration with Tailwind v4 & reverse proxy
└── README.md                  # Project documentation
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone the Repository

Clone the project from your Git repository and navigate into the root directory:

```bash
git clone <repository-url>
cd TechSamp-V0.1
```

---

### 2. Install Dependencies

Install all root, frontend, and backend packages in a single command:

```bash
npm install
```

---

### 3. Configure Environment Variables

Create your local `.env` configuration file from the template:

```bash
cp .env.example .env
cp .env.example backend/.env
```

Open `.env` (and `backend/.env`) in your text editor and configure your environment variables (server port, database connections, and authentication secrets) as outlined in `.env.example`.

> **Security Notice**: Never commit `.env` files or expose sensitive database credentials, network IP addresses, or secret keys in public repositories or documentation. Keep all connection strings and secrets secure in your local environment.

---

### 4. Generate SSL Certificates

The backend runs on HTTPS. Generate local SSL certificates in `backend/certs/`:

```bash
npm run cert:generate
```

*If `mkcert` is installed, it creates trusted certificates. Otherwise, it automatically falls back to standard OpenSSL self-signed certificates.*

---

### 5. Start the Application

You will run the **backend** and the **frontend** in two separate terminal windows.

#### Terminal 1: Start the Backend Server

```bash
npm run server
```
*Or with automatic code reload:*
```bash
npm run server:dev
```

You should see:
```text
✓ SSL Certificates loaded
✓ MongoDB Connected: database_name
✓ Server running securely over HTTPS on port 5003
```

#### Terminal 2: Start the Frontend Client

```bash
npm run dev
```

You should see:
```text
  VITE v8.3.5  ready in 150 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Open the Application:

Navigate to [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 📜 Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on `http://localhost:5173` |
| `npm run server` | Starts the Node.js Express HTTPS backend on port `5003` |
| `npm run server:dev` | Starts the backend with Node's native `--watch` flag for hot reloading |
| `npm run cert:generate` | Automatically provisions SSL certificates inside `backend/certs/` |
| `npm run build` | Compiles and optimizes the React frontend into the production `dist/` folder |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Runs ESLint across the codebase |

---

## 🔌 Default Ports & Endpoints

| Service | Protocol / URL | Notes |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | Vite Dev Server with HMR |
| **Backend API** | `https://localhost:5003` | Express HTTPS REST API |
| **Vite API Proxy** | `http://localhost:5173/api/*` | Proxied automatically to `https://localhost:5003/api/*` |
| **Health Check** | `https://localhost:5003/api/health` | Returns `{ status: "ok" }` |
| **Auth Endpoint** | `https://localhost:5003/api/auth/login` | Accepts `{ username, password }` |

---

## ❓ Troubleshooting & FAQs

### 1. `EADDRINUSE: address already in use :::5003`
Another process is already holding port 5003. To free it:
```bash
# macOS / Linux:
kill $(lsof -t -i:5003)
```

### 2. `Unable to connect to the authentication server`
- Ensure the backend server is running in your terminal (`npm run server`).
- Check that your database server is running and accessible from your environment.
- Verify the API URL configured in `.env` is correct.

### 3. Self-Signed SSL Certificate Warning in Browser
When testing backend endpoints directly in the browser (`https://localhost:5003`), your browser may warn that the certificate is self-signed:
- Click **Advanced** $\rightarrow$ **Proceed to localhost (unsafe)** once to trust the certificate.
- When accessing through the frontend (`http://localhost:5173`), the Vite proxy handles SSL verification with `secure: false`, avoiding browser security prompts.

### 4. Modules Not Showing on the Home Page
- Verify that your user account has access in `src/config/modulesConfig.js`.
- Users with `job_title` containing `Developer` or accounts with `Admin` / `Super Admin` roles have access to view and launch all modules.

---

## 📄 License

Internal Proprietary - All rights reserved.
