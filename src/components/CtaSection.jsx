import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScroll } from '../hooks/useGsapScroll';
import './CtaSection.css';

gsap.registerPlugin(ScrollTrigger);

const CtaSection = () => {
  const sectionRef = useRef(null);

  useGsapScroll(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return;

    gsap.fromTo('.cta-label',
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    );

    gsap.fromTo('.cta-headline',
      { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
        duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      }
    );

    gsap.fromTo('.cta-body',
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
      }
    );

    gsap.fromTo('.cta-actions',
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    );

    // Cinematic zoom on the container
    gsap.fromTo('.cta-inner',
      { scale: 0.9, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      }
    );

    /* Subtle background grid parallax */
    gsap.to('.cta-grid-overlay', {
      backgroundPositionY: '60px',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  return (
    <section className="cta-section" ref={sectionRef} id="cta" aria-labelledby="cta-headline">
      <div className="cta-grid-overlay" aria-hidden="true" />

      <div className="container">
        <div className="cta-inner">
          <div className="cta-label section-label">Ready?</div>

          <h2 className="cta-headline" id="cta-headline">
            Ready to move<br />smarter?
          </h2>

          <p className="cta-body">
            Build a faster, more visible, more connected logistics operation.<br />
            FreightCore is the platform that makes it possible.
          </p>

          <div className="cta-actions">
            <button
              className="btn-primary cta-btn-primary"
              onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in touch
            </button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore solutions
            </button>
          </div>

          {/* Decorative accent line */}
          <div className="cta-accent-line" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
