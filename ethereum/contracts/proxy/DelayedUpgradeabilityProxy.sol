pragma solidity >=0.5.0 <0.7.0;

import "./UpgradeabilityProxy.sol";
import "../libs/SafeMath.sol";

contract DelayedUpgradeabilityProxy is UpgradeabilityProxy {
  using SafeMath for uint256;
  
  address public pendingImplementation;
  bool public pendingImplmentationIsSet;
  // Date on which to switch all contract calls to the new implementation
  uint256 public pendingImplementationApplicationDate;
  uint256 public UPGRADE_DELAY = 4 weeks;
  
  event PendingImplementationChanged(address indexed oldPendingImplementation, address indexed newPendingImplementation);
  
  constructor(address _implementation) public UpgradeabilityProxy(_implementation) {}

  /**
    * @notice Sets the pending implementation address of the proxy.
    * This function is internal--uses of this proxy should wrap this function
    * with a public function in order to make it externally callable.
    * @param implementation Address of the new implementation.
    */
  function _setPendingUpgrade(address implementation) internal {
    address oldPendingImplementation = pendingImplementation;
    pendingImplementation = implementation;
    pendingImplmentationIsSet =  true;
    emit PendingImplementationChanged(oldPendingImplementation, implementation);
    pendingImplementationApplicationDate =  block.timestamp.add(UPGRADE_DELAY);
  }

  /**
    * @notice Overrides the _willFallback() function of Proxy, which enables some code to
    * be executed prior to the fallback function. In this case, the purpose of this code
    * is to automatically switch the implementation to the pending implementation if the
    * wait period of UPGRADE_DELAY (28 days) has been satisfied.
    */
  function _willFallback() internal {
    if (pendingImplmentationIsSet && block.timestamp > pendingImplementationApplicationDate) {
      _upgradeTo(pendingImplementation);
      pendingImplmentationIsSet = false;
      super._willFallback();
    } else {
      super._willFallback();
    }
  }
}
