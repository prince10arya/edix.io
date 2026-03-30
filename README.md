<div align="center">
  <img src="https://raw.githubusercontent.com/tldraw/tldraw/main/assets/tldraw-logo.svg" alt="Logo" width="100"/>
  <h1>Mini Eraser 🚀</h1>
  <p>An AI-first technical design workspace inspired by <a href="https://eraser.io/">Eraser.io</a>. Combines an infinite canvas with a markdown editor to help developers diagram architectures and write system design specs side-by-side.</p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

## ✨ Features

- 📐 **Split-Pane Editor**: Draw diagrams and write markdown side-by-side with a resizable layout.
- 🤖 **AI Architecture Generation**:
  - **Prompt to Diagram**: Describe your system in plain text and watch the AI draw your architecture graph.
  - **Notes to Diagram**: The AI reads your markdown documentation to auto-generate the corresponding diagrams.
  - **Codebase to Diagram**: Upload a `.zip` of your backend codebase (Express, Spring, Django, Go) and let the AI reverse-engineer the architecture graph automatically!
- 💾 **Real-Time Autosave**: Debounced auto-saving tracks your canvas and notes directly to MongoDB.
- 🔐 **Authentication**: JWT-based secure auth and workspace ownership.

---

## 🛠 Tech Stack

### Frontend
* **Framework**: React 18 & [Next.js 14](https://nextjs.org/) (App Router)
* **Styling**: [TailwindCSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
* **State Management**: [Zustand](https://github.com/pmndrs/zustand)
* **Canvas Engine**: [tldraw](https://tldraw.dev/)
* **Rich Text Editor**: [TipTap](https://tiptap.dev/)

### Backend
* **Server**: Node.js & [Express.js](https://expressjs.com/)
* **Language**: TypeScript throughout
* **Database**: MongoDB with [Mongoose](https://mongoosejs.com/) ODM
* **AI Provider**: Google Gemini (`gemini-2.5-flash`) via `@google/genai`
* **Utilities**: `nanoid`, `bcryptjs`, `jsonwebtoken`, `multer`, `unzipper`

---

## 🚀 Local Setup

### 1. Clone & Install
Ensure you have Node.js (v18+) installed.
```bash
git clone https://github.com/prince10arya/edix.io.git
cd edix.io

# Install dependencies for the client and server workspaces
cd client && npm install
cd ../server && npm install
```

### 2. Environment Variables
Create a `.env` file in the **root** of the monorepo by copying `.env.example`:
```bash
cp .env.example .env
```
Update the `.env` file with your credentials:
- **MONGODB_URI**: Your local or Atlas MongoDB string (e.g. `mongodb://127.0.0.1:27017/mini-eraser`).
- **GEMINI_API_KEY**: Your Google Gemini API Key.
- **JWT_SECRET**: Random string for auth tokens.

### 3. Seed Database (Optional but Recommended)
Populate the database with a test user and pre-made example workspaces:
```bash
cd server
npm run seed
```
*Creates a demo user: `demo@mini-eraser.dev` / `password123`*

### 4. Run the Application
From the root directory, you can start both the Next.js client and the Express backend concurrently:
```bash
# In terminal 1 (Client)
cd client
npm run dev

# In terminal 2 (Server)
cd server
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 📂 Project Structure

```text
├── client/                 # Next.js 14 Frontend
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # Reusable React components (Canvas, AI Chat, etc.)
│   ├── store/              # Zustand state management
│   └── services/           # Axios API services
├── server/                 # Express.js Backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose User & Workspace schemas
│   │   ├── services/       # AI & codebase parsing services
│   │   └── utils/          # JWT and seeding utils
└── .env                    # Shared environment variables
```

---

<div align="center">
  <sub>Built as a technical showcase for infinite canvas integration and AI-driven architecture reverse engineering.</sub>
</div>
