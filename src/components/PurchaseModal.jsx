import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  post, 
  userBalance, 
  onPurchaseComplete 
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(10);

  const handlePurchase = async () => {
    if (userBalance < purchaseAmount) {
      alert('Saldo insuficiente!');
      return;
    }

    setIsPurchasing(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/transactions/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: post._id,
          amount: purchaseAmount
        })
      });

      if (!response.ok) {
        throw new Error('Erro na compra');
      }

      const result = await response.json();
      
      // Mostrar resultado da compra
      alert(`✅ Compra realizada!\n🔗 TX: ${result.transaction.transactionHash}\n🌐 Ver no Etherscan: ${result.etherscanUrl}`);
      
      onPurchaseComplete(result.transaction);
      onClose();

    } catch (error) {
      console.error('Erro na compra:', error);
      alert('Erro ao processar compra: ' + error.message);
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Comprar Item</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle size={24} />
          </button>
        </div>

        {post && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${post.imageUrl}`}
                alt={post.content}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-medium text-gray-800">{post.content}</p>
                <p className="text-sm text-gray-500">Por: {post.author?.name}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Seu saldo atual:</span>
                <span className="font-bold text-green-600">{userBalance} GIRO</span>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Valor da compra:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                    min="1"
                    max={userBalance}
                    className="w-20 px-2 py-1 border rounded-lg text-center"
                  />
                  <span className="text-sm font-medium">GIRO</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              💡 Esta transação será registrada na blockchain Sepolia e você poderá visualizá-la no Etherscan
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isPurchasing}
              >
                Cancelar
              </button>
              
              <button
                onClick={handlePurchase}
                disabled={isPurchasing || userBalance < purchaseAmount}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isPurchasing ? (
                  <>
                    <Clock className="animate-spin" size={18} />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Comprar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PurchaseModal;