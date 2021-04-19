const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: '1000000' });

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000'
	});

	[ campaignAddress ] = await factory.methods.getDeployedCampaigns().call();

	campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaign', () => {
	it('deploys factory and campaign', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});
	it('caller is the manager or not', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});
	it('allows to contriibute', async () => {
		await campaign.methods.contribute().send({
			value: '500',
			from: accounts[1]
		});
		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		assert(isContributor);
	});
	it('requires a minimum contribution', async () => {
		try {
			await campaign.methods.contribute().send({
				value: '10',
				from: accounts[1]
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});
	it('allows manager to request', async () => {
		await campaign.methods.createRequest('Buy battery', '100', accounts[0]).send({
			from: accounts[0],
			gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call()
        assert.equal('Buy battery',request.description)
	});
});
