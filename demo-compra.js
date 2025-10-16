#!/usr/bin/env node

/**
 * 🎯 DEMO: Simulação Completa de Compra no RecityEC
 * 
 * Este script cria usuários de teste e simula uma transação completa
 */

const API_URL = process.env.API_URL || 'http://localhost:3001';

async function createTestUser(name, email) {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: email,
        password: 'demo123456'
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`⚠️  Usuário ${email} pode já existir`);
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ Usuário criado: ${name} (${email})`);
    return data;
    
  } catch (error) {
    console.error(`❌ Erro ao criar usuário ${name}:`, error.message);
    return null;
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.token) {
      console.log(`✅ Login realizado: ${email}`);
      return data;
    } else {
      console.error(`❌ Erro no login: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro no login:`, error.message);
    return null;
  }
}

async function createTestPost(token, title, description) {
  try {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: title,
        description: description,
        giroValue: 25,
        category: 'eletronicos'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log(`✅ Post criado: ${title}`);
      return data.post;
    } else {
      console.error(`❌ Erro ao criar post:`, data.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro ao criar post:`, error.message);
    return null;
  }
}

async function simulatePurchase(buyerToken, postId, amount) {
  try {
    const response = await fetch(`${API_URL}/api/transactions/purchase`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${buyerToken}`
      },
      body: JSON.stringify({
        postId: postId,
        amount: amount
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log(`✅ COMPRA REALIZADA!`);
      console.log(`💰 Valor: ${amount} GIRO`);
      console.log(`🔗 TX Hash: ${data.transaction.transactionHash}`);
      console.log(`🌐 Etherscan: ${data.etherscanUrl}`);
      return data.transaction;
    } else {
      console.error(`❌ Erro na compra:`, data.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erro na compra:`, error.message);
    return null;
  }
}

async function runDemo() {
  console.log('🚀 INICIANDO DEMO DE COMPRA RECITYEC\n');
  
  // 1. Criar usuários de teste
  console.log('👥 1. Criando usuários de teste...');
  await createTestUser('João Vendedor', 'vendedor@demo.com');
  await createTestUser('Maria Compradora', 'compradora@demo.com');
  console.log('');
  
  // 2. Login dos usuários
  console.log('🔐 2. Fazendo login dos usuários...');
  const seller = await loginUser('vendedor@demo.com', 'demo123456');
  const buyer = await loginUser('compradora@demo.com', 'demo123456');
  
  if (!seller || !buyer) {
    console.error('❌ Falha no login. Parando demo.');
    return;
  }
  console.log('');
  
  // 3. Criar post de venda
  console.log('📦 3. Criando item para venda...');
  const post = await createTestPost(
    seller.token, 
    'iPhone 12 Pro Max', 
    'iPhone em perfeito estado, com caixa e carregador'
  );
  
  if (!post) {
    console.error('❌ Falha ao criar post. Parando demo.');
    return;
  }
  console.log('');
  
  // 4. Simular compra
  console.log('🛒 4. Simulando compra...');
  const transaction = await simulatePurchase(buyer.token, post._id, 25);
  
  if (transaction) {
    console.log('\n🎉 DEMO CONCLUÍDA COM SUCESSO!');
    console.log('\n📋 RESUMO:');
    console.log(`👤 Vendedor: João (${seller.user.email})`);
    console.log(`👤 Comprador: Maria (${buyer.user.email})`);
    console.log(`📦 Item: ${post.title}`);
    console.log(`💰 Valor: ${transaction.amount} GIRO`);
    console.log(`🔗 Transação: ${transaction.transactionHash}`);
    console.log(`\n🌐 Para ver no "Etherscan":`);
    console.log(`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`);
  }
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };