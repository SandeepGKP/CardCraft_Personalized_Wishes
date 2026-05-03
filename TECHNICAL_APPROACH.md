# 🎨 CardCraft AI: Technical Approach Document

Welcome to the technical deep-dive of **CardCraft AI**, a high-performance, immersive greeting card studio. This document outlines the architectural decisions and engineering strategies used to build this platform.

---

## 🚀 1. Problem-Solving Approach: Image Overlay Logic

The core challenge was creating a **Dynamic Canvas** that allows users to personalize templates with text, stickers, and branding, and then "snapshot" that state into a shareable image.

### 🛠️ The Implementation Strategy:
- **Layered Component Architecture**: We implemented a multi-layered coordinate system where the base layer is the high-definition template, followed by the **Typography Layer** and the **Decoration Layer**.
- **Percentage-Based Positioning**: To ensure responsiveness across all screen sizes, all overlays (text, stickers, avatars) use **relative (%) coordinates**. This means a sticker placed at `x:50, y:50` remains perfectly centered whether viewed on a 4K monitor or an iPhone.
- **State-to-Canvas Mapping**: We used a unified state object to track every decoration's ID, type, position, and size. This allowed for real-time manipulation (dragging/resizing) without re-rendering the entire canvas.
- **Robust Snapshotting**: We leveraged `html2canvas` with advanced configurations (CORS support, high-resolution scaling, and custom cloning logic) to convert the browser's DOM state into a high-quality PNG.

---

## 💻 2. Tech Stack

Our stack was chosen for **speed, developer experience, and visual excellence**.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Component-based UI with lightning-fast HMR. |
| **Styling** | Tailwind CSS | Utility-first styling for complex, responsive layouts. |
| **Icons** | Lucide React | Premium, lightweight vector icons. |
| **Image Capture** | html2canvas | DOM-to-PNG conversion for sharing/downloads. |
| **Backend** | Node.js / Express | Robust API orchestration. |
| **Database** | MongoDB | Flexible schema for storing templates and shared links. |
| **Integrations** | Giphy API | Real-time "Live Sticker" search functionality. |

---

## ⚠️ 3. Challenges & Resolutions

### 🧩 The "Misplaced Initial" Glitch
- **Hurdle**: During image capture, initial-based avatars (the first letter of a name) would often drift out of position or appear cut off in the final PNG.
- **Fix**: We transitioned from standard HTML/CSS centering to a **Pure SVG Implementation**. By defining the letter's coordinates within an SVG's fixed coordinate system, we bypassed all browser-specific layout shifts during the snapshot phase.

### ⚡ Real-Time Sticker Search Performance
- **Hurdle**: Fetching high-resolution transparent stickers in real-time could feel sluggish.
- **Fix**: Implemented a backend proxy to handle Giphy API requests, reducing client-side complexity and allowing us to serve optimized preview thumbnails in a sleek, horizontal-scrolling tray.

### 📱 Responsive Design Studio Overlay
- **Hurdle**: Fitting a complex design editor with canvas and controls into a mobile screen while keeping it "premium."
- **Fix**: Developed a **Centered Immersive Modal** with Backdrop Blur (Glassmorphism). On mobile, we added a sticky hamburger toggle and switched the sticker tray to an inline horizontal scroll to save vertical space.

---

## 🔮 4. Future Improvements & Scalability

### 📈 Scalability Considerations:
- **Server-Side Rendering (SSR)**: Implementing Next.js for better SEO on shared greeting card links.
- **Canvas Optimization**: Transitioning from DOM-based overlays to a **Fabric.js (Canvas API)** approach for even more complex operations like rotations, filters, and 1000+ decorations.
- **Distributed Caching**: Using Redis to cache popular sticker search results and template metadata to reduce API latency.
- **Vector Export**: Adding support for PDF/SVG exports for users who want to print their cards at professional print shops.

---

> [!TIP]
> **CardCraft AI** is designed with a "Visual First" philosophy, ensuring that technical complexity never compromises the user's creative flow.

---
© 2026 CardCraft AI Engineering Team
