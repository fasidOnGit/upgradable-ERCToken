pragma solidity >=0.5.0 <0.7.0;

import "../proxy/UpgradeabilityProxy.sol";
import "../TokenStorage.sol";
import "../helpers/Ownable.sol";

/**
* @title TokenProxy
* @notice A proxy contract that serves the latest implementation of TokenProxy.
*/
contract TokenProxy is UpgradeabilityProxy, TokenStorage {
  address public owner;
  constructor(address _implementation) UpgradeabilityProxy(_implementation) public {
    owner = msg.sender;
  }
  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyProxyOwner() {
    require(msg.sender == owner);
    _;
  }
  /**
    * @dev Upgrade the backing implementation of the proxy.
    * Only the admin can call this function.
    * @param newImplementation Address of the new implementation.
    */
  function upgradeTo(address newImplementation) public onlyProxyOwner {
    _upgradeTo(newImplementation);
  }

  /*
   * @return The address of the implementation.
   */
  function implementation() public view returns (address) {
    return _implementation();
  }
}

/**
* Importantly, the end-user will ALWAYS make calls to the address of the token proxy even if the underlying logic changes.
*/