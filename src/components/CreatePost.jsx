import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, Coins, MapPin, Tag, Camera, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    giroValue: '',
    tags: [],
    location: {
      city: '',
      state: ''
    }
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Máximo 5 imagens permitidas');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        setError('Apenas imagens são permitidas');
        return false;
      }
      if (!isValidSize) {
        setError('Cada imagem deve ter no máximo 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      
      // Criar previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
      
      setError('');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validações
    if (!formData.title.trim()) {
      setError('Título é obrigatório');
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError('Descrição é obrigatória');
      setLoading(false);
      return;
    }
    if (!formData.giroValue || formData.giroValue < 1 || formData.giroValue > 10000) {
      setError('Valor deve estar entre 1 e 10000 tokens GIRO');
      setLoading(false);
      return;
    }
    if (images.length === 0) {
      setError('Pelo menos uma imagem é obrigatória');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Adicionar dados do formulário
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('giroValue', formData.giroValue);
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('location', JSON.stringify(formData.location));
      
      // Adicionar imagens
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Item publicado com sucesso! Redirecionando para o feed...');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          giroValue: '',
          tags: [],
          location: { city: '', state: '' }
        });
        setImages([]);
        setImagePreviews([]);
        setTagInput('');

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/feed');
        }, 2000);
      } else {
        setError(data.message || 'Erro ao criar post');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Acesso Negado</h2>
          <p className="text-charcoal/60 mb-6">Você precisa estar logado para criar posts</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-sage text-white px-6 py-3 rounded-xl"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/feed')}
            className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={20} className="text-charcoal" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Criar Post</h1>
            <p className="text-charcoal/60">Compartilhe um item incrível com a comunidade</p>
          </div>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de Imagens */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Imagens do Item * (máximo 5)
              </label>
              
              {/* Area de upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sage transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 5}
                />
                <label 
                  htmlFor="image-upload" 
                  className={`cursor-pointer ${images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    {images.length === 0 
                      ? 'Clique para adicionar imagens' 
                      : `${images.length}/5 imagens adicionadas`
                    }
                  </p>
                  <p className="text-sm text-gray-400">PNG, JPG, GIF até 5MB cada</p>
                </label>
              </div>

              {/* Preview das imagens */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Título do Item *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: iPhone 13 Pro Max 256GB"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
              />
              <p className="text-sm text-gray-400 mt-1">{formData.title.length}/100 caracteres</p>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva o item em detalhes: estado de conservação, motivo da venda, características especiais..."
                maxLength={1000}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage resize-none"
              />
              <p className="text-sm text-gray-400 mt-1">{formData.description.length}/1000 caracteres</p>
            </div>

            {/* Valor em GIRO */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Valor Estimado *
              </label>
              <div className="relative">
                <Coins size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage" />
                <input
                  type="number"
                  name="giroValue"
                  value={formData.giroValue}
                  onChange={handleInputChange}
                  placeholder="Ex: 150"
                  min="1"
                  max="10000"
                  className="w-full pl-12 pr-16 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage font-medium">
                  GIRO
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Entre 1 e 10.000 tokens GIRO</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Tags (opcional)
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Tag size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Ex: eletrônicos, smartphone"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim() || formData.tags.length >= 10}
                  className="px-6 py-3 bg-sage text-white rounded-xl hover:bg-sage/80 transition-colors disabled:opacity-50"
                >
                  <Plus size={20} />
                </motion.button>
              </div>
              
              {/* Tags adicionadas */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-sage/10 text-sage px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-sage/60 hover:text-sage"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-400 mt-1">{formData.tags.length}/10 tags</p>
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Localização (opcional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="Cidade"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
                  />
                </div>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  placeholder="Estado"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
                />
              </div>
            </div>

            {/* Mensagens */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <p className="text-green-600 text-sm">{success}</p>
              </motion.div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-6 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/feed')}
                className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 font-medium shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando...
                  </div>
                ) : (
                  'Publicar Item'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;