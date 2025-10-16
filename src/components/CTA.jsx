import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="pt-4 pb-2 sm:py-20 bg-gradient-to-r from-sage/30 to-terracotta/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-12 sm:w-20 h-12 sm:h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-8 sm:w-16 h-8 sm:h-16 bg-white rounded-full hidden sm:block"></div>
        <div className="absolute bottom-20 left-1/4 w-6 sm:w-12 h-6 sm:h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full hidden sm:block"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-black"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4 sm:mb-6"
          >
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-soft-graphite/80" />
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-playfair font-semibold mb-4 sm:mb-6 leading-tight px-4">
            Pronto para começar sua{' '}
            <span className="text-terracotta">jornada sustentável</span>?
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-soft-graphite/80 max-w-2xl mx-auto leading-relaxed px-4">
            Junte-se a milhares de pessoas que já estão fazendo a diferença. 
            Transforme o que você não usa em oportunidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-white text-sage px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-cream transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
            >
              <span className="hidden sm:inline">Anunciar meu primeiro produto</span>
              <span className="sm:hidden">Anunciar produto</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto border-2 border-soft-graphite text-soft-graphite px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-soft-graphite hover:text-white transition-all duration-300"
            >
              Explorar produtos
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-1 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-8 text-center px-1"
          >
            
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;