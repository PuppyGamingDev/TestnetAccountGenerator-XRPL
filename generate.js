const xrpl = require('xrpl');
const fs = require('node:fs');
const cliProgress = require('cli-progress');
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const amount = parseInt(process.argv[2]) || 10;

async function generate() {
	var generatedAccounts = [];
	const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233/');
	await client.connect();
	progress.start(amount, 0);
	for (i = 0; i < amount; i++) {
		const fund_result = await client.fundWallet()
		generatedAccounts.push({
			address: fund_result.wallet.classicAddress,
			seed: fund_result.wallet.seed
		});
		progress.update(i + 1);
	}
	await client.disconnect();
	progress.stop();
	console.log(`Generated ${amount} accounts. Writing to accounts.json.`);
	fs.writeFileSync('accounts.json', JSON.stringify(generatedAccounts, null, 2));
	return;
}

generate();