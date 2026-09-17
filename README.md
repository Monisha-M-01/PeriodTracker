# Period Tracker

Period Tracker is a comprehensive full-stack web application designed for private and dynamic period and cycle tracking. It allows users to log their period dates, daily symptoms (such as mood, flow, and cramps), and provides dynamic predictions for future cycles and fertile windows. The app prioritizes data privacy and features an intuitive, responsive user interface.

## 🚀 Tech Stack

**Frontend:**
- **Framework:** React 19 (TypeScript) with Vite
- **Styling:** Tailwind CSS (v4)
- **State & Data Fetching:** React Query & Axios
- **Routing:** React Router v7
- **UI & Animations:** Framer Motion, Radix UI, Lucide React
- **Data Visualization:** Recharts

**Backend:**
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only cookies
- **Rate Limiting & Security:** Express-rate-limit, Helmet, CORS

## 📋 Prerequisites

To run this project locally, you will need the following applications installed on your system:

1. **[Node.js](https://nodejs.org/)** (v18 or higher) - Runtime environment for both frontend and backend.
2. **[Git](https://git-scm.com/)** - For cloning the repository.
3. **[PostgreSQL](https://www.postgresql.org/)** (or **[Docker](https://www.docker.com/)**) - A running PostgreSQL database instance is required. You can install PostgreSQL locally, use Docker to spin up a container (a `docker-compose.yml` is included), or use a cloud provider like Supabase.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Monisha-M-01/PeriodTracker.git
   cd PeriodTracker
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Variables:**
   - Copy the `.env.example` file to `.env` in the root directory.
   - Update the `DATABASE_URL` and `DIRECT_URL` with your PostgreSQL connection strings.
   - Set up your JWT secrets (`JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`).

5. **Database Setup:**
   Run Prisma to push the schema to your database:
   ```bash
   npx prisma db push
   ```

6. **Run the Application:**
   Open two terminal windows.
   
   **Terminal 1 (Backend):**
   ```bash
   npm run dev
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

Now you can access the application at `http://localhost:5173`.
