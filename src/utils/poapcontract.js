import Web3 from "web3";
import { PoapContractABI } from "../ABI/PoapContractABI";

const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
}
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545", null, OPTIONS);
var poapContractAddress;
console.log("web3.givenProvider.chainId");
console.log(web3.givenProvider.chainId);
poapContractAddress = "0x22c1f6050e56d2876009903609a2cc3fef83b415";

const poapcontract = new web3.eth.Contract(PoapContractABI, poapContractAddress);

export default poapcontract;
