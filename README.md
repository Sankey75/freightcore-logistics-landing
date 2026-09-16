# FreightCore Logistics

## Overview
This is a premium scroll-driven logistics landing page created as a Full-Stack Developer Intern hiring assignment. It presents a fictional enterprise freight and fleet-management company called "FreightCore Logistics". The website demonstrates strong frontend engineering, focusing on responsive design, performance optimization, modular component architecture, and advanced animations using GSAP and Three.js.

## Tech Stack
- **React** & **Vite**: For fast development and optimized production builds.
- **GSAP & ScrollTrigger**: Used for scroll-driven animations, counters, and the complex pinned horizontal scroll sequence.
- **Three.js**: Implements an optimized WebGL interactive hero scene (globe, moving nodes, curved routes, particles).
- **CSS**: Modern plain CSS with CSS variables for the premium dark theme.

## Features
- **Responsive design**: Seamlessly adapts across Desktop, Tablet, and Mobile views.
- **GSAP ScrollTrigger animations**: Element reveals, counters, and parallax effects.
- **Pinned horizontal scroll experience**: The "Fleet Journey" section pins and scrubs horizontally on desktop, falling back to a clean vertical list on mobile.
- **Three.js WebGL scene**: Interactive 3D scene with resource disposal, scaling, and reduced-motion support.
- **Animated statistics**: Counters animate on entering the viewport.
- **Global network visualization**: Abstract map with animated hub pings and route paths.
- **Micro-interactions**: Button hovers, underline reveals, and card interaction effects.
- **Reduced-motion support**: Animations and WebGL interactions respect the `prefers-reduced-motion` media query.

## Run Locally
To run the project on your local machine:

```bash
npm install
npm run dev
```

## Build
To create a production build:

```bash
npm run build
```
The output will be in the `dist` folder.

## Deployment
This project can be easily deployed to platforms like Vercel or Netlify.
For Vercel:
1. Connect the GitHub repository to Vercel.
2. Vercel will automatically detect the Vite setup.
3. Deploy.

## AI Development Process
AI tools were utilized to accelerate boilerplate generation (Vite setup), scaffold standard component structures, and generate baseline CSS animations. However, the complex logic connecting GSAP ScrollTrigger to React component lifecycles, and the raw Three.js optimization (such as geometry disposal and performance tuning) were carefully structured and assembled to ensure maintainability, performance, and best practices.

## Technical Decisions
- **Raw Three.js over React Three Fiber**: Chose to implement the hero section using raw Three.js inside a `useEffect` to demonstrate a fundamental understanding of WebGL, manual resource disposal, and resize handling.
- **CSS Modules vs Tailwind**: Used global CSS with variables to maintain fine-grained control over complex premium styling and animations without bloating the HTML with utility classes.
- **Conditional ScrollTrigger**: Disabled the horizontal pinning on mobile devices to prevent UX issues commonly associated with nested scroll areas on touch devices.

## Challenges & Solutions
- **Challenge**: Memory leaks with Three.js.
  - **Solution**: Implemented rigorous cleanup in the `useEffect` return function, disposing of geometries, materials, the renderer, and canceling the animation frame.
- **Challenge**: ScrollTrigger calculating wrong heights due to the loading screen.
  - **Solution**: Triggers a `ScrollTrigger.refresh()` after the loading screen completes and the DOM is fully visible.

## Performance
- Lighthouse/Core Web Vitals results pending after production deployment. (Targeting 90+ across all metrics).
