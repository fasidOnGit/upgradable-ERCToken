pragma solidity >=0.5.0 <0.7.0;

import "./AllowanceSheet.sol";
import "./BalanceSheet.sol";

/**
 * All Tokens and Token Proxies will inherit from the TokenStorage class.
 */
contract TokenStorage is BalanceSheet, AllowanceSheet {
    /**
     * @dev claim ownership of balance sheet passed into ctor.
     */
    function claimBalanceOwnership() public {
        super.claimOwnerShip();
    }
    
    /**
     * @dev claim ownership of balance shet passed into ctor.
     */
    function claimAllowanceOwnership() public {
        super.claimOwnerShip();
    }
}
/**
 * Note that although BalanceSheet and AllowanceSheet are isolated from the Token logic,
 * their addresses cannot be changed after construction.
 * This is a design decision and has important tradeoffs:
 *  modifiable storage addresses prevent against disaster scenarios or hacks that corrupt storage contracts,
 *  but they also force end-users to place trust in storage contract owners.
 *  We choose in this example to make storage non-upgradeable, but logic upgradeable.
 */