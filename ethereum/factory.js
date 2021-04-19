import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xAbe97e5c4213ec266dafb70D32BaD01320198Ad1'
)

export default instance;