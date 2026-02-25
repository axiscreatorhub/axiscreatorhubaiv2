# Database Migration Plan

## 1. Environment Setup
- Ensure you have a Postgres database provisioned (e.g., Neon).
- Update `.env` with your `DATABASE_URL`:
  ```env
  DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
  ```

## 2. Initial Migration
Run the following command to create the initial migration and apply it to the database:
```bash
npx prisma migrate dev --name init
```
This will:
- Create the `migrations` folder.
- Generate the SQL to create all tables (`users`, `brand_profiles`, `subscriptions`, etc.) and enums.
- Apply the SQL to your connected Postgres database.
- Generate the Prisma Client.

## 3. Post-Migration Verification
- Check the database to ensure tables are created.
- Verify that `User` table has a unique index on `clerkId`.
- Verify that `BrandProfile` and `Subscription` have foreign keys to `User`.

## 4. Seeding (Optional)
If you need initial data (e.g., test users), create a `prisma/seed.ts` file and run:
```bash
npx prisma db seed
```

## 5. Deployment
When deploying to production (e.g., Cloud Run):
- Ensure `DATABASE_URL` is set in the production environment variables.
- Run migrations during the build process or as a separate release command:
  ```bash
  npx prisma migrate deploy
  ```
