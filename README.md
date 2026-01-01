# 📄 Doc to Markdown Converter

[![Live Demo](https://img.shields.io/badge/Live_Demo-Online-green?style=for-the-badge&logo=netlify)](https://markdownconvert.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A lightning-fast, client-side tool to batch convert **Word Documents (`.docx`)** and **PDFs** into clean, formatted **Markdown (`.md`)**.

**[🔴 Visit Live Website](https://markdownconvert.netlify.app/)**

---

## ✨ Features

- **🚀 Batch Processing**: Drag & drop dozens of files (PDF or DOCX) to convert them simultaneously.
- **🔒 Privacy First**: **100% Client-Side**. Your files never leave your browser. No servers, no tracking.
- **💎 Premium UI**: A modern, glassmorphic interface designed for clarity and ease of use.
- **📦 ZIP Download**: Download converted files individually or grab them all in a single ZIP archive.
- **📝 High Fidelity**:
  - **DOCX**: Preserves semantic structure, tables, formatting, and images (via `mammoth.js` + `turndown`).
  - **PDF**: Intelligent layout parsing to reconstruct headers and paragraphs.

## 🛠️ Technology Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **DOCX Engine**: [Mammoth.js](https://github.com/mwilliamson/mammoth.js)
- **PDF Engine**: [PDF.js](https://github.com/mozilla/pdf.js)
- **Markdown Engine**: [Turndown](https://github.com/mixmark-io/turndown) + [GFM Plugin](https://github.com/domchristie/turndown-plugin-gfm)
- **Utilities**: [JSZip](https://stuk.github.io/jszip/) (Archiving), [Lucide React](https://lucide.dev/) (Icons)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SubhadipJana1409/markdown_converter.git
    cd markdown_converter
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:5173`.

## 📦 Deployment

This project is configured for automated deployment to **GitHub Pages**.

### Manual Deployment
To deploy changes manually:
```bash
npm run deploy
```
This script runs the build process and pushes the `dist` folder to the `gh-pages` branch.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Created with ❤️ by [SubhadipJana1409](https://github.com/SubhadipJana1409)*
