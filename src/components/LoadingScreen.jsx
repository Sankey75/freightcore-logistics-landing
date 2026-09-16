import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef      = useRef(null);
  const barRef       = useRef(null);
  const eyebrowRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete,
          });
        },
      });

      // Entrance
      tl.from(eyebrowRef.current, { opacity: 0, y: 10, duration: 0.4 })
        .from(textRef.current,    { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')
        // Progress bar grows across
        .to(barRef.current, {
          scaleX: 1,
          duration: 1.6,
          ease: 'power2.inOut',
        }, '-=0.1')
        // Fade out content before exit
        .to([eyebrowRef.current, textRef.current, barRef.current], {
          opacity: 0,
          y: -16,
          stagger: 0.06,
          duration: 0.4,
          ease: 'power2.in',
        }, '-=0.2');
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="loading-screen" role="status" aria-live="polite" aria-label="Loading FreightCore">
      <div className="loading-content">
        <span ref={eyebrowRef} className="loading-eyebrow">Freight &bull; Fleet &bull; Intelligence</span>
        <h1 ref={textRef} className="loading-text">
          FreightCore<span>.</span>
        </h1>
        <div className="loading-bar-container">
          <div ref={barRef} className="loading-bar" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
