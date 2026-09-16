import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScroll } from '../hooks/useGsapScroll';
import './NetworkSection.css';

gsap.registerPlugin(ScrollTrigger);

const locations = [
  { name: 'Mumbai',    desc: 'South Asia Gateway',  top: '52%', left: '68%' },
  { name: 'Dubai',     desc: 'Middle East Hub',     top: '46%', left: '60%' },
  { name: 'Singapore', desc: 'Asia-Pacific Hub',    top: '65%', left: '79%' },
  { name: 'Rotterdam', desc: 'European Gateway',    top: '24%', left: '49%' },
  { name: 'London',    desc: 'UK Hub',              top: '22%', left: '45%' },
  { name: 'Los Angeles', desc: 'Americas Hub',      top: '38%', left: '12%' },
];

const stats = [
  { value: 42,   suffix: '',   label: 'Countries' },
  { value: 180,  suffix: '+',  label: 'Operational hubs' },
  { value: 2.8,  suffix: 'K+', label: 'Connected vehicles' },
  { value: 98.7, suffix: '%',  label: 'On-time performance' },
];

const NetworkSection = () => {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);
  const [activeHub, setActiveHub] = useState(null);

  useGsapScroll(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    /* Header reveal */
    tl.fromTo('.network-header > *',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power3.out' }
    );

    /* Map reveal */
    tl.fromTo('.map-container',
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );

    /* Sequenced Route Reveals */
    // 1. Show all hubs first as tiny dots
    tl.fromTo('.map-hub',
      { scale: 0, opacity: 0 },
      { scale: 0.5, opacity: 0.5, duration: 0.3, stagger: 0.05, ease: 'back.out(1.2)' }
    );

    // 2. Progressively draw routes and pop destination hubs
    const routes = document.querySelectorAll('.route-path');
    const hubs = document.querySelectorAll('.map-hub');
    
    routes.forEach((path, idx) => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      
      // Draw route
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power1.inOut'
      }, `-=${idx > 0 ? 0.5 : 0}`);

      // Pop destination hub
      if (hubs[idx + 1]) {
        tl.to(hubs[idx + 1], {
          scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)'
        }, '-=0.2');
      }
    });

    /* Coverage Panel */
    tl.fromTo('.coverage-panel',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.5'
    );

    /* Stat counters */
    countersRef.current.forEach((el) => {
      if (!el) return;
      const target = parseFloat(el.dataset.value);
      const isFloat = !Number.isInteger(target);

      gsap.fromTo(el,
        { innerHTML: 0 },
        {
          innerHTML: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerHTML: isFloat ? 0.1 : 1 },
          scrollTrigger: { trigger: '.network-stats', start: 'top 85%' },
          onUpdate() {
            el.innerHTML = Number(el.innerHTML).toFixed(isFloat ? 1 : 0);
          },
        }
      );
    });
  });

  return (
    <section className="network-section" id="network" ref={sectionRef}>
      <div className="container">
        <div className="network-header">
          <div className="section-label">03 / Global Network</div>
          <h2 className="section-title">From first mile<br />to final destination.</h2>
          <p className="section-subtitle">
            A connected infrastructure spanning 42 countries, 180+ hubs, and 2,800+ vehicles — all visible in real time.
          </p>
        </div>

        <div className="network-content">
          {/* ── Map visual ── */}
          <div className="network-visual glass-panel">
            <div className="map-container">

              {/* Abstract SVG routes between hubs */}
              <svg className="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Mumbai → Dubai */}
                <path d="M 68 52 Q 64 44 60 46" className="route-path" />
                {/* Dubai → Rotterdam */}
                <path d="M 60 46 Q 54 30 49 24" className="route-path" />
                {/* Rotterdam → London */}
                <path d="M 49 24 Q 47 23 45 22" className="route-path" />
                {/* Dubai → Singapore */}
                <path d="M 60 46 Q 70 55 79 65" className="route-path" />
                {/* London → Los Angeles */}
                <path d="M 45 22 Q 28 18 12 38" className="route-path" />
              </svg>

              {/* Hub markers */}
              {locations.map((loc, index) => (
                <button
                  key={index}
                  className={`map-hub hub-marker ${activeHub === index ? 'active' : ''}`}
                  style={{ top: loc.top, left: loc.left }}
                  onMouseEnter={() => setActiveHub(index)}
                  onMouseLeave={() => setActiveHub(null)}
                  onFocus={() => setActiveHub(index)}
                  onBlur={() => setActiveHub(null)}
                  aria-label={`${loc.name} — ${loc.desc}`}
                >
                  <div className="hub-dot" />
                  <div className="hub-ping" />
                  {activeHub === index && (
                    <div className="hub-info-panel glass-panel" role="tooltip">
                      <div className="hub-info-name">{loc.name}</div>
                      <div className="hub-info-desc">{loc.desc}</div>
                    </div>
                  )}
                </button>
              ))}

              {/* Coverage overlay panel */}
              <div className="coverage-panel glass-panel">
                <div className="coverage-title">GLOBAL COVERAGE</div>
                <div className="coverage-item">42 countries</div>
                <div className="coverage-item">180+ operational hubs</div>
                <div className="coverage-item">24/7 visibility</div>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="network-stats">
            {stats.map((stat, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-value-container">
                  <span
                    className="stat-value"
                    ref={el => countersRef.current[i] = el}
                    data-value={stat.value}
                  >0</span>
                  <span className="stat-suffix">{stat.suffix}</span>
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
