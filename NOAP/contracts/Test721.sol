// SPDX-License-Identifier: MIT
// https://github.com/OpenZeppelin/openzeppelin-contracts/commit/8e0296096449d9b1cd7c5631e917330635244c37
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol';

pragma experimental ABIEncoderV2;
pragma solidity 0.6.12;

contract Test721 is ERC721Burnable {
    constructor() public ERC721("TESTs", "TEST") { }

    function mint(
        uint256 tokenID,
        address recipient,
        string memory tokenURI
    ) public {
        _mint(recipient, tokenID);
        _setTokenURI(tokenID, tokenURI);
    }
}