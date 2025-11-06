# Application Deployment Guide

This guide explains how to make your Next.js application public (deploy it) so that anyone can visit it with a URL.

The AI assistant's role is to help you create and modify the application's code within the Firebase Studio environment. The AI **does not** handle the deployment process. You are responsible for deploying the finished code.

A common and recommended way to deploy a Next.js application is by using a Git-based workflow with a hosting provider like **Netlify** or **Vercel**.

## General Deployment Steps

### Step 1: Push Your Code to a GitHub Repository

1.  **Create a new repository on GitHub:** Go to [GitHub](https://github.com) and create a new, empty repository. Do not initialize it with a README or license file.
2.  **Link your local project to GitHub:** In your Firebase Studio terminal, or your local command line, run the following commands, replacing `<YOUR_GITHUB_REPO_URL>` with the URL of the repository you just created.

    ```bash
    # Make sure you are in your project's root directory
    git init -b main
    git add .
    git commit -m "Initial commit of the AT Game HUB application"
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin main
    ```

### Step 2: Choose a Hosting Provider

Netlify is a great choice for Next.js apps and is easy to set up. This project already contains a `netlify.toml` configuration file.

1.  **Sign up for Netlify:** Go to [Netlify](https://www.netlify.com/) and sign up with your GitHub account.
2.  **Import your project:**
    *   From your Netlify dashboard, click "Add new site" -> "Import an existing project".
    *   Choose "GitHub" as your provider and authorize Netlify to access your repositories.
    *   Select the GitHub repository you created in Step 1.
3.  **Configure build settings:**
    *   Netlify should automatically detect that you have a Next.js project and configure the build settings for you based on the `netlify.toml` file.
    *   The settings should be:
        *   **Build command:** `npm run build`
        *   **Publish directory:** `out`
    *   You may need to add Environment Variables (like your Firebase and Telegram keys) in the Netlify site settings for the live application to work correctly. Go to `Site settings > Build & deploy > Environment`.
4.  **Deploy:** Click the "Deploy site" button. Netlify will start building and deploying your application.

### Step 3: Access Your Live Site

Once the deployment is complete, Netlify will provide you with a public URL (e.g., `https://your-site-name.netlify.app`). You can now share this link with anyone.

Every time you push new code changes to your GitHub repository's `main` branch, Netlify will automatically redeploy your site with the updates.
