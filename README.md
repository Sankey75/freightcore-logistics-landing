<div align="center">
  <h1>🚛 FreightCore Logistics</h1>
  <p><strong>Premium Scroll-Driven Logistics Experience</strong></p>
  <p><em>Built for the Truckinzy Infotech Pvt Ltd — Full-Stack Developer Intern Assignment</em></p>
  <p>🌍 <strong><a href="https://freightcore-logistics-gold.vercel.app/" target="_blank">Live Demo on Vercel</a></strong></p>
</div>

---

## 📖 Overview

**FreightCore Logistics** is a highly interactive, premium frontend application designed to showcase a modern enterprise logistics brand. It is a true single-page application (SPA) that leverages cutting-edge web animation technologies to create an immersive, story-driven scroll experience.

The core philosophy behind this build was **"Logistics as a Cinematic Journey"**. Instead of a static brochure, the website reacts to the user's scroll, featuring a 3D WebGL freight truck that physically moves through the environment, paired with complex GSAP scroll triggers that assemble dashboards, draw global route lines, and transition between logistics phases.

---

## ✨ Key Features & Assignment Requirements

### 1. 🎬 GSAP ScrollTrigger Integration
- **Complex Timelines**: Utilizes `gsap.timeline` with `scrub: true` to tie complex animations directly to the user's scroll position.
- **Pinned Sections**: Features a horizontal-scrolling industry section and a pinned service showcase that reveals tabs seamlessly without losing the user's place on the page.
- **Cinematic Reveals**: Custom text-blur staggers, clip-path image reveals, and parallax layering.
- **Optimized Cleanup**: Employs `gsap.context()` inside React `useEffect` hooks to ensure animations are properly killed on unmount, preventing memory leaks.

### 2. 🧊 Three.js / WebGL Environment
- **Programmatic 3D Scene**: Instead of loading heavy external assets, the hero features a programmatic 3D freight truck built entirely with Vanilla Three.js geometries and materials.
- **Scroll Synchronization**: The 3D camera and truck position are piped directly into a GSAP ScrollTrigger, creating a seamless connection between the DOM and the WebGL canvas.
- **Performance First**: Implements a strict `requestAnimationFrame` loop with proper resource disposal (`geometry.dispose()`, `material.dispose()`) to guarantee a smooth 60fps experience.

### 3. 📱 Responsive Architecture
- **Fluid Layouts**: The application is fully responsive from `320px` mobile screens up to `1920px` ultrawide displays.
- **Adaptive UX**: Complex interactions (like horizontal pinning) gracefully degrade to vertical stacks on touch devices to preserve scrolling UX.

### 4. ♿ Accessibility & Performance
- **Reduced Motion Support**: The application explicitly respects `@media (prefers-reduced-motion: reduce)`, disabling the heavy WebGL and GSAP animations for users who require it.
- **Custom Loading State**: A tailored `<LoadingScreen />` ensures that fonts and WebGL contexts are fully initialized before releasing the scroll to the user, preventing layout thrashing.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 |
| **Animation Engine** | GSAP + ScrollTrigger |
| **3D Rendering** | Vanilla Three.js |
| **Styling** | Modern CSS Variables + Modular CSS |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sankey75/freightcore-logistics-landing.git
   cd freightcore-logistics-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`*

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🧠 AI Development Process & Write-up

As part of the assignment requirements, AI tools were strategically utilized to accelerate the development of this prototype, focusing primarily on boilerplate generation and repetitive CSS styling. 

However, the core architectural decisions were strictly human-led:

1. **Vanilla Three.js over React Three Fiber (R3F)**:
   While R3F is popular, I chose to implement the 3D scene using Raw Three.js inside a `useRef` to demonstrate a fundamental understanding of WebGL lifecycle management, manual garbage collection, and raw canvas manipulation.
   
2. **GSAP Context Management**:
   A major challenge when pairing React with GSAP is stale closures and memory leaks caused by React's double-mounting in Strict Mode. This was solved by wrapping all ScrollTriggers inside `gsap.context()` and rigorously calling `ctx.revert()` in the cleanup phase.

3. **Performance Optimization (Layout Thrashing)**:
   To prevent ScrollTrigger from calculating incorrect start/end points due to the `LoadingScreen` unmounting, a `setTimeout` with `ScrollTrigger.refresh()` was implemented to allow the DOM to settle before pinning calculations occur.

---

## 📂 Project Structure

```text
src/
├── assets/            # Static images and icons
├── components/        # Modular React components
│   ├── HeroExperience # 3D Hero + GSAP Stagger
│   ├── TruckScene.js  # Vanilla Three.js Logic
│   ├── LogisticsJourney # Scroll-driven SVG path
│   └── ...            # Other sections
├── hooks/             # Custom React hooks (e.g. useGsapScroll)
├── styles/            # Global CSS variables and utility classes
├── App.jsx            # Main assembly and route layout
└── main.jsx           # React DOM entry point
```

---

<div align="center">
  <p>Developed for the Truckinzy Infotech Assignment.</p>
</div>
