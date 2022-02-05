pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";

/// @title Administration smart contract
/// @author Fatemeh Heidari Soureshjani
/// @notice Define the roles and implement pausable

contract Administration is AccessControl, Pausable {
    //bool noAdmin;

    constructor() public AccessControl() Pausable() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    bytes32 public constant DONOR = keccak256("DONOR");
    bytes32 public constant RECEIVER = keccak256("RECEIVER");
    struct donor {
        bool exists;
        bool approved;
        uint32 donationCount;
    }

    struct receiver {
        bool exists;
        bool approved;
        uint32 requestCount;
        //uint32 pageNo;
    }

    mapping(address => donor) public donors;
    mapping(address => receiver) public receivers;
    modifier isAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Sender is not ADMIN."
        );
        _;
    }

    /// @notice Adds an address to list of donors
    /// @dev approve donor role
    /// @param donorAddress address to be added
    
    function addDonor(address donorAddress) public {
        donor storage d = donors[donorAddress];
        if (!d.exists) {
            donors[donorAddress] = donor({
                exists: true,
                approved: false,
                donationCount: 1
            });
        } else {
            d.donationCount = SafeCast.toUint32(
                SafeMath.add(uint256(donors[donorAddress].donationCount), 1)
            );
        }
    }

    /// @notice Adds an address to list of Receiver
    /// @dev approve Receiver role
    /// @param receiverAddress address to be added
    function addReceiver(address receiverAddress) public {
        receiver storage r = receivers[receiverAddress];
        if (!r.exists) {
            receivers[receiverAddress] = receiver({
                exists: true,
                approved: false,
                requestCount: 1
            });
        } else {
            r.requestCount = SafeCast.toUint32(
                SafeMath.add(
                    uint256(receivers[receiverAddress].requestCount),
                    1
                )
            );
        }
    }
    /// @notice Return information of a Receiver
    /// @param receiverAddress address or Receiver to be added
    function getReceiver(address receiverAddress)
        public
        view
        returns (receiver memory)
    {
        return receivers[receiverAddress];
    }
    /// @notice Return information of a Donor
    /// @param donorAddress address or Donor to be added
    function getDonor(address donorAddress) public view returns (donor memory) {
        return donors[donorAddress];
    }

    /// @notice Admin approves an address to have the donor role
    /// @param donorAddress The address of donor to be approved
    function approveDonor(address donorAddress) public {
        grantRole(DONOR, donorAddress);
        donors[donorAddress].approved = true;
    }

    /// @notice Admin approves an address to have the receiver role
    /// @param receiverAddress The address of receiver to be approved
    function approveReceiver(address receiverAddress) public {
        grantRole(RECEIVER, receiverAddress);
        receivers[receiverAddress].approved = true;
    }
    /// @notice System emergency pause only by admin
    function pause() public isAdmin {
        _pause();
    }

    /// @notice System upause only by admin
    function unpause() public isAdmin {
        _unpause();
    }
    /// @notice return true if system is paused
    function systemPaused() public view returns (bool) {
        bool paused = paused();
        return paused;
    }
    /// @notice return true if caller is ADMIN
    function isAdminUser() public view returns (bool) {
        if (hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) return true;
        else return false;
    }
}
