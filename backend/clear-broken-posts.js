// Script para limpar posts com imagens quebradas
// Execute no terminal: node clear-broken-posts.js

require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

async function clearBrokenPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Conectado ao MongoDB');
    
    // Deletar posts que têm imagens (que estarão quebradas no Railway)
    const result = await Post.deleteMany({
      images: { $exists: true, $ne: [] }
    });
    
    console.log(`🗑️ ${result.deletedCount} posts com imagens removidos`);
    
    // Contar posts restantes
    const remaining = await Post.countDocuments();
    console.log(`📊 ${remaining} posts restantes no banco`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
  }
}

clearBrokenPosts();