# Giro Platform Backend

Backend API para a plataforma Giro - Sistema de economia circular com token nativo ERC20.

## 🚀 Funcionalidades

- ✅ **Autenticação tradicional** (email/senha + Google OAuth)
- ✅ **Carteiras automáticas** - Criadas automaticamente para cada usuário
- ✅ **Gerenciamento de tokens GIRO** - Saldos e transferências
- ✅ **Sistema de recompensas** - 7 tipos de ações sustentáveis
- ✅ **Descontos progressivos** - Baseados na atividade do usuário
- ✅ **Integração blockchain** - Sepolia testnet
- ✅ **Segurança avançada** - Chaves criptografadas, rate limiting, JWT

## 🔧 Configuração

### 1. Instalação
```bash
cd backend
npm install
```

### 2. Configuração do Ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

### 3. MongoDB
Certifique-se de ter o MongoDB rodando localmente ou configure uma conexão remota.

### 4. Iniciar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Endpoints API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validar token
- `POST /api/auth/logout` - Logout

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil

### Carteira
- `GET /api/wallet/balance` - Saldo GIRO
- `POST /api/wallet/transfer` - Transferir tokens
- `GET /api/wallet/transactions` - Histórico

### Recompensas
- `POST /api/rewards/grant` - Conceder recompensa
- `GET /api/rewards/actions` - Tipos de ação
- `GET /api/rewards/history` - Histórico de recompensas

## 🎯 Sistema de Recompensas

| Ação | Recompensa | Descrição |
|------|------------|-----------|
| Vender Item | 50 GIRO | Venda na plataforma |
| Comprar Item | 10 GIRO | Compra sustentável |
| Reciclar | 25 GIRO | Ação de reciclagem |
| Indicação | 100 GIRO | Novo usuário indicado |
| Avaliação | 15 GIRO | Avaliar produto/vendedor |
| Compartilhar | 5 GIRO | Share redes sociais |
| Desafio Eco | 75 GIRO | Desafio sustentável |

## 🏆 Sistema de Descontos

| Tier | Atividades | Desconto |
|------|------------|----------|
| Bronze | 0-19 | 0% |
| Silver | 20-49 | 10% |
| Gold | 50-99 | 25% |
| Platinum | 100+ | 50% |

## 🔐 Segurança

- **Chaves privadas criptografadas** - AES-256-CBC
- **JWT com expiração** - Tokens de 30 dias
- **Rate limiting** - 100 requests/15min
- **Validação de dados** - Express-validator
- **Helmet** - Headers de segurança
- **CORS configurado** - Apenas domínios permitidos

## 🌐 Blockchain Integration

- **Rede**: Sepolia Testnet
- **Contrato**: 0x7a96BBe42f0DDEDF7eFF75511481f729011A2A41
- **Provider**: Infura
- **Funções**: Transferências automáticas, concessão de recompensas

## 📊 Estrutura do Banco

### User Collection
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  walletAddress: String,
  encryptedPrivateKey: String,
  giroBalance: Number,
  totalRewardsEarned: Number,
  activityCount: Number,
  discountTier: String,
  // ... outros campos
}
```

## 🔍 Logs e Monitoramento

O sistema gera logs detalhados para:
- ✅ Criação de usuários e carteiras
- ✅ Transações blockchain
- ✅ Concessão de recompensas
- ✅ Erros e exceções

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Produção
1. Configure variáveis de ambiente
2. Instale dependências: `npm install --production`
3. Inicie: `npm start`

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request