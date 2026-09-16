import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapScroll } from '../hooks/useGsapScroll';
import './ScrollExperience.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollExperience = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const planRef = useRef(null);
  const moveRef = useRef(null);
  const trackStageRef = useRef(null);
  const deliverRef = useRef(null);

  useGsapScroll(() => {
    const mm = gsap.matchMedia();

    /* ─────────────────────────────────────────────────────────
       DESKTOP: Pinned Horizontal Scroll
       ───────────────────────────────────────────────────────── */
    mm.add('(min-width: 769px)', () => {
      const getScrollAmount = () =>
        -(trackRef.current.scrollWidth - window.innerWidth);

      const tween = gsap.to(trackRef.current, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1.2,
          end: () => `+=${Math.abs(getScrollAmount())}`,
          invalidateOnRefresh: true,
        },
      });

      /* ── PLAN: stagger reveal ── */
      gsap.from('.plan-item', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: planRef.current,
          containerAnimation: tween,
          start: 'left 65%',
        },
      });

      /* ── MOVE: SVG route draw ── */
      gsap.fromTo('.move-route-path',
        { strokeDashoffset: 1200 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: moveRef.current,
            containerAnimation: tween,
            start: 'left 70%',
            end: 'right 30%',
            scrub: true,
          },
        }
      );

      /* ── MOVE: dot travels the path ── */
      gsap.fromTo('.move-dot',
        { offsetDistance: '0%' },
        {
          offsetDistance: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: moveRef.current,
            containerAnimation: tween,
            start: 'left 70%',
            end: 'right 30%',
            scrub: true,
          },
        }
      );

      /* ── TRACK: fade in data rows ── */
      gsap.from('.track-data-row', {
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
          trigger: trackStageRef.current,
          containerAnimation: tween,
          start: 'left 70%',
        },
      });

      /* ── TRACK: progress bar fill ── */
      gsap.fromTo('.track-progress-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left',
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: trackStageRef.current,
            containerAnimation: tween,
            start: 'left 60%',
          },
        }
      );

      /* ── DELIVER: checkmark ── */
      gsap.from('.deliver-check', {
        scale: 0,
        opacity: 0,
        rotation: -90,
        ease: 'back.out(1.5)',
        duration: 0.8,
        scrollTrigger: {
          trigger: deliverRef.current,
          containerAnimation: tween,
          start: 'left 65%',
        },
      });

      gsap.from('.deliver-text > *', {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: deliverRef.current,
          containerAnimation: tween,
          start: 'left 60%',
        },
      });
    });

    /* ─────────────────────────────────────────────────────────
       MOBILE: Vertical stacked cards
       ───────────────────────────────────────────────────────── */
    mm.add('(max-width: 768px)', () => {
      gsap.utils.toArray('.journey-card').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        );
      });

      gsap.to('.move-route-path', {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: moveRef.current,
          start: 'top 65%',
          end: 'bottom 35%',
          scrub: true,
        },
      });
    });
  });

  return (
    <section className="journey-section" ref={sectionRef} id="journey">
      {/* Pinned header visible during horizontal scroll */}
      <div className="journey-header">
        <div className="section-label">02 / The Journey</div>
        <h2 className="journey-heading">THE JOURNEY</h2>
        <p className="journey-subheading">Every shipment is a sequence of decisions.</p>
      </div>

      {/* Horizontal track */}
      <div className="journey-track" ref={trackRef}>

        {/* ── STAGE 1: PLAN ── */}
        <div className="journey-stage journey-card" ref={planRef}>
          <div className="stage-content">
            <span className="stage-number" aria-hidden="true">01</span>
            <h3 className="stage-title">PLAN</h3>
            <div className="plan-interface glass-panel">
              <div className="plan-item">
                <span className="plan-label">ORIGIN</span>
                <span className="plan-value">Mumbai, IN</span>
              </div>
              <div className="plan-item">
                <span className="plan-label">DESTINATION</span>
                <span className="plan-value">Rotterdam, NL</span>
              </div>
              <div className="plan-item">
                <span className="plan-label">CARGO TYPE</span>
                <span className="plan-value">Industrial Freight</span>
              </div>
              <div className="plan-item">
                <span className="plan-label">EST. DISTANCE</span>
                <span className="plan-value">7,250 KM</span>
              </div>
              <div className="plan-item">
                <span className="plan-label">DEPARTURE</span>
                <span className="plan-value">06:00 UTC+5:30</span>
              </div>
              <div className="plan-item">
                <span className="plan-label">ROUTE</span>
                <span className="plan-value plan-route">MUM → DXB → RTM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STAGE 2: MOVE ── */}
        <div className="journey-stage journey-card" ref={moveRef}>
          <div className="stage-content">
            <span className="stage-number" aria-hidden="true">02</span>
            <h3 className="stage-title">MOVE</h3>
            <div className="move-interface">
              <div className="move-waypoints">
                <div className="waypoint">
                  <div className="waypoint-dot active"></div>
                  <span className="waypoint-label">Mumbai</span>
                </div>
                <div className="waypoint waypoint-mid">
                  <div className="waypoint-dot"></div>
                  <span className="waypoint-label">Dubai</span>
                </div>
                <div className="waypoint">
                  <div className="waypoint-dot"></div>
                  <span className="waypoint-label">Rotterdam</span>
                </div>
              </div>
              <svg viewBox="0 0 600 140" className="move-svg" aria-hidden="true">
                {/* Background ghost path */}
                <path
                  d="M 40 110 C 120 110 140 30 300 70 S 480 30 560 30"
                  fill="none"
                  stroke="rgba(40, 85, 154,0.08)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Animated accent path */}
                <path
                  className="move-route-path"
                  d="M 40 110 C 120 110 140 30 300 70 S 480 30 560 30"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeDasharray="1200"
                  strokeDashoffset="1200"
                  strokeLinecap="round"
                />
                {/* City nodes */}
                <circle cx="40"  cy="110" r="6" fill="var(--accent)" />
                <circle cx="300" cy="70"  r="5" fill="rgba(40, 85, 154,0.4)" />
                <circle cx="560" cy="30"  r="6" fill="rgba(40, 85, 154,0.4)" />
                {/* Travelling dot */}
                <circle
                  className="move-dot"
                  cx="0" cy="0" r="7"
                  fill="var(--accent)"
                  style={{ offsetPath: "path('M 40 110 C 120 110 140 30 300 70 S 480 30 560 30')" }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── STAGE 3: TRACK ── */}
        <div className="journey-stage journey-card" ref={trackStageRef}>
          <div className="stage-content">
            <span className="stage-number" aria-hidden="true">03</span>
            <h3 className="stage-title">TRACK</h3>
            <div className="track-interface glass-panel">
              <div className="track-status-header">
                <span className="pulse-dot" aria-hidden="true"></span>
                <span className="track-status-text">IN TRANSIT</span>
              </div>

              <div className="track-progress-bar" role="progressbar" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100">
                <div className="track-progress-fill"></div>
              </div>
              <div className="track-progress-labels">
                <span>Mumbai</span>
                <span>Dubai Hub</span>
                <span>Rotterdam</span>
              </div>

              <div className="track-data-row">
                <span className="track-label">CURRENT LOCATION</span>
                <span className="track-value">Dubai Hub, UAE</span>
              </div>
              <div className="track-data-row">
                <span className="track-label">SPEED</span>
                <span className="track-value">104 KM/H</span>
              </div>
              <div className="track-data-row">
                <span className="track-label">ETA</span>
                <span className="track-value">08:42 UTC+1</span>
              </div>
              <div className="track-data-row">
                <span className="track-label">DISTANCE REMAINING</span>
                <span className="track-value">4,800 KM</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STAGE 4: DELIVER ── */}
        <div className="journey-stage journey-card" ref={deliverRef}>
          <div className="stage-content">
            <span className="stage-number" aria-hidden="true">04</span>
            <h3 className="stage-title">DELIVER</h3>
            <div className="deliver-interface">
              <div className="deliver-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="deliver-text">
                <div className="deliver-percent">100%</div>
                <h4 className="deliver-word">DELIVERED.</h4>
                <p className="deliver-caption">From first mile to final destination.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ScrollExperience;
