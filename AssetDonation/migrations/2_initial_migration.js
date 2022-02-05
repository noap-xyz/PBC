var Administration = artifacts.require('./Administration.sol');
var DonateAsset = artifacts.require('./DonateAsset.sol');
var ReceiveAsset = artifacts.require('./ReceiveAsset.sol');

module.exports = async function (deployer) {
    deployer.deploy(Administration).then(() => {
        return deployer.deploy(DonateAsset, Administration.address).then(() =>
            {
                return deployer.deploy(ReceiveAsset, DonateAsset.address, Administration.address);
            }
        )
    })
};