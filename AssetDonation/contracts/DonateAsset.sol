pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;
struct donor {
    bool exists;
    bool approved;
    uint32 donationCount;
}

contract Administration {
    function systemPaused() public returns (bool) {}

    function addDonor(address donorAddress) public {}

    function getDonor(address donorAddress)
        public
        view
        returns (donor memory)
    {}
}

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";

/// @title A Asset donation smart contract
/// @author Fatemeh Heidari Soureshjani
/// @notice This contract facilitates donation of physical assets for specific periods of time between asset owners and receivers

contract DonateAsset is ERC721 {
    Administration ADM;

    uint32 lastAssetId;
    uint32 lastDonationId;

    constructor(address _adm) public ERC721("MyToken", "MTS") {
        ADM = Administration(_adm);
        lastAssetId = 0;
        lastDonationId = 0;
    }

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

    mapping(uint32 => Donation) public donationList;
    mapping(uint256 => Asset) public AssetList;

    modifier assetIsFree(uint32 donationId) {
        require(
            donationList[donationId].recipient == address(0) &&
                (donationList[donationId].status == Status.Free ||
                    donationList[donationId].status == Status.Requested),
            "Asset is not Free."
        );
        _;
    }

    modifier assetExists(uint32 donationId) {
        require(donationList[donationId].owner != address(0), "Invalid asset");
        _;
    }

    modifier isAssetOwner(uint256 assetId) {
        require(ownerOf(assetId) == msg.sender, "Sender nis ot asset owner.");
        _;
    }

    modifier whenNotPaused() {
        require(!ADM.systemPaused(), "System is in emergency stop.");
        _;
    }

    event LogFree(uint32 assetId);

    event LogDonated(uint32 assetId);

    // event LogInactive(uint32 assetId);
    // event LogIBurned(uint32 assetId);

    function UpdateDonation(Donation memory donation, uint32 donationId)
        public
    {
        if (donation.status > donationList[donationId].status) {
            donationList[donationId].status = donation.status;
        }
        donationList[donationId].requestCount = donation.requestCount;
    }

    /// @notice Adds a new asset to list of donated assets(Should be called by a donor)
    /// @dev other asset struct members should be added
    /// @param assetDescription Descrption of the asset entered by owner
    /// @param availablityDate the first date the owner can donate the asset
    /// @param location the location of the donated asset
    /// @param imageIPFSHash IPFS hash of the asset image uploaded by owner and saved to IPFS
    function addAsset(
        string memory assetTitle,
        string memory assetDescription,
        uint32 availablityDate,
        string memory location,
        string memory imageIPFSHash
    ) public whenNotPaused {
        ADM.addDonor(msg.sender);
        uint32 assetId = mintToken(msg.sender);
        AssetList[assetId] = Asset({
            assetTitle: assetTitle,
            assetDescription: assetDescription,
            availablityDate: availablityDate,
            location: location,
            owner: msg.sender,
            imageIPFSHash: imageIPFSHash
        });
        donationList[lastDonationId] = Donation({
            donationId:lastDonationId,
            assetId: assetId,
            availablityDate: availablityDate,
            location: location,
            status: Status.Free,
            owner: msg.sender,
            recipient: address(0),
            requestCount: 0
        });
        lastDonationId = SafeCast.toUint32(
            SafeMath.add(uint256(lastDonationId), 1)
        );
        emit LogFree(assetId);
    }

    /// @notice Returns all donations of an donor(it shoud be called by a donor)
    /// @dev There must be better way than returing always an array of 16
    /// @return Asset returns an array of type asset and length 16 of donations of msg.sender
    function getDonationsByOwner(uint256 pageNo)
        public
        view
        returns (Donation[8] memory,Asset[8] memory)
    {
        donor memory d = ADM.getDonor(msg.sender);
        uint256 donationCount = d.donationCount; //uint(balanceOf(msg.sender)); //donors[msg.sender].donationCount;
        //uint32 pageNo = donors[msg.sender].pageNo;
        uint256 nextStart = SafeMath.mul(pageNo, 8); //0
        uint256 rem = SafeMath.sub(donationCount, nextStart); //1
        uint256 index = 0;
        uint32 j = 0;
        Donation[8] memory _donationList;
        Asset[8] memory _assetList;
        if (rem < 0) {
            return (_donationList,_assetList);
        } else {
            if ((rem) < 8) {
                index = rem; //1
            } else {
                index = 8;
            }
            uint nextInd = 0;
            uint256 loopEnd = SafeMath.add(nextStart, index); //9
            for (uint32 i = SafeCast.toUint32( nextStart); i < lastDonationId; i++) {
                if (donationList[i].owner == msg.sender) {
                    //if (j > nextStart) {
                        nextInd = SafeMath.sub(j,nextStart); 
                        _donationList[nextInd] = donationList[i];
                        j++;
                        _assetList[nextInd] = AssetList[donationList[i].assetId];
                    //} else {
                    //    j++;
                    //}
                }
                if (j == loopEnd) {
                    break;
                }
            }
            // for (uint i = nextStart; i < loopEnd; i++) {
            //     tokenId = uint32(donationOfOwnerByIndex(msg.sender, i));
            //     assetList[SafeMath.sub(i , nextStart)] = donationList[tokenId];
            // }
            return (_donationList,_assetList);
        }
    }

    /// @notice returns all donations
    /// @dev There must be better way than returing always an array of 16
    /// @return Asset returns an array of type asset and length 16 of all donations
    function getAllDonations() public view returns (Donation[16] memory,Asset[16] memory) {
        uint32 index = 0;
        Donation[16] memory _donationList;
        Asset[16] memory _assetList;
        if (lastAssetId <= 16) {
            index = lastDonationId;
        } else {
            index = 16;
        }
        for (uint32 i = 0; i < index; i++) {
            _donationList[i] = donationList[i];
            _assetList[i] = AssetList[donationList[i].assetId];
        }
        return (_donationList,_assetList);
    }

    /// @notice The ERC721 stadard for nunfungible token is used to maintain ownership of assets
    /// @notice everytime a new token is minted based on current value of lastAssetId for assetOwner address, and then lastAssetId is increased
    /// @param assetOwner the owner of the new asset
    /// @return returns the id of new minted token
    function mintToken(
        address assetOwner //isDonor(msg.sender)
    ) public whenNotPaused returns (uint32) {
        _safeMint(assetOwner, lastAssetId);
        uint32 assetId = lastAssetId;
        lastAssetId = SafeCast.toUint32(SafeMath.add(uint256(lastAssetId), 1));
        return assetId;
    }

    /// @notice a donor can approve a specific request and this function assigns the recipient of this asset to the recipientAddress and transfers the token ownership
    /// @notice caller should be a donor and recipient should be a receiver
    /// @dev change related request's status to approved, Project should implement onERC721Received
    /// @param donationId unique id of donation to be donated
    /// @param recipientAddress donation receiver
    function donateAsset(
        uint32 donationId,
        uint256 assetId,
        address recipientAddress
    ) public 
    assetIsFree(donationId) 
    isAssetOwner(assetId) 
    whenNotPaused 
    {
        safeTransferFrom(msg.sender, recipientAddress, assetId);
        donationList[donationId].recipient = recipientAddress;
        donationList[donationId].status = Status.Donated;
        emit LogDonated(donationId);
    }

    function getDonationRequestCount(uint32 donationId)
        public
        view
        returns (uint32)
    {
        return donationList[donationId].requestCount;
    }

    function getDonation(uint32 donationId)
        public
        view
        returns (Donation memory)
    {
        return donationList[donationId];
    }

    function getAsset(uint256 assetId) public view returns (Asset memory) {
        return AssetList[assetId];
    }
}
