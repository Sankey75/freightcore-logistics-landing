import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TruckScene } from './TruckScene';
import './HeroExperience.css';

gsap.registerPlugin(ScrollTrigger);

const HeroExperience = () => {
  const containerRef = useRef(null);
  const webglRef = useRef(null);
  const truckSceneRef = useRef(null);
  
  const speedRef = useRef(null);
  const phaseRef = useRef(null);

  useEffect(() => {
    if (webglRef.current && !truckSceneRef.current) {
      truckSceneRef.current = new TruckScene(webglRef.current);
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      // Cinematic Entrance (Phase 1)
      const tl = gsap.timeline({ delay: 0.2 });
      
      // Setup initial state for blur-to-sharp
      gsap.set('.hero-word', { opacity: 0, y: 20, filter: 'blur(10px)' });
      gsap.set(['.hero-desc-main', '.hero-cta-main'], { y: 40, opacity: 0 });
      gsap.set('.hero-webgl-wrapper', { opacity: 0 });

      tl.to('.hero-word', { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 0.8, 
          stagger: 0.1, 
          ease: 'power3.out' 
        })
        .to('.hero-desc-main', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
        .to('.hero-cta-main', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
        .to('.hero-webgl-wrapper', { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, '-=1');
      gsap.set('.hero-webgl-wrapper', { opacity: 0 });

      // Scroll Sequence
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          
          if (truckSceneRef.current) {
            truckSceneRef.current.seek(p);
          }

          // HUD Speed logic
          let currentSpeed = 0;
          if (p > 0.05 && p < 0.95) currentSpeed = 72 + Math.random() * 5;
          else if (p <= 0.05) currentSpeed = (p / 0.05) * 72;
          else currentSpeed = ((1 - p) / 0.05) * 72;
          let newPhase = '01 PICKUP';
          if (p < 0.2) newPhase = '01 PICKUP';
          else if (p < 0.4) newPhase = '02 IN TRANSIT';
          else if (p < 0.6) newPhase = '03 DISTRIBUTION';
          else if (p < 0.8) newPhase = '04 GLOBAL NETWORK';
          else newPhase = '05 DELIVERY';

          if (speedRef.current) speedRef.current.innerHTML = Math.max(0, currentSpeed).toFixed(0) + ' <span class="ste-unit">km/h</span>';
          if (phaseRef.current) phaseRef.current.innerText = newPhase;

          // Fade out left hero content as we scroll
          gsap.to('.hero-left-content', {
            opacity: p > 0.1 ? 0 : 1 - (p * 10),
            y: p > 0.1 ? -50 : -p * 500,
            duration: 0.5,
            overwrite: 'auto'
          });

          // Show HUD only after we start moving
          gsap.to('.hero-hud-overlay', {
            opacity: p > 0.1 && p < 0.9 ? 1 : 0,
            duration: 0.5,
            overwrite: 'auto'
          });
        }
      });
    }

    return () => {
      if (truckSceneRef.current) {
        truckSceneRef.current.dispose();
        truckSceneRef.current = null;
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="hero-experience" ref={containerRef}>
      
      {/* 3D WebGL Background / Centerpiece */}
      <div className="hero-webgl-wrapper" ref={webglRef}></div>

      {/* Grid Overlay for depth */}
      <div className="hero-grid-overlay" aria-hidden="true"></div>

      {/* Main Hero Content (Fades out on scroll) */}
      <div className="container hero-content-container">
        <div className="hero-left-content">
          <h1 className="hero-title-main">
            <span className="hero-word" style={{display: 'inline-block', marginRight: '0.25em'}}>FREIGHTCORE</span>
            <span className="hero-word" style={{display: 'inline-block'}}>LOGISTICS</span><br/>
            <span className="text-gradient">
              <span className="hero-word" style={{display: 'inline-block', marginRight: '0.25em'}}>Moving</span>
              <span className="hero-word" style={{display: 'inline-block', marginRight: '0.25em'}}>the</span>
              <span className="hero-word" style={{display: 'inline-block', marginRight: '0.25em'}}>World.</span>
              <span className="hero-word" style={{display: 'inline-block', marginRight: '0.25em'}}>Delivering</span>
              <span className="hero-word" style={{display: 'inline-block'}}>Possibilities.</span>
            </span>
          </h1>
          <p className="hero-desc-main">
            Technology-driven freight solutions connecting businesses, markets, and destinations worldwide.
          </p>
          <div className="hero-cta-main">
            <button className="btn-primary">Get a Quote</button>
            <button className="btn-secondary">Explore Services</button>
          </div>
        </div>
      </div>

      {/* Scrolling HUD Overlay */}
      <div className="hero-hud-overlay">
        <div className="ste-hud-box glass-panel">
          <div className="ste-hud-label">PHASE</div>
          <div className="ste-hud-value accent" ref={phaseRef}>01 PICKUP</div>
        </div>
        <div className="ste-hud-box glass-panel">
          <div className="ste-hud-label">SPEED</div>
          <div className="ste-hud-value" ref={speedRef}>0 <span className="ste-unit">km/h</span></div>
        </div>
      </div>

      <div className="scroll-indicator-modern">
        <span>Scroll to explore</span>
        <div className="scroll-line-modern"></div>
      </div>
    </section>
  );
};

export default HeroExperience;
