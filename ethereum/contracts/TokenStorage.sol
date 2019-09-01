pragma solidity >=0.5.0 <0.7.0;

import "./AllowanceSheet.sol";
import "./BalanceSheet.sol";
import "./helpers/Console.sol";

/**
 * All Tokens and Token Proxies will inherit from the TokenStorage class.
 */
contract TokenStorage is Console {
    /**
     * Storage.
     */
    BalanceSheet public balances;
    AllowanceSheet public allowances;

    // A TokenStorage consumer can set its storages only once , onInit.
    constructor(address _balances, address _allowances) public {
        balances = BalanceSheet(_balances);
        allowances = AllowanceSheet(_allowances);
        log('balances', true);
        
    }
    /**
     * @dev claim ownership of balance sheet passed into ctor.
     */
    function calimBalanceOwnership() public {
        balances.claimOwnerShip();
    }
    
    /**
     * @dev claim ownership of balance shet passed into ctor.
     */
    function claimAllowanceOwnership() public {
        allowances.claimOwnerShip();
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