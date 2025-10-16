import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Heart, MessageCircle, Eye, Plus, Grid, Award, Coins, Home, Shirt, MessageSquare } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { API_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        const posts = Array.isArray(responseData.data) ? responseData.data : [];
        setUserPosts(posts);
        
        // Calcular estatísticas com valores padrão
        const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
        const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
        
        setStats({
          totalPosts: posts.length,
          totalLikes,
          totalViews
        });
      } else {
        setUserPosts([]);
        setStats({
          totalPosts: 0,
          totalLikes: 0,
          totalViews: 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setUserPosts([]);
      setStats({
        totalPosts: 0,
        totalLikes: 0,
        totalViews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'text-orange-600 bg-orange-100',
      silver: 'text-gray-600 bg-gray-100',
      gold: 'text-yellow-600 bg-yellow-100',
      platinum: 'text-purple-600 bg-purple-100'
    };
    return colors[tier] || colors.bronze;
  };

  const getTierIcon = (tier) => {
    if (tier === 'platinum') return '💎';
    if (tier === 'gold') return '🏆';
    if (tier === 'silver') return '🥈';
    return '🥉';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header do Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-sage" />
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-sage text-white p-2 rounded-full hover:bg-sage/80 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            {/* Informações do usuário */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-charcoal mb-2">{user.name}</h1>
              <p className="text-charcoal/60 mb-4">{user.email}</p>
              
              {/* Tier do usuário */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(user.discountTier)}`}>
                  {getTierIcon(user.discountTier)} {user.discountTier.toUpperCase()}
                </span>
                <div className="flex items-center gap-1 bg-sage/10 px-3 py-1 rounded-full">
                  <Coins size={16} className="text-sage" />
                  <span className="text-sage font-medium">{user.giroBalance} GIRO</span>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="flex gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-xl font-bold text-charcoal">{stats.totalPosts}</div>
                  <div className="text-sm text-charcoal/60">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-charcoal">{stats.totalLikes}</div>
                  <div className="text-sm text-charcoal/60">Curtidas</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-charcoal">{stats.totalViews}</div>
                  <div className="text-sm text-charcoal/60">Visualizações</div>
                </div>
              </div>
            </div>

            {/* Botão Criar Post */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-sage text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-sage/80 transition-colors"
              onClick={() => window.location.href = '/create-post'}
            >
              <Plus size={20} />
              <span className="font-medium">Criar Post</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Grid de Posts */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Grid size={20} className="text-charcoal" />
            <h2 className="text-xl font-bold text-charcoal">Meus Posts</h2>
          </div>

          {!userPosts || userPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-charcoal/40 mb-4">
                <Camera size={48} className="mx-auto mb-2" />
                <p>Você ainda não criou nenhum post</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-sage text-white px-6 py-3 rounded-xl inline-flex items-center gap-2"
                onClick={() => window.location.href = '/create-post'}
              >
                <Plus size={20} />
                Criar Primeiro Post
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(userPosts || []).map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Imagem do post */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={`${API_URL}${post.images[0]?.url}`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        +{post.images.length - 1}
                      </div>
                    )}
                    
                    {/* Status badge */}
                    {post.status === 'sold' && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        VENDIDO
                      </div>
                    )}
                  </div>

                  {/* Informações do post */}
                  <div className="p-4">
                    <h3 className="font-semibold text-charcoal truncate mb-1">{post.title}</h3>
                    <p className="text-sage font-bold text-lg mb-2">{post.giroValue} GIRO</p>
                    
                    {/* Estatísticas */}
                    <div className="flex items-center gap-4 text-sm text-charcoal/60">
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{post.likesCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{post.commentsCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualização de post */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{selectedPost.title}</h3>
              <p className="text-charcoal/70 mb-4">{selectedPost.description}</p>
              <div className="text-sage font-bold text-2xl mb-4">
                {selectedPost.giroValue} GIRO
              </div>
              
              {/* Imagens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPost.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${API_URL}${image.url}`}
                    alt={`${selectedPost.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Navigation para Mobile */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
          <div className="grid grid-cols-4 py-2">
            <button 
              onClick={() => navigate('/feed')}
              className="flex flex-col items-center py-2 text-black"
            >
              <Home size={20} className="text-black" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center py-2 text-emerald-500"
            >
              <Shirt size={20} className="text-emerald-500" />
              <span className="text-xs mt-1">Meus Itens</span>
            </button>
            <button 
              onClick={() => {}}
              className="flex flex-col items-center py-2 text-black"
            >
              <MessageSquare size={20} className="text-black" />
              <span className="text-xs mt-1">Conversas</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center py-2 text-black"
            >
              <User size={20} className="text-black" />
              <span className="text-xs mt-1">Perfil</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;