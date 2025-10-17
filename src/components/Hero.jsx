import React from 'react';
import { ArrowRight, PlayCircle, Recycle, Heart, Leaf, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../assets/img/giro_logo.png';

const Hero = () => {
  return (
    <section id="inicio" className="relative pt-32 sm:pt-28 pb-2 sm:pb-16 bg-gradient-to-br from-cream via-terracotta/10 to-sage/20 min-h-[50vh] sm:min-h-screen flex items-center overflow-hidden">
      {/* Textura de fundo orgânica */}
      <div className="absolute inset-0 opacity-30"></div>
      
      {/* Elementos flutuantes decorativos - responsive */}
      <div className="absolute top-20 left-4 sm:left-10 w-8 sm:w-16 h-8 sm:h-16 bg-sage/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-8 sm:right-20 w-6 sm:w-8 h-6 sm:h-8 bg-terracotta/30 rounded-full animate-gentle-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-8 sm:w-12 h-8 sm:h-12 bg-blue-gray/25 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-2 sm:gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left relative order-2 lg:order-1"
          >
            {/* Pequeno elemento decorativo */}
            <div className="hidden sm:block absolute -top-8 left-0 lg:left-0 w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-sage to-terracotta rounded-full"></div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-medium text-soft-graphite leading-tight mb-1 sm:mb-6 px-2 sm:px-0">
              Cada objeto tem uma{' '}
              <span className="text-sage relative">
                nova história
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3" viewBox="0 0 200 10" fill="none">
                  <path d="M2 8c30-6 60-6 90 0s60 6 90 0" stroke="#B7C9A9" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>{' '}
              pra contar.
            </h1>
            
            <p className="text-sm sm:text-lg md:text-xl text-soft-graphite/70 mb-2 sm:mb-8 leading-relaxed font-inter px-2 sm:px-0 max-w-lg mx-auto lg:mx-0">
              Compre, venda e troque de forma consciente.<br className="hidden sm:block"/>
              <span className="text-sage font-medium">Juntos, fazemos a economia circular girar.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center lg:justify-start px-2 sm:px-0">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-sage to-sage/80 text-black px-4 sm:px-8 py-2 sm:py-4 rounded-full font-raleway font-semibold text-sm sm:text-lg hover:from-sage/90 hover:to-sage transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">Começar Agora</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
              </motion.button>
              
              
            </div>

            {/* Micro elementos decorativos */}
            <div className="absolute -right-4 sm:-right-8 top-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-terracotta/40 transform rotate-45 animate-gentle-bounce" style={{animationDelay: '0.5s'}}></div>
          </motion.div>

          {/* Right Content - Ilustração Orgânica */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2 flex justify-center lg:block"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto lg:mx-0">
              {/* Logo centralizada */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 sm:p-6 lg:p-8 shadow-xl border border-sage/20">
                  <img 
                    src={Logo} 
                    alt="Giro Logo" 
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
                  />
                </div>
              </div>
              
              {/* Ícones flutuantes com design mais orgânico */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-8 sm:top-16 left-8 sm:left-16 bg-gradient-to-br from-white to-cream/80 p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl border border-sage/20 backdrop-blur-sm"
                style={{ transform: 'rotate(5deg)' }}
              >
                <Recycle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-sage" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.7 }}
                className="absolute top-24 sm:top-36 right-6 sm:right-12 bg-gradient-to-br from-terracotta/20 to-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-terracotta/30"
                style={{ transform: 'rotate(-8deg)' }}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-terracotta" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, delay: 1.2 }}
                className="absolute bottom-16 sm:bottom-24 left-6 sm:left-12 bg-gradient-to-br from-sage/20 to-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border border-sage/40"
                style={{ transform: 'rotate(12deg)' }}
              >
                <Leaf className="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 text-sage" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, delay: 1.8 }}
                className="absolute bottom-28 sm:bottom-40 right-12 sm:right-20 bg-gradient-to-br from-blue-gray/20 to-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-blue-gray/30"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-gray" />
              </motion.div>
              
              {/* Elementos conectores - setas curvas */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                <path d="M120 150 Q180 120 220 180" stroke="#B7C9A9" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5,5">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                </path>
                <path d="M280 120 Q250 200 180 250" stroke="#E7BFA7" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="3,7">
                  <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite"/>
                </path>
              </svg>
              
              {/* Pequenas partículas flutuantes */}
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-sage rounded-full animate-float opacity-60" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-terracotta rounded-full animate-gentle-bounce opacity-50" style={{animationDelay: '3s'}}></div>
              <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-blue-gray rounded-full animate-organic-pulse opacity-70" style={{animationDelay: '1.5s'}}></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;