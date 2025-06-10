# 📖 Bible Reference Linker Plugin for Obsidian

This plugin converts Bible references (e.g. `John 3:16`) into links to [Bible.com](https://www.bible.com), and can optionally add inline verse previews.

## ✨ Features

- Command Palette or editor toolbar action to convert references
- Optional version selection
- Optional inline preview (KJV/ASV/WEB)

## 🔧 Settings

- Choose default version
- Toggle inline preview

## 🛠️ Install

1. Clone/download this repo
2. Copy the `manifest.json`, `main.js`, and `styles.css` (optional) into your vault's `plugins/obsidian-bible-linker` folder.
3. Enable the plugin in Obsidian.

## 🧪 Development Instructions

### 🛠 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v22 or later recommended)
- [Yarn](https://yarnpkg.com/) or `npm`
- Obsidian (for testing in your vault)

### 📦 Install Dependencies

```bash
cd obsidian-bible-linker
npm install
# or
yarn install
```

### 🧪 Develop with Live Rebuild

```bash
npm run dev
# or
yarn dev
```

This watches your code and recompiles on change.

### 🏗 Build for Production

```bash
npm run build
# or
yarn build
```

Builds the final version into the dist/ folder.

### 🧪 Test in Obsidian

1. In Obsidian:

   - Go to Settings → Community plugins → Open plugins folder.

2. Copy the following files from this repo:

   - `dist/main.js`
   - `manifest.json`
   - `styles.css` (optional)

3. Enable the plugin in Obsidian.

Optional: To avoid copying each time:

```bash
# From inside your Obsidian vault's plugins folder
ln -s /path/to/obsidian-bible-linker obsidian-bible-linker
```

