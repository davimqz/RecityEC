require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallet');
const rewardsRoutes = require('./routes/rewards');
const postsRoutes = require('./routes/posts');
const transactionRoutes = require('./routes/transactions');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:", "http://localhost:3001"],
    },
  },
}));

// Rate limiting (DESABILITADO PARA TESTES)
// const limiter = rateLimit({
//   windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
//   max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://recity-ec.vercel.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('📦 MongoDB conectado com sucesso');
  console.log('🔗 Database:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//****@'));
})
.catch((err) => {
  console.error('❌ Erro na conexão MongoDB:', err.message);
  console.log('💡 Verifique sua MONGODB_URI no arquivo .env');
  console.log('💡 Para MongoDB Atlas: mongodb+srv://usuario:senha@cluster.mongodb.net/database');
  console.log('💡 Para MongoDB local: mongodb://localhost:27017/giro_platform');
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/transactions', transactionRoutes);

// Servir arquivos estáticos (uploads)
// Garantir que o diretório de uploads existe
const uploadsDir = path.join(__dirname, 'uploads');
const postsDir = path.join(uploadsDir, 'posts');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Diretório uploads criado');
}

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
  console.log('📁 Diretório uploads/posts criado');
}

app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path, stat) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Debug endpoint para listar arquivos
app.get('/api/debug/uploads', (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, 'uploads', 'posts');
    const files = fs.existsSync(uploadsPath) ? fs.readdirSync(uploadsPath) : [];
    res.json({
      uploadsPath,
      exists: fs.existsSync(uploadsPath),
      files: files,
      totalFiles: files.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint para deletar posts (CUIDADO - só para debug!)
app.delete('/api/debug/posts/:id', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const { id } = req.params;
    
    if (id === 'all') {
      // Deletar TODOS os posts
      const result = await Post.deleteMany({});
      res.json({ 
        message: 'Todos os posts deletados', 
        deletedCount: result.deletedCount 
      });
    } else {
      // Deletar post específico
      const result = await Post.findByIdAndDelete(id);
      if (result) {
        res.json({ message: 'Post deletado com sucesso', post: result });
      } else {
        res.status(404).json({ error: 'Post não encontrado' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint para listar todos os posts
app.get('/api/debug/posts', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const posts = await Post.find({}).populate('author', 'name email');
    res.json({
      totalPosts: posts.length,
      posts: posts.map(post => ({
        id: post._id,
        title: post.title,
        author: post.author?.name || 'Unknown',
        createdAt: post.createdAt,
        giroValue: post.giroValue
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 GIRO Contract: ${process.env.GIRO_CONTRACT_ADDRESS || 'Not configured'}`);
});