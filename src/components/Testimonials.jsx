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
    <section className="py-20 bg-gradient-to-br from-gray-blue/20 to-mint/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-semibold text-soft-gray mb-4">
            Histórias Reais
          </h2>
          <p className="text-lg text-soft-gray/70 max-w-2xl mx-auto">
            Veja como nossa comunidade está transformando objetos e vidas
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="relative h-80 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-soft-gray mb-6 leading-relaxed">
                    "{testimonials[currentIndex].text}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center text-soft-gray font-semibold">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-soft-gray">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-soft-gray/60 text-sm">
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-sage hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-sage hover:text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-mint' : 'bg-gray-300'
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