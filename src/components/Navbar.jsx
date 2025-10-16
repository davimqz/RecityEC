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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-sage/30 to-terracotta/20 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/30">
                <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-black animate-gentle-bounce" />
              </div>
              {/* Pequenos elementos decorativos */}
              <div className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-sage/60 rounded-full animate-organic-pulse"></div>
            </div>
            <span className="text-lg sm:text-xl font-raleway font-semibold text-black tracking-wide">
              ReUse Market
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="#inicio" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Início
            </a>
            <a href="#como-funciona" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Como Funciona
            </a>
            <a href="#anunciar" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Anunciar
            </a>
            <a href="#explorar" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Explorar
            </a>
            <a href="#contato" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Contato
            </a>
            <button className="bg-gradient-to-r from-white to-cream text-soft-graphite px-4 xl:px-6 py-2 rounded-full hover:from-cream hover:to-terracotta hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm xl:text-base">
              Entrar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 mx-2 sm:mx-0 p-4 shadow-lg border border-white/50"
          >
            <div className="flex flex-col space-y-3">
              <a href="#inicio" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                Início
              </a>
              <a href="#como-funciona" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                Como Funciona
              </a>
              <a href="#anunciar" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                Anunciar
              </a>
              <a href="#explorar" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                Explorar
              </a>
              <a href="#contato" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                Contato
              </a>
              <div className="pt-2 border-t border-black/10">
                <button className="bg-gradient-to-r from-sage to-terracotta text-white px-6 py-3 rounded-full hover:from-sage/90 hover:to-terracotta/90 transition-colors font-medium w-full shadow-md">
                  Entrar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;