import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScroll } from '../hooks/useGsapScroll';
import './TechnologySection.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: '01',
    title: 'REAL-TIME VISIBILITY',
    desc: 'Track every shipment, vehicle and milestone from one unified operational layer. Know where everything is, at any moment.',
    SvgVisual: () => (
      <svg className="tech-svg" viewBox="0 0 100 100" fill="none" stroke="var(--accent)">
        <circle cx="50" cy="50" r="5" fill="var(--accent)" />
        <circle cx="50" cy="50" r="15" className="tech-ping-circle" style={{animationDelay: '0s'}} />
        <circle cx="50" cy="50" r="28" className="tech-ping-circle" style={{animationDelay: '0.7s'}} />
        <circle cx="50" cy="50" r="42" className="tech-ping-circle" style={{animationDelay: '1.4s'}} />
      </svg>
    )
  },
  {
    id: '02',
    title: 'ROUTE OPTIMIZATION',
    desc: 'AI-driven routing continuously adapts using live traffic, weather and operational constraints to deliver maximum efficiency.',
    SvgVisual: () => (
      <svg className="tech-svg" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <path d="M 10 85 Q 30 20 90 15" stroke="rgba(40, 85, 154,0.1)" />
        <path d="M 10 85 Q 30 20 90 15" className="tech-route-primary" stroke="var(--accent)" />
        <circle cx="10" cy="85" r="4" fill="var(--accent)" />
        <circle cx="90" cy="15" r="4" fill="var(--accent)" className="tech-route-dot" />
      </svg>
    )
  },
  {
    id: '03',
    title: 'PREDICTIVE OPERATIONS',
    desc: 'Machine learning models surface delays, inefficiencies and risks before they impact your delivery promises.',
    SvgVisual: () => (
      <svg className="tech-svg" viewBox="0 0 100 100" fill="none" stroke="var(--accent)" strokeWidth="2">
        <rect x="18" y="60" width="12" height="28" className="tech-bar" fill="rgba(228, 61, 18, 0.3)" stroke="var(--accent)" />
        <rect x="44" y="38" width="12" height="50" className="tech-bar" fill="rgba(228, 61, 18, 0.3)" stroke="var(--accent)" />
        <rect x="70" y="18" width="12" height="70" className="tech-bar" fill="rgba(228, 61, 18, 0.3)" stroke="var(--accent)" />
        <polyline points="8,80 24,60 50,38 76,18 92,8" stroke="rgba(40, 85, 154,0.8)" strokeWidth="2" className="tech-trend" fill="none" />
      </svg>
    )
  },
  {
    id: '04',
    title: 'CARBON INTELLIGENCE',
    desc: "Measure, report and reduce your fleet's environmental footprint with granular emissions tracking across every route and vehicle.",
    SvgVisual: () => (
      <svg className="tech-svg" viewBox="0 0 100 100" fill="none" strokeWidth="2.5">
        <circle cx="50" cy="50" r="35" stroke="rgba(40, 85, 154,0.1)" />
        <circle cx="50" cy="50" r="35" stroke="var(--accent)" strokeDasharray="220" strokeDashoffset="55" strokeLinecap="round" className="tech-carbon-ring" />
        <text x="50" y="46" textAnchor="middle" fill="var(--text)" fontSize="11" fontFamily="var(--font-display)" fontWeight="600">75%</text>
        <text x="50" y="60" textAnchor="middle" fill="var(--muted)" fontSize="7">REDUCED</text>
      </svg>
    )
  }
];

const TechnologySection = () => {
  const sectionRef = useRef(null);

  useGsapScroll(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Text Parallax
    gsap.to('.tech-header .section-title', {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.tech-header .section-subtitle', {
      y: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Dashboard Assembly (Cards Entrance)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.tech-grid',
        start: 'top 80%',
      }
    });

    tl.fromTo('.tech-module',
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'back.out(1.2)' }
    )
    .fromTo('.tech-svg',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
      '-=0.4'
    );

    // Header reveal (initial load)
    gsap.fromTo('.tech-header > *',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%'
        }
      }
    );
  });

  return (
    <section className="technology-section" id="technology" ref={sectionRef}>
      <div className="container">
        <div className="tech-header">
          <div className="section-label">03 / Technology</div>
          <h2 className="section-title">Intelligence behind<br/>every movement.</h2>
          <p className="section-subtitle">
            FreightCore's platform layer makes logistics data actionable — turning raw signals into operational advantage.
          </p>
        </div>

        <div className="tech-grid">
          {features.map((feature, index) => (
            <div className="tech-module glass-panel" key={index}>
              <div className="tech-accent-line"></div>

              <div className="tech-visual-container">
                <feature.SvgVisual />
              </div>

              <div className="tech-content">
                <div className="tech-number">{feature.id}</div>
                <h3 className="tech-module-title">{feature.title}</h3>
                <p className="tech-module-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
