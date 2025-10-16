import React from 'react';
import { Camera, MessageCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      icon: Camera,
      title: 'Anuncie',
      description: 'Tire uma foto e publique seu item de forma simples e rápida.'
    },
    {
      icon: MessageCircle,
      title: 'Conecte-se',
      description: 'Converse com compradores ou doadores de forma direta e segura.'
    },
    {
      icon: RefreshCw,
      title: 'Reutilize',
      description: 'Dê um novo propósito a cada objeto e contribua para um mundo melhor.'
    }
  ];

  return (
    <section id="como-funciona" className="pt-4 pb-2 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-2 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-semibold text-soft-gray mb-3 sm:mb-4 px-4">
            Como Funciona
          </h2>
          <p className="text-base sm:text-lg text-soft-gray/70 max-w-2xl mx-auto px-4">
            Em apenas três passos simples, você pode fazer parte da revolução da economia circular
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="text-center p-6 sm:p-8 rounded-2xl bg-cream/50 hover:shadow-xl transition-all duration-300 mx-2 sm:mx-0"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-sage/20">
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 sm:top-10 -right-12 w-8 h-0.5 bg-sage/30"></div>
                )}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-terracotta rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-playfair font-semibold text-soft-graphite mb-3 sm:mb-4">
                {step.title}
              </h3>
              
              <p className="text-sm sm:text-base text-soft-graphite/70 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-mint text-soft-gray px-8 py-3 rounded-full font-semibold hover:bg-mint/80 transition-colors shadow-lg">
            Começar Agora
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;