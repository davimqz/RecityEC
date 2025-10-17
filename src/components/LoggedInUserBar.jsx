import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Grid, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoggedInUserBar = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-sage to-terracotta text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ArrowLeft size={20} />
            <span className="text-sm">
              Você está logado como <strong>{user.name || user.email}</strong>
            </span>
            {user.giroBalance !== undefined && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {user.giroBalance} GIRO
              </span>
            )}
          </div>
          
          <Link
            to="/feed"
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
          >
            <Grid size={16} />
            <span className="text-sm font-medium">Voltar ao App</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LoggedInUserBar;