
let BN = web3.utils.BN
let Administration = artifacts.require('Administration')
let DonateAsset = artifacts.require('DonateAsset')
let ReceiveAsset = artifacts.require('ReceiveAsset')
let catchRevert = require("./exceptionsHelpers.js").catchRevert

contract('donationTest', function (accounts) {

    const admin = accounts[0]
    const donor = accounts[1]
    const receiver = accounts[2]
    const other = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    const title = "RV"
    const des = "RV"
    const availablitydate = 3545435445;
    const loc = "albuquerque";
    const ipfsHash = "QmdBC2po8FGwh4niygC8i4NfpVXAiPY6Ei2eisNy76ThaW";


    it("should revert if addAsset is called in paused situation", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const t3 = await adminInstance.pause({ from: admin })
        await catchRevert(instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor }))
        const t4 = await adminInstance.unpause({ from: admin })
    })

    it("add an asset", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const tx2 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })

        const result = await instanceDonate.getDonation.call(0);

        assert.equal(result.availablityDate, availablitydate, 'availablitydate is not saved properly')
        assert.equal(result.location, loc, 'location is not saved properly')
        assert.equal(result.status, 0, 'the status should be Free')
        assert.equal(result.owner, donor, 'the owner of asset should be equal to donor')
        assert.equal(result.recipient, emptyAddress, 'the receiver address should be empty')
    })


    it("add asset updates donationCount in donor", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const tx = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })
        const result = await adminInstance.getDonor.call(donor);
        assert.equal(result.exists, true, 'donation count is not increased appropriately')
        assert.equal(result.donationCount.toString(10), 2, 'donation count is not increased appropriately');
    })

    it("emit LogFree event when an asset is added", async () => {
        let eventEmitted = false
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const tx = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })

        if (tx.logs[1].event == "LogFree") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'adding an asset should emit a Free event')
    })

    const requestDescription = 'Request 0 Asset 0';
    const requestDateFrom = 12345678;
    const requestDateTo = 12345789;

    it("request an asset", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        let instanceReceive = await ReceiveAsset.deployed(instanceDonate.address, adminInstance.address);
        const tx4 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })
        const tx5 = await instanceReceive.requestAsset(2, requestDescription,
            requestDateFrom,
            requestDateTo, { from: receiver })

        const resultAsset = await instanceDonate.getDonation.call(2)
        const result = await instanceReceive.getRequest.call(2, 0)

        assert.equal(result[0], receiver, 'receiver is not saved properly')
        assert.equal(result[1], requestDescription, 'requestDescription is not saved properly')
        assert.equal(result[2].toString(10), requestDateFrom, 'requestDateFrom is not saved properly')
        assert.equal(result[3].toString(10), requestDateTo, 'requestDateTo is not saved properly')
        assert.equal(resultAsset.status, 1, 'the status should be Requested')
        assert.equal(resultAsset.requestCount, 1, 'the status should be Requested')
    })
    it("request Count updated", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        let instanceReceive = await ReceiveAsset.deployed(instanceDonate.address, adminInstance.address);
        const tx4 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })
        const tx5 = await instanceReceive.requestAsset(2, requestDescription,
            requestDateFrom,
            requestDateTo, { from: receiver })
            
        const result = await adminInstance.getReceiver(receiver);
        assert.equal(result[2], 2, 'receiver is not saved properly')

    })
    it("request list", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        let instanceReceive = await ReceiveAsset.deployed(instanceDonate.address, adminInstance.address);
        const tx4 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })
        const tx5 = await instanceReceive.requestAsset(2, requestDescription,
            requestDateFrom,
            requestDateTo, { from: receiver })
        const result = await instanceReceive.getReceiver.call(receiver);
        //assert.equal(result[2], receiver, 'receiver is not saved properly');
        const result1 = await instanceReceive.getRequests.call(receiver);

        assert.equal(result1[0][0], receiver, 'receiver is not saved properly')
        // assert.equal(result1[0][1], receiver, 'receiver is not saved properly')
        // assert.equal(result1[0][2], receiver, 'receiver is not saved properly')
        // assert.equal(result1[0][3], receiver, 'receiver is not saved properly')
    })
    it("request asset emitts LogRequested", async () => {
        let eventEmitted = false
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        let instanceReceive = await ReceiveAsset.deployed(instanceDonate.address, adminInstance.address);
        const tx4 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })
        const tx5 = await instanceReceive.requestAsset(3, requestDescription,
            requestDateFrom,
            requestDateTo, { from: receiver })

        if (tx5.logs[0].event == "LogRequested") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'request asset should emit a Requested event')
    })

    it("should revert if donateAsset is not called by owner", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const tx2 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })

        await catchRevert(instanceDonate.donateAsset(5,5, receiver, { from: other }))

    })

    it("donate an asset", async () => {
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const tx2 = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })

        const tx3 = await instanceDonate.donateAsset(5,5, receiver, { from: donor })

        const resultAsset = await instanceDonate.getDonation.call(5)

        assert.equal(resultAsset.status, 2, 'the status should be Donated')
        assert.equal(resultAsset.recipient, receiver, 'the recipient address should be updated to receiver')
    })

    it("donate asset emitts LogDonated", async () => {
        let eventEmitted = false
        let adminInstance = await Administration.deployed();
        let instanceDonate = await DonateAsset.deployed(adminInstance.address);
        const tx = await instanceDonate.addAsset(title, des, availablitydate, loc, ipfsHash, { from: donor })

        const tx1 = await instanceDonate.donateAsset(6, 6,receiver, { from: donor })
        if (tx1.logs[2].event == "LogDonated") {
            eventEmitted = true
        }

        assert.equal(eventEmitted, true, 'donate asset should emit a LogDonated event')

    })


})
