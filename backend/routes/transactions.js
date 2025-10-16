const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Post = require('../models/Post');
const blockchainService = require('../services/BlockchainService');

// Processar compra
router.post('/purchase', authMiddleware, async (req, res) => {
  try {
    const { postId, amount } = req.body;
    const buyerId = req.user.id;

    // Verificar se o post existe
    const post = await Post.findById(postId).populate('user');
    if (!post) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Verificar se não está comprando próprio item
    if (post.user._id.toString() === buyerId) {
      return res.status(400).json({ message: 'Você não pode comprar seu próprio item' });
    }

    const sellerId = post.user._id.toString();

    // Processar compra através do blockchain service
    const transaction = await blockchainService.processPurchase(
      buyerId, 
      sellerId, 
      postId, 
      amount
    );

    // Buscar transação completa com populate
    const fullTransaction = await Transaction.findById(transaction._id)
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('post', 'content imageUrl');

    res.json({
      message: 'Compra realizada com sucesso!',
      transaction: fullTransaction,
      etherscanUrl: fullTransaction.etherscanUrl
    });

  } catch (error) {
    console.error('Erro na compra:', error);
    res.status(500).json({ 
      message: error.message || 'Erro interno do servidor' 
    });
  }
});

// Listar transações do usuário
router.get('/my-transactions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }]
    })
    .populate('from', 'name email')
    .populate('to', 'name email') 
    .populate('post', 'content imageUrl')
    .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar transação específica
router.get('/transaction/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('post', 'content imageUrl');

    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    // Verificar se o usuário tem acesso a esta transação
    const userId = req.user.id;
    if (transaction.from._id.toString() !== userId && transaction.to._id.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Verificar saldo de tokens
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      balance: user.giroBalance,
      address: user.walletAddress || null
    });
  } catch (error) {
    console.error('Erro ao verificar saldo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Histórico completo de transações (admin)
router.get('/all-transactions', authMiddleware, async (req, res) => {
  try {
    // Verificar se é admin (opcional)
    const transactions = await Transaction.find({})
      .populate('from', 'name email')
      .populate('to', 'name email')
      .populate('post', 'content imageUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar todas as transações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;