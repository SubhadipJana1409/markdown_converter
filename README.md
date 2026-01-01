# DOCX to Markdown Converter

A high-fidelity, client-side converter that transforms Word documents (`.docx`) into clean Markdown (`.md`). Features a modern, glassmorphic UI and supports batch processing.

## Features

- **Batch Conversion**: Upload and convert multiple files at once.
- **High Fidelity**: Preserves tables, headings, lists, and formatting (using `mammoth.js` + `turndown` + `gfm`).
- **Privacy First**: All conversion happens locally in your browser. No files are uploaded to any server.
- **Bulk Download**: Download individual files or a ZIP archive of all converted documents.

## How to Run

1.  **Install Dependencies** (if you haven't already):
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Technologies

- **Vite + React**: Fast, modern frontend framework.
- **Mammoth.js**: Best-in-class .docx to HTML converter.
- **Turndown**: HTML to Markdown converter.
- **Vanilla CSS**: Custom premium styling with Glassmorphism.
- **JSZip**: Client-side ZIP creation.

## 🚀 How to Deploy (Free)

Since this application runs entirely in the browser (client-side), you can host it for **free** forever on any static site provider. Here are the two easiest ways:

### Option 1: Vercel (Recommended)
1.  Create an account at [vercel.com](https://vercel.com).
2.  Install the Vercel CLI (optional) or just use the web dashboard.
3.  **Drag & Drop**: Run `npm run build` locally. This creates a `dist` folder. Drag this folder into the Vercel dashboard to deploy.
4.  **Git (Automatic)**: Push this code to GitHub/GitLab. Connect your repository in Vercel. It will detect Vite and deploy automatically.

### Option 2: Netlify
1.  Create an account at [netlify.com](https://netlify.com).
2.  **Drag & Drop**: Run `npm run build` locally. Drag the `dist` folder onto the "Sites" page in Netlify.
3.  **Git**: Connect your repository. Netlify will auto-detect the build command (`npm run build`) and publish directory (`dist`).

### Option 3: GitHub Pages
1.  If using GitHub Pages, you may need to set the `base` in `vite.config.js` to your repository name.

