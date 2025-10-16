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
      description: 'Encontre ótimos produtos por preços acessíveis e ganhe dinheiro com o que não usa.',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-soft-gray mb-4">
            Por que usar o ReUse Market?
          </h2>
          <p className="text-lg text-soft-gray/70 max-w-2xl mx-auto">
            Uma plataforma que conecta pessoas e transforma a forma como consumimos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center p-8 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-20 h-20 ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}
              >
                <benefit.icon className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-poppins font-semibold text-soft-gray mb-4">
                {benefit.title}
              </h3>
              
              <p className="text-soft-gray/70 leading-relaxed">
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
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-poppins font-bold text-mint mb-2">10k+</div>
            <div className="text-soft-gray/70">Itens Reutilizados</div>
          </div>
          <div>
            <div className="text-3xl font-poppins font-bold text-mint mb-2">5k+</div>
            <div className="text-soft-gray/70">Usuários Ativos</div>
          </div>
          <div>
            <div className="text-3xl font-poppins font-bold text-mint mb-2">95%</div>
            <div className="text-soft-gray/70">Satisfação</div>
          </div>
          <div>
            <div className="text-3xl font-poppins font-bold text-mint mb-2">2 ton</div>
            <div className="text-soft-gray/70">CO₂ Evitado</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;