import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container navbar-container">
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          FreightCore<span className="logo-accent">.</span>
        </div>

        {/* Desktop Nav */}
        <div className="nav-links desktop-only">
          <button onClick={() => scrollToSection('fleet')} className="nav-link link-underline">Solutions</button>
          <button onClick={() => scrollToSection('network')} className="nav-link link-underline">Network</button>
          <button onClick={() => scrollToSection('technology')} className="nav-link link-underline">Technology</button>
          <button onClick={() => scrollToSection('footer')} className="nav-link link-underline">Contact</button>
        </div>

        <div className="nav-cta desktop-only">
          <button className="btn-primary" onClick={() => scrollToSection('footer')}>Get in touch</button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-nav-links">
          <button onClick={() => scrollToSection('fleet')} className="mobile-nav-link">Solutions</button>
          <button onClick={() => scrollToSection('network')} className="mobile-nav-link">Network</button>
          <button onClick={() => scrollToSection('technology')} className="mobile-nav-link">Technology</button>
          <button onClick={() => scrollToSection('footer')} className="mobile-nav-link">Contact</button>
          <button onClick={() => scrollToSection('footer')} className="btn-primary mobile-cta">Get in touch</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
