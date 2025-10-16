import React from 'react';
import { Recycle, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <footer className="bg-gradient-to-br from-cream to-pale-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-mint rounded-full p-2">
                  <Recycle className="w-6 h-6 text-soft-gray" />
                </div>
                <span className="text-xl font-poppins font-semibold text-soft-gray">
                  ReUse Market
                </span>
              </div>
              
              <p className="text-soft-gray/70 mb-6 leading-relaxed max-w-md">
                Conectando pessoas através da economia circular. 
                Juntos, criamos um futuro mais sustentável, um objeto reutilizado por vez.
              </p>

              <div className="space-y-3 text-soft-gray/70">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-mint" />
                  <span>contato@reusemarket.com.br</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-mint" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-mint" />
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
              <h3 className="font-poppins font-semibold text-soft-gray mb-6">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-soft-gray/70 hover:text-mint transition-colors duration-300"
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
          className="py-8 border-t border-soft-gray/20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-poppins font-semibold text-soft-gray mb-2">
                Fique por dentro das novidades
              </h3>
              <p className="text-soft-gray/70">
                Receba dicas de sustentabilidade e as melhores ofertas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-full border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
              />
              <button className="bg-mint text-soft-gray px-6 py-3 rounded-full font-semibold hover:bg-mint/80 transition-colors whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-soft-gray/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-soft-gray/60 text-center md:text-left"
            >
              © 2025 Powered by Blockchaintech Brazil — Fazendo a economia circular girar 💚
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
                  className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:bg-mint group"
                >
                  <Icon className="w-5 h-5 text-soft-gray group-hover:text-white transition-colors" />
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