import React, { useState, useEffect } from 'react';
import { Menu, X, Recycle, User, LogOut, Wallet, Plus, Grid, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './Auth/LoginModal';
import Logo from "../assets/img/giro_logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={Logo} 
              alt="Giro Logo" 
              className="h-8 sm:h-10 w-auto"
            />
            Giro
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link 
              to="/" 
              className={`flex items-center gap-2 transition-colors font-medium text-sm xl:text-base ${
                location.pathname === '/' ? 'text-sage' : 'text-black hover:text-sage'
              }`}
            >
              <Home size={16} />
              Início
            </Link>
            <Link 
              to="/feed" 
              className={`flex items-center gap-2 transition-colors font-medium text-sm xl:text-base ${
                location.pathname === '/feed' ? 'text-sage' : 'text-black hover:text-sage'
              }`}
            >
              <Grid size={16} />
              Feed
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2 transition-colors font-medium text-sm xl:text-base ${
                    location.pathname === '/profile' ? 'text-sage' : 'text-black hover:text-sage'
                  }`}
                >
                  <User size={16} />
                  Perfil
                </Link>
                <Link 
                  to="/create-post" 
                  className="flex items-center gap-2 bg-sage text-white px-4 py-2 rounded-xl hover:bg-sage/80 transition-colors font-medium text-sm xl:text-base"
                >
                  <Plus size={16} />
                  Criar Post
                </Link>
              </>
            )}
            <a href="#explorar" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Explorar
            </a>
            <a href="#contato" className="text-black hover:text-sage transition-colors font-medium text-sm xl:text-base">
              Contato
            </a>
            
            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-white to-cream text-soft-graphite px-4 xl:px-6 py-2 rounded-full hover:from-cream hover:to-terracotta hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm xl:text-base"
                >
                  <User size={16} />
                  <span>{user?.name || user?.email}</span>
                  {user?.giro_balance && (
                    <span className="bg-sage text-white px-2 py-1 rounded-full text-xs">
                      {user.giro_balance} GIRO
                    </span>
                  )}
                </button>
                
                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <User size={16} className="mr-2" />
                      Meu Perfil
                    </Link>
                    <Link to="/my-purchases" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <ShoppingBag size={16} className="mr-2" />
                      Minhas Compras
                    </Link>
                    <Link to="/rewards" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <Wallet size={16} className="mr-2" />
                      Ganhar GIRO
                    </Link>
                    <Link to="/create-post" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <Plus size={16} className="mr-2" />
                      Criar Post
                    </Link>
                    <Link to="/feed" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <Grid size={16} className="mr-2" />
                      Feed
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-white to-cream text-soft-graphite px-4 xl:px-6 py-2 rounded-full hover:from-cream hover:to-terracotta hover:text-white transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-sm xl:text-base"
              >
                Entrar
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 mx-2 sm:mx-0 p-4 shadow-lg border border-white/50"
          >
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  {/* Menu para usuários logados */}
                  <div className="text-center text-sm text-gray-600 pb-2 border-b border-gray-200">
                    Olá, {user?.name || user?.email}
                    {user?.giroBalance !== undefined && (
                      <div className="text-sage font-semibold">
                        {user.giroBalance} GIRO
                      </div>
                    )}
                  </div>
                  
                  <Link to="/feed" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10">
                    <Grid size={18} className="mr-3" />
                    Feed
                  </Link>
                  
                  <Link to="/my-purchases" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10">
                    <ShoppingBag size={18} className="mr-3" />
                    Minhas Compras
                  </Link>
                  
                  <Link to="/rewards" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10">
                    <Wallet size={18} className="mr-3" />
                    Ganhar GIRO
                  </Link>
                  
                  <Link to="/create-post" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10">
                    <Plus size={18} className="mr-3" />
                    Criar Post
                  </Link>
                  
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10">
                    <User size={18} className="mr-3" />
                    Meu Perfil
                  </Link>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium w-full"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Menu para visitantes */}
                  <a href="#inicio" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                    Início
                  </a>
                  <a href="#como-funciona" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                    Como Funciona
                  </a>
                  <a href="#anunciar" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                    Anunciar
                  </a>
                  <a href="#explorar" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                    Explorar
                  </a>
                  <a href="#contato" className="text-black hover:text-sage transition-colors font-medium py-3 px-4 rounded-lg hover:bg-sage/10 text-center">
                    Contato
                  </a>
                  <div className="pt-2 border-t border-black/10">
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-gradient-to-r from-sage to-terracotta text-white px-6 py-3 rounded-full hover:from-sage/90 hover:to-terracotta/90 transition-colors font-medium w-full shadow-md"
                    >
                      Entrar
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={(userData) => {
            // Fechar modal e menus
            setIsLoginModalOpen(false);
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
            // Redirecionar para feed após login
            navigate('/feed');
          }}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;