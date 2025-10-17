import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Categories from './components/Categories';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import UserProfile from './components/UserProfile';
import Feed from './components/Feed';
import CreatePost from './components/CreatePost';
import TransactionHistory from './components/TransactionHistory';
import RewardsPanel from './components/RewardsPanel';
import MyPurchases from './components/MyPurchases';
import LoggedInUserBar from './components/LoggedInUserBar';

// Componente para página inicial
const HomePage = () => (
  <>
    <LoggedInUserBar />
    <Hero />
    <HowItWorks />
    <Categories />
    <Benefits />
    <Testimonials />
    <CTA />
  </>
);

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" replace />;
};

// Componente principal da aplicação
const AppContent = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar se há token do Google OAuth na URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    const error = urlParams.get('error');

    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Login Google realizado com sucesso');
        
        // Atualizar contexto de autenticação
        login(userData);
        
        // Limpar URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirecionar para feed após login Google
        navigate('/feed');
      } catch (err) {
        console.error('❌ Erro ao processar login Google:', err);
      }
    } else if (error) {
      console.error('❌ Erro no login Google:', error);
      alert('Erro no login com Google. Tente novamente.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-cream font-inter">
      <Navbar />
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />
        
        {/* Feed público */}
        <Route path="/feed" element={<Feed />} />
        
        {/* Rotas protegidas */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/rewards" 
          element={<RewardsPanel />} 
        />
        <Route 
          path="/my-purchases" 
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirecionamento baseado no status de login */}
        <Route 
          path="/dashboard" 
          element={user ? <Navigate to="/feed" replace /> : <Navigate to="/" replace />} 
        />
        
        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Footer só aparece quando usuário NÃO está logado */}
      {!user && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
