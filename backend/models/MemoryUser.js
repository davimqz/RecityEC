// Sistema temporário de usuários em memória (para desenvolvimento)
// Substitua por MongoDB em produção

let users = [];
let nextId = 1;

class MemoryUser {
  constructor(userData) {
    this._id = nextId++;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password; // Será hasheado
    this.walletAddress = '';
    this.encryptedPrivateKey = '';
    this.giroBalance = 0;
    this.totalRewardsEarned = 0;
    this.totalGiroSpent = 0;
    this.activityCount = 0;
    this.discountTier = 'bronze';
    this.isActive = true;
    this.emailVerified = false;
    this.lastLogin = null;
    this.lastBlockchainSync = new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Simula método save()
  async save() {
    this.updatedAt = new Date();
    const existingIndex = users.findIndex(u => u._id === this._id);
    if (existingIndex >= 0) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    return this;
  }

  // Método para comparar senha (simplificado para desenvolvimento)
  async comparePassword(candidatePassword) {
    // Em desenvolvimento, comparação simples
    // Em produção, usar bcrypt
    return this.password === candidatePassword;
  }

  // Método para criar carteira (simplificado)
  createWallet() {
    const { ethers } = require('ethers');
    const crypto = require('crypto');
    
    try {
      const wallet = ethers.Wallet.createRandom();
      const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32';
      
      // Usar createCipheriv ao invés de createCipher (depreciado)
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(encryptionKey, 'salt', 32), iv);
      let encrypted = cipher.update(wallet.privateKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      this.walletAddress = wallet.address;
      this.encryptedPrivateKey = iv.toString('hex') + ':' + encrypted;
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error) {
      console.error('❌ Erro ao criar carteira:', error);
      throw new Error('Erro ao criar carteira: ' + error.message);
    }
  }

  // Método para descriptografar chave privada
  getDecryptedPrivateKey() {
    const crypto = require('crypto');
    try {
      const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32';
      const [ivHex, encrypted] = this.encryptedPrivateKey.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(encryptionKey, 'salt', 32), iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('❌ Erro ao descriptografar chave privada:', error);
      throw new Error('Erro ao descriptografar chave privada');
    }
  }

  // Método para atualizar tier de desconto
  updateDiscountTier() {
    const count = this.activityCount;
    if (count >= 100) {
      this.discountTier = 'platinum';
    } else if (count >= 50) {
      this.discountTier = 'gold';
    } else if (count >= 20) {
      this.discountTier = 'silver';
    } else {
      this.discountTier = 'bronze';
    }
  }

  // Método para calcular desconto
  getDiscountPercentage() {
    const discounts = {
      bronze: 0,
      silver: 10,
      gold: 25,
      platinum: 50
    };
    return discounts[this.discountTier] || 0;
  }

  // Remove campos sensíveis para JSON
  toJSON() {
    const obj = { ...this };
    delete obj.password;
    delete obj.encryptedPrivateKey;
    return obj;
  }
}

// Métodos estáticos simulando Mongoose
MemoryUser.findOne = async function(query) {
  return users.find(user => {
    if (query.email) return user.email === query.email;
    if (query._id) return user._id === query._id;
    return false;
  });
};

MemoryUser.findById = async function(id) {
  return users.find(user => user._id == id);
};

MemoryUser.createWithWallet = async function(userData) {
  console.log('🔧 Criando usuário com carteira:', userData);
  try {
    const user = new MemoryUser(userData);
    console.log('✅ Usuário criado em memória');
    
    user.createWallet();
    console.log('✅ Carteira criada');
    
    await user.save();
    console.log('✅ Usuário salvo');
    
    return user;
  } catch (error) {
    console.error('❌ Erro em createWithWallet:', error);
    throw error;
  }
};

module.exports = MemoryUser;