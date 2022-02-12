import Web3 from "web3";
import { NoapContractABI } from "../abi/NoapContractABI";
import contractAddresses from "./contractAddresses.js"

const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
}
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545", null, OPTIONS);
var noapContractAddress;
noapContractAddress = contractAddresses.noapContractAddress;

const noapcontract = new web3.eth.Contract(NoapContractABI, noapContractAddress);

export default noapcontract;
