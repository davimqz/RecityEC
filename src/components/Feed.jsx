import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, User, Coins, MoreHorizontal, Award } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`http://localhost:3001/api/posts?page=${pageNum}&limit=10`);
      const data = await response.json();

      if (data.success) {
        if (reset || pageNum === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.pagination.hasMore);
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

  const handleLike = async (postId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Atualizar estado local
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likesCount: data.likesCount,
                isLiked: data.isLiked
              }
            : post
        ));

        // Mostrar notificação de recompensa
        if (data.reward) {
          showRewardNotification(data.reward.tokens, 'curtida');
        }
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!user || !commentText[postId]?.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: commentText[postId].trim() })
      });

      const data = await response.json();
      if (data.success) {
        // Atualizar estado local
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: [...post.comments, data.comment],
                commentsCount: data.commentsCount
              }
            : post
        ));

        // Limpar campo de comentário
        setCommentText(prev => ({ ...prev, [postId]: '' }));

        // Mostrar notificação de recompensa
        if (data.reward) {
          showRewardNotification(data.reward.tokens, 'comentário');
        }
      }
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  const showRewardNotification = (tokens, action) => {
    // Você pode implementar um toast/notification aqui
    console.log(`🎉 +${tokens} GIRO por ${action}!`);
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchPosts(page + 1);
    }
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'text-orange-600',
      silver: 'text-gray-600',
      gold: 'text-yellow-600',
      platinum: 'text-purple-600'
    };
    return colors[tier] || colors.bronze;
  };

  const getTierIcon = (tier) => {
    if (tier === 'platinum') return '💎';
    if (tier === 'gold') return '🏆';
    if (tier === 'silver') return '🥈';
    return '🥉';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header do Feed */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-charcoal mb-2">Feed GIRO</h1>
          <p className="text-charcoal/60">Descubra itens incríveis da comunidade</p>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header do Post */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden">
                      {post.author.profilePicture ? (
                        <img 
                          src={post.author.profilePicture} 
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-sage" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-charcoal">{post.author.name}</h3>
                        <span className={`text-xs ${getTierColor(post.author.discountTier)}`}>
                          {getTierIcon(post.author.discountTier)}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  <button className="text-charcoal/40 hover:text-charcoal/60">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>

              {/* Conteúdo do Post */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-charcoal mb-2">{post.title}</h2>
                <p className="text-charcoal/70 mb-3">{post.description}</p>
                
                {/* Valor em GIRO */}
                <div className="flex items-center gap-2 mb-4">
                  <Coins size={20} className="text-sage" />
                  <span className="text-2xl font-bold text-sage">{post.giroValue} GIRO</span>
                </div>

                {/* Imagens */}
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {post.images.slice(0, 3).map((image, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={`http://localhost:3001${image.url}`}
                        alt={`${post.title} ${idx + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {idx === 2 && post.images.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            +{post.images.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="bg-sage/10 text-sage px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Ações do Post */}
              <div className="border-t border-gray-100">
                {/* Estatísticas */}
                <div className="px-4 py-2 flex items-center justify-between text-sm text-charcoal/60">
                  <div className="flex items-center gap-4">
                    <span>{post.likesCount} curtidas</span>
                    <span>{post.commentsCount} comentários</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{post.views} visualizações</span>
                  </div>
                </div>

                {/* Botões de ação */}
                {user && (
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 mb-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                          post.isLiked 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-gray-50 text-charcoal hover:bg-gray-100'
                        }`}
                      >
                        <Heart size={16} className={post.isLiked ? 'fill-current' : ''} />
                        <span className="text-sm font-medium">Curtir</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-charcoal hover:bg-gray-100 transition-colors"
                      >
                        <MessageCircle size={16} />
                        <span className="text-sm font-medium">Comentar</span>
                      </motion.button>
                    </div>

                    {/* Campo de comentário */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={16} className="text-sage" />
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Escreva um comentário..."
                          value={commentText[post._id] || ''}
                          onChange={(e) => setCommentText(prev => ({
                            ...prev,
                            [post._id]: e.target.value
                          }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post._id);
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleComment(post._id)}
                          disabled={!commentText[post._id]?.trim()}
                          className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Enviar
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comentários existentes */}
                {post.comments && post.comments.length > 0 && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="space-y-3 mt-3">
                      {post.comments.slice(-3).map((comment, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-sage/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {comment.user.profilePicture ? (
                              <img 
                                src={comment.user.profilePicture} 
                                alt={comment.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={12} className="text-sage" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg px-3 py-2">
                              <h4 className="font-medium text-charcoal text-sm">{comment.user.name}</h4>
                              <p className="text-charcoal/70 text-sm">{comment.text}</p>
                            </div>
                            <p className="text-xs text-charcoal/40 mt-1">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              className="bg-sage text-white px-8 py-3 rounded-xl font-medium hover:bg-sage/80 transition-colors disabled:opacity-50"
            >
              {loadingMore ? 'Carregando...' : 'Carregar Mais Posts'}
            </motion.button>
          </div>
        )}

        {/* Mensagem final */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-8 text-charcoal/60">
            <p>Você viu todos os posts disponíveis! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;