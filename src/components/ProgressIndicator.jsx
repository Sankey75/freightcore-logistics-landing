import React, { useEffect, useState } from 'react';
import './ProgressIndicator.css';

const sections = [
  { id: 'hero',       label: 'Home',       num: '01' },
  { id: 'fleet',      label: 'Fleet',      num: '02' },
  { id: 'network',    label: 'Network',    num: '03' },
  { id: 'technology', label: 'Technology', num: '04' },
  { id: 'footer',     label: 'Contact',    num: '05' },
];

const ProgressIndicator = () => {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    // IntersectionObserver correctly handles pinned sections
    const observers = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="scroll-progress-container" aria-label="Section navigation">
      {sections.map(({ id, label, num }) => (
        <button
          key={id}
          className={`progress-item ${active === id ? 'active' : ''}`}
          onClick={() => scrollTo(id)}
          aria-label={`Navigate to ${label}`}
          aria-current={active === id ? 'true' : undefined}
        >
          <span className="progress-num">{num}</span>
          <div className="progress-line" />
          <span className="progress-label">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default ProgressIndicator;
