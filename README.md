# Startmap 🚀
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/84a02e87-fae9-422a-8d5a-84cd14adfe4b" />


Startmap is an interactive, cinematic "startup universe" ecosystem map. It visualizes the complex relationships between top startups (such as Y Combinator alumni) in a stunning, highly animated Bento Grid UI. 

Built with modern web technologies, Startmap provides an immersive experience to explore companies, discover their connections (competitors, similar industries, shared tags, or same batch), and view detailed information.

## 🌟 Key Features

- **Cinematic Ecosystem View:** Powered by Framer Motion, the UI smoothly transitions between a global grid and a focused "Ecosystem View" that highlights a selected company and its direct connections.
- **Dynamic Relationships:** Companies are linked together based on industry overlap, shared batches, and common tags. 
- **Premium Design:** A dark-mode, glassmorphism-inspired aesthetic with subtle glows, custom scrollbars, and fluid animations.
- **Detailed Insights:** A slide-out sidebar reveals in-depth information about a startup when clicked.
- **Local Database:** Uses Prisma with a local SQLite database, making it extremely easy to run and extend.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Library:** [React](https://react.dev/) 19
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/) (SQLite)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Setup the Database

The project uses a local SQLite database (`prisma/dev.db`). You need to push the schema and seed the database with the initial startup data.

```bash
npx prisma db push
node prisma/seed.js
```
*(Note: The seed script will generate the initial companies and calculate their relationship weights).*

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal, e.g., 3001) in your browser to see the result.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and API routes (e.g., `api/data` for serving the graph data).
- `src/components/`: Core UI components like `BentoGrid`, `Sidebar`, `MainOverlay`, and `UIControls`.
- `src/store/`: Zustand state management (`useStore.ts`) for handling node and link data globally.
- `prisma/`: Database schema (`schema.prisma`) and the data seeding script (`seed.js`).
