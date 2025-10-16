import React from 'react';
import { Shirt, Sofa, BookOpen, Smartphone, Baby } from 'lucide-react';
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
    {
      icon: Baby,
      title: 'Infantis',
      description: 'Crescendo juntos',
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-pale-yellow to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-soft-gray mb-4">
            Categorias Populares
          </h2>
          <p className="text-lg text-soft-gray/70 max-w-2xl mx-auto">
            Encontre exatamente o que você procura nas nossas categorias mais procuradas
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer"
            >
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <category.icon className={`w-8 h-8 ${category.iconColor}`} />
              </div>
              
              <h3 className="text-lg font-poppins font-semibold text-soft-gray mb-2">
                {category.title}
              </h3>
              
              <p className="text-sm text-soft-gray/60 mb-4">
                {category.description}
              </p>
              
              <button className="text-mint font-semibold text-sm hover:text-mint/80 transition-colors">
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
          <button className="border-2 border-mint text-mint px-8 py-3 rounded-full font-semibold hover:bg-mint hover:text-white transition-all duration-300">
            Ver Todas as Categorias
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;