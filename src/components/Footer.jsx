import React from 'react';
import { Recycle, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from "../assets/img/giro_logo.png"
const Footer = () => {
  const footerLinks = {
    'Empresa': [
      { name: 'Sobre Nós', href: '#sobre' },
      { name: 'Como Funciona', href: '#como-funciona' },
      { name: 'Blog', href: '#blog' },
      { name: 'Carreiras', href: '#carreiras' }
    ],
    'Suporte': [
      { name: 'Central de Ajuda', href: '#ajuda' },
      { name: 'Contato', href: '#contato' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Segurança', href: '#seguranca' }
    ],
    'Legal': [
      { name: 'Política de Privacidade', href: '#privacidade' },
      { name: 'Termos de Uso', href: '#termos' },
      { name: 'Cookies', href: '#cookies' },
      { name: 'LGPD', href: '#lgpd' }
    ]
  };

  const socialLinks = [
    { Icon: Instagram, href: '#', name: 'Instagram' },
    { Icon: Linkedin, href: '#', name: 'LinkedIn' },
    { Icon: Twitter, href: '#', name: 'Twitter' }
  ];

  return (
    <footer className="bg-gradient-to-br from-cream to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-2 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <img 
                  src={Logo} 
                  alt="Giro Logo" 
                  className="h-8 sm:h-10 w-auto"
                />
                Giro
              </div>
              
              <p className="text-soft-graphite/70 mb-4 sm:mb-6 leading-relaxed max-w-md text-sm sm:text-base">
                Conectando pessoas através da economia circular. 
                Juntos, criamos um futuro mais sustentável, um objeto reutilizado por vez.
              </p>

              <div className="space-y-2 sm:space-y-3 text-soft-graphite/70 text-sm sm:text-base">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-sage" />
                  <span>contato@giro.com.br</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-sage" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-sage" />
                  <span>São Paulo, Brasil</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-playfair font-semibold text-soft-graphite mb-4 sm:mb-6 text-base sm:text-lg">
                {title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-soft-graphite/70 hover:text-sage transition-colors duration-300 text-sm sm:text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-6 sm:py-8 border-t border-soft-graphite/20"
        >
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="font-playfair font-semibold text-soft-graphite mb-2 text-base sm:text-lg">
                Fique por dentro das novidades
              </h3>
              <p className="text-soft-graphite/70 text-sm sm:text-base">
                Receba dicas de sustentabilidade e as melhores ofertas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 sm:py-3 rounded-full border border-soft-graphite/20 focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent text-sm sm:text-base"
              />
              <button className="bg-sage text-soft-graphite px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-sage/80 transition-colors whitespace-nowrap text-sm sm:text-base">
                Inscrever-se
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="py-6 sm:py-8 border-t border-soft-graphite/20">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-soft-graphite/60 text-center sm:text-left text-xs sm:text-sm"
            >
              © 2025 Powered by Blockchaintech Brazil
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map(({ Icon, href, name }) => (
                <motion.a
                  key={name}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-white p-2 sm:p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-sage group"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-soft-graphite group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;