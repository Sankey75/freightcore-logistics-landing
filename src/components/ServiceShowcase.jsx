import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Ship, Plane, Truck, Warehouse, FileCheck, Network } from 'lucide-react';
import './ServiceShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: '01',
    title: 'OCEAN FREIGHT',
    desc: 'Cost-effective global shipping with guaranteed capacity and reliable transit times across major trade lanes.',
    icon: Ship,
    stats: { label: 'Global Ports', value: '140+' },
    img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80'
  },
  {
    id: '02',
    title: 'AIR FREIGHT',
    desc: 'Expedited air cargo solutions for time-critical shipments requiring premium speed and security.',
    icon: Plane,
    stats: { label: 'Airports Served', value: '250+' },
    img: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&q=80'
  },
  {
    id: '03',
    title: 'ROAD FREIGHT',
    desc: 'Flexible FTL and LTL trucking network providing seamless door-to-door domestic and cross-border connectivity.',
    icon: Truck,
    stats: { label: 'Active Fleet', value: '2,800+' },
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80'
  },
  {
    id: '04',
    title: 'WAREHOUSING',
    desc: 'Strategically located smart distribution centers featuring automated inventory management and order fulfillment.',
    icon: Warehouse,
    stats: { label: 'Fulfillment Centers', value: '42' },
    img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590e?auto=format&fit=crop&q=80'
  },
  {
    id: '05',
    title: 'CUSTOMS CLEARANCE',
    desc: 'Expert brokerage services navigating complex international trade regulations to prevent delays.',
    icon: FileCheck,
    stats: { label: 'Clearance Rate', value: '99.8%' },
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80'
  },
  {
    id: '06',
    title: 'SUPPLY CHAIN',
    desc: 'End-to-end logistics engineering to optimize your entire operation from sourcing to final delivery.',
    icon: Network,
    stats: { label: 'Visibility', value: 'Real-time' },
    img: 'https://images.unsplash.com/photo-1587293852726-591133ab4eb9?auto=format&fit=crop&q=80'
  }
];

const ServiceShowcase = () => {
  const containerRef = useRef(null);
  const visualsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      const sectionCount = services.length;
      
      // Pin the section and scrub through the services
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${sectionCount * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          // Calculate which tab should be active based on scroll progress
          const progress = self.progress;
          const newIndex = Math.min(Math.floor(progress * sectionCount), sectionCount - 1);
          
          if (newIndex !== activeTab) {
            setActiveTab(newIndex);
            
            // Image clip-path transition
            const visuals = gsap.utils.toArray('.ss-visual-item');
            visuals.forEach((v, idx) => {
              if (idx === newIndex) {
                gsap.to(v, { 
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', 
                  scale: 1,
                  duration: 0.8, 
                  ease: 'power3.out',
                  zIndex: 2
                });
              } else {
                gsap.to(v, { 
                  clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                  scale: 1.1,
                  duration: 0.8, 
                  ease: 'power3.inOut',
                  zIndex: 1
                });
              }
            });

            // Text transition
            const textGroups = gsap.utils.toArray('.ss-text-group');
            textGroups.forEach((t, idx) => {
              if (idx === newIndex) {
                gsap.to(t, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 });
              } else {
                gsap.to(t, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' });
              }
            });
          }
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeTab]);

  return (
    <section className="service-showcase" ref={containerRef} id="services">
      <div className="ss-container">
        
        {/* Left Side: Navigation & Text */}
        <div className="ss-content">
          <div className="ss-header">
            <span className="eyebrow">Capabilities</span>
            <h2 className="section-title">Logistics Engineered for Excellence</h2>
          </div>

          <div className="ss-tabs-nav">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div 
                  key={svc.id} 
                  className={`ss-tab ${activeTab === idx ? 'active' : ''}`}
                >
                  <div className="ss-tab-number">{svc.id}</div>
                  <Icon size={18} className="ss-tab-icon" />
                  <div className="ss-tab-title">{svc.title}</div>
                </div>
              );
            })}
          </div>

          <div className="ss-text-container">
            {services.map((svc, idx) => (
              <div 
                key={svc.id} 
                className="ss-text-group"
                style={{ 
                  opacity: idx === 0 ? 1 : 0, 
                  transform: idx === 0 ? 'translateY(0)' : 'translateY(-20px)',
                  pointerEvents: idx === activeTab ? 'auto' : 'none'
                }}
              >
                <h3 className="ss-active-title">{svc.title}</h3>
                <p className="ss-active-desc">{svc.desc}</p>
                <div className="ss-active-stat glass-panel">
                  <div className="ss-stat-value">{svc.stats.value}</div>
                  <div className="ss-stat-label">{svc.stats.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="ss-visuals" ref={visualsRef}>
          {services.map((svc, idx) => (
            <div 
              key={svc.id} 
              className="ss-visual-item"
              style={{
                clipPath: idx === 0 ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                zIndex: idx === 0 ? 2 : 1,
                backgroundImage: `url(${svc.img})`
              }}
            >
              <div className="ss-visual-overlay"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ServiceShowcase;
