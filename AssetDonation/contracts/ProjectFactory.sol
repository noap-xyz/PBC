pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

/// @title ProjectFactory
/// @author Fatemeh Heidari Soureshjani
/// @notice Project Factory is used to create new contract for each new project added to system
import "./ProjectFunding.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
struct Project {
    string projectTitle;
    string projectDescription;
    address payable projectOwner;
    uint32 projectKickOffMinBalance;
    uint32 projectKickOffTime;
}

contract ProjectFactory is ReentrancyGuard {
    address payable[] public projects;
    event projectCreated(ProjectFunding project);
    event logBalance(uint256 x);
    event LogTransfer(address, address, uint256);

    address private Owner;

    constructor() public {
        Owner = msg.sender;
    }


    modifier onlyOwner(address ad) {
        require(msg.sender == ad, "System is in emergency stop.");
        _;
    }

    /// @notice Adds a new project contract and adds its addres to list of projects
    /// @param _projectDescription Descrption of the project entered by project owner
    /// @param _projectTitle DescrpTitletion of the project entered by project owner
    /// @param _projectKickOffTime The time the owner plans to start the project
    /// @param _projectKickOffMinBalance The minimum amount of balance project owner needs to be collected
    function createProject(
        string memory _projectDescription,
        string memory _projectTitle,
        uint32 _projectKickOffTime,
        uint32 _projectKickOffMinBalance
    ) public payable 
    //whenNotPaused 
    {
        ProjectFunding project = new ProjectFunding(
            msg.sender,
            uint32(msg.value),
            _projectDescription,
            _projectTitle,
            _projectKickOffTime,
            _projectKickOffMinBalance
        );
        address nftAddress = address(project);
        address payable addr = address(uint160(nftAddress));
        //addr.send(address(this).balance);
        projects.push(addr);
        emit projectCreated(project);
    }
    /// @notice Returns list of all projects
    function getProjects() external view returns (Project[8] memory) {
        Project[8] memory projectList;
        string memory _projectTitle;
        string memory _projectDescription;
        address payable _projectOwner;
        uint32 _projectKickOffMinBalance;
        uint32 _projectKickOffTime;
        uint32 j = 0;
        for (uint32 i = 0; i < projects.length; i++) {
            (
                _projectTitle,
                _projectDescription,
                _projectOwner,
                _projectKickOffMinBalance,
                _projectKickOffTime
            ) = this.getProject(i);
            Project memory p = Project({
                projectTitle: _projectTitle,
                projectDescription: _projectDescription,
                projectOwner: _projectOwner,
                projectKickOffMinBalance: _projectKickOffMinBalance,
                projectKickOffTime: _projectKickOffTime
            });
            if (p.projectOwner == msg.sender) {
                projectList[j] = p;
                j++;
            }
        }
        return projectList;
    }

   function getAllProjects() external view returns (Project[8] memory) {
        Project[8] memory projectList;
        string memory _projectTitle;
        string memory _projectDescription;
        address payable _projectOwner;
        uint32 _projectKickOffMinBalance;
        uint32 _projectKickOffTime;
        for (uint32 i = 0; i < projects.length; i++) {
            (
                _projectTitle,
                _projectDescription,
                _projectOwner,
                _projectKickOffMinBalance,
                _projectKickOffTime
            ) = this.getProject(i);
            Project memory p = Project({
                projectTitle: _projectTitle,
                projectDescription: _projectDescription,
                projectOwner: _projectOwner,
                projectKickOffMinBalance: _projectKickOffMinBalance,
                projectKickOffTime: _projectKickOffTime
            });
            projectList[i] = p;

        }
        return projectList;
    }    
    /// @notice Returns a project address by its index in list of projects
    /// @param projectId project index in list of projects
    function getProjectAddress(uint256 projectId)
        external
        view
        returns (address)
    {
        return projects[projectId];
    }
    /// @notice Returns a project by its index in list of projects
    /// @param projectId project index in list of projects
    function getProject(uint32 projectId)
        external
        view
        returns (
            string memory,
            string memory,
            address payable,
            uint32,
            uint32
        )
    {
        return ProjectFunding(projects[projectId]).getProject();
    }
    /// @notice Returns a project by its address
    /// @param projectAddress project contract address
    function getProjectByAddress(address payable projectAddress)
        external
        view
        returns (
            string memory,
            string memory,
            address payable,
            uint32,
            uint32
        )
    {
        return ProjectFunding(projectAddress).getProject();
    }
    /// @notice Adds an amount to the balance of a project contract
    /// @param projectId project index in list of projects
    function donateToProject(uint32 projectId) public payable //whenNotPaused 
    {
        projects[projectId].transfer(msg.value);
    }
    /// @notice transfers balance of a project to its owner
    /// @param projectAddress project contract address
    function claimDonaition(address payable projectAddress)
        public
        payable
        nonReentrant
    {
        ProjectFunding(projectAddress).claimDonation(msg.sender);
    }
    /// @notice returns balance of a project by its index in list of projects
    /// @param projectId project index in list of projects
    function getProjectBalance(uint32 projectId)
        external
        view
        returns (uint256)
    {
        return projects[projectId].balance; //.getBalance();
        //emit logBalance(x);
        //return x;
    }
    /// @notice returns balance of a project by its address
    /// @param projectAddress project contract address
    function getProjectBalanceByAddress(address payable projectAddress)
        external
        view
        returns (uint256)
    {
        return projectAddress.balance; //.getBalance();
        //emit logBalance(x);
        //return x;
    }
    /// @notice returns address of a project by its index in list of projects
    /// @param projectId project index in list of projects
    function getProjectAddress(uint32 projectId)
        public
        view
        returns (address payable)
    {
        return projects[projectId];
    }
}
