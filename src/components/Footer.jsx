import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
        }
      });
      
      tl.fromTo('.footer-logo, .footer-tagline, .footer-social-link',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo('.footer-column',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.footer-bottom',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.2'
      );
      
      // Animate background lines if they exist
      if (document.querySelector('.footer-bg-line')) {
        tl.fromTo('.footer-bg-line', 
          { scaleX: 0 }, 
          { scaleX: 1, transformOrigin: 'left', duration: 1.5, ease: 'power3.inOut' },
          0
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" id="footer" ref={footerRef}>
      <div className="container">
        <div className="footer-content">
          <div className="footer-top">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                FreightCore<span className="logo-accent">.</span>
              </div>
              <p className="footer-tagline">Moving the World. Delivering Possibilities.</p>
              <div className="footer-social">
                <a href="#" className="footer-social-link" aria-label="LinkedIn">LI</a>
                <a href="#" className="footer-social-link" aria-label="Twitter/X">X</a>
                <a href="#" className="footer-social-link" aria-label="GitHub">GH</a>
              </div>
            </div>

            {/* Links grid */}
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Product</h4>
                <a href="#fleet"      className="footer-link link-underline">Fleet Management</a>
                <a href="#network"    className="footer-link link-underline">Global Network</a>
                <a href="#technology" className="footer-link link-underline">Technology</a>
                <a href="#journey"    className="footer-link link-underline">How It Works</a>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <a href="#" className="footer-link link-underline">About</a>
                <a href="#" className="footer-link link-underline">Careers</a>
                <a href="#" className="footer-link link-underline">Press</a>
                <a href="#" className="footer-link link-underline">Partners</a>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Contact</h4>
                <a href="mailto:hello@freightcore.example" className="footer-link link-underline">hello@freightcore.io</a>
                <a href="#" className="footer-link link-underline">Global Offices</a>
                <a href="#" className="footer-link link-underline">Support 24/7</a>
                <a href="#" className="footer-link link-underline">Privacy Policy</a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="copyright">&copy; 2026 FreightCore Logistics. All rights reserved.</p>
            <p className="footer-slogan">"Built for a connected world."</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
