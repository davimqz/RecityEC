import React, { useState, useEffect } from 'react';
import { Menu, X, Recycle } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-sage/30 to-terracotta/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                <Recycle className="w-6 h-6 text-black animate-gentle-bounce" />
              </div>
              {/* Pequenos elementos decorativos */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-sage/60 rounded-full animate-organic-pulse"></div>
            </div>
            <span className="text-xl font-raleway font-semibold text-black tracking-wide">
              ReUse Market
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-black hover:text-sage transition-colors font-medium">
              Início
            </a>
            <a href="#como-funciona" className="text-black hover:text-sage transition-colors font-medium">
              Como Funciona
            </a>
            <a href="#anunciar" className="text-black hover:text-sage transition-colors font-medium">
              Anunciar
            </a>
            <a href="#explorar" className="text-black hover:text-sage transition-colors font-medium">
              Explorar
            </a>
            <a href="#contato" className="text-black hover:text-sage transition-colors font-medium">
              Contato
            </a>
            <button className="bg-gradient-to-r from-white to-cream text-soft-graphite px-6 py-2 rounded-full hover:from-cream hover:to-terracotta hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
              Entrar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 backdrop-blur-md rounded-lg mt-2 p-4 shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              <a href="#inicio" className="text-black hover:text-sage transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10">
                Início
              </a>
              <a href="#como-funciona" className="text-black hover:text-sage transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10">
                Como Funciona
              </a>
              <a href="#anunciar" className="text-black hover:text-sage transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10">
                Anunciar
              </a>
              <a href="#explorar" className="text-black hover:text-sage transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10">
                Explorar
              </a>
              <a href="#contato" className="text-black hover:text-sage transition-colors font-medium py-2 px-3 rounded-lg hover:bg-white/10">
                Contato
              </a>
              <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium w-full mt-2">
                Entrar
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;