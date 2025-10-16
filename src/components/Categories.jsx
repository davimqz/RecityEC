import React from 'react';
import { Shirt, Sofa, BookOpen, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = () => {
  const categories = [
    {
      icon: Shirt,
      title: 'Roupas',
      description: 'Moda sustentável e consciente',
      color: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: Sofa,
      title: 'Móveis',
      description: 'Decore seu lar com história',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Livros',
      description: 'Conhecimento que circula',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      icon: Smartphone,
      title: 'Eletrônicos',
      description: 'Tecnologia acessível',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
  ];

  return (
    <section className="pt-4 pb-2 sm:py-16 bg-gradient-to-br from-sage/10 to-terracotta/5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-2 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-soft-graphite mb-3 sm:mb-4 px-4">
            Categorias Populares
          </h2>
          <p className="text-base sm:text-lg text-soft-graphite/70 max-w-2xl mx-auto px-4">
            Encontre exatamente o que você procura nas nossas categorias mais procuradas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-1 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                <category.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${category.iconColor}`} />
              </div>
              
              <h3 className="text-sm sm:text-lg font-raleway font-semibold text-soft-graphite mb-1 sm:mb-2">
                {category.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-soft-graphite/60 mb-3 sm:mb-4 hidden sm:block">
                {category.description}
              </p>
              
              <button className="text-sage font-semibold text-xs sm:text-sm hover:text-sage/80 transition-colors">
                Explorar →
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="border-2 border-sage text-sage px-8 py-3 rounded-full font-semibold hover:bg-sage hover:text-white transition-all duration-300">
            Ver Todas as Categorias
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;