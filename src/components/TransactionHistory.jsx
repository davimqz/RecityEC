import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/transactions/my-transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getTransactionIcon = (transaction, currentUserId) => {
    if (transaction.from._id === currentUserId) {
      return <ArrowUpRight className="text-red-500" size={20} />;
    } else {
      return <ArrowDownRight className="text-green-500" size={20} />;
    }
  };

  const getTransactionDescription = (transaction, currentUserId) => {
    if (transaction.from._id === currentUserId) {
      return `Compra realizada para ${transaction.to.name}`;
    } else {
      return `Venda recebida de ${transaction.from.name}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Histórico de Transações</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction, localStorage.getItem('userId'))}
                  
                  <div>
                    <p className="font-medium text-gray-800">
                      {getTransactionDescription(transaction, localStorage.getItem('userId'))}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.post?.content || transaction.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-lg">
                      {transaction.from._id === localStorage.getItem('userId') ? '-' : '+'}
                      {transaction.amount} GIRO
                    </span>
                    <CheckCircle className="text-green-500" size={16} />
                  </div>
                  
                  {transaction.transactionHash && (
                    <a
                      href={transaction.etherscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <span>Ver no Etherscan</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-1">
                    TX: {transaction.transactionHash?.substring(0, 10)}...
                  </p>
                </div>
              </div>

              {transaction.post?.imageUrl && (
                <div className="mt-3 flex items-center space-x-2">
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${transaction.post.imageUrl}`}
                    alt="Item"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="text-sm text-gray-600">
                    Item: {transaction.post.content}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Bloco:</span>
                    <br />
                    #{transaction.blockNumber}
                  </div>
                  <div>
                    <span className="font-medium">Gas Usado:</span>
                    <br />
                    {transaction.gasUsed}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <br />
                    <span className="text-green-600 font-medium">Confirmada</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;