import Web3 from "web3";
import { PoapContractABI } from "../abi/PoapContractABI";
import contractAddresses from "./contractAddresses.js"

const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
}
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545", null, OPTIONS);
var poapContractAddress;
poapContractAddress = contractAddresses.poapContractAddress;

const poapcontract = new web3.eth.Contract(PoapContractABI, poapContractAddress);

export default poapcontract;
