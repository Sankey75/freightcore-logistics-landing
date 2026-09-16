import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScroll } from '../hooks/useGsapScroll';
import './FleetSection.css';

gsap.registerPlugin(ScrollTrigger);

const FleetSection = () => {
  const sectionRef = useRef(null);
  
  useGsapScroll(() => {
    // Header reveal
    gsap.fromTo('.fleet-header-elem', 
      { y: 50, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0% 0 0 0)',
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      }
    );

    // Dashboard card stagger reveal
    gsap.fromTo('.dashboard-card',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.dashboard-grid',
          start: 'top 85%',
        }
      }
    );

    // Fleet Cards reveal
    gsap.fromTo('.fleet-card',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.fleet-cards-grid',
          start: 'top 80%',
        }
      }
    );

    // Number Counters
    const counters = gsap.utils.toArray('.counter-val');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const prefix = counter.getAttribute('data-prefix') || '';
      const decimals = target % 1 !== 0 ? 1 : 0;
      
      gsap.fromTo(counter, 
        { innerHTML: 0 },
        {
          innerHTML: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
          },
          onUpdate: function() {
            let val = Number(this.targets()[0].innerHTML).toFixed(decimals);
            if (val >= 1000) val = Number(val).toLocaleString();
            counter.innerHTML = prefix + val + suffix;
          }
        }
      );
    });

    // 3D Tilt interaction for Desktop only
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray('.fleet-card');
      
      cards.forEach(card => {
        const visual = card.querySelector('.fleet-card-visual');
        
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
          const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1
          
          gsap.to(card, {
            rotationY: xPercent * 10,
            rotationX: -yPercent * 10,
            transformPerspective: 1000,
            ease: "power2.out",
            duration: 0.5
          });
          
          gsap.to(visual, {
            x: -xPercent * 15,
            y: -yPercent * 15,
            ease: "power2.out",
            duration: 0.5
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            ease: "power3.out",
            duration: 1
          });
          
          gsap.to(visual, {
            x: 0,
            y: 0,
            ease: "power3.out",
            duration: 1
          });
        });
      });
    });

  });

  return (
    <section className="fleet-section" id="fleet" ref={sectionRef}>
      <div className="container">
        <div className="fleet-header">
          <div className="section-label fleet-header-elem">01 / Fleet Intelligence</div>
          <h2 className="section-title fleet-header-elem">Every vehicle.<br/>One intelligent view.</h2>
          <p className="section-subtitle fleet-header-elem">
            FreightCore connects vehicles, drivers, routes and operations into a single real-time intelligence layer.
          </p>
        </div>

        {/* STATS GRID */}
        <div className="dashboard-wrapper">
          <div className="dashboard-grid">
            <div className="dashboard-card glass-panel main-stat interactive-card">
              <div className="card-label">ACTIVE VEHICLES</div>
              <div className="card-value counter-val" data-target="2840" data-suffix="+">0</div>
              <div className="card-chart">
                <div className="chart-bar" style={{ height: '40%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '50%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar active" style={{ height: '100%' }}></div>
              </div>
            </div>

            <div className="dashboard-card glass-panel interactive-card">
              <div className="card-label">DELIVERIES IN TRANSIT</div>
              <div className="card-value counter-val" data-target="18420">0</div>
              <div className="card-trend positive">↑ 12% vs last week</div>
            </div>

            <div className="dashboard-card glass-panel interactive-card">
              <div className="card-label">ON-TIME RATE</div>
              <div className="card-value counter-val" data-target="98.7" data-suffix="%">0</div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '98.7%' }}></div>
              </div>
            </div>

            <div className="dashboard-card glass-panel interactive-card">
              <div className="card-label">FUEL EFFICIENCY</div>
              <div className="card-value success counter-val" data-target="24" data-prefix="+" data-suffix="%">0</div>
              <div className="card-trend neutral">Fleet optimization active</div>
            </div>
          </div>
          <div className="dashboard-glow"></div>
        </div>
        
        {/* FLEET CARDS GRID */}
        <div className="fleet-cards-grid mt-24">
          
          <div className="fleet-card glass-panel interactive-card">
            <div className="fleet-card-visual-wrapper">
              <div className="fleet-card-visual" style={{ background: 'linear-gradient(135deg, rgba(239, 177, 29, 0.2), rgba(0,0,0,0))' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                  <rect x="2" y="7" width="16" height="11" rx="2" />
                  <path d="M18 10h4v5h-4" />
                  <circle cx="6" cy="18" r="2" />
                  <circle cx="14" cy="18" r="2" />
                </svg>
              </div>
            </div>
            <div className="fleet-card-content">
              <h4>LONG HAUL</h4>
              <p>Cross-continental heavy freight optimized for fuel efficiency and speed.</p>
              <div className="fleet-card-metric">1,240 Active Units</div>
            </div>
          </div>
          
          <div className="fleet-card glass-panel interactive-card">
            <div className="fleet-card-visual-wrapper">
              <div className="fleet-card-visual" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0,0,0,0))' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a651" strokeWidth="1.5">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              </div>
            </div>
            <div className="fleet-card-content">
              <h4>URBAN DELIVERY</h4>
              <p>Agile last-mile electric vehicles navigating complex city environments.</p>
              <div className="fleet-card-metric">850 Active Units</div>
            </div>
          </div>
          
          <div className="fleet-card glass-panel interactive-card">
            <div className="fleet-card-visual-wrapper">
              <div className="fleet-card-visual" style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(0,0,0,0))' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#28559a" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
            <div className="fleet-card-content">
              <h4>TEMP CONTROLLED</h4>
              <p>Cold-chain logistics ensuring integrity of sensitive shipments.</p>
              <div className="fleet-card-metric">420 Active Units</div>
            </div>
          </div>

          <div className="fleet-card glass-panel interactive-card">
            <div className="fleet-card-visual-wrapper">
              <div className="fleet-card-visual" style={{ background: 'linear-gradient(135deg, rgba(228, 61, 18, 0.2), rgba(0,0,0,0))' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f4d03f" strokeWidth="1.5">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
            </div>
            <div className="fleet-card-content">
              <h4>HEAVY FREIGHT</h4>
              <p>Industrial scale transportation for oversized and specialized cargo.</p>
              <div className="fleet-card-metric">330 Active Units</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FleetSection;
