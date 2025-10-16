// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title GiroToken
 * @dev Token nativo da plataforma Giro - Economia Circular
 * @notice Token de recompensas e utilidade para transações sustentáveis
 */
contract GiroToken is ERC20, Ownable, Pausable {
    
    // ===== CONFIGURAÇÕES BÁSICAS =====
    uint256 public constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 bilhão de tokens
    uint256 public constant MAX_SUPPLY = 10000000000 * 10**18; // 10 bilhões max
    
    // ===== SISTEMA DE RECOMPENSAS =====
    mapping(address => bool) public authorizedRewarders;
    mapping(address => uint256) public userRewards;
    mapping(bytes32 => bool) public claimedActions; // Previne duplas recompensas
    
    // ===== EVENTOS =====
    event RewardGranted(address indexed user, uint256 amount, string action);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewarderAdded(address indexed rewarder);
    event RewarderRemoved(address indexed rewarder);
    
    // ===== TIPOS DE AÇÕES RECOMPENSADAS =====
    enum ActionType {
        PRODUCT_LISTED,     // +10 GIRO - Anunciar produto
        SALE_COMPLETED,     // +50 GIRO - Venda concluída
        PURCHASE_MADE,      // +25 GIRO - Compra sustentável
        REVIEW_LEFT,        // +5 GIRO - Deixar avaliação
        PROFILE_VERIFIED,   // +100 GIRO - Verificar perfil
        REFERRAL,          // +75 GIRO - Indicar amigo
        ECO_MILESTONE      // +200 GIRO - Marcos sustentáveis
    }
    
    constructor() ERC20("Giro", "GIRO") {
        _mint(msg.sender, INITIAL_SUPPLY);
        authorizedRewarders[msg.sender] = true;
    }
    
    // ===== SISTEMA DE RECOMPENSAS =====
    
    /**
     * @dev Concede recompensa por ação na plataforma
     * @param user Usuário que receberá a recompensa
     * @param action Tipo de ação realizada
     * @param actionId ID único da ação (previne duplicatas)
     */
    function grantReward(
        address user, 
        ActionType action, 
        string memory actionId
    ) external whenNotPaused {
        require(authorizedRewarders[msg.sender], "Nao autorizado");
        require(user != address(0), "Endereco invalido");
        
        bytes32 actionHash = keccak256(abi.encodePacked(user, actionId));
        require(!claimedActions[actionHash], "Recompensa ja concedida");
        
        uint256 rewardAmount = getRewardAmount(action);
        require(totalSupply() + rewardAmount <= MAX_SUPPLY, "Limite maximo atingido");
        
        claimedActions[actionHash] = true;
        userRewards[user] += rewardAmount;
        
        emit RewardGranted(user, rewardAmount, actionId);
    }
    
    /**
     * @dev Usuário reivindica suas recompensas acumuladas
     */
    function claimRewards() external whenNotPaused {
        uint256 rewards = userRewards[msg.sender];
        require(rewards > 0, "Nenhuma recompensa disponivel");
        
        userRewards[msg.sender] = 0;
        _mint(msg.sender, rewards);
        
        emit RewardClaimed(msg.sender, rewards);
    }
    
    /**
     * @dev Retorna quantidade de recompensa por tipo de ação
     */
    function getRewardAmount(ActionType action) public pure returns (uint256) {
        if (action == ActionType.PRODUCT_LISTED) return 10 * 10**18;
        if (action == ActionType.SALE_COMPLETED) return 50 * 10**18;
        if (action == ActionType.PURCHASE_MADE) return 25 * 10**18;
        if (action == ActionType.REVIEW_LEFT) return 5 * 10**18;
        if (action == ActionType.PROFILE_VERIFIED) return 100 * 10**18;
        if (action == ActionType.REFERRAL) return 75 * 10**18;
        if (action == ActionType.ECO_MILESTONE) return 200 * 10**18;
        return 0;
    }
    
    // ===== SISTEMA DE TAXA REDUZIDA =====
    
    /**
     * @dev Calcula desconto baseado em saldo de GIRO
     * @param user Usuário
     * @param originalFee Taxa original
     * @return Taxa com desconto aplicado
     */
    function calculateDiscountedFee(address user, uint256 originalFee) 
        external view returns (uint256) {
        uint256 balance = balanceOf(user);
        
        // Desconto escalonado baseado no saldo
        if (balance >= 10000 * 10**18) return originalFee * 20 / 100; // 80% desconto
        if (balance >= 5000 * 10**18) return originalFee * 40 / 100;  // 60% desconto
        if (balance >= 1000 * 10**18) return originalFee * 60 / 100;  // 40% desconto
        if (balance >= 100 * 10**18) return originalFee * 80 / 100;   // 20% desconto
        
        return originalFee; // Sem desconto
    }
    
    // ===== FUNCÕES DE QUEIMA (DEFLACIONÁRIAS) =====
    
    /**
     * @dev Queima tokens para reduzir fornecimento (deflação)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    /**
     * @dev Queima automática de taxa da plataforma
     */
    function burnPlatformFee(uint256 amount) external {
        require(authorizedRewarders[msg.sender], "Nao autorizado");
        _burn(address(this), amount);
    }
    
    // ===== ADMINISTRAÇÃO =====
    
    /**
     * @dev Adiciona endereço autorizado a conceder recompensas
     */
    function addRewarder(address rewarder) external onlyOwner {
        authorizedRewarders[rewarder] = true;
        emit RewarderAdded(rewarder);
    }
    
    /**
     * @dev Remove autorização de recompensas
     */
    function removeRewarder(address rewarder) external onlyOwner {
        authorizedRewarders[rewarder] = false;
        emit RewarderRemoved(rewarder);
    }
    
    /**
     * @dev Pausa o contrato em emergências
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ===== FUNÇÕES DE CONSULTA =====
    
    /**
     * @dev Verifica recompensas pendentes do usuário
     */
    function getPendingRewards(address user) external view returns (uint256) {
        return userRewards[user];
    }
    
    /**
     * @dev Verifica se ação já foi recompensada
     */
    function isActionClaimed(address user, string memory actionId) 
        external view returns (bool) {
        bytes32 actionHash = keccak256(abi.encodePacked(user, actionId));
        return claimedActions[actionHash];
    }
    
    /**
     * @dev Fornecimento circulante atual
     */
    function circulatingSupply() external view returns (uint256) {
        return totalSupply();
    }
    
    // ===== OVERRIDE NECESSÁRIO =====
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}