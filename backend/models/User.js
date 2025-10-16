const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ethers } = require('ethers');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Dados básicos do usuário
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  
  password: {
    type: String,
    required: function() { return !this.googleId; }, // Senha obrigatória apenas se não for login Google
    minlength: 6
  },
  
  // OAuth
  googleId: {
    type: String,
    sparse: true // Permite múltiplos valores null
  },
  
  profilePicture: {
    type: String,
    default: null
  },
  
  // Carteira blockchain automática
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  
  encryptedPrivateKey: {
    type: String,
    required: true
  },
  
  // Saldos e estatísticas
  giroBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  
  totalRewardsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  
  totalGiroSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Atividades para desconto
  activityCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  discountTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  
  // Configurações
  isActive: {
    type: Boolean,
    default: true
  },
  
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: null
  },
  
  lastBlockchainSync: {
    type: Date,
    default: Date.now
  },
  
  // Campos para sistema de recompensas
  receivedWelcomeBonus: {
    type: Boolean,
    default: false
  },
  
  lastDailyReward: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.encryptedPrivateKey;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes para performance
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ googleId: 1 });

// Middleware para hash da senha
userSchema.pre('save', async function(next) {
  // Se a senha não foi modificada, pula o hash
  if (!this.isModified('password')) return next();
  
  try {
    // Hash da senha
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para verificar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para criar carteira automática
userSchema.methods.createWallet = function() {
  try {
    // Gera carteira aleatória
    const wallet = ethers.Wallet.createRandom();
    
    // Criptografa a chave privada
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32';
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encrypted = cipher.update(wallet.privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    this.walletAddress = wallet.address;
    this.encryptedPrivateKey = encrypted;
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey // Retorna apenas para log inicial, não salva
    };
  } catch (error) {
    throw new Error('Erro ao criar carteira: ' + error.message);
  }
};

// Método para descriptografar chave privada (uso interno)
userSchema.methods.getDecryptedPrivateKey = function() {
  try {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32';
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(this.encryptedPrivateKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Erro ao descriptografar chave privada');
  }
};

// Método para atualizar tier de desconto
userSchema.methods.updateDiscountTier = function() {
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
};

// Método para calcular desconto baseado na atividade
userSchema.methods.getDiscountPercentage = function() {
  const discounts = {
    bronze: 0,
    silver: 10,
    gold: 25,
    platinum: 50
  };
  
  return discounts[this.discountTier] || 0;
};

// Static method para criar usuário com carteira
userSchema.statics.createWithWallet = async function(userData) {
  const user = new this(userData);
  user.createWallet();
  await user.save();
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;