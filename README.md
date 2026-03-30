# Mini Eraser 🚀

An AI-first technical design workspace inspired by Eraser.io. Combines an infinite canvas with a markdown editor to help developers draw architecture diagrams and write system design specs side-by-side.

## Features

- **Split-Pane Editor**: Draw diagrams and write markdown side-by-side.
- **AI Architecture Generation**:
  - **Prompt to Diagram**: Describe your system in text and get an architecture graph.
  - **Notes to Diagram**: AI reads your markdown to generate the corresponding diagram.
  - **Codebase to Diagram**: Upload a ZIP of your backend (Express/Spring/Django/Go) and the AI reverse engineers the architecture graph automatically!
- **Real-Time Autosave**: Debounced auto-saving to local MongoDB.
- **Authentication**: JWT-based auth and workspace ownership.

## Tech Stack

**Frontend**: Next.js 14, TailwindCSS, Zustand, Framer Motion, tldraw, TipTap
**Backend**: Express.js, TypeScript, MongoDB & Mongoose, multer, OpenAI API, unzipper

## Local Setup

1. **Clone & Install**
   ```bash
   npm run install:all
   ```

2. **Environment Variables**
   Update `.env` in the root (copied from `.env.example`).
   - You need a local MongoDB or Atlas URI.
   - You need an OpenAI API Key.

3. **Seed Database (Optional)**
   ```bash
   cd server
   npm run seed
   ```
   *Creates a demo user: `demo@mini-eraser.dev` / `password123` and some sample workspaces.*

4. **Run the App**
   ```bash
   npm run dev
   ```
   - Client: `http://localhost:3000`
   - Server: `http://localhost:5000`

## Disclaimer

This is an MVP built to demonstrate integration of an infinite canvas, rich-text markdown, and AI logic to reverse-engineer architecture diagrams from code.
