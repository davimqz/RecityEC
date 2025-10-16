import React from 'react';
import { ArrowRight, PlayCircle, Recycle, Heart, Leaf, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="inicio" className="pt-20 pb-16 bg-gradient-to-br from-cream to-pale-yellow min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-poppins font-semibold text-soft-gray leading-tight mb-6">
              Dê um novo{' '}
              <span className="text-mint">destino</span>{' '}
              ao que você não usa mais.
            </h1>
            
            <p className="text-lg md:text-xl text-soft-gray/80 mb-8 leading-relaxed">
              Compre, venda ou doe objetos e ajude a construir um futuro mais sustentável.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-mint text-soft-gray px-8 py-4 rounded-full font-semibold text-lg hover:bg-mint/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-soft-gray text-soft-gray px-8 py-4 rounded-full font-semibold text-lg hover:bg-soft-gray hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Saiba Mais
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Floating Icons */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 left-10 bg-white p-4 rounded-2xl shadow-lg"
              >
                <Recycle className="w-8 h-8 text-mint" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute top-32 right-20 bg-white p-4 rounded-2xl shadow-lg"
              >
                <Heart className="w-8 h-8 text-pink-400" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 left-20 bg-white p-4 rounded-2xl shadow-lg"
              >
                <Leaf className="w-8 h-8 text-green-500" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-32 right-10 bg-white p-4 rounded-2xl shadow-lg"
              >
                <Package className="w-8 h-8 text-gray-blue" />
              </motion.div>

              {/* Central Circle */}
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-mint/30 to-gray-blue/30 rounded-full flex items-center justify-center">
                <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <Recycle className="w-16 h-16 text-mint mx-auto mb-4" />
                    <p className="text-soft-gray font-semibold text-lg">Economia Circular</p>
                    <p className="text-soft-gray/60 text-sm">em movimento</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;