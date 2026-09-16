import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Package, Settings, Truck, Search, ShieldCheck, Home } from 'lucide-react';
import './LogisticsJourney.css';

gsap.registerPlugin(ScrollTrigger);

const journeySteps = [
  { id: '01', title: 'PICKUP', desc: 'Secure collection from origin facility', icon: Package },
  { id: '02', title: 'PROCESSING', desc: 'Sortation and compliance verification', icon: Settings },
  { id: '03', title: 'TRANSIT', desc: 'Main leg transportation via optimized routes', icon: Truck },
  { id: '04', title: 'TRACKING', desc: 'Real-time GPS visibility and monitoring', icon: Search },
  { id: '05', title: 'CUSTOMS', desc: 'Regulatory clearance and documentation', icon: ShieldCheck },
  { id: '06', title: 'DELIVERY', desc: 'Final mile distribution to destination', icon: Home }
];

const LogisticsJourney = () => {
  const containerRef = useRef(null);
  const routeLineRef = useRef(null);
  const truckMarkerRef = useRef(null);
  
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && containerRef.current) {
      // Pin the container for a horizontal-like scroll experience while scrolling down
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Animate the main route line
          if (routeLineRef.current) {
            gsap.set(routeLineRef.current, { scaleY: progress });
          }

          // Move the truck marker along the route line
          if (truckMarkerRef.current) {
            gsap.set(truckMarkerRef.current, { top: `${progress * 100}%` });
          }

          // Determine active step
          const stepIndex = Math.min(
            Math.floor((progress * 100) / (100 / journeySteps.length)),
            journeySteps.length - 1
          );
          setActiveStep(stepIndex);
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section className="logistics-journey" ref={containerRef} id="journey">
      <div className="lj-container">
        
        <div className="lj-header">
          <span className="eyebrow">The FreightCore Process</span>
          <h2 className="section-title">From Origin<br/>To Destination</h2>
        </div>

        <div className="lj-route-wrapper">
          {/* Background Line */}
          <div className="lj-route-bg-line"></div>
          
          {/* Active Fill Line */}
          <div className="lj-route-active-line" ref={routeLineRef}></div>
          
          {/* Traveling Marker */}
          <div className="lj-traveling-marker" ref={truckMarkerRef}>
            <div className="lj-marker-pulse"></div>
            <Truck size={16} color="white" />
          </div>

          {/* Steps */}
          <div className="lj-steps">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;
              
              let statusClass = '';
              if (isActive) statusClass = 'active';
              if (isPast) statusClass = 'past';

              return (
                <div key={step.id} className={`lj-step-item ${statusClass}`}>
                  <div className="lj-step-node">
                    <div className="lj-node-inner"></div>
                  </div>
                  
                  <div className="lj-step-content glass-panel">
                    <div className="lj-step-header">
                      <span className="lj-step-id">{step.id}</span>
                      <Icon size={20} className="lj-step-icon" />
                    </div>
                    <h3 className="lj-step-title">{step.title}</h3>
                    <p className="lj-step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default LogisticsJourney;
