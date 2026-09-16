import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeScene from './ThreeScene';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        // Cinematic entrance timeline
        const tl = gsap.timeline({ delay: 0.2 });

        tl.to('.eyebrow',      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
          .to('.hero-title',   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.4')
          .to('.hero-subtitle',{ opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
          .to('.hero-cta',     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .to('.hero-metrics', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .to('.scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.2');

        // Set initial states for animation
        gsap.set(['.eyebrow', '.hero-title', '.hero-subtitle', '.hero-cta', '.hero-metrics'], {
          y: 30,
          opacity: 0,
          immediateRender: false
        });
      } else {
        // Reduced motion: just show everything
        gsap.set(['.eyebrow', '.hero-title', '.hero-subtitle', '.hero-cta', '.hero-metrics', '.scroll-indicator'], {
          opacity: 1, y: 0
        });
      }

      // Desktop only: scroll-driven parallax exit
      const mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        gsap.to('.hero-container', {
          y: -120,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to('.hero-webgl', {
          scale: 0.92,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Background grid overlay */}
      <div className="hero-grid-overlay" aria-hidden="true" />

      {/* Three.js globe */}
      <div className="hero-webgl" aria-hidden="true">
        <ThreeScene />
      </div>

      {/* Hero text content */}
      <div className="container hero-container">
        <div className="hero-content">
          <div className="eyebrow">
            Freight &bull; Fleet &bull; Intelligence
          </div>

          <h1 className="hero-title">
            Moving the world.<br />Smarter.
          </h1>

          <p className="hero-subtitle">
            Intelligent freight infrastructure built for a faster, more connected world.
          </p>

          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => document.getElementById('network')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore our network
            </button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See the fleet
            </button>
          </div>

          {/* Live metrics ticker */}
          <div className="hero-metrics" aria-label="Live fleet statistics">
            <div className="hero-metric-item">
              <div className="hero-metric-value">2,840<span>+</span></div>
              <div className="hero-metric-label">Active Vehicles</div>
            </div>
            <div className="hero-metric-item">
              <div className="hero-metric-value">42</div>
              <div className="hero-metric-label">Global Hubs</div>
            </div>
            <div className="hero-metric-item">
              <div className="hero-metric-value">98.7<span>%</span></div>
              <div className="hero-metric-label">On-Time Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line-container">
          <div className="scroll-line" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
