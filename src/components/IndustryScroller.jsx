import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Car, ShoppingBag, Factory, Stethoscope, Cpu, Coffee, Zap, Laptop } from 'lucide-react';
import './IndustryScroller.css';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { name: 'Automotive', desc: 'JIT delivery and parts logistics', icon: Car, img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80' },
  { name: 'Retail', desc: 'Omnichannel fulfillment', icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80' },
  { name: 'Manufacturing', desc: 'Heavy machinery transport', icon: Factory, img: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&q=80' },
  { name: 'Pharma', desc: 'Cold chain & secure transport', icon: Stethoscope, img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80' },
  { name: 'Electronics', desc: 'High-value secure shipping', icon: Cpu, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80' },
  { name: 'Food & Bev', desc: 'Temperature-controlled freight', icon: Coffee, img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80' },
  { name: 'Energy', desc: 'Oversized project cargo', icon: Zap, img: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80' },
  { name: 'Technology', desc: 'Rapid deployment solutions', icon: Laptop, img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' },
];

const IndustryScroller = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && sectionRef.current && containerRef.current) {
      const cards = gsap.utils.toArray('.is-card');
      const totalWidth = cards.length * 400 + (cards.length - 1) * 32; // card width + gap
      const viewportWidth = window.innerWidth;
      
      const xOffset = -(totalWidth - viewportWidth + window.innerWidth * 0.2); 

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        animation: gsap.to(containerRef.current, {
          x: xOffset,
          ease: 'none',
        })
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section className="industry-scroller" ref={sectionRef} id="industries">
      
      <div className="is-header">
        <span className="eyebrow">Industries</span>
        <h2 className="section-title">Specialized Solutions.</h2>
      </div>

      <div className="is-viewport">
        <div className="is-container" ref={containerRef}>
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div key={idx} className="is-card glass-panel group">
                <div className="is-card-img-wrapper">
                  <img src={ind.img} alt={ind.name} className="is-card-img" loading="lazy" />
                  <div className="is-card-overlay"></div>
                </div>
                
                <div className="is-card-content">
                  <div className="is-card-icon-wrapper">
                    <Icon size={24} className="is-card-icon" />
                  </div>
                  <h3 className="is-card-title">{ind.name}</h3>
                  <p className="is-card-desc">{ind.desc}</p>
                  
                  <div className="is-card-footer">
                    <span className="is-explore-text">Explore Solutions</span>
                    <ArrowRight size={18} className="is-arrow" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
};

export default IndustryScroller;
