
let BN = web3.utils.BN
let Administration = artifacts.require('Administration')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('Administration', function (accounts) {

    const admin = accounts[0];
    const donor = accounts[1];
    const other = accounts[2];
    const receiver = accounts[3];

    it("should revert if approveDonor is called by a non admin role", async() =>{

        let instance = await Administration.deployed();
        const tx = await instance.addDonor( donor)
        await catchRevert(instance.approveDonor(donor, { from: other }))
    })
    it("should pause system", async() =>{

        let instance = await Administration.deployed();
        const tx = await instance.pause({ from: admin });
        const result = await instance.paused.call();
        assert.equal(result, true, 'paused properly')
    })
    it("should revert if pause is called by a non admin role", async() =>{

        let instance = await Administration.deployed();
        await catchRevert(instance.pause({ from: other }))
    })
    it("check isAdminUser", async() =>{

        let instance = await Administration.deployed();
        const result = await instance.isAdminUser({from:other});
        assert.equal(result, false, 'paused properly')
    })   
    
    it("add receiver", async() =>{

        let instance = await Administration.deployed();
        const tx = await instance.addReceiver(receiver);
        const result = await instance.getReceiver(receiver);
        assert.equal(result[2], 1, 'receiver saved adeq.')
    })  
})
