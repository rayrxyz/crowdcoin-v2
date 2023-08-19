const Factory = artifacts.require("CampaignFactory");

module.exports = async function (deployer) {
	try {
		deployer.deploy(Factory);
	} catch (error) {
		console.log("Deployment Error:", error);
	}
};
