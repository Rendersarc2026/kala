# Kala. | Architecture & Curated Interiors Studio

Kala is a minimalist, editorial-style website for an architecture and interior design studio. It includes a public-facing website presenting landing sliders, team history (Who We Are), design services, project archives, journal entries, and a protected Admin Dashboard (`/admin`) for full content management.

---

## Technical Stack

*   **Framework**: Next.js 14 (App Router) with TypeScript
*   **Styling**: Tailwind CSS & Vanilla Custom CSS
*   **Database**: PostgreSQL
*   **ORM**: Prisma (using PostgreSQL PG driver adapter)
*   **Authentication**: Credentials-based NextAuth.js (for `/admin` routes)
*   **Animations**: Framer Motion
*   **File Uploads**: Server-side write to local disk (`/public/uploads`)

---

## Project Setup & Running Locally

### 1. Installation
Clone the repository, enter the directory and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and `.env`:
```bash
cp .env.example .env.local
cp .env.example .env
```
Ensure that `DATABASE_URL` matches your local PostgreSQL connection string.

*   *Note: If you do not have a local Postgres service running on port 5432, you can use the built-in Prisma dev server sandbox. See the "Database Sandbox Setup" section below.*

### 3. Initialize the Database
Generate the Prisma Client and push the schema structure to PostgreSQL:
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Database Content & Default Admin Credentials
Seed the database with placeholder editorial images (from Unsplash) and initial copy:
```bash
npx prisma db seed
```
This inserts the default administrator credentials:
*   **Admin Email**: `admin@kala.design`
*   **Admin Password**: `password123`

### 5. Run the Development Server
Start the Next.js development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin panel.

---

## Database Sandbox Setup (Optional)

If you do not have a local PostgreSQL server installed, you can launch a local sandbox PostgreSQL server using Prisma:

1.  **Start the Dev Server in the background**:
    ```bash
    npx prisma dev --detach
    ```
2.  **Get the connection string**:
    Inspect the output or run `npx prisma dev ls` to find the TCP PostgreSQL URL (usually starts with `postgres://postgres:postgres@localhost:51214/...`).
3.  **Update `.env` and `.env.local`**:
    Replace `DATABASE_URL` in both files with the TCP URL output from the previous step.
4.  **Push and Seed**:
    Run `npx prisma db push` and `npx prisma db seed` to finalize the sandbox.

---

## Replacing Local Storage with Cloud Storage

The file upload handler is located in `src/lib/upload.ts`. To switch to cloud storage (e.g. AWS S3, DigitalOcean Spaces):
1.  Install the S3 Client: `npm install @aws-sdk/client-s3`
2.  Uncomment the S3 client setup in [upload.ts](file:///home/abin/Desktop/work/kala/src/lib/upload.ts).
3.  Provide the environment keys in `.env.local` (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`).
4.  Update the return statement to output the public cloud URL.
