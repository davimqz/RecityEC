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
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-soft-gray mb-4">
            Como Funciona
          </h2>
          <p className="text-lg text-soft-gray/70 max-w-2xl mx-auto">
            Em apenas três passos simples, você pode fazer parte da revolução da economia circular
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="text-center p-8 rounded-2xl bg-cream/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-mint rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon className="w-10 h-10 text-soft-gray" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-12 w-8 h-0.5 bg-mint/30"></div>
                )}
              </div>
              
              <h3 className="text-xl font-poppins font-semibold text-soft-gray mb-4">
                {step.title}
              </h3>
              
              <p className="text-soft-gray/70 leading-relaxed">
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