pragma solidity >=0.5.0 <0.7.0;

import "./DelayedUpgradeabilityProxy.sol";
import "../TokenStorage.sol";

contract TokenProxyDelayed is DelayedUpgradeabilityProxy, TokenStorage, Ownable {
  constructor(address _implementation, address _balances, address _allowances)
  DelayedUpgradeabilityProxy(_implementation) TokenStorage(_balances, _allowances) public {
  }

  /**
    * @dev Upgrade the backing implementation of the proxy.
    * Only the admin can call this function.
    * @param newImplementation Address of the new implementation.
    */
  function upgradeTo(address newImplementation) public onlyOwner {
    _setPendingUpgrade(newImplementation);
  }
  
  function implementation() public view returns (address) {
    return _implementation();
  }
}
