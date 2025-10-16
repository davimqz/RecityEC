const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Dados da transação
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  
  type: {
    type: String,
    enum: ['purchase', 'reward', 'transfer'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Blockchain data
  transactionHash: {
    type: String,
    sparse: true // Permite múltiplos valores null
  },
  
  blockNumber: {
    type: Number,
    sparse: true
  },
  
  gasUsed: {
    type: String,
    sparse: true
  },
  
  // Metadata
  description: {
    type: String,
    maxlength: 500
  },
  
  metadata: {
    type: mongoose.Schema.Types.Mixed // Para dados adicionais
  }
}, {
  timestamps: true
});

// Índices
transactionSchema.index({ from: 1, createdAt: -1 });
transactionSchema.index({ to: 1, createdAt: -1 });
transactionSchema.index({ transactionHash: 1 }, { unique: true, sparse: true });
transactionSchema.index({ status: 1 });

// Virtual para URL do Etherscan
transactionSchema.virtual('etherscanUrl').get(function() {
  if (this.transactionHash) {
    return `https://sepolia.etherscan.io/tx/${this.transactionHash}`;
  }
  return null;
});

// Método para converter para JSON
transactionSchema.methods.toJSON = function() {
  const transaction = this.toObject();
  transaction.etherscanUrl = this.etherscanUrl;
  return transaction;
};

module.exports = mongoose.model('Transaction', transactionSchema);