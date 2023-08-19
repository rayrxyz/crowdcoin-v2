import web3 from "./web3";
import CampaignFactory from "./build/contracts/CampaignFactory.json";

const instance = new web3.eth.Contract(
	CampaignFactory.abi,
	"0xeba8EBCBDc5b30e5A0Eef17B93b95a9dA6F91e52"
);

export default instance;
