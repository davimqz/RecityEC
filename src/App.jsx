import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Categories from './components/Categories';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-cream font-inter">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Categories />
      <Benefits />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
