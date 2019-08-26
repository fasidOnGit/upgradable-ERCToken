pragma solidity >=0.5.0 <0.7.0;

import "./libs/SafeMath.sol";
import "./helpers/Ownable.sol";
/**
 * @title AllowanceSheet.
 * @notice A wrapper around an allowance mapping.
 */
contract AllowanceSheet is Ownable {
  using SafeMath for uint256;
  
  mapping (address => mapping (address => uint256)) public allowanceOf;
  
  function addAllowance(address _tokenHolder, address _spender, uint256 _value) public onlyOwner {
    allowanceOf[_tokenHolder][_spender].add(_value);
  }
  
  function subAllowance(address _tokenHolder, address _spender, uint256 _value) public onlyOwner {
    allowanceOf[_tokenHolder][_spender].sub(_value);
  }
  
  function setAllowance(address _tokenHolder, address _spender, uint256 _value) public onlyOwner {
    allowanceOf[_tokenHolder][_spender] = _value;
  }
}
/**
 * This contract provides for the concept of a single owner, who can unilaterally transfer ownership to a different address.
 * However, if the owner of a contract makes a mistake in entering the address of an intended new owner,
 * then the contract can become irrecoverably unowned.
 * This is analogous to the well-known “Locked Ether” scenario
 * resulting in several million US dollars (over 7000 Ether) irretrievably locked at address 0x0.
 */