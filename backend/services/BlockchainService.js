const { ethers } = require('ethers');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

class BlockchainService {
  constructor() {
    // Configurar provider (Sepolia testnet)
    this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
    
    // Contract address e ABI
    this.contractAddress = process.env.GIRO_CONTRACT_ADDRESS;
    this.contractABI = [
      // Transfer function
      "function transfer(address to, uint256 amount) public returns (bool)",
      // Balance function  
      "function balanceOf(address account) public view returns (uint256)",
      // Approve function
      "function approve(address spender, uint256 amount) public returns (bool)",
      // TransferFrom function
      "function transferFrom(address from, address to, uint256 amount) public returns (bool)",
      // Events
      "event Transfer(address indexed from, address indexed to, uint256 value)"
    ];
    
    // Wallet da plataforma (para fazer transações)
    this.platformWallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.platformWallet);
  }

  /**
   * Transferir GIRO tokens entre usuários
   */
  async transferTokens(fromAddress, toAddress, amount) {
    try {
      console.log(`🔄 Transferindo ${amount} GIRO de ${fromAddress} para ${toAddress}`);
      
      // Converter para Wei (18 decimais)
      const amountWei = ethers.parseEther(amount.toString());
      
      // Executar transferência
      const tx = await this.contract.transfer(toAddress, amountWei);
      
      console.log(`📤 Transação enviada: ${tx.hash}`);
      
      // Aguardar confirmação
      const receipt = await tx.wait();
      
      console.log(`✅ Transação confirmada no bloco: ${receipt.blockNumber}`);
      
      return {
        hash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        success: true
      };
      
    } catch (error) {
      console.error('❌ Erro na transação blockchain:', error);
      throw error;
    }
  }

  /**
   * Verificar saldo de tokens
   */
  async getBalance(address) {
    try {
      const balance = await this.contract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Erro ao verificar saldo:', error);
      return '0';
    }
  }

  /**
   * Processar compra de item
   */
  async processPurchase(buyerId, sellerId, postId, amount) {
    try {
      console.log('💰 DEBUG - processPurchase chamado:', {
        buyerId, sellerId, postId, amount, amountType: typeof amount
      });

      // Garantir que amount é um número
      const purchaseAmount = Number(amount);
      
      if (purchaseAmount <= 0) {
        throw new Error('Valor da compra deve ser maior que zero');
      }

      // Buscar usuários
      const buyer = await User.findById(buyerId);
      const seller = await User.findById(sellerId);
      
      if (!buyer || !seller) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar saldo do comprador
      if (buyer.giroBalance < purchaseAmount) {
        throw new Error('Saldo insuficiente');
      }

      // Criar transação no banco
      const transaction = new Transaction({
        from: buyerId,
        to: sellerId,
        post: postId,
        amount: purchaseAmount,
        type: 'purchase',
        description: `Compra de item por ${purchaseAmount} GIRO`
      });

      await transaction.save();

      // Simular transação blockchain (para demo)
      // Em produção, usaria endereços de carteira reais
      const mockTxHash = this.generateMockTxHash();
      
      // Atualizar saldos no banco
      buyer.giroBalance -= purchaseAmount;
      seller.giroBalance += purchaseAmount;
      
      await buyer.save();
      await seller.save();

      // Atualizar transação com dados "blockchain"
      transaction.transactionHash = mockTxHash;
      transaction.blockNumber = Math.floor(Math.random() * 1000000) + 5000000;
      transaction.gasUsed = (Math.random() * 50000 + 21000).toFixed(0);
      transaction.status = 'completed';
      
      await transaction.save();
      
      console.log(`✅ Compra processada: ${purchaseAmount} GIRO transferidos`);
      console.log(`🔗 TX Hash: ${mockTxHash}`);
      
      return transaction;
      
    } catch (error) {
      console.error('❌ Erro ao processar compra:', error);
      throw error;
    }
  }

  /**
   * Gerar hash de transação simulada (para demo)
   */
  generateMockTxHash() {
    // Gerar 64 caracteres hexadecimais aleatórios (hash blockchain real)
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Verificar status de transação
   */
  async getTransactionStatus(txHash) {
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      return {
        hash: txHash,
        status: receipt ? 'confirmed' : 'pending',
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString()
      };
    } catch (error) {
      console.error('Erro ao verificar transação:', error);
      return { hash: txHash, status: 'error' };
    }
  }
}

module.exports = new BlockchainService();