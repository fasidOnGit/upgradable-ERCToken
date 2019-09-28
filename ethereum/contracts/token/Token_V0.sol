pragma solidity >=0.5.0 <0.7.0;

import "./ERC20.sol";
import "../TokenStorage.sol";

/**
 * @title Token_V0
 * @notice A basic ERC20 token with modular data storage.
 */
contract Token_V0 is Ownable, TokenStorage {
  using SafeMath for uint256;

  // Events.
  event Mint(address indexed to, uint256 value);
  event Burn(address indexed burner, uint256 value);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
  
  constructor () public {}
  
  function mint(address _to, uint256 _amount) public onlyOwner {
    return _mint(_to, _amount);
  }
  
  function burn(uint256 _amount) public {
    _burn(msg.sender, _amount);
  }
  
  function approve(address _spender, uint256 _value) public returns (bool) {
    super.setAllowance(msg.sender, _spender, _value);
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
  
  function transfer(address _to, uint256 _amount) public returns (bool) {
    require(_to != address(0), "to address cannot be 0x0");
    require(_amount <= getBalance(msg.sender), "not enough balance to transfer");
    super.subBalance(msg.sender, _amount);
    super.addBalance(_to, _amount);
    return true;
  }
  
  function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
    require(_amount <= allowance(_from, msg.sender), "not enough allowance to transfer");
    require(_to != address(0), 'to address cannot be 0x0');
    require(_amount <= getBalance(_from), 'not enough balance to transfer');
    
    super.subAllowance(_from, msg.sender, _amount);
    super.addBalance(_to, _amount);
    super.subBalance(_from, _amount);
    emit Transfer(_from, _to, _amount);
    return true;
  }
  
  /**
   * @notice Implements balanceOf() as specified in the ERC20 standard.
   */
  function getBalance(address who) public view returns (uint256) {
    return balanceOf[who];
  }
  
  /**
   * @notice Implements allowance() as specified in the ERC20 standard.
   */
  function allowance(address owner, address spender) public view returns (uint256) {
    return allowanceOf[owner][spender];
  }
  
  /**
   * @notice Implements totalSupply() as specified in the ERC20 standard.
   */
  function getTotalSupply() public view returns (uint256) {
    return totalSupply;
  }
  
  /** Internal Functions **/
  function _burn(address _tokensOf, uint256 _amount) internal {
    require(_amount <= getBalance(_tokensOf), 'not enough balance to burn');
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be an assertion failure
    super.subBalance(_tokensOf, _amount);
    super.subTotalSupply(_amount);
    emit Burn(_tokensOf, _amount);
    emit Transfer(_tokensOf, address(0), _amount);
  }
  
  function _mint(address _to, uint256 _amount) internal {
    super.addTotalSupply(_amount);
    super.addBalance(_to, _amount);
    emit Mint(_to, _amount);
    emit Transfer(address(0), _to, _amount);
  }
}