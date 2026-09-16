import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setIsVisible(true);

    const ctx = gsap.context(() => {
      /* Fast dot follows cursor immediately */
      const dotXTo = gsap.quickTo(cursorDotRef.current, 'x', { duration: 0.1, ease: 'none' });
      const dotYTo = gsap.quickTo(cursorDotRef.current, 'y', { duration: 0.1, ease: 'none' });
      /* Lagging ring for trailing effect */
      const ringXTo = gsap.quickTo(cursorRingRef.current, 'x', { duration: 0.45, ease: 'power3' });
      const ringYTo = gsap.quickTo(cursorRingRef.current, 'y', { duration: 0.45, ease: 'power3' });

      const onMouseMove = (e) => {
        dotXTo(e.clientX);
        dotYTo(e.clientY);
        ringXTo(e.clientX);
        ringYTo(e.clientY);
      };

      /* Expand ring over interactive elements */
      const onEnter = () => {
        gsap.to(cursorRingRef.current, { scale: 2.2, opacity: 0.4, duration: 0.3 });
        gsap.to(cursorDotRef.current, { scale: 0, duration: 0.2 });
      };

      const onLeave = () => {
        gsap.to(cursorRingRef.current, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(cursorDotRef.current, { scale: 1, duration: 0.2 });
      };

      window.addEventListener('mousemove', onMouseMove);

      const interactiveEls = document.querySelectorAll('a, button, .interactive-card, .hub-marker');
      interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      /* ────────────────────────────────────────────────────────
         MAGNETIC BUTTONS — desktop only, subtle 8px max pull
         ──────────────────────────────────────────────────────── */
      const magneticEls = document.querySelectorAll('.btn-primary, .btn-secondary');

      magneticEls.forEach(btn => {
        const onMagneticMove = (e) => {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = (e.clientX - centerX) * 0.18; // max ~8px pull
          const dy = (e.clientY - centerY) * 0.18;
          gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
        };

        const onMagneticLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        };

        btn.addEventListener('mousemove', onMagneticMove);
        btn.addEventListener('mouseleave', onMagneticLeave);
      });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        interactiveEls.forEach(el => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
        magneticEls.forEach(btn => {
          btn.removeEventListener('mousemove', () => {});
          btn.removeEventListener('mouseleave', () => {});
        });
      };
    });

    return () => ctx.revert();
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
