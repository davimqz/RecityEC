import React from 'react';
import { Leaf, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const Benefits = () => {
  const benefits = [
    {
      icon: Leaf,
      title: 'Sustentável',
      description: 'Reduz o desperdício e o impacto ambiental, contribuindo para um planeta mais verde.',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'Comunitário',
      description: 'Crie conexões locais e fortaleça o consumo colaborativo na sua comunidade.',
      color: 'bg-blue-500'
    },
    {
      icon: DollarSign,
      title: 'Econômico',
      description: 'Encontre o que você precisa, adquira com tokens sem gastar dinheiro.',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <section className="pt-4 pb-2 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-2 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-soft-graphite mb-3 sm:mb-4 px-4">
            Por que usar o Giro?
          </h2>
          <p className="text-base sm:text-lg text-soft-graphite/70 max-w-2xl mx-auto px-4">
            Uma plataforma que conecta pessoas e transforma a forma como consumimos
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-2 sm:p-8 group mx-1 sm:mx-0"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 sm:w-20 sm:h-20 ${benefit.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
              </motion.div>
              
              <h3 className="text-lg sm:text-xl font-playfair font-semibold text-soft-graphite mb-3 sm:mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-sm sm:text-base text-soft-graphite/70 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-2 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-8 text-center px-1"
        >
          <div>
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-sage mb-1 sm:mb-2">10k+</div>
            <div className="text-xs sm:text-sm text-soft-graphite/70">Itens Reutilizados</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-terracotta mb-1 sm:mb-2">5k+</div>
            <div className="text-xs sm:text-sm text-soft-graphite/70">Usuários Ativos</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-sage mb-1 sm:mb-2">2k+</div>
            <div className="text-xs sm:text-sm text-soft-graphite/70">Transações</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-playfair font-bold text-blue-gray mb-1 sm:mb-2">95%</div>
            <div className="text-xs sm:text-sm text-soft-graphite/70">Satisfação</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;