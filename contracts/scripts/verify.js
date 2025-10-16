const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x7a96BBe42f0DDEDF7eFF75511481f729011A2A41";
  
  console.log("🔍 Verificando contrato no explorer...");
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // GiroToken não tem parâmetros no constructor
    });
    
    console.log("✅ Contrato verificado com sucesso!");
  } catch (error) {
    if (error.message.includes("already verified")) {
      console.log("ℹ️  Contrato já foi verificado anteriormente");
    } else {
      console.error("❌ Erro na verificação:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro:", error);
    process.exit(1);
  });