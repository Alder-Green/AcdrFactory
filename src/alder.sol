// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Alder is ERC20 {
    address public alder_admin;
    enum Status { Pending, Accepted, Rejected }

    // mappings
    mapping(address => uint256) public vvbs;
    mapping(address => uint256) public farmers;
    mapping(address => uint256) public farmerACDR; 

    // Structs for Project and MRVReport
    struct Project {
        address owner;
        address vvb_assigned;
        Status status;
        uint256 dateOfSubmission;
        bytes blob;
    }

    struct MRVReport {
        uint256 projectId;
        address owner;
        address vvb_assigned;
        Status status;
        uint256 dateOfSubmission;
        bytes blob;
    }

    mapping(uint256 => Project) public projects;
    mapping(uint256 => MRVReport) public mrv_reports;

    uint256 public totalPool;
    uint256 public lastProjectId;
    uint256 public lastMRVReportId;
    uint256 public lastFarmerId;
    uint256 public lastVVBId;

    // Events
    event ProjectStatusChanged(uint256 indexed projectId, Status status);
    event MRVReportStatusChanged(uint256 indexed reportId, Status status);
    event FarmerAdded(address indexed farmer, uint256 indexed farmerId);
    event FarmerRemoved(address indexed farmer, uint256 indexed farmerId);
    event VVBAdded(address indexed vvb, uint256 indexed vvbId);
    event VVBRemoved(address indexed vvb, uint256 indexed vvbId);
    event VVBAssignedToProject(uint256 indexed projectId, address vvb);
    event VVBAssignedToMRV(uint256 indexed projectId, address vvb);
    event TokensMinted(uint256 amount);
    event TokensBurned(uint256 amount);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event ProjectAdded(uint256 indexed projectId, address owner, string description);
    event ProjectRemoved(uint256 indexed projectId);
    event MRVReportAdded(uint256 indexed reportId, uint256 indexed projectId, address owner, string description);
    event FarmerACDRSet(address indexed farmer, uint256 amount);

    // Constructor
    constructor() ERC20("Alder Carbon Direct Removals", "ACDR") {
        alder_admin = msg.sender;
    }

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == alder_admin, "Not authorized");
        _;
    }

    modifier onlyFarmer() {
        require(farmers[msg.sender] > 0, "Not a registered farmer");
        _;
    }

    modifier onlyVVB(uint256 projectId) {
        require(projects[projectId].vvb_assigned == msg.sender, "Not authorized");
        _;
    }

    modifier onlyAdminOrFarmer() {
        require(msg.sender == alder_admin || farmers[msg.sender] > 0, "Not authorized");
        _;
    }

    modifier onlyAdminOrVVB(uint256 projectId) {
        require(msg.sender == alder_admin || projects[projectId].vvb_assigned == msg.sender, "Not authorized");
        _;
    }

    // Token management
    function mintACDR(uint256 amount) external onlyAdmin {
        require(amount > 0, "Invalid amount");
        _mint(address(this), amount);
        totalPool += amount;
        emit TokensMinted(amount);
    }

    function burnACDR(uint256 amount) private onlyAdmin {
        require(amount > 0 && amount <= totalPool, "Invalid amount");
        _burn(address(this), amount);
        totalPool -= amount;
        emit TokensBurned(amount);
    }

    function retire(uint256 amount) external onlyAdmin {
        burnACDR(amount);
    }

    function setFarmerACDR(address farmer, uint256 amount) external onlyAdmin {
        farmerACDR[farmer] = amount;
        emit FarmerACDRSet(farmer, amount);
    }

    // Farmer management
    function addFarmer(address farmer, uint256 farmerId) external onlyAdmin {
        require(farmer != address(0), "Invalid farmer address");
        farmers[farmer] = farmerId;
        lastFarmerId = farmerId;
        emit FarmerAdded(farmer, farmerId);
    }

    function removeFarmer(address farmer) external onlyAdmin {
        uint256 farmerId = farmers[farmer];
        require(farmerId != 0, "Farmer does not exist");
        delete farmers[farmer];
        emit FarmerRemoved(farmer, farmerId);
    }

    // VVB management
    function addVVB(address vvb, uint256 vvbId) external onlyAdmin {
        require(vvb != address(0), "Invalid VVB address");
        vvbs[vvb] = vvbId;
        lastVVBId = vvbId;
        emit VVBAdded(vvb, vvbId);
    }

    function removeVVB(address vvb) external onlyAdmin {
        uint256 vvbId = vvbs[vvb];
        require(vvbId != 0, "VVB does not exist");
        delete vvbs[vvb];
        emit VVBRemoved(vvb, vvbId);
    }

    function assignVVBToProject(uint256 projectId, address vvb) external onlyAdmin {
        require(projects[projectId].owner != address(0), "Project does not exist");
        require(vvbs[vvb] != 0, "VVB does not exist");
        projects[projectId].vvb_assigned = vvb;
        emit VVBAssignedToProject(projectId, vvb);
    }

    function assignVVBToMRV(uint256 reportId, address vvb) external onlyAdmin {
        require(mrv_reports[reportId].owner != address(0), "MRV report does not exist");
        require(vvbs[vvb] != 0, "VVB does not exist");
        mrv_reports[reportId].vvb_assigned = vvb;
        emit VVBAssignedToMRV(reportId, vvb);
    }

    // Project and MRV report management
    function acceptProject(uint256 projectId) external onlyVVB(projectId) {
        require(projects[projectId].status == Status.Pending, "Project is not pending");
        projects[projectId].status = Status.Accepted;
        emit ProjectStatusChanged(projectId, Status.Accepted);
    }

    function rejectProject(uint256 projectId) external onlyVVB(projectId) {
        require(projects[projectId].status == Status.Pending, "Project is not pending");
        projects[projectId].status = Status.Rejected;
        emit ProjectStatusChanged(projectId, Status.Rejected);
    }

    function addMRVReport(uint256 reportId, uint256 projectId, address owner, uint256 date, bytes memory blob) external onlyAdminOrFarmer {
        require(projects[projectId].owner != address(0), "Project does not exist");
        require(owner != address(0), "Invalid owner address");
        mrv_reports[reportId] = MRVReport(projectId, owner, owner, Status.Pending, date, blob);
        string memory description = string(blob);
        lastMRVReportId = reportId;
        emit MRVReportAdded(reportId, projectId, owner, description);
        emit MRVReportStatusChanged(reportId, Status.Pending);
    }


    function removeMRVReport(uint256 reportId) external onlyAdminOrFarmer {
        require(mrv_reports[reportId].owner != address(0), "MRV report does not exist");
        delete mrv_reports[reportId];
        emit MRVReportStatusChanged(reportId, Status.Rejected);
    }

    function addProject(uint256 projectId, address owner, uint256 dateOfSubmission, bytes memory blob) external onlyAdminOrFarmer {
        require(owner != address(0), "Invalid owner address");
        require(projects[projectId].owner == address(0), "Project already exists");
        projects[projectId] = Project(owner, address(0), Status.Pending, dateOfSubmission, blob);
        string memory description = string(blob);
        lastProjectId = projectId;
        emit ProjectAdded(projectId, owner, description);
    }

    function removeProject(uint256 projectId) external onlyAdminOrFarmer {
        require(projects[projectId].owner != address(0), "Project does not exist");
        delete projects[projectId];
        emit ProjectRemoved(projectId);
    }

    // Function to remove all VVBs
    function removeAllVVBs() external onlyAdmin {
        for (uint256 i = 1; i <= lastVVBId; i++) {
            address vvb = address(uint160(i));
            if (vvbs[vvb] != 0) {
                delete vvbs[vvb];
                emit VVBRemoved(vvb, i);
            }
        }
        lastVVBId = 0;
    }

    // Function to remove all farmers
    function removeAllFarmers() external onlyAdmin {
        for (uint256 i = 1; i <= lastFarmerId; i++) {
            address farmer = address(uint160(i));
            if (farmers[farmer] != 0) {
                delete farmers[farmer];
                emit FarmerRemoved(farmer, i);
            }
        }
        lastFarmerId = 0;
    }

    // Function to remove all projects
    function removeAllProjects() external onlyAdmin {
        for (uint256 i = 1; i <= lastProjectId; i++) {
            if (projects[i].owner != address(0)) {
                delete projects[i];
                emit ProjectRemoved(i);
            }
        }
        lastProjectId = 0;
    }

    // Function to remove all MRV reports
    function removeAllMRVReports() external onlyAdmin {
        for (uint256 i = 1; i <= lastMRVReportId; i++) {
            if (mrv_reports[i].owner != address(0)) {
                delete mrv_reports[i];
                emit MRVReportStatusChanged(i, Status.Rejected);
            }
        }
        lastMRVReportId = 0;
    }

    // Getters
    function getFarmerBalance(address farmer) external view returns (uint256) {
        return balanceOf(farmer);
    }

    function getFarmer(address farmer) external view returns (uint256) {
        return farmers[farmer];
    }

    function getVVB(address vvb) external view returns (uint256) {
        return vvbs[vvb];
    }

    function getFarmerContribution(address farmer) external view returns (uint256) {
        return farmerACDR[farmer];
    }

    function getFarmerContributionPercentage(address farmer) external view returns (uint256) {
        require(totalPool > 0, "Total pool is zero");
        return (farmerACDR[farmer] * 100) / totalPool;
    }

    function getTotalPool() external view returns (uint256) {
        return totalPool;
    }

  // Function to get project details including description
    function getProjectDetails(uint256 projectId) public view returns (address, address, Status, uint256, string memory) {
        require(projects[projectId].owner != address(0), "Project does not exist");
        Project memory project = projects[projectId];
        string memory description = string(project.blob);
        return (project.owner, project.vvb_assigned, project.status, project.dateOfSubmission, description);
    }

    // Function to get MRV report details including description
    function getMRVReportDetails(uint256 reportId) public view returns (uint256, address, address, Status, uint256, string memory) {
        require(mrv_reports[reportId].owner != address(0), "MRV report does not exist");
        MRVReport memory report = mrv_reports[reportId];
        string memory description = string(report.blob);
        return (report.projectId, report.owner, report.vvb_assigned, report.status, report.dateOfSubmission, description);
    }


    // Function to get the last project ID
    function getLastProjectId() public view returns (uint256) {
        return lastProjectId;
    }

    // Function to get the last MRV report ID
    function getLastMRVReportId() public view returns (uint256) {
        return lastMRVReportId;
    }

    // Function to get the last farmer ID
    function getLastFarmerId() public view returns (uint256) {
        return lastFarmerId;
    }

    // Function to get the last VVB ID
    function getLastVVBId() public view returns (uint256) {
        return lastVVBId;
    }

}
