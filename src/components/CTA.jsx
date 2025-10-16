import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-sage/30 to-terracotta/20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full"></div>
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
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 mx-auto text-black/80" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-poppins font-semibold mb-6 leading-tight">
            Pronto para começar sua{' '}
            <span className="text-terracotta">jornada sustentável</span>?
          </h2>
          
          <p className="text-lg md:text-xl mb-8 text-black/80 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de pessoas que já estão fazendo a diferença. 
            Transforme o que você não usa em oportunidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-mint px-8 py-4 rounded-full font-semibold text-lg hover:bg-cream transition-all duration-300 flex items-center gap-2 shadow-xl"
            >
              Anunciar meu primeiro produto
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-black text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-black hover:text-white transition-all duration-300"
            >
              Explorar produtos
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <div className="text-2xl font-poppins font-bold text-pale-yellow mb-2">
                ✨ Gratuito
              </div>
              <div className="text-black/80 text-sm">
                Anuncie sem pagar nada
              </div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-terracotta mb-2">
                🚀 Rápido
              </div>
              <div className="text-black/80 text-sm">
                Publique em menos de 2 minutos
              </div>
            </div>
            <div>
              <div className="text-2xl font-poppins font-bold text-sage mb-2">
                🌱 Sustentável
              </div>
              <div className="text-black/80 text-sm">
                Faça a diferença no planeta
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;