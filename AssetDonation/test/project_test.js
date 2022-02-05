
let BN = web3.utils.BN
let ProjectFactory = artifacts.require('ProjectFactory')
let Administration = artifacts.require('Administration')
let DonateAsset = artifacts.require('DonateAsset')
let ReceiveAsset = artifacts.require('ReceiveAsset')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('ProjectFactory', function (accounts) {
    
    const admin = accounts[0]
    const donor = accounts[1]
    const receiver = accounts[2]
    const other = accounts[3]
    const projectOwner = accounts[1];
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    const title = "RV"
    const des = "RV"
    const availablitydate = 3545435445;
    const loc = "albuquerque";
    const ipfsHash = "QmdBC2po8FGwh4niygC8i4NfpVXAiPY6Ei2eisNy76ThaW";
    const initialBalance = 10;
    const projectDescription = "Desc";
    const projectTitle = "Title";
    const projectKickOffTime = 12345678;
    const projectKickOffMinBalance = 10;

    // it("add new project", async() =>{

    //     let instance = await ProjectFactory.deployed();
    //     const tx = await instance.createProject(projectDescription,projectTitle,projectKickOffTime,projectKickOffMinBalance,{from:projectOwner,value:initialBalance});
    //     const tx1 = await instance.createProject(projectDescription,projectTitle,projectKickOffTime,projectKickOffMinBalance,{from:projectOwner,value:initialBalance});
    //     const result = await instance.getProjects();
    //     assert.equal(result.length, 3, 'update projects array appropriately')
    //     //await catchRevert(instance.approveDonor(donor, { from: other }))
    // })


    it("add new project", async() =>{

        let instance = await ProjectFactory.deployed();
        const tx = await instance.createProject(projectDescription,projectTitle,projectKickOffTime,projectKickOffMinBalance,{from:projectOwner,value:initialBalance});
        const tx1 = await instance.createProject(projectDescription,projectTitle,projectKickOffTime,projectKickOffMinBalance,{from:projectOwner,value:initialBalance});
        const result = await instance.getProject(0);
        assert.equal(result[0], projectTitle, 'return project data')
        //await catchRevert(instance.approveDonor(donor, { from: other }))
    })    

    it("transfer ether", async () => {

        let instance = await ProjectFactory.deployed();
        const result = await instance.donateToProject(0, { from: other, value: 10 });
        const result1 = await instance.getProjectBalance(0, { from: other });
        assert.equal(result1, 10, 'return project data')
        //await catchRevert(instance.approveDonor(donor, { from: other }))
    })
    it("get list", async () => {

        let instance = await ProjectFactory.deployed();
        const result = await instance.donateToProject(0, { from: other, value: 10 });
        const result1 = await instance.getProjects({ from: other });
        assert.equal(result1.length, 8, 'return project data')
        //await catchRevert(instance.approveDonor(donor, { from: other }))
    }) 
    
    it("request Asset for project", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        let instanceReceive = await ReceiveAsset.deployed(instanceDonate.address, adminInstance.address);
        let instance = await ProjectFactory.deployed();
        const projAddress = await instance.getProjectAddress(0);
        

        const tx4 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })
        const tx5 = await instanceReceive.requestAsset(0, projAddress)

        const resultAsset = await instanceDonate.getDonation.call(0)
        const result = await instanceReceive.getRequest.call(0, 0)

        assert.equal(result[0], projAddress, 'receiver is not saved properly')
        assert.equal(resultAsset.status, 1, 'the status should be Requested')
        assert.equal(resultAsset.requestCount, 1, 'the status should be Requested')
    })   
        
})
