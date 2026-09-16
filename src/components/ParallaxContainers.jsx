import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box } from 'lucide-react';
import './ParallaxContainers.css';

gsap.registerPlugin(ScrollTrigger);

const ParallaxContainers = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && containerRef.current) {
      const items = gsap.utils.toArray('.plx-item');
      
      items.forEach((item) => {
        const speed = parseFloat(item.dataset.speed || '1');
        
        gsap.to(item, {
          y: (i, el) => (1 - parseFloat(el.getAttribute('data-speed'))) * (ScrollTrigger.maxScroll(window) - (ScrollTrigger.maxScroll(window) * 0.1)),
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === document.body) t.kill();
      });
    };
  }, []);

  return (
    <div className="parallax-containers" ref={containerRef} aria-hidden="true">
      {/* Various floating elements distributed around the page */}
      <div className="plx-item" data-speed="0.2" style={{ top: '15%', left: '5%' }}>
        <Box size={40} className="plx-icon" />
      </div>
      <div className="plx-item plx-blur" data-speed="0.8" style={{ top: '25%', right: '10%' }}>
        <Box size={60} className="plx-icon" />
      </div>
      <div className="plx-item" data-speed="0.4" style={{ top: '45%', left: '80%' }}>
        <Box size={30} className="plx-icon" />
      </div>
      <div className="plx-item plx-blur" data-speed="0.1" style={{ top: '65%', left: '10%' }}>
        <Box size={80} className="plx-icon" />
      </div>
      <div className="plx-item" data-speed="0.6" style={{ top: '85%', right: '15%' }}>
        <Box size={45} className="plx-icon" />
      </div>
    </div>
  );
};

export default ParallaxContainers;
