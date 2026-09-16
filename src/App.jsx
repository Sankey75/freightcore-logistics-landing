import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HeroExperience from './components/HeroExperience';
import ServiceShowcase from './components/ServiceShowcase';
import LogisticsJourney from './components/LogisticsJourney';
import ShipmentTracking from './components/ShipmentTracking';
import FleetSection from './components/FleetSection';
import ScrollExperience from './components/ScrollExperience';
import NetworkSection from './components/NetworkSection';
import LogisticsDashboard from './components/LogisticsDashboard';
import IndustryScroller from './components/IndustryScroller';
import CinematicSection from './components/CinematicSection';
import TechnologySection from './components/TechnologySection';
import CtaSection from './components/CtaSection';
import ParallaxContainers from './components/ParallaxContainers';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  const [loading, setLoading] = useState(true);

  // Lock body scroll while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Give GSAP ScrollTrigger a moment after loader exits
      setTimeout(() => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 150);
    }
  }, [loading]);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <div
        className="app-content"
        style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}
      >
        <CustomCursor />
        <Navbar />

        <main>
          <ParallaxContainers />
          <HeroExperience />
          <ServiceShowcase />
          <LogisticsJourney />
          <ShipmentTracking />
          <FleetSection />
          <ScrollExperience />
          <NetworkSection />
          <LogisticsDashboard />
          <IndustryScroller />
          <CinematicSection />
          <TechnologySection />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
