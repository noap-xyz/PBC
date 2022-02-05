pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;
struct receiver {
    bool exists;
    bool approved;
    uint32 requestCount;
    //uint32 pageNo;
}

contract Administration {
    function systemPaused() public returns (bool) {}

    function addReceiver(address receiverAddress) public {}

    function getReceiver(address receiverAddress)
        public
        view
        returns (receiver memory)
    {}
}

contract DonateAsset {
    function getDonationRequestCount(uint32 donationId)
        public
        view
        returns (uint32)
    {}

    function UpdateDonation(Donation memory donation, uint32 donationId)
        public
    {}
}

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";

/// @title A Asset donation smart contract
/// @author Fatemeh Heidari Soureshjani
/// @notice This contract facilitates donation of physical assets for specific periods of time between asset owners and receivers
/// @dev time
enum Status {Free, Requested, Donated, Inactive, Burned}

    struct Asset {
        string assetTitle;
        string assetDescription;
        uint32 availablityDate;
        string location;
        address owner;
        string imageIPFSHash;
    }

    struct Donation {
        uint32 donationId;
        uint256 assetId;
        uint32 availablityDate;
        string location;
        Status status;
        address owner;
        address recipient;
        uint32 requestCount;
    }

contract ReceiveAsset {
    Administration ADM;
    DonateAsset DA;
    uint32 lastRequestId;

    constructor(address _da, address _adm) public {
        ADM = Administration(_adm);
        DA = DonateAsset(_da);
        lastRequestId = 0;
    }

    enum RequestStatus {Open, Approved, Rejected}
    enum RequestType {Individual, Project}
    struct Request {
        address receiver;
        string requestDescription;
        uint32 requestDateFrom;
        uint32 requestDateTo;
        RequestStatus status;
        RequestType requestType;
    }
    mapping(uint32 => mapping(uint32 => Request)) public assetRequestList;
    mapping(address => mapping(uint32 => Request)) public addressRequestList;
    modifier whenNotPaused() {
        require(!ADM.systemPaused(), "System is in emergency stop.");
        _;
    }
    event LogRequested(uint32 assetId);
    event LogRequest(Request r, uint32 reCount, address receiver);
    event LogRequestApproved(uint32 assetId, address recAddress);

    /// @notice retrieves all request for a specific donation
    /// @dev There must be better way than returing always an array of 16
    /// @param assetId the unique asset id of donation
    /// @return Request returns an array of type Request and length 16
    function getDonationRequests(uint32 assetId, uint256 requestCount)
        public
        view
        returns (Request[16] memory)
    {
        Request[16] memory requestArray;


            mapping(uint32 => Request) storage requestMapping
         = assetRequestList[assetId];
        for (uint32 i = 0; i < requestCount; i++) {
            requestArray[i] = requestMapping[i];
        }
        return requestArray;
    }

    /// @notice A receiver can register a request for a specific donation previousely added
    /// @notice to list of donation by a donor
    /// @dev date conflicts can be checked
    /// @param donationId The unique id of donation
    /// @param requestDescription The description entered by the receiver
    /// @param requestDateFrom The starting date receiver needs this asset
    /// @param requestDateTo The ending date receiver needs this asset
    function requestAsset(
        uint32 donationId,
        string memory requestDescription,
        uint32 requestDateFrom,
        uint32 requestDateTo
    ) public whenNotPaused {
        ADM.addReceiver(msg.sender);
        receiver memory r = ADM.getReceiver(msg.sender);
        uint32 requestCount = DA.getDonationRequestCount(donationId); ///donationList[assetId];
        //if (requestedItem.requestCount < maxNoOfReqsPerAsst) {
        assetRequestList[donationId][requestCount] = Request({
            receiver: msg.sender,
            requestDescription: requestDescription,
            requestDateFrom: requestDateFrom,
            requestDateTo: requestDateTo,
            status: RequestStatus.Open,
            requestType: RequestType.Individual
        });
        Request storage req = assetRequestList[donationId][requestCount];
        addressRequestList[msg.sender][r.requestCount - 1] = req;
        emit LogRequested(donationId);
        emit LogRequest(req, r.requestCount, msg.sender);
        requestCount = SafeCast.toUint32(
            SafeMath.add(uint256(requestCount), 1)
        );
        Donation memory donation = Donation({
            donationId:donationId,
            assetId: 0,
            availablityDate: 0,
            location: "",
            status: Status.Requested,
            owner: address(0),
            recipient: address(0),
            requestCount: requestCount
        });
        DA.UpdateDonation(donation,donationId);
    }

    /// @notice A Project can register a request for a specific donation previousely added
    /// @notice to list of donation by a donor
    /// @dev date conflicts can be checked
    /// @param donationId The unique id of donation
    /// @param projectAddress address of the project
    function requestAsset(uint32 donationId, address projectAddress)
        public
        whenNotPaused
    {
        ADM.addReceiver(msg.sender);
        uint32 requestCount = DA.getDonationRequestCount(donationId); ///donationList[assetId];
        //if (requestedItem.requestCount < maxNoOfReqsPerAsst) {
        assetRequestList[donationId][requestCount] = Request({
            receiver: projectAddress,
            requestDescription: "",
            requestDateFrom: 0,
            requestDateTo: 0,
            status: RequestStatus.Open,
            requestType: RequestType.Project
        });
        emit LogRequested(donationId);
        requestCount = SafeCast.toUint32(
            SafeMath.add(uint256(requestCount), 1)
        );
        Donation memory donation = Donation({
            donationId:donationId,
            assetId: 0,
            availablityDate: 0,
            location: "",
            status: Status.Requested,
            owner: address(0),
            recipient: address(0),
            requestCount: requestCount
        });
        DA.UpdateDonation(donation,donationId);
    }

    function getReceiver(address receiverAddress)
        public
        view
        returns (receiver memory)
    {
        return ADM.getReceiver(receiverAddress);
    }

    function getRequest(uint32 assetId, uint32 requestId)
        public
        view
        returns (
            address receiver,
            string memory requestDescription,
            uint32 requestDateFrom,
            uint32 requestDateTo
        )
    {
        Request storage request = assetRequestList[assetId][requestId];
        receiver = request.receiver;
        requestDescription = request.requestDescription;
        requestDateFrom = request.requestDateFrom;
        requestDateTo = request.requestDateTo;
        return (receiver, requestDescription, requestDateFrom, requestDateTo);
    }

    function approveRequest(uint32 assetId, address recipientAddress) public {

            mapping(uint32 => Request) storage assetRequests
         = assetRequestList[assetId];
        uint32 requestCount = DA.getDonationRequestCount(assetId);
        for (uint32 i = 0; i < requestCount; i++) {
            if (assetRequests[i].receiver == recipientAddress) {
                Request storage r = assetRequests[i];
                r.status = RequestStatus.Approved;
                emit LogRequestApproved(assetId, recipientAddress);
            }
        }
    }

    function getRequests(address receiverAddress)
        public
        view
        returns (Request[8] memory)
    {
        receiver memory r = getReceiver(receiverAddress);
        Request[8] memory requestList;

            mapping(uint32 => Request) storage t
         = addressRequestList[receiverAddress];
        for (uint32 i = 0; i < r.requestCount; i++) {
            requestList[i] = t[i];
        }
        return requestList;
    }
}
