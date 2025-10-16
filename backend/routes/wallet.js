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

// ABI do contrato GIRO (apenas as funções necessárias)
const GIRO_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

// GET /api/wallet/balance
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Busca saldo na blockchain
    let blockchainBalance = 0;
    try {
      const provider = getProvider();
      const contract = new ethers.Contract(
        process.env.GIRO_CONTRACT_ADDRESS,
        GIRO_ABI,
        provider
      );

      const balance = await contract.balanceOf(user.walletAddress);
      blockchainBalance = parseFloat(ethers.formatEther(balance));

      // Atualiza saldo no banco se diferente
      if (Math.abs(user.giroBalance - blockchainBalance) > 0.001) {
        user.giroBalance = blockchainBalance;
        user.lastBlockchainSync = new Date();
        await user.save();
      }
    } catch (blockchainError) {
      console.error('⚠️ Erro ao consultar blockchain:', blockchainError.message);
      // Usa saldo do banco como fallback
      blockchainBalance = user.giroBalance;
    }

    res.json({
      success: true,
      balance: {
        giro: blockchainBalance,
        walletAddress: user.walletAddress,
        discountTier: user.discountTier,
        discountPercentage: user.getDiscountPercentage(),
        lastSync: user.lastBlockchainSync
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar saldo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/wallet/transfer
router.post('/transfer', authMiddleware, async (req, res) => {
  try {
    const { toAddress, amount, description } = req.body;

    if (!toAddress || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Endereço e valor são obrigatórios'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verifica se tem saldo suficiente
    if (user.giroBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Saldo insuficiente'
      });
    }

    try {
      // Configura provider e wallet
      const provider = getProvider();
      const privateKey = user.getDecryptedPrivateKey();
      const wallet = new ethers.Wallet(privateKey, provider);
      
      // Cria instância do contrato
      const contract = new ethers.Contract(
        process.env.GIRO_CONTRACT_ADDRESS,
        GIRO_ABI,
        wallet
      );

      // Executa transferência
      const amountWei = ethers.parseEther(amount.toString());
      const tx = await contract.transfer(toAddress, amountWei);
      
      console.log('📤 Transferência iniciada:', {
        from: user.walletAddress,
        to: toAddress,
        amount: amount,
        txHash: tx.hash
      });

      // Aguarda confirmação
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Atualiza saldo local
        user.giroBalance -= amount;
        user.totalGiroSpent += amount;
        await user.save();

        console.log('✅ Transferência confirmada:', {
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber
        });

        res.json({
          success: true,
          message: 'Transferência realizada com sucesso',
          transaction: {
            hash: receipt.hash,
            blockNumber: receipt.blockNumber,
            from: user.walletAddress,
            to: toAddress,
            amount: amount,
            description: description || 'Transferência GIRO'
          }
        });
      } else {
        throw new Error('Transação falhou');
      }

    } catch (blockchainError) {
      console.error('❌ Erro na transferência blockchain:', blockchainError);
      res.status(500).json({
        success: false,
        message: 'Erro na transferência: ' + blockchainError.message
      });
    }

  } catch (error) {
    console.error('❌ Erro na transferência:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/wallet/transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Por enquanto retorna mock - implementar histórico real posteriormente
    const mockTransactions = [
      {
        id: '1',
        type: 'reward',
        amount: 50,
        description: 'Recompensa por venda sustentável',
        date: new Date(Date.now() - 86400000),
        status: 'confirmed'
      },
      {
        id: '2',
        type: 'transfer',
        amount: -25,
        description: 'Pagamento com desconto',
        date: new Date(Date.now() - 172800000),
        status: 'confirmed'
      }
    ];

    res.json({
      success: true,
      transactions: mockTransactions,
      pagination: {
        page: 1,
        limit: 10,
        total: mockTransactions.length
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar transações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;