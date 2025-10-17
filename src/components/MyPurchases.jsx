import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Eye, Calendar, CreditCard, Package } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../config/api';

const MyPurchases = () => {
  const { user } = useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchMyPurchases();
  }, []);

  const fetchMyPurchases = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/transactions/my-purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-blue-500" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Minhas Compras</h1>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma compra ainda</h3>
          <p className="text-gray-500">Explore o feed e faça sua primeira compra!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((transaction) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Imagem do produto */}
              <div className="aspect-square relative overflow-hidden">
                {transaction.post?.imageUrl ? (
                  <img
                    src={`${API_URL}${transaction.post.imageUrl}`}
                    alt={transaction.post.content}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
                        <rect width="300" height="300" fill="%23f8f9fa"/>
                        <circle cx="150" cy="120" r="25" fill="%23dee2e6"/>
                        <rect x="120" y="160" width="60" height="50" rx="5" fill="%23dee2e6"/>
                        <text x="150" y="240" text-anchor="middle" fill="%236c757d" font-family="Arial" font-size="12">Produto Comprado</text>
                      </svg>`;
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="text-gray-400" size={48} />
                  </div>
                )}
                
                {/* Badge de status */}
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  ✅ Comprado
                </div>
              </div>

              {/* Informações da compra */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                  {transaction.post?.content || 'Item removido'}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-red-500">
                    -{transaction.amount} GIRO
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p>Vendedor: {transaction.to?.name}</p>
                  <p className="truncate">TX: {transaction.transactionHash?.substring(0, 16)}...</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openTransactionDetails(transaction)}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={16} />
                    Detalhes
                  </button>
                  
                  <a
                    href={transaction.etherscanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Detalhes da Compra</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Informações do Produto */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Package size={20} />
                  Produto Comprado
                </h4>
                <div className="flex items-start gap-4">
                  {selectedTransaction.post?.imageUrl && (
                    <img
                      src={`${API_URL}${selectedTransaction.post.imageUrl}`}
                      alt="Produto"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-medium">{selectedTransaction.post?.content || 'Item removido'}</p>
                    <p className="text-sm text-gray-600">
                      Vendido por: {selectedTransaction.to?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações da Transação */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CreditCard size={20} />
                  Dados da Transação
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Valor:</span>
                    <p className="font-bold text-red-500">{selectedTransaction.amount} GIRO</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-medium text-green-600">Confirmada</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Data da Compra:</span>
                    <p className="font-medium">{formatDate(selectedTransaction.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Informações Blockchain */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  ⛓️ Blockchain (Simulado)
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Hash da Transação:</span>
                    <p className="font-mono text-xs break-all bg-white p-2 rounded mt-1">
                      {selectedTransaction.transactionHash}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Bloco:</span>
                      <p className="font-medium">#{selectedTransaction.blockNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Gas Usado:</span>
                      <p className="font-medium">{selectedTransaction.gasUsed}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href={selectedTransaction.etherscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink size={16} />
                      Ver no Etherscan (Simulado)
                    </a>
                  </div>
                </div>
              </div>

              {/* Aviso sobre simulação */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Sobre esta transação</h4>
                <p className="text-sm text-yellow-700">
                  Esta é uma transação simulada para demonstração. Os GIRO tokens foram 
                  debitados do seu saldo na plataforma, mas a transação blockchain é fictícia. 
                  Para transações reais, seria necessário conectar sua wallet MetaMask.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyPurchases;