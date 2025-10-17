import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, User, Coins, MoreHorizontal, Award, Plus, Home, Shirt, MessageSquare, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import PurchaseModal from './PurchaseModal';

const Feed = () => {
  const { user, updateUserBalance, fetchUserBalance } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${API_URL}/api/posts?page=${pageNum}&limit=12`);
      const data = await response.json();

      if (data.success) {
        if (reset || pageNum === 1) {
          setPosts(data.data);
        } else {
          setPosts(prev => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.hasNextPage);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Effect separado para buscar saldo (só uma vez quando user mudar)
  useEffect(() => {
    if (user && fetchUserBalance) {
      fetchUserBalance();
    }
  }, [user?._id]); // Só roda quando o user ID mudar

  const handleLike = async (postId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prev => prev.map(post => {
          if (post._id === postId) {
            const isLiked = post.likes.includes(user._id);
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter(id => id !== user._id)
                : [...post.likes, user._id]
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchPosts(page + 1);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handlePurchaseClick = (post) => {
    if (!user) {
      alert('Faça login para comprar!');
      return;
    }
    
    // DEBUG: Vamos ver os dados completos
    console.log('🔍 DEBUG - Dados completos:', {
      post: post,
      postAuthor: post.author,
      currentUser: user,
      postAuthorId: post.author?._id,
      currentUserId: user._id,
      postAuthorIdString: post.author?._id?.toString(),
      currentUserIdString: user._id?.toString(),
      areEqual: post.author?._id?.toString() === user._id?.toString()
    });
    
    // Verificar se não está comprando do próprio item
    const postAuthorId = post.author?._id?.toString() || post.author?.id?.toString();
    const currentUserId = user._id?.toString() || user.id?.toString();
    
    if (postAuthorId === currentUserId) {
      alert('Você não pode comprar seu próprio item!');
      console.log('❌ Bloqueado: mesmo usuário');
      return;
    }
    
    console.log('✅ Compra permitida - usuários diferentes');
    setSelectedPost(post);
    setShowPurchaseModal(true);
  };

  const handlePurchaseComplete = (transaction) => {
    console.log('Compra completada:', transaction);
    
    // Atualizar saldo do usuário
    if (updateUserBalance) {
      updateUserBalance(user.giroBalance - transaction.amount);
    }
    
    // Remover o post comprado do feed
    setPosts(prevPosts => prevPosts.filter(post => post._id !== transaction.post));
    
    // Mostrar mensagem de sucesso
    alert(`🎉 Compra realizada com sucesso!\n💰 ${transaction.amount} GIRO descontados\n📦 Item removido do feed`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      {/* Header com saldo GIRO */}
      {user && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-sm z-40 border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/rewards')}
                  className="bg-purple-500 text-white px-4 py-2 rounded-full font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  <Coins size={16} />
                  {user.giroBalance || 0} GIRO
                </button>
                <button 
                  onClick={() => navigate('/create-post')}
                  className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4" style={{ paddingTop: user ? '100px' : '20px' }}>
        {/* Grid de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Imagem do Item */}
              <div className="aspect-square relative overflow-hidden">
                {post.images && post.images.length > 0 ? (
                  <img 
                    src={`${API_URL}${post.images[0]?.url || post.images[0]}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Remover logs para evitar spam
                      // Usar placeholder mais elegante
                      e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
                        <rect width="400" height="400" fill="%23f8f9fa"/>
                        <circle cx="200" cy="150" r="30" fill="%23dee2e6"/>
                        <rect x="150" y="200" width="100" height="80" rx="8" fill="%23dee2e6"/>
                        <text x="200" y="320" text-anchor="middle" fill="%236c757d" font-family="Arial" font-size="14">Imagem Indisponível</text>
                      </svg>`;
                      // Para o log infinito
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                      📷
                    </div>
                    <span className="text-gray-500 text-sm">Sem imagem</span>
                  </div>
                )}
                
                {/* Badge do valor GIRO */}
                <div className="absolute top-3 right-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.giroValue} TKN
                </div>
              </div>

              {/* Informações do Item */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>
                
                {/* Autor */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{post.author?.name || 'Usuário'}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <button 
                    className="flex-1 bg-emerald-500 text-white py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                    onClick={() => {
                      console.log('Interesse no item:', post.title);
                    }}
                  >
                    Quero Trocar!
                  </button>
                  
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                    onClick={() => handlePurchaseClick(post)}
                  >
                    <ShoppingCart size={16} />
                    Comprar
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1 transition-colors ${
                      post.likes.includes(user?._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} className={post.likes.includes(user?._id) ? 'fill-current' : ''} />
                    <span className="text-sm">{post.likes?.length || 0}</span>
                  </button>
                  
                  <div className="flex items-center gap-1 text-gray-400">
                    <MessageCircle size={16} />
                    <span className="text-sm">{post.comments?.length || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye size={16} />
                    <span className="text-sm">{post.views || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão Carregar Mais */}
        {hasMore && (
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {loadingMore ? 'Carregando...' : 'Carregar Mais Items'}
            </motion.button>
          </div>
        )}

        {/* Mensagem final */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-8 text-gray-600">
            <p>Você viu todos os itens disponíveis! 🎉</p>
          </div>
        )}

        {/* Mensagem quando não há posts */}
        {posts.length === 0 && !loading && (
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum item encontrado</h3>
              <p className="text-gray-600 mb-4">Seja o primeiro a compartilhar um item!</p>
              {user && (
                <button 
                  onClick={() => navigate('/create-post')}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                >
                  Criar Primeiro Post
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
              className="flex flex-col items-center py-2 text-black"
            >
              <Shirt size={20} className="text-black" />
              <span className="text-xs mt-1">Meus Itens</span>
            </button>
            <button 
              onClick={() => navigate('/my-purchases')}
              className="flex flex-col items-center py-2 text-black"
            >
              <ShoppingCart size={20} className="text-black" />
              <span className="text-xs mt-1">Compras</span>
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

      {/* Modal de Compra */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        post={selectedPost}
        userBalance={user?.giroBalance || 0}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
};

export default Feed;