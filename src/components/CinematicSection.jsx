import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CinematicSection.css';

gsap.registerPlugin(ScrollTrigger);

const CinematicSection = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Background slow zoom and parallax
      tl.fromTo(bgRef.current, 
        { scale: 1, y: -50 },
        { scale: 1.15, y: 50, ease: 'none' },
        0
      );

      // Overlay opacity change
      tl.fromTo(overlayRef.current,
        { opacity: 0.8 },
        { opacity: 0.4, ease: 'none' },
        0
      );

      // Text reveal and scale
      tl.fromTo(contentRef.current,
        { scale: 0.95, opacity: 0, y: 100 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.3 // Start revealing when section is partially in view
      );
    }
  }, []);

  return (
    <section className="cinematic-section" ref={sectionRef} id="vision">
      
      <div 
        className="cs-background" 
        ref={bgRef}
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80)' }}
      ></div>
      
      <div className="cs-overlay" ref={overlayRef}></div>

      <div className="cs-content" ref={contentRef}>
        <h2 className="cs-title">LOGISTICS<br/>WITHOUT LIMITS.</h2>
        <p className="cs-desc">Connecting businesses, markets, and people through smarter freight solutions.</p>
      </div>

    </section>
  );
};

export default CinematicSection;
