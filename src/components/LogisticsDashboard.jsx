import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, TrendingUp, Activity, Box } from 'lucide-react';
import './LogisticsDashboard.css';

gsap.registerPlugin(ScrollTrigger);

const dashboardData = [
  { id: 'vol', title: 'Monthly Volume', target: 12500, prefix: '', suffix: ' TEU', icon: Box, bars: [30, 45, 60, 40, 85, 100, 75] },
  { id: 'perf', title: 'Delivery Performance', target: 98.7, prefix: '', suffix: '%', icon: TrendingUp, bars: [92, 94, 93, 96, 97, 98, 98.7] },
  { id: 'active', title: 'Active Shipments', target: 4280, prefix: '', suffix: '', icon: Activity, bars: [40, 42, 38, 50, 45, 60, 55] },
  { id: 'rev', title: 'Route Efficiency', target: 94.2, prefix: '', suffix: '%', icon: BarChart3, bars: [85, 88, 86, 90, 92, 93, 94.2] }
];

const LogisticsDashboard = () => {
  const containerRef = useRef(null);
  const countersRef = useRef([]);
  const chartsRef = useRef([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && containerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse'
        }
      });

      // Header reveal
      tl.fromTo('.ld-header > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
      );

      // Cards stagger pop-in
      tl.fromTo('.ld-card',
        { scale: 0.9, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(1.2)' },
        '-=0.4'
      );

      // Counter animations
      countersRef.current.forEach((el, index) => {
        if (!el) return;
        const target = dashboardData[index].target;
        const isFloat = !Number.isInteger(target);

        tl.fromTo(el,
          { innerHTML: 0 },
          {
            innerHTML: target,
            duration: 1.5,
            ease: 'power2.out',
            snap: { innerHTML: isFloat ? 0.1 : 1 },
            onUpdate: function() {
              el.innerHTML = Number(el.innerHTML).toFixed(isFloat ? 1 : 0);
            }
          },
          '-=0.4'
        );
      });

      // Chart bars animation
      chartsRef.current.forEach((chartEl, index) => {
        if (!chartEl) return;
        const bars = chartEl.querySelectorAll('.ld-bar-fill');
        
        tl.fromTo(bars,
          { height: 0 },
          { height: (i) => `${dashboardData[index].bars[i]}%`, duration: 1, stagger: 0.05, ease: 'power3.out' },
          '-=1.5'
        );
      });
    }
  }, []);

  return (
    <section className="logistics-dashboard" id="analytics" ref={containerRef}>
      <div className="container">
        
        <div className="ld-header">
          <span className="eyebrow">Analytics</span>
          <h2 className="section-title">Operations Command Center</h2>
          <p className="section-subtitle">Real-time performance metrics and predictive supply chain analytics.</p>
        </div>

        <div className="ld-grid">
          {dashboardData.map((data, idx) => {
            const Icon = data.icon;
            return (
              <div key={data.id} className="ld-card glass-panel">
                <div className="ld-card-header">
                  <div className="ld-card-icon-wrapper">
                    <Icon size={20} className="ld-card-icon" />
                  </div>
                  <h3 className="ld-card-title">{data.title}</h3>
                </div>
                
                <div className="ld-card-value-wrapper">
                  <span className="ld-card-prefix">{data.prefix}</span>
                  <span className="ld-card-value" ref={el => countersRef.current[idx] = el}>0</span>
                  <span className="ld-card-suffix">{data.suffix}</span>
                </div>

                <div className="ld-chart" ref={el => chartsRef.current[idx] = el}>
                  {data.bars.map((_, barIdx) => (
                    <div key={barIdx} className="ld-bar">
                      <div className="ld-bar-fill"></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};

export default LogisticsDashboard;
