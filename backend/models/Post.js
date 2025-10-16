const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Dados do post
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  
  // Valor estimado em tokens GIRO
  giroValue: {
    type: Number,
    required: true,
    min: 1,
    max: 10000
  },
  
  // Imagens do item (até 5)
  images: [{
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Autor do post
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Estatísticas de engajamento
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Métricas
  views: {
    type: Number,
    default: 0
  },
  
  // Status do post
  status: {
    type: String,
    enum: ['active', 'sold', 'archived', 'reported'],
    default: 'active'
  },
  
  // Tags para categorização
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Localização (opcional)
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Brazil'
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

// Middleware para atualizar updatedAt
postSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Métodos virtuais
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Método para verificar se usuário curtiu
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Método para curtir/descurtir
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => 
    like.user.toString() === userId.toString()
  );
  
  if (likeIndex > -1) {
    // Remover like
    this.likes.splice(likeIndex, 1);
    return false; // Não curtido
  } else {
    // Adicionar like
    this.likes.push({ user: userId });
    return true; // Curtido
  }
};

// Método para adicionar comentário
postSchema.methods.addComment = function(userId, text) {
  this.comments.push({
    user: userId,
    text: text
  });
  return this.comments[this.comments.length - 1];
};

// Método para remover campos sensíveis no JSON
postSchema.methods.toJSON = function() {
  const post = this.toObject();
  
  // Adicionar contadores virtuais
  post.likesCount = this.likesCount;
  post.commentsCount = this.commentsCount;
  
  return post;
};

module.exports = mongoose.model('Post', postSchema);