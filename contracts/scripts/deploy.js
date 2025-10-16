const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy do GIRO Token...");
  
  // Pega a conta que fará o deploy
  const [deployer] = await ethers.getSigners();
  console.log("📝 Fazendo deploy com a conta:", deployer.address);
  
  // Verifica saldo da conta
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Saldo da conta:", ethers.formatEther(balance), "ETH");
  
  // Faz o deploy do contrato
  console.log("⏳ Fazendo deploy do GiroToken...");
  const GiroToken = await ethers.getContractFactory("GiroToken");
  const giroToken = await GiroToken.deploy();
  
  // Aguarda confirmação
  await giroToken.waitForDeployment();
  
  const contractAddress = await giroToken.getAddress();
  
  console.log("✅ GIRO Token deployado com sucesso!");
  console.log("📍 Endereço do contrato:", contractAddress);
  console.log("🔗 Explorer:", getExplorerUrl(contractAddress));
  
  // Informações do token
  const name = await giroToken.name();
  const symbol = await giroToken.symbol();
  const totalSupply = await giroToken.totalSupply();
  const ownerBalance = await giroToken.balanceOf(deployer.address);
  
  console.log("\n📊 INFORMAÇÕES DO TOKEN:");
  console.log("📛 Nome:", name);
  console.log("🏷️  Símbolo:", symbol);
  console.log("💎 Supply Total:", ethers.formatEther(totalSupply), "GIRO");
  console.log("👑 Saldo do Owner:", ethers.formatEther(ownerBalance), "GIRO");
  
  // Salva informações do deploy
  const deployInfo = {
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    name: name,
    symbol: symbol,
    totalSupply: ethers.formatEther(totalSupply)
  };
  
  console.log("\n💾 Informações salvas do deploy:");
  console.log(JSON.stringify(deployInfo, null, 2));
  
  console.log("\n🎉 Deploy concluído com sucesso!");
  console.log("🔍 Próximos passos:");
  console.log("   1. Verifique o contrato no explorer");
  console.log("   2. Adicione o token na sua wallet");
  console.log("   3. Configure os rewarders autorizados");
}

function getExplorerUrl(address) {
  const network = hre.network.name;
  
  switch(network) {
    case 'sepolia':
      return `https://sepolia.etherscan.io/address/${address}`;
    case 'mumbai':
      return `https://mumbai.polygonscan.com/address/${address}`;
    case 'bscTestnet':
      return `https://testnet.bscscan.com/address/${address}`;
    default:
      return `Endereço: ${address}`;
  }
}

// Executa o deploy e trata erros
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro no deploy:", error);
    process.exit(1);
  });