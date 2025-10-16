import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Marina L.',
      role: 'Vendedora',
      text: 'Vendi meu sofá em 2 dias! A plataforma é simples e prática.',
      rating: 5,
      avatar: 'ML'
    },
    {
      name: 'Carlos R.',
      role: 'Comprador',
      text: 'Encontrei móveis únicos por preços incríveis. Recomendo!',
      rating: 5,
      avatar: 'CR'
    },
    {
      name: 'Ana Sofia',
      role: 'Doadora',
      text: 'Que alegria saber que meus livros chegaram a outras crianças!',
      rating: 5,
      avatar: 'AS'
    },
    {
      name: 'Pedro M.',
      role: 'Comprador',
      text: 'Interface intuitiva e pessoas muito gentis. Experiência nota 10!',
      rating: 5,
      avatar: 'PM'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-4 pb-2 sm:py-20 bg-gradient-to-br from-blue-gray/20 to-sage/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-2 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-semibold text-soft-graphite mb-3 sm:mb-4 px-4">
            Histórias Reais
          </h2>
          <p className="text-base sm:text-lg text-soft-graphite/70 max-w-2xl mx-auto px-4">
            Veja como nossa comunidade está transformando objetos e vidas
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="relative h-auto min-h-64 sm:h-80 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center px-4"
              >
                <div className="bg-white p-3 sm:p-8 rounded-lg sm:rounded-2xl shadow-xl max-w-2xl text-center mx-1 sm:mx-0">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-base sm:text-lg lg:text-xl text-soft-graphite mb-4 sm:mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage rounded-full flex items-center justify-center text-soft-graphite font-semibold text-sm sm:text-base">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-soft-graphite text-sm sm:text-base">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-soft-graphite/60 text-xs sm:text-sm">
                        {testimonials[currentIndex].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-sage hover:text-white z-10"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-sage hover:text-white z-10"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-sage' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;