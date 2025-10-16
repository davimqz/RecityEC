const express = require('express');
const { ethers } = require('ethers');
const { authMiddleware } = require('../middleware/auth');

// Tenta usar MongoDB, fallback para sistema em memória
let User;
try {
  User = require('../models/User');
} catch (error) {
  User = require('../models/MemoryUser');
}

const router = express.Router();

// Configuração do provider blockchain
const getProvider = () => {
  const infuraUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
  return new ethers.JsonRpcProvider(infuraUrl);
};

// ABI do contrato GIRO (funções de recompensa)
const GIRO_ABI = [
  "function grantReward(address user, uint8 actionType, uint256 amount)",
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)"
];

// Tipos de ação para recompensas
const ACTION_TYPES = {
  SELL_ITEM: 0,
  BUY_ITEM: 1,
  RECYCLE: 2,
  REFERRAL: 3,
  REVIEW: 4,
  SOCIAL_SHARE: 5,
  ECO_CHALLENGE: 6
};

// Valores padrão de recompensa por ação
const REWARD_AMOUNTS = {
  [ACTION_TYPES.SELL_ITEM]: 50,
  [ACTION_TYPES.BUY_ITEM]: 10,
  [ACTION_TYPES.RECYCLE]: 25,
  [ACTION_TYPES.REFERRAL]: 100,
  [ACTION_TYPES.REVIEW]: 15,
  [ACTION_TYPES.SOCIAL_SHARE]: 5,
  [ACTION_TYPES.ECO_CHALLENGE]: 75
};

// POST /api/rewards/grant
router.post('/grant', authMiddleware, async (req, res) => {
  try {
    const { actionType, customAmount, description } = req.body;

    if (actionType === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de ação é obrigatório'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Determina valor da recompensa
    const rewardAmount = customAmount || REWARD_AMOUNTS[actionType] || 10;

    try {
      // Configura blockchain (usando wallet administrativo)
      const provider = getProvider();
      const adminPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
      
      if (!adminPrivateKey) {
        throw new Error('Chave privada administrativa não configurada');
      }

      const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
      
      // Cria instância do contrato
      const contract = new ethers.Contract(
        process.env.GIRO_CONTRACT_ADDRESS,
        GIRO_ABI,
        adminWallet
      );

      // Executa concessão de recompensa
      const amountWei = ethers.parseEther(rewardAmount.toString());
      const tx = await contract.grantReward(
        user.walletAddress,
        actionType,
        amountWei
      );
      
      console.log('🎁 Recompensa concedida:', {
        user: user.email,
        wallet: user.walletAddress,
        actionType: actionType,
        amount: rewardAmount,
        txHash: tx.hash
      });

      // Aguarda confirmação
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Atualiza dados locais
        user.giroBalance += rewardAmount;
        user.totalRewardsEarned += rewardAmount;
        user.activityCount += 1;
        
        // Atualiza tier de desconto
        user.updateDiscountTier();
        
        await user.save();

        console.log('✅ Recompensa confirmada:', {
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          newBalance: user.giroBalance,
          newTier: user.discountTier
        });

        res.json({
          success: true,
          message: 'Recompensa concedida com sucesso',
          reward: {
            amount: rewardAmount,
            actionType: actionType,
            description: description || getActionDescription(actionType),
            transaction: {
              hash: receipt.hash,
              blockNumber: receipt.blockNumber
            },
            userStats: {
              newBalance: user.giroBalance,
              totalRewards: user.totalRewardsEarned,
              activityCount: user.activityCount,
              discountTier: user.discountTier,
              discountPercentage: user.getDiscountPercentage()
            }
          }
        });
      } else {
        throw new Error('Transação falhou');
      }

    } catch (blockchainError) {
      console.error('❌ Erro na concessão de recompensa:', blockchainError);
      res.status(500).json({
        success: false,
        message: 'Erro na concessão de recompensa: ' + blockchainError.message
      });
    }

  } catch (error) {
    console.error('❌ Erro ao conceder recompensa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/rewards/actions
router.get('/actions', (req, res) => {
  const actions = [
    {
      type: ACTION_TYPES.SELL_ITEM,
      name: 'Vender Item',
      description: 'Recompensa por vender um item na plataforma',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.SELL_ITEM],
      icon: '🛍️'
    },
    {
      type: ACTION_TYPES.BUY_ITEM,
      name: 'Comprar Item',
      description: 'Recompensa por comprar um item sustentável',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.BUY_ITEM],
      icon: '🛒'
    },
    {
      type: ACTION_TYPES.RECYCLE,
      name: 'Reciclar',
      description: 'Recompensa por ação de reciclagem',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.RECYCLE],
      icon: '♻️'
    },
    {
      type: ACTION_TYPES.REFERRAL,
      name: 'Indicação',
      description: 'Recompensa por indicar novos usuários',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.REFERRAL],
      icon: '👥'
    },
    {
      type: ACTION_TYPES.REVIEW,
      name: 'Avaliação',
      description: 'Recompensa por avaliar produtos/vendedores',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.REVIEW],
      icon: '⭐'
    },
    {
      type: ACTION_TYPES.SOCIAL_SHARE,
      name: 'Compartilhamento',
      description: 'Recompensa por compartilhar nas redes sociais',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.SOCIAL_SHARE],
      icon: '📱'
    },
    {
      type: ACTION_TYPES.ECO_CHALLENGE,
      name: 'Desafio Ecológico',
      description: 'Recompensa por completar desafios sustentáveis',
      defaultReward: REWARD_AMOUNTS[ACTION_TYPES.ECO_CHALLENGE],
      icon: '🌱'
    }
  ];

  res.json({
    success: true,
    actions: actions
  });
});

// GET /api/rewards/history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Mock data - implementar histórico real posteriormente
    const mockHistory = [
      {
        id: '1',
        actionType: ACTION_TYPES.SELL_ITEM,
        actionName: 'Vender Item',
        amount: 50,
        description: 'Venda de camiseta vintage',
        date: new Date(Date.now() - 86400000),
        status: 'confirmed',
        txHash: '0x123...'
      },
      {
        id: '2',
        actionType: ACTION_TYPES.REVIEW,
        actionName: 'Avaliação',
        amount: 15,
        description: 'Avaliação de compra',
        date: new Date(Date.now() - 172800000),
        status: 'confirmed',
        txHash: '0x456...'
      }
    ];

    res.json({
      success: true,
      history: mockHistory,
      stats: {
        totalRewardsEarned: user.totalRewardsEarned,
        activityCount: user.activityCount,
        discountTier: user.discountTier,
        discountPercentage: user.getDiscountPercentage()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Função auxiliar para obter descrição da ação
function getActionDescription(actionType) {
  const descriptions = {
    [ACTION_TYPES.SELL_ITEM]: 'Recompensa por venda sustentável',
    [ACTION_TYPES.BUY_ITEM]: 'Recompensa por compra consciente',
    [ACTION_TYPES.RECYCLE]: 'Recompensa por reciclagem',
    [ACTION_TYPES.REFERRAL]: 'Recompensa por indicação',
    [ACTION_TYPES.REVIEW]: 'Recompensa por avaliação',
    [ACTION_TYPES.SOCIAL_SHARE]: 'Recompensa por compartilhamento',
    [ACTION_TYPES.ECO_CHALLENGE]: 'Recompensa por desafio ecológico'
  };
  
  return descriptions[actionType] || 'Recompensa GIRO';
}

// === NOVAS ROTAS DE RECOMPENSA SIMPLES ===

// Recompensa por login diário
router.post('/daily-login', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Verificar se já recebeu hoje
    const today = new Date().toDateString();
    const lastLogin = user.lastDailyReward ? new Date(user.lastDailyReward).toDateString() : null;
    
    if (lastLogin === today) {
      return res.status(400).json({ 
        message: 'Você já recebeu sua recompensa diária hoje!' 
      });
    }
    
    const rewardAmount = 100; // 100 GIRO por dia
    
    // Atualizar saldo
    user.giroBalance += rewardAmount;
    user.lastDailyReward = new Date();
    await user.save();
    
    res.json({
      message: `Parabéns! Você recebeu ${rewardAmount} GIRO tokens!`,
      reward: rewardAmount,
      newBalance: user.giroBalance
    });
    
  } catch (error) {
    console.error('Erro na recompensa diária:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Saldo inicial para novos usuários
router.post('/welcome-bonus', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // Verificar se já recebeu bônus
    if (user.receivedWelcomeBonus) {
      return res.status(400).json({ 
        message: 'Você já recebeu seu bônus de boas-vindas!' 
      });
    }
    
    const bonusAmount = 1000; // 1000 GIRO de bônus inicial
    
    user.giroBalance += bonusAmount;
    user.receivedWelcomeBonus = true;
    await user.save();
    
    res.json({
      message: `Bem-vindo! Você recebeu ${bonusAmount} GIRO tokens!`,
      reward: bonusAmount,
      newBalance: user.giroBalance
    });
    
  } catch (error) {
    console.error('Erro no bônus de boas-vindas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Admin: Adicionar tokens para qualquer usuário
router.post('/add-tokens', authMiddleware, async (req, res) => {
  try {
    const { targetUserId, amount, reason } = req.body;
    
    // Se não especificar usuário, adicionar para o próprio usuário logado
    const userId = targetUserId || req.user.id;
    const tokenAmount = amount || 500;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    user.giroBalance += tokenAmount;
    await user.save();
    
    res.json({
      message: `${tokenAmount} GIRO tokens adicionados!`,
      newBalance: user.giroBalance,
      reason: reason || 'Tokens adicionados'
    });
    
  } catch (error) {
    console.error('Erro ao adicionar tokens:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;