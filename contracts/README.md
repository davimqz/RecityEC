# 🪙 GIRO TOKEN - Contrato Inteligente

## 📋 **ESPECIFICAÇÕES DO TOKEN**

| Item | Valor | Justificativa |
|------|-------|---------------|
| **Nome** | Giro | Reflete a missão de circular itens e valor |
| **Símbolo** | GIRO | Alinhado com a marca, evita conflitos |
| **Decimais** | 18 | Padrão ERC20 |
| **Supply Inicial** | 1 Bilhão GIRO | Distribuição adequada para crescimento |
| **Supply Máximo** | 10 Bilhões GIRO | Limite para prevenir inflação excessiva |

---

## 🎯 **SISTEMA DE RECOMPENSAS**

### **Ações Recompensadas:**
- 📦 **Anunciar Produto**: +10 GIRO
- 💰 **Venda Concluída**: +50 GIRO (vendedor)
- 🛒 **Compra Sustentável**: +25 GIRO (comprador)
- ⭐ **Deixar Avaliação**: +5 GIRO
- ✅ **Verificar Perfil**: +100 GIRO (uma vez)
- 👥 **Indicar Amigo**: +75 GIRO
- 🌱 **Marco Sustentável**: +200 GIRO

### **Sistema Anti-Fraude:**
- ✅ Hash único para cada ação
- ✅ Prevenção de duplas recompensas
- ✅ Verificação de autorização

---

## 💸 **SISTEMA DE DESCONTOS**

### **Descontos Escalonados por Saldo:**
- 🥇 **10,000+ GIRO**: 80% de desconto nas taxas
- 🥈 **5,000+ GIRO**: 60% de desconto
- 🥉 **1,000+ GIRO**: 40% de desconto  
- 📈 **100+ GIRO**: 20% de desconto

---

## 🔥 **MECÂNICA DEFLACIONÁRIA**

### **Queima de Tokens:**
- 🔥 **Taxas da Plataforma**: Queimadas automaticamente
- 🔥 **Queima Manual**: Usuários podem queimar voluntariamente
- 📉 **Efeito**: Reduz supply, aumenta escassez

---

## ⚙️ **FUNCIONALIDADES TÉCNICAS**

### **Segurança:**
- 🛡️ **Pausável**: Parada de emergência
- 🔐 **Ownable**: Controle administrativo
- ✅ **OpenZeppelin**: Padrões auditados

### **Controle de Acesso:**
- 👮 **Rewarders Autorizados**: Apenas contratos da plataforma
- 🚫 **Prevenção de Spam**: Sistema de hash único
- ⏸️ **Sistema de Pausa**: Emergências

---

## 🚀 **CASOS DE USO NA PLATAFORMA**

### **1. Pagamentos:**
```solidity
// Pagar taxa com desconto
uint256 discountedFee = giroToken.calculateDiscountedFee(user, originalFee);
```

### **2. Recompensas:**
```solidity
// Recompensar venda
giroToken.grantReward(seller, ActionType.SALE_COMPLETED, saleId);
```

### **3. Queima Deflacionária:**
```solidity
// Queimar taxa da plataforma
giroToken.burnPlatformFee(platformFeeAmount);
```

---

## 📊 **TOKENOMICS**

### **Distribuição Inicial:**
- 🏢 **Plataforma**: 40% (400M GIRO)
- 👥 **Comunidade**: 30% (300M GIRO)  
- 🎯 **Marketing**: 15% (150M GIRO)
- 👨‍💻 **Equipe**: 10% (100M GIRO)
- 🔒 **Reserva**: 5% (50M GIRO)

### **Emissão de Novas Moedas:**
- ✅ **Apenas via Recompensas**
- ✅ **Limitado ao Max Supply**
- ✅ **Controlado por Smart Contract**

---

## 🔧 **DEPLOY E CONFIGURAÇÃO**

### **Dependências:**
```bash
npm install @openzeppelin/contracts
```

### **Deploy Script:**
```javascript
const GiroToken = await ethers.getContractFactory("GiroToken");
const giro = await GiroToken.deploy();
```

### **Configuração Inicial:**
1. Adicionar contratos da plataforma como rewarders
2. Configurar wallet multi-sig para owner
3. Distribuir tokens iniciais

---

## 🌐 **INTEGRAÇÃO COM FRONTEND**

O token pode ser integrado na plataforma React atual com:
- **Web3.js/Ethers.js** para interação
- **MetaMask** para carteiras
- **Dashboard** de saldo e recompensas
- **Sistema de notificações** para rewards

---

## 🔒 **SEGURANÇA E AUDITORIA**

### **Características de Segurança:**
- ✅ Baseado em OpenZeppelin (auditado)
- ✅ Sistema de pausa para emergências
- ✅ Controle de acesso granular
- ✅ Prevenção de ataques conhecidos

### **Recomendações:**
- 🔍 Auditoria de código antes do mainnet
- 🧪 Testes extensivos em testnet
- 📋 Documentação completa de API
- 🛡️ Sistema de monitoring contínuo