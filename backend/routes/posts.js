const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/posts');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
    files: 5 // máximo 5 arquivos
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas (JPEG, JPG, PNG, GIF, WebP)'));
    }
  }
});

// GET /api/posts - Buscar posts com paginação e filtros
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, tags, minValue, maxValue, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Construir filtros
    const filters = {};
    
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filters.tags = { $in: tagArray };
    }
    
    if (minValue || maxValue) {
      filters.giroValue = {};
      if (minValue) filters.giroValue.$gte = parseInt(minValue);
      if (maxValue) filters.giroValue.$lte = parseInt(maxValue);
    }
    
    // Ordenação
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const posts = await Post.find(filters)
      .populate('author', 'name profilePicture')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments(filters);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/posts/user/:userId - Buscar posts de um usuário específico
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ author: userId })
      .populate('author', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments({ author: userId });
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/posts - Criar novo post
router.post('/', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    // Validações manuais
    const { title, description, giroValue, tags, location } = req.body;
    
    if (!title || title.trim().length < 3 || title.trim().length > 100) {
      // Remover arquivos se houve erro de validação
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erro ao remover arquivo:', err);
          });
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Título deve ter entre 3 e 100 caracteres'
      });
    }
    
    if (!description || description.trim().length < 10 || description.trim().length > 1000) {
      // Remover arquivos se houve erro de validação
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erro ao remover arquivo:', err);
          });
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Descrição deve ter entre 10 e 1000 caracteres'
      });
    }
    
    const giroVal = parseInt(giroValue);
    if (!giroVal || giroVal < 1 || giroVal > 10000) {
      // Remover arquivos se houve erro de validação
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Erro ao remover arquivo:', err);
          });
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Valor deve estar entre 1 e 10000 tokens GIRO'
      });
    }
    
    // Verificar se tem pelo menos uma imagem
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pelo menos uma imagem é obrigatória'
      });
    }
    
    // Processar imagens com estrutura completa
    const imagesArray = req.files.map(file => ({
      url: `/uploads/posts/${file.filename}`,
      filename: file.filename,
      size: file.size,
      uploadedAt: new Date()
    }));
    
    // Processar tags (string para array)
    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
      } catch (error) {
        tagsArray = typeof tags === 'string' ? [tags] : [];
      }
    }
    
    // Criar o post
    const post = new Post({
      title: title.trim(),
      description: description.trim(),
      images: imagesArray,
      giroValue: giroVal,
      author: req.user.id,
      tags: tagsArray,
      location: location ? location.trim() : undefined
    });
    
    await post.save();
    
    // Popular os dados do autor
    await post.populate('author', 'name profilePicture');
    
    res.status(201).json({
      success: true,
      message: 'Post criado com sucesso',
      data: post
    });
    
  } catch (error) {
    console.error('Erro ao criar post:', error);
    
    // Remover arquivos em caso de erro
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Erro ao remover arquivo:', err);
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/posts/:id - Buscar post específico
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture giroBalance')
      .populate('comments.user', 'name profilePicture');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }
    
    // Incrementar visualizações
    post.views += 1;
    await post.save();
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/posts/:id - Atualizar post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }
    
    // Verificar se o usuário é o autor
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a editar este post'
      });
    }
    
    const { title, description, giroValue, tags, location } = req.body;
    
    // Atualizar apenas campos fornecidos
    if (title !== undefined) post.title = title.trim();
    if (description !== undefined) post.description = description.trim();
    if (giroValue !== undefined) post.giroValue = parseInt(giroValue);
    if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : [tags];
    if (location !== undefined) post.location = location.trim();
    
    await post.save();
    await post.populate('author', 'name profilePicture');
    
    res.json({
      success: true,
      message: 'Post atualizado com sucesso',
      data: post
    });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/posts/:id - Deletar post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }
    
    // Verificar se o usuário é o autor
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Não autorizado a deletar este post'
      });
    }
    
    // Remover arquivos de imagem
    post.images.forEach(imageUrl => {
      const imagePath = path.join(__dirname, '../', imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Erro ao remover arquivo:', err);
      });
    });
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Post deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/posts/:id/like - Curtir/descurtir post
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }
    
    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Descurtir
      post.likes.splice(likeIndex, 1);
    } else {
      // Curtir
      post.likes.push(userId);
      
      // Dar recompensa ao autor do post (se não for o próprio usuário)
      if (post.author.toString() !== userId) {
        const author = await User.findById(post.author);
        if (author) {
          author.giroBalance += 1; // 1 GIRO por like
          await author.save();
        }
      }
    }
    
    await post.save();
    
    res.json({
      success: true,
      message: likeIndex > -1 ? 'Post descurtido' : 'Post curtido',
      data: {
        likesCount: post.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/posts/:id/comment - Comentar em post
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comentário não pode estar vazio'
      });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post não encontrado'
      });
    }
    
    const comment = {
      user: req.user.id,
      text: text.trim(),
      createdAt: new Date()
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Popular o comentário criado
    await post.populate('comments.user', 'name profilePicture');
    const newComment = post.comments[post.comments.length - 1];
    
    // Dar recompensa ao autor do post (se não for o próprio usuário)
    if (post.author.toString() !== req.user.id) {
      const author = await User.findById(post.author);
      if (author) {
        author.giroBalance += 2; // 2 GIRO por comentário
        await author.save();
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Comentário adicionado com sucesso',
      data: newComment
    });
  } catch (error) {
    console.error('Erro ao comentar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;