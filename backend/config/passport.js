const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

console.log('🔍 Configurando Google OAuth...');
console.log('📋 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Configurado' : 'Não encontrado');
console.log('📋 GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Configurado' : 'Não encontrado');

// Configuração da estratégia do Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔍 Login Google - Profile:', {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName
    });

    // Verificar se usuário já existe pelo Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('✅ Usuário existente encontrado via Google ID');
      return done(null, user);
    }

    // Verificar se usuário já existe pelo email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Usuário existe com email mas sem Google ID - vincular contas
      console.log('🔗 Vinculando conta existente ao Google');
      user.googleId = profile.id;
      user.profilePicture = profile.photos[0]?.value;
      await user.save();
      return done(null, user);
    }

    // Criar novo usuário
    console.log('🆕 Criando novo usuário via Google');
    user = await User.createWithWallet({
      name: profile.displayName,
      email: profile.emails[0].value,
      googleId: profile.id,
      profilePicture: profile.photos[0]?.value,
      emailVerified: true // Google emails são verificados
    });

    console.log('🎉 Novo usuário criado via Google:', {
      email: user.email,
      walletAddress: user.walletAddress,
      userId: user._id
    });

    return done(null, user);
  } catch (error) {
    console.error('❌ Erro na autenticação Google:', error);
    return done(error, null);
  }
}));

// Serialização do usuário para sessão
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialização do usuário da sessão
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;