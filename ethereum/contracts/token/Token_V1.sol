pragma solidity >=0.5.0 <0.7.0;

import "./Token_V0.sol";
import "../helpers/Pausable.sol";
import "../helpers/Lockable.sol";

contract Token_V1 is Token_V0, Pausable, Lockable {
  using SafeMath for uint256;
  
  constructor(address _balances, address _allowances) public
    Token_V0(_balances, _allowances) {}
  
  /**
   * Functions
   */
  function mint(address _to, uint256 _amount) public whenNotPaused {
    super.mint(_to, _amount);
  }
  
  function burn(uint256 _amount) public whenNotPaused {
    super.burn(_amount);
  }
  
  /**
   * @notice Implements ERC-20 standard approve function. Locked or disabled by default,
   * to protect against double spend attacks.
   * To modify allowances,clients should call safer increase/decreaseApproval methods.
   * Upon construction, all calls to approve() will revert
   * unless this contract owner explicitly unlocks approve()
   */
  function approve(address _spender, uint256 _value)
    public whenNotPaused whenUnlocked returns (bool) {
    super.approve(_spender, _value);
    return true;
  }
  
  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * @notice increaseApproval should be used instead of approve when the user's allowance
   * is greater than 0. Using increaseApproval protects against potential double-spending attacks.
   * by moving the check of whether the user has spent their allowance to the time that the transaction is mined.
   * removing the user's ability to double-spend.
   * @param _spender The address which will spend the funds..
   * @param _addedValue The amount of tokens to increase the allowance by
   */
  function increaseApproval(address _spender, uint256 _addedValue)
    public whenNotPaused returns (bool) {
    increaseApprovalAllArgs(_spender, _addedValue, msg.sender);
    return true;
  }
  
  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * @notice
   */
  function decreaseApproval(address _spender, uint256 _substractedValue)
    public whenNotPaused returns (bool) {
    decreaseApprovalAllArgs(_spender, _substractedValue, msg.sender);
    return true;
  }
  
  function transfer(address _to, uint256 _amount) public whenNotPaused returns (bool) {
    super.transfer(_to, _amount);
    return true;
  }

  /**
    * @notice Initiates a transfer operation between address `_from` and `_to`. Requires that the
    * message sender is an approved spender on the _from account.
    * @dev When implemented, it should use the transferFromConditionsRequired() modifier.
    * @param _to The address of the recipient. This address must not be blacklisted.
    * @param _from The address of the origin of funds. This address _could_ be blacklisted, because
    * a regulator may want to transfer tokens out of a blacklisted account, for example.
    * In order to do so, the regulator would have to add themselves as an approved spender
    * on the account via `addBlacklistAddressSpender()`, and would then be able to transfer tokens out of it.
    * @param _amount The number of tokens to transfer
    * @return `true` if successful
    */
  function transferFrom(address _from, address _to, uint256 _amount)
   public whenNotPaused returns (bool) {
    super.transferFrom(_from, _to, _amount);
    return true;
  }
  
  /** Internal functions **/
  function decreaseApprovalAllArgs(
    address _spender,
    uint256 _substractedValue,
    address _tokenHolder
  ) internal {
    uint256 oldValue = allowances.allowanceOf(_tokenHolder, _spender);
    if(_substractedValue > oldValue) {
      allowances.setAllowance(_tokenHolder, _spender, 0);
    } else {
      allowances.setAllowance(_tokenHolder, _spender, _substractedValue);
    }
    emit Approval(_tokenHolder, _spender, allowances.allowanceOf(_tokenHolder, _spender));
  }
  
  function increaseApprovalAllArgs(
    address _spender,
    uint256 _addedValue,
    address _tokenHolder
  ) internal {
    allowances.addAllowance(_tokenHolder, _spender, _addedValue);
    emit Approval(_tokenHolder, _spender, allowances.allowanceOf(_tokenHolder, _spender));
  }
}