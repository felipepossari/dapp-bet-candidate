import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0xf4d3fc19da4dfb47f09b9a6849cafabb87e9b52a";

export async function doLogin() {

    // Check if MetaMask is installed
    if (!window.ethereum) { throw new Error("MetaMask not installed"); }

    // Connect to MetaMask
    const web3 = new Web3(window.ethereum);

    // Request accounts
    const accounts = await web3.eth.requestAccounts();

    if (!accounts || !accounts.length) { throw new Error("No accounts found"); }

    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];
}

function getContract() {
    if (!window.ethereum) { throw new Error("MetaMask not installed"); }

    const from = localStorage.getItem("wallet");

    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getDispute() {
    const contract = getContract();
    return await contract.methods.dispute().call();
}

export async function bet(candidate, amountIEth) {
    const contract = getContract();
    return await contract.methods.bet(candidate).send({
        value: Web3.utils.toWei(amountIEth, "ether"),
        gas: 115635,
        gasPrice: "37636000015"
    });
}

export async function claimPrize() {
    const contract = getContract();
    return await contract.methods.claim().send();
}