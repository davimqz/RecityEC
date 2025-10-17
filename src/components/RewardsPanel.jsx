import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Gift, Calendar, Plus, Coins, Trophy, Star } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../config/api';

const RewardsPanel = () => {
  const { user, fetchUserBalance } = useContext(AuthContext);
  const [loading, setLoading] = useState({});

  // Debug: Ver se o componente está carregando
  console.log('🎁 RewardsPanel carregou', { user });

  // Se não estiver logado, mostrar mensagem
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Centro de Recompensas</h2>
          <p className="text-gray-600 mb-6">Faça login para ganhar GIRO tokens gratuitamente!</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }
  
  const claimReward = async (endpoint, buttonId) => {
    setLoading({ ...loading, [buttonId]: true });
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/rewards/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`🎉 ${result.message}\n💰 Novo saldo: ${result.newBalance} GIRO`);
        
        // Atualizar o saldo no contexto do usuário
        if (fetchUserBalance) {
          fetchUserBalance();
        }
        
        // Forçar recarregamento da página para sincronizar
        window.location.reload();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao resgatar recompensa:', error);
      alert('Erro ao resgatar recompensa');
    } finally {
      setLoading({ ...loading, [buttonId]: false });
    }
  };

  const addTokens = async (amount = 500) => {
    setLoading({ ...loading, addTokens: true });
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/rewards/add-tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amount,
          reason: 'Tokens adicionados para teste'
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`🎉 ${result.message}\n💰 Novo saldo: ${result.newBalance} GIRO`);
        
        // Atualizar o saldo no contexto do usuário
        if (fetchUserBalance) {
          fetchUserBalance();
        }
        
        // Forçar recarregamento da página para sincronizar
        window.location.reload();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao adicionar tokens:', error);
      alert('Erro ao adicionar tokens');
    } finally {
      setLoading({ ...loading, addTokens: false });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={28} />
              Centro de Recompensas
            </h2>
            <p className="text-gray-600 mt-2">Ganhe GIRO tokens gratuitamente!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Seu saldo atual</p>
            <p className="text-3xl font-bold text-purple-600">
              {user?.giroBalance || 0} <span className="text-lg">GIRO</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Bônus de Boas-vindas */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl border border-green-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Star className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bônus de Boas-vindas</h3>
                <p className="text-sm text-gray-600">1000 GIRO tokens</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Receba tokens gratuitamente ao se cadastrar!
            </p>
            <button
              onClick={() => claimReward('welcome-bonus', 'welcome')}
              disabled={loading.welcome}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading.welcome ? 'Processando...' : 'Resgatar Bônus'}
            </button>
          </motion.div>

          {/* Recompensa Diária */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl border border-blue-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Login Diário</h3>
                <p className="text-sm text-gray-600">100 GIRO tokens</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Faça login todos os dias e ganhe tokens!
            </p>
            <button
              onClick={() => claimReward('daily-login', 'daily')}
              disabled={loading.daily}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading.daily ? 'Processando...' : 'Resgatar Diário'}
            </button>
          </motion.div>

          {/* Adicionar Tokens (Teste) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl border border-purple-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Plus className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Tokens de Teste</h3>
                <p className="text-sm text-gray-600">500 GIRO tokens</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Para testar compras na plataforma
            </p>
            <div className="space-y-2">
              <button
                onClick={() => addTokens(500)}
                disabled={loading.addTokens}
                className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {loading.addTokens ? 'Processando...' : '+ 500 GIRO'}
              </button>
              <button
                onClick={() => addTokens(1000)}
                disabled={loading.addTokens}
                className="w-full bg-purple-600 text-white py-1 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
              >
                + 1000 GIRO
              </button>
            </div>
          </motion.div>

        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="text-yellow-600" size={20} />
            <h4 className="font-semibold text-yellow-800">Como Ganhar Mais Tokens</h4>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Crie posts para vender itens (50 GIRO por post)</li>
            <li>• Faça login diariamente (100 GIRO por dia)</li>
            <li>• Complete seu perfil (recompensa única)</li>
            <li>• Convide amigos para a plataforma</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RewardsPanel;