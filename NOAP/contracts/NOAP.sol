// SPDX-License-Identifier: MIT
// https://github.com/OpenZeppelin/openzeppelin-contracts/commit/8e0296096449d9b1cd7c5631e917330635244c37
import 'openzeppelin-solidity/contracts/utils/EnumerableSet.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Burnable.sol';
import 'openzeppelin-solidity/contracts/cryptography/ECDSA.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './IERC2981.sol';
import './BaseRelayRecipient.sol';

pragma experimental ABIEncoderV2;
pragma solidity 0.6.12;

contract NOAP is ERC721Burnable, BaseRelayRecipient, IERC2981 {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.UintSet;

    string private constant ERROR_INVALID_INPUTS = "Each field must have the same number of values";

    struct Evt {
        bool ended;
        address royalty;
        string tokenURI;
        EnumerableSet.AddressSet minters;
    }

    mapping(address => EnumerableSet.UintSet) private userEventIDs;

    mapping(uint256 => Evt) evts;
    mapping(uint256 => uint256) private tokenToEventID;
    mapping(bytes32 => uint256) private hashToEventID;
    uint256 private tokenIDCounter;
    uint256 private eventIDCounter;

    uint256 private constant _NULL_EVENT_ID = 0;
    address private constant _NULL_ADDRESS = 0x0000000000000000000000000000000000000000;

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    constructor() public ERC721("NOAPs", "NOAP") {
        _registerInterface(_INTERFACE_ID_ERC2981);

        // hardcode the trusted forwarded for EIP2771 metatransactions
        _setTrustedForwarder(0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8); // xDAI trusted forwarder
    }

    /**
     * Mint a single token
     */
    function mint(
        uint256 eventID,
        address recipient
    ) external {
        Evt storage evt = evts[eventID];
        require(!evt.ended, "Event Ended");
        _checkSenderIsMinter(evt);
        _mintEventToken(recipient, eventID);
    }

    /**
     * Mint multiple tokens for a single event
     */
    function mintBatch(
        uint256 eventID,
        address[] memory recipients
    ) external {
        Evt storage evt = evts[eventID];
        require(!evt.ended, "Event Ended");
        _checkSenderIsMinter(evt);

        for (uint i = 0; i < recipients.length; i++) {
            _mintEventToken(recipients[i], eventID);
        }
    }

    /**
     * Burn a token from another contract and mint it here, copying the metadata
     * The token owner must have `approve` this contract to access the token beforehand
     */
    function burnAndRemint(
        address tokenContract,
        uint256 tokenID
    ) public {
        require(tokenContract != address(this), "Cannot burn and remint on the same contract");

        // Grab the tokenURI
        ERC721Burnable collection = ERC721Burnable(tokenContract);
        string memory tokenURI = collection.tokenURI(tokenID);

        // Burn the source NFT
        collection.transferFrom(_msgSender(), address(this), tokenID);
        collection.burn(tokenID);

        // Load the event obj from the URI, creating a new event ID if non-existent
        bytes32 eventHash = _computeEventHash(tokenContract, tokenURI);
        uint256 eventID = hashToEventID[eventHash];
        if (eventID == _NULL_EVENT_ID) {
            eventID = _createEvent(eventHash, tokenURI);
        }

        _mintEventToken(_msgSender(), eventID);
    }

    /**
     * Batch API to burn and remint, for those feeling frisky.
     */
    function burnAndRemintBatch(
        address[] memory tokenContracts,
        uint256[] memory tokenIDs
    ) external {
        require(tokenContracts.length == tokenIDs.length, ERROR_INVALID_INPUTS);
        for (uint i = 0; i < tokenContracts.length; i++) {
            burnAndRemint(tokenContracts[i], tokenIDs[i]);
        }
    }
    /**
     * Batch API to burn and remint, for those feeling frisky.
     */
    function burnAndRemintBatchDenver(
        address[] memory tokenContracts,
        uint256[] memory tokenIDs,
        string memory tokenURI
    ) external {
        bytes32 eventHash = _computeEventHash(address(this), tokenURI);
        uint256 eventID = hashToEventID[eventHash];
        require(eventID != _NULL_EVENT_ID,"Event Does Not Exist!");
        Evt storage evt = evts[eventID];
        require(!evt.ended, "Event Ended");
        require(tokenContracts.length == tokenIDs.length && tokenIDs.length == 5, ERROR_INVALID_INPUTS);
        for (uint i = 0; i < tokenContracts.length; i++) {
            burnAndRemint(tokenContracts[i], tokenIDs[i]);
        }        
        _mintEventToken(_msgSender(), eventID);
    }
    /**
     * Create an event based on the metadata URI.
     * The caller is the sole minter.
     * Each event is a unique <contract, tokenURI> pair and cannot be recreated.
     */
    function createEvent(
        string memory tokenURI
    ) external {
        bytes32 eventHash = _computeEventHash(address(this), tokenURI);
        uint256 eventID = _createEvent(eventHash, tokenURI);

        Evt storage evt = evts[eventID];
        evt.minters.add(_msgSender());
        evt.royalty = _msgSender();

        userEventIDs[_msgSender()].add(eventID);
    }

    /**
     * End the event, halting minting.
     * Token minting from other contracts (burned and reminted here) cannot be halted.
     */
    function endEvent(
        uint256 eventID
    ) external {
        Evt storage evt = evts[eventID];
        _checkSenderIsMinter(evt);
        evt.ended = true;
    }

    /**
     * Add a minter to the event. Minter can create infinite tokens. Caller must be a minter
     */
    function addEventMinter(
        uint256 eventID,
        address minter
    ) external {
        Evt storage evt = evts[eventID];
        _checkSenderIsMinter(evt);
        evt.minters.add(minter);

        userEventIDs[minter].add(eventID);
    }

    function renounceEventMinter(
        uint256 eventID
    ) external {
        Evt storage evt = evts[eventID];
        _checkSenderIsMinter(evt);
        evt.minters.remove(_msgSender());

        userEventIDs[_msgSender()].remove(eventID);
    }

    function _checkSenderIsMinter(
        Evt storage evt
    ) internal view {
        require(evt.minters.contains(_msgSender()), "Not event minter");
    }

    function _createEvent(
        bytes32 eventHash,
        string memory tokenURI
    ) internal returns (uint256) {
        require(hashToEventID[eventHash] == _NULL_EVENT_ID, "Event already created");

        uint256 eventID = ++eventIDCounter;
        evts[eventID].tokenURI = tokenURI;

        // Map the event hash back to the Event
        hashToEventID[eventHash] = eventID;

        return eventID;
    }

    function _mintEventToken(
        address recipient,
        uint256 eventID
    ) internal {
        // Mint the token. ID is generated by hashing the source contract and id, bitmasked for shortness
        uint256 tokenID = ++tokenIDCounter;
        _mint(recipient, tokenID);

        // Map the token back to the Event
        tokenToEventID[tokenID] = eventID;
    }

    function _computeEventHash(
        address tokenContract,
        string memory tokenURI
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(tokenContract, tokenURI));
    }

    /**
     * ERC2981 royalty implementation
     * For events created using this contract, we hardcode a 10% resale royalty the corresponding tokens
     * The recipient of this royalty is controlled by the event minters.
     */
    function royaltyInfo(
        uint256 tokenID,
        uint256 salePrice
    ) external view override returns (address, uint256) {
        address royalty = evts[tokenToEventID[tokenID]].royalty;
        if (royalty == _NULL_ADDRESS) {
            // For tokens that are burned and reminted,
            // we don't track the creator, so zero royalties.
            return (_NULL_ADDRESS, 0);
        }

        return (royalty, salePrice / 10);
    }

    /**
     * Allow any of the event minters to change the royalty recipient
     */
    function changeRoyaltyReceiver(uint256 eventID, address receiver) external {
        Evt storage evt = evts[eventID];
        _checkSenderIsMinter(evt);
        evt.royalty = receiver;
    }
    /* -- END ERC2981 methods */

    /**
     * Overwrite the default `tokenURI` getter.
     * Since all events have the same tokenURI, resolve tokenIDs to events load the URI from the event
     */
    function tokenURI(uint256 tokenID) public view virtual override returns (string memory) {
        require(_exists(tokenID), "ERC721Metadata: URI query for nonexistent token");
        return evts[tokenToEventID[tokenID]].tokenURI;
    }

    function isApprovedOrOwner(
        address spender,
        uint256 tokenID
    ) external view returns (bool) {
        return _isApprovedOrOwner(spender, tokenID);
    }

    /* -- BEGIN batch methods */
    function burnBatch(
        uint256[] memory tokenIDs
    ) external {
        for (uint256 i = 0; i < tokenIDs.length; ++i) {
            burn(tokenIDs[i]);
        }
    }

    function approveBatch(
        address[] memory tos,
        uint256[] memory tokenIDs
    ) external {
        require(tos.length == tokenIDs.length, ERROR_INVALID_INPUTS);
        for (uint256 i = 0; i < tos.length; ++i) {
            approve(tos[i], tokenIDs[i]);
        }
    }

    function transferFromBatch(
        address[] memory froms,
        address[] memory tos,
        uint256[] memory tokenIDs
    ) external {
        require(
            froms.length == tos.length &&
            froms.length == tokenIDs.length,
            ERROR_INVALID_INPUTS
        );
        for (uint256 i = 0; i < froms.length; ++i) {
            transferFrom(froms[i], tos[i], tokenIDs[i]);
        }
    }

    function safeTransferFromBatch(
        address[] memory froms,
        address[] memory tos,
        uint256[] memory tokenIDs
    ) external {
        require(
            froms.length == tos.length &&
            froms.length == tokenIDs.length,
            ERROR_INVALID_INPUTS
        );
        for (uint256 i = 0; i < froms.length; ++i) {
            safeTransferFrom(froms[i], tos[i], tokenIDs[i], "");
        }
    }

    function safeTransferFromWithDataBatch(
        address[] memory froms,
        address[] memory tos,
        uint256[] memory tokenIDs,
        bytes[] memory datas
    ) external {
        require(
            froms.length == tos.length &&
            froms.length == tokenIDs.length &&
            froms.length == datas.length,
            ERROR_INVALID_INPUTS
        );
        for (uint256 i = 0; i < froms.length; ++i) {
            safeTransferFrom(froms[i], tos[i], tokenIDs[i], datas[i]);
        }
    }

    function isApprovedOrOwnerBatch(
        address[] memory spenders,
        uint256[] memory tokenIDs
    ) external view returns (bool[] memory) {
        require(spenders.length == tokenIDs.length, ERROR_INVALID_INPUTS);
        bool[] memory approvals = new bool[](spenders.length);
        for (uint256 i = 0; i < spenders.length; ++i) {
            approvals[i] = _isApprovedOrOwner(spenders[i], tokenIDs[i]);
        }
        return approvals;
    }

    function existsBatch(
        uint256[] memory tokenIDs
    ) external view returns (bool[] memory) {
        bool[] memory exists = new bool[](tokenIDs.length);
        for (uint256 i = 0; i < tokenIDs.length; ++i) {
            exists[i] = _exists(tokenIDs[i]);
        }
        return exists;
    }
    /* -- END batch methods */

    function getLastTokenID() public view returns (uint) {
        return tokenIDCounter;
    }

    function getLastEventID() public view returns (uint) {
        return eventIDCounter;
    }

    function getUserEventTotal(
        address user
    ) public view returns (uint256) {
        return userEventIDs[user].length();
    }

    function getUserEventAt(
        address user,
        uint256 index
    ) public view returns (uint256) {
        return userEventIDs[user].at(index);
    }

    function getUserEventIDs(
        address user
    ) public view returns (uint256[] memory) {
        uint256 numEvents = getUserEventTotal(user);
        uint256[] memory eventIDs = new uint256[](numEvents);
        for (uint i = 0; i < numEvents; i++) {
            eventIDs[i] = getUserEventAt(user, i);
        }
        return eventIDs;
    }

    /* -- BEGIN IRelayRecipient overrides -- */
    function _msgSender() internal override(Context, BaseRelayRecipient) view returns (address payable) {
        return BaseRelayRecipient._msgSender();
    }

    string public override versionRecipient = "1";
    /* -- END IRelayRecipient overrides -- */
}
