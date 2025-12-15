# Using This Project as a Seed

## Step 1: Clone and Rename the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/[original-repo]/next-drizzle-tailwind-auth.git new-project-name
   cd new-project-name
   ```

2. Remove the existing Git history and initialize a new repository:

   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit from seed project"
   ```

3. Update project name in `package.json`:
   ```json
   {
     "name": "your-new-project-name"
     // other fields...
   }
   ```

## Step 2: Set Up Database

1. Create a new Neon Database project:

   - Go to [Neon](https://neon.tech/) and create an account if you don't have one
   - Create a new project
   - Create a new database
   - Get the connection string from the dashboard

2. Update the `.env.local` file with your new database connection string:

   ```
   NEXT_PUBLIC_APP_ENV=LOCAL
   DB_URL=postgresql://[your-username]:[your-password]@[your-host]/[your-database]?sslmode=require
   MIGRATIONS_PATH=./drizzle/migrations
   ```

3. Generate and apply migrations:
   ```bash
   npm run generate
   npm run migrate
   ```

## Step 3: Configure Third-Party Services

### Email Service (Resend)

1. Create a [Resend](https://resend.com/) account
2. Create an API key
3. Update `.env.local` with your Resend API key:
   ```
   RESEND_API_KEY=your_resend_api_key
   ```
4. Update sender email in `src/actions/emails.tsx` if needed

### Error Monitoring (Sentry)

1. Create a [Sentry](https://sentry.io/) account
2. Create a new project (select Next.js as the platform)
3. Get your DSN from the project settings
4. Update `.env.local` with your Sentry DSN:
   ```
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
   NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
   ```
5. The project is already configured with Sentry integration:
   - Client-side: `sentry.client.config.ts`
   - Server-side: `sentry.server.config.ts`
   - Edge runtime: `sentry.edge.config.ts`
6. **Configure Sentry Sourcemaps for Better Error Tracking**:

   Sourcemaps allow Sentry to show you the original source code in error stack traces instead of minified code.

   **a. Update Sentry Organization and Project Names**:

   Edit `scripts/upload-sentry-sourcemaps.cjs` and update:

   ```javascript
   const SENTRY_ORG = "your-sentry-org-name";
   const SENTRY_PROJECT = "your-app-name";
   ```

   **b. Get Sentry Auth Token**:

   - Go to Sentry → Settings → Auth Tokens
   - Click "Create New Token"
   - Name it (e.g., "netlify-sourcemaps")
   - Required scopes: `project:releases`, `project:write`, `org:read`
   - Copy the token

   **c. Add to Netlify Environment Variables**:

   - Go to Netlify dashboard → Site settings → Environment variables
   - Click "Add a variable"
   - Name: `SENTRY_AUTH_TOKEN`
   - Value: [paste your Sentry auth token]
   - Scopes: Select "All scopes" or specific deploy contexts
   - Click "Create variable"

   **d. (Optional) Update GitHub Actions Workflow**:

   If you want sourcemaps uploaded via GitHub Actions as well, update `.github/workflows/sentry-sourcemaps.yml`:

   ```yaml
   env:
     NEXT_PUBLIC_APP_ENV: CI
     SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
     SENTRY_ORG: your-sentry-org-name
     SENTRY_PROJECT: your-app-name
   ```

   Then add `SENTRY_AUTH_TOKEN` to your GitHub repository secrets.

   **How it works**:

   - Netlify builds (main + PR previews) will automatically upload sourcemaps
   - GitHub Actions workflow uploads sourcemaps only on pushes to main
   - Local builds skip sourcemap upload (no token required)
   - Build won't fail if sourcemap upload fails

## Step 4: Update E2E Testing Configuration

1. Update the `.env.e2e` file:

   ```
   E2E_URL=http://localhost:3001
   DB_URL=postgresql://test:test@localhost:5433/testdb-<APP_NAME_HERE>
   NEXT_PUBLIC_APP_ENV=E2E
   ```

   Replace `<APP_NAME_HERE>` with your application name to ensure a unique database name for E2E tests.

2. Update the `drizzle-e2e.config.ts` file with your app-specific database name:

   ```typescript
   import type { Config } from "drizzle-kit";

   export default {
     schema: "./src/db/schema.ts",
     out: "./drizzle/migrations",
     dialect: "postgresql",
     dbCredentials: {
       url: "postgresql://test:test@localhost:5433/testdb-<APP_NAME_HERE>",
     },
   } satisfies Config;
   ```

   Replace `<APP_NAME_HERE>` with the same application name you used in `.env.e2e`.

3. Update the `.github/workflows/playwright.yml` file to use your app-specific database name:

   Find the `POSTGRES_DB` line (around line 19) and update it:

   ```yaml
   services:
     postgres:
       image: postgres
       env:
         POSTGRES_PASSWORD: test
         POSTGRES_USER: test
         POSTGRES_DB: testdb-<APP_NAME_HERE>
   ```

   Also update the `DB_URL` in the "Create .env.e2e" step (around line 72):

   ```yaml
   - name: Create .env.e2e
     run: |
       echo "NEXT_PUBLIC_APP_ENV=E2E" > .env.e2e
       echo "DB_URL=postgresql://test:test@localhost:5433/testdb-<APP_NAME_HERE>" >> .env.e2e
       echo "MIGRATIONS_PATH=./drizzle/e2e-migrations" >> .env.e2e
       echo "E2E_URL=http://localhost:3001" >> .env.e2e
       chmod 600 .env.e2e
   ```

   Replace `<APP_NAME_HERE>` with the same application name used in the previous steps.

4. Update the `scripts/start-e2e-db.cjs` file to use your app-specific database name:

   Find the `POSTGRES_DB` constant (line 9) and update it:

   ```javascript
   const POSTGRES_DB = "testdb-<APP_NAME_HERE>";
   ```

   Replace `<APP_NAME_HERE>` with the same application name used in the previous steps.

## Step 5: Configure GitHub Actions and Secrets

This project includes several GitHub Actions workflows that require proper configuration:

### GitHub Actions Workflows Overview

- **`audit.yml`**: Runs dependency security audits on pull requests
- **`build.yml`**: Builds the Next.js application on push/PR
- **`playwright.yml`**: Runs E2E tests with Playwright
- **`sentry-sourcemaps.yml`**: Uploads sourcemaps to Sentry (optional)

### Required GitHub Secrets Setup

#### 1. Navigate to GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

#### 2. Create Repository Secrets

Click **"New repository secret"** and add each of the following:

##### Required for E2E Tests (Playwright workflow):

- **`DOCKERHUB_USERNAME`**: Your Docker Hub username

  - Required to authenticate with Docker Hub for pulling PostgreSQL images
  - Get this from your [Docker Hub](https://hub.docker.com) account

- **`DOCKERHUB_TOKEN`**: Your Docker Hub access token
  - **Important**: Use an access token, NOT your password
  - Create at: Docker Hub → Account Settings → Security → Access Tokens
  - Recommended permissions: "Public Repo Read"

##### Optional for Sentry Integration:

- **`SENTRY_AUTH_TOKEN`**: Your Sentry authentication token
  - Only needed if you're using Sentry for error monitoring
  - Required for both `build.yml` and `sentry-sourcemaps.yml` workflows
  - Create at: Sentry → Settings → Auth Tokens
  - Required scopes: `project:releases`, `project:write`
  - If not using Sentry, you can skip this or disable the Sentry workflows

#### 3. Create GitHub Environments and Add Secrets/Variables

The workflows reference environments (`CI` and `e2e`) where you must configure secrets and variables:

##### Step 3.1: Create Environments

1. Go to repository → **Settings** → **Environments**
2. Click **"New environment"** and create:
   - **`CI`**: For build and audit workflows
   - **`e2e`**: For E2E test workflows

##### Step 3.2: Configure the `e2e` Environment

1. Click on the **`e2e`** environment
2. Scroll to **"Environment secrets"** section
3. Click **"Add environment secret"** and add each of the following:

   - **Name**: `DOCKERHUB_USERNAME`  
     **Value**: Your Docker Hub username (see Docker Hub Setup section below)
   - **Name**: `DOCKERHUB_TOKEN`  
     **Value**: Your Docker Hub access token (see Docker Hub Setup section below)
   - **Name**: `SENTRY_AUTH_TOKEN` (optional, only if using Sentry)  
     **Value**: Your Sentry auth token (see Sentry Setup section below)

4. Scroll to **"Environment variables"** section
5. Click **"Add environment variable"** and add:

   - **Name**: `NEXT_PUBLIC_APP_ENV`  
     **Value**: `e2e`

##### Step 3.3: Configure the `CI` Environment

1. Click on the **`CI`** environment
2. Scroll to **"Environment secrets"** section
3. Click **"Add environment secret"** and add:

   - **Name**: `SENTRY_AUTH_TOKEN` (optional, only if using Sentry)  
     **Value**: Your Sentry auth token (see Sentry Setup section below)
     **Required scopes**: `project:releases`, `project:write`, `org:read`

**Important Notes**:

- The `CI` environment uses **secrets only** - no environment variables are needed
- `SENTRY_AUTH_TOKEN` must be added as a **secret**, not an environment variable
- This secret is used by both `build.yml` and `sentry-sourcemaps.yml` workflows

### Docker Hub Setup (Detailed Steps)

The E2E tests require Docker Hub authentication:

1. **Create Docker Hub Account**:

   - Go to [Docker Hub](https://hub.docker.com)
   - Sign up for a free account if you don't have one

2. **Generate Access Token**:

   - Log in to Docker Hub
   - Click your username → **Account Settings**
   - Go to **Security** → **Access Tokens**
   - Click **"New Access Token"**
   - Name: `github-actions-e2e` (or any descriptive name)
   - Permissions: **"Public Repo Read"** (sufficient for pulling public images)
   - Click **"Generate"**
   - **Copy the token immediately** (you won't be able to see it again)

3. **Add to GitHub Secrets**:
   - Add `DOCKERHUB_USERNAME` with your Docker Hub username
   - Add `DOCKERHUB_TOKEN` with the access token you just generated

### Sentry Setup (Optional)

If you want to use Sentry for error monitoring:

1. **Update Sentry Configuration**:

   - Edit `.github/workflows/sentry-sourcemaps.yml`
   - Update `SENTRY_ORG` and `SENTRY_PROJECT` with your values:
     ```yaml
     env:
       SENTRY_ORG: your-org-name
       SENTRY_PROJECT: your-project-name
     ```

2. **Create Sentry Auth Token**:

   - Go to Sentry → Settings → Auth Tokens
   - Create a new token with scopes: `project:releases`, `project:write`
   - Add as `SENTRY_AUTH_TOKEN` secret in GitHub

3. **Disable Sentry (if not using)**:
   - Delete or disable `.github/workflows/sentry-sourcemaps.yml`
   - Remove Sentry configuration from `next.config.ts` if present

### Verify GitHub Actions Setup

After adding secrets:

1. **Trigger a test run**:

   - Push a commit to your main branch or create a pull request
   - Go to repository → **Actions** tab
   - Watch the workflows run

2. **Check for errors**:

   - If any workflow fails, click on it to see detailed logs
   - Common issues:
     - Missing secrets (will show "secret not found" errors)
     - Invalid Docker Hub credentials
     - Sentry configuration mismatch

3. **Review workflow files** in `.github/workflows/` and customize if needed

## Step 6: Customize the Application

### Update Authentication

1. Review and update user schema in `src/db/schema.ts`
2. Update authentication logic in:
   - `src/app/login/actions.ts`
   - `src/app/register/actions.ts`
   - `src/app/auth.ts`

### Update UI

1. Update the branding and UI components in:

   - `src/app/layout.tsx`
   - `src/app/page.tsx`
   - `src/components/`

2. Update Tailwind configuration in `tailwind.config.js` if needed

### Update Email Templates

1. Customize email templates in `src/react-email/emails/`

## Step 7: Deploy to Netlify

### Prerequisites

- Ensure your code is pushed to a GitHub repository
- Have your environment variables ready (from Steps 2 & 3)

### 1. **Create a Netlify account**:

- Sign up at [Netlify](https://app.netlify.com/signup) if you don't already have an account
- Choose "Sign up with GitHub" for easier integration

### 2. **Connect your GitHub repository**:

- Go to the [Netlify dashboard](https://app.netlify.com)
- Click **"Add new site"** → **"Import an existing project"**
- Select **"GitHub"** as your Git provider
- **Authorize Netlify** to access your GitHub account (if not already done)
- **Search and select** your repository (e.g., `long-covid-ai`)

### 3. **Configure build settings**:

**Important**: Use these exact settings for Next.js:

- **Build command**: `yarn build` (or `npm run build`)
- **Publish directory**: `.next`
- **Base directory**: Leave empty
- **Functions directory**: Leave empty

### 4. **Add environment variables** (CRITICAL):

Before deploying, add these environment variables:

- In Netlify dashboard: **Site settings** → **Environment variables** → **Add variable**
- Add each variable individually:

```
NODE_VERSION=20
NEXT_PUBLIC_APP_ENV=PRODUCTION
DB_URL=postgresql://[your-neon-connection-string]
RESEND_API_KEY=re_[your-resend-api-key]
SENTRY_DSN=https://[your-sentry-dsn]@sentry.io/[your-project-id]
NEXT_PUBLIC_SENTRY_DSN=https://[your-sentry-dsn]@sentry.io/[your-project-id]
SENTRY_AUTH_TOKEN=[your-sentry-auth-token]
MIGRATIONS_PATH=./drizzle/migrations
```

**⚠️ Important**:

- Copy DSN values from your local `.env.local` file
- `SENTRY_AUTH_TOKEN` is used for sourcemap uploads (see Step 3, section 6 above)

### 5. **Deploy your site**:

- Click **"Deploy site"**
- **Monitor the build logs** for any errors
- First deployment typically takes 2-3 minutes
- **Check the deploy log** if build fails

### 6. **Verify deployment**:

- Once deployed, click the **site URL** to test
- Test key functionality:
  - Homepage loads
  - Registration/login works
  - Database connectivity (try registering a test user)

### 7. **Set up custom domain** (optional):

- Go to **Site settings** → **Domain management**
- Click **"Add custom domain"**
- Follow DNS configuration instructions

### 8. **Continuous deployment** (automatic):

- ✅ **Automatic**: Every push to your `main` branch triggers a new deployment
- View deployment history in the Netlify dashboard
- Rollback to previous versions if needed

### 🔧 **Build Configuration File** (Alternative)

You can also create a `netlify.toml` file in your project root for consistent builds:

```toml
[build]
  command = "yarn build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## Common Issues and Troubleshooting

### Database Connection Issues

- Ensure your database connection string is correct
- Check that your IP is allowed in the Neon database firewall settings
- Verify that the database user has the necessary permissions

### Email Sending Issues

- Verify your Resend API key is correct
- Check that your sending domain is verified in Resend
- Look for error messages in the Resend dashboard

### E2E Testing Issues

- Ensure Docker is running for the E2E database
- Check that the PostgreSQL container is accessible on port 5433
- Verify that the E2E database migrations are applied correctly
