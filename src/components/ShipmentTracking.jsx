import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, MapPin, CheckCircle2, Clock } from 'lucide-react';
import './ShipmentTracking.css';

gsap.registerPlugin(ScrollTrigger);

const trackingSteps = [
  { id: 1, label: 'PICKED UP', location: 'Shanghai, CN', time: '10:24 AM', status: 'completed' },
  { id: 2, label: 'IN TRANSIT', location: 'Ocean Freight', time: 'In Progress', status: 'completed' },
  { id: 3, label: 'AT LOGISTICS HUB', location: 'Rotterdam, NL', time: '08:15 AM', status: 'completed' },
  { id: 4, label: 'CUSTOMS', location: 'Rotterdam, NL', time: 'Processing', status: 'active' },
  { id: 5, label: 'OUT FOR DELIVERY', location: 'Local Carrier', time: 'Pending', status: 'pending' },
  { id: 6, label: 'DELIVERED', location: 'Frankfurt, DE', time: 'Est. Tomorrow', status: 'pending' }
];

const ShipmentTracking = () => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const resultsRef = useRef(null);
  
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && containerRef.current && cardRef.current) {
      // Parallax entry for the tracking section
      gsap.fromTo(cardRef.current, 
        { scale: 0.94, y: 50, opacity: 0 },
        { 
          scale: 1, y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'center center',
            scrub: true
          }
        }
      );
    }
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsTracking(true);

    // Animate results appearing
    setTimeout(() => {
      if (resultsRef.current) {
        // Animate the timeline elements sequentially
        gsap.fromTo('.st-results-header',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        // Animate the progress line
        gsap.fromTo('.st-progress-fill',
          { height: 0 },
          { height: '55%', duration: 1.5, ease: 'power3.inOut', delay: 0.2 }
        );

        // Stagger the steps
        gsap.fromTo('.st-step',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.3 }
        );
      }
    }, 100);
  };

  return (
    <section className="shipment-tracking" ref={containerRef} id="tracking">
      {/* Subtle parallax background elements */}
      <div className="st-bg-elements" aria-hidden="true">
        <div className="st-bg-circle st-bg-circle-1"></div>
        <div className="st-bg-circle st-bg-circle-2"></div>
      </div>

      <div className="container">
        <div className="st-card glass-panel" ref={cardRef}>
          
          <div className="st-header">
            <h2 className="section-title">Track Your Freight</h2>
            <p className="st-subtitle">Real-time visibility into your global supply chain.</p>
          </div>

          <form className="st-form" onSubmit={handleTrack}>
            <div className="st-input-group">
              <Search className="st-input-icon" size={20} />
              <input 
                type="text" 
                placeholder="Enter Tracking ID (e.g. FC-2026-847291)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="st-input"
              />
              <button type="submit" className="btn-primary st-btn">Track Shipment</button>
            </div>
          </form>

          {isTracking && (
            <div className="st-results" ref={resultsRef}>
              <div className="st-results-header">
                <div className="st-result-id">Shipment: {trackingId.toUpperCase()}</div>
                <div className="st-result-eta">ETA: Tomorrow, 04:30 PM</div>
              </div>

              <div className="st-timeline">
                <div className="st-progress-bg"></div>
                <div className="st-progress-fill"></div>
                
                {trackingSteps.map((step) => (
                  <div key={step.id} className={`st-step ${step.status}`}>
                    <div className="st-step-indicator">
                      {step.status === 'completed' ? (
                        <CheckCircle2 size={16} className="st-icon-completed" />
                      ) : step.status === 'active' ? (
                        <Clock size={16} className="st-icon-active" />
                      ) : (
                        <div className="st-icon-pending"></div>
                      )}
                    </div>
                    <div className="st-step-details">
                      <div className="st-step-label">{step.label}</div>
                      <div className="st-step-meta">
                        <span className="st-meta-loc"><MapPin size={12}/> {step.location}</span>
                        <span className="st-meta-time">{step.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default ShipmentTracking;
