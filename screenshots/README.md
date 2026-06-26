# Application Screenshots Guide

This folder contains guidelines and instructions to capture visual assets for the submission. The following files should be captured and saved directly to this directory:

---

## Required Visual Assets

1. **`home.png` / `home.webp`**
   - **Page**: Workspace Landing Page (`/` idle state)
   - **Details**: Full-screen view showing the search workspace, including popular ticks, recent chips, quick statistics, recent reports table, and the active watchlist sparklines.
   - **Aesthetics**: Ensure the permanent sidebar is fully visible and the animated SVG nodes have completed a fade-in.

2. **`loading.png` / `loading.webp`**
   - **Page**: Workspace Searching Page (`/` loading state)
   - **Details**: Capture mid-analysis showing the multi-agent orchestration loading panel and the pulsing orbital node graph.
   - **Aesthetics**: Ensure at least 2 steps are marked completed (e.g. Research, Financials) while the third is in a "running" active loading state.

3. **`results.png` / `results.webp`**
   - **Page**: Investment Analysis Results Page (`/` completed report state)
   - **Details**: Full dashboard showing the custom confidence radial rings, company profiles, metric card charts, news timeline sentiment, and the polar risk radar chart.
   - **Aesthetics**: Scroll to display the balance between the left column summary panel and the right column charting boards.

4. **`mobile.png` / `mobile.webp`**
   - **Page**: Mobile Workspace Layout (responsive breakpoint)
   - **Details**: Responsive view simulating an iPhone/Android portrait size. Show how the sidebar collapses into a drawer overlay toggled by the sticky top bar menu.

---

## Capture Procedure

1. Run the local development server:
   ```bash
   npm run dev
   ```
2. Open Chrome/Safari Developer Tools, set resolution to **1920×1080** (high DPI/Retina is preferred).
3. Use the Chrome Command Menu (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for **"Capture full size screenshot"** to get perfect high-definition assets without browser chrome.
4. Convert files to PNG or highly optimized WebP format, name them exactly as shown above, and drop them into this folder.
