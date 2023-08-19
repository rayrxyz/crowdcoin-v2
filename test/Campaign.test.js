const Factory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

contract("Campaign", (accounts) => {
	let factory;
	let campaignAddress;
	let campaign;

	beforeEach(async () => {
		factory = await Factory.new({ from: accounts[0] });

		await factory.createCampaign("100", { from: accounts[0] });
		campaignAddress = await factory.getDeployedCampaigns();
		campaign = await Campaign.at(campaignAddress[0]);
	});

	it("deploys a factory and a campaign", () => {
		assert.ok(factory.address);
		assert.ok(campaign.address);
	});

	it("marks caller as the campaign manager", async () => {
		const manager = await campaign.manager();
		assert.equal(accounts[0], manager);
	});

	it("allows people to contribute money and marks them as approvers", async () => {
		await campaign.contribute({ from: accounts[1], value: "200" });

		const isContributor = await campaign.approvers(accounts[1]);
		assert(isContributor);
	});

	it("requires a minimum contribution", async () => {
		try {
			await campaign.contribute({ from: accounts[1], value: "5" });
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	it("allows a manager to make a payment request", async () => {
		await campaign.createRequest("Buy batteries", "100", accounts[1], {
			from: accounts[0],
			gas: "1000000",
		});
		const request = await campaign.requests(0);
		assert.equal("Buy batteries", request.description);
	});

	it("processes requests", async () => {
		await campaign.contribute({
			from: accounts[0],
			value: web3.utils.toWei("10", "ether"),
		});

		await campaign.createRequest(
			"Buy batteries",
			web3.utils.toWei("5", "ether"),
			accounts[1],
			{
				from: accounts[0],
				gas: "1000000",
			}
		);

		await campaign.approveRequest(0, {
			from: accounts[0],
			gas: "1000000",
		});

		await campaign.finalizeRequest(0, {
			from: accounts[0],
			gas: "1000000",
		});

		let balance = await web3.eth.getBalance(accounts[1]);
		balance = web3.utils.fromWei(balance, "ether");
		balance = parseFloat(balance);
		console.log(balance);
		assert(balance > 104);
	});
});
