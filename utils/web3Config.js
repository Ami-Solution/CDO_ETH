import Web3 from 'web3';

let web3;

if(typeof window != 'undefined' && typeof window.web3 != 'undefined'){
	//we are in the browser and a web3 has been injected
	//check if web3 is from metamask
	if(window.web3.currentProvider.isMetaMask){
		console.log("using metamask's injected web3!!");
		web3 = new Web3(window.web3.currentProvider);
	}else{
		console.log('using unknown injected web3!!');
		web3 = new Web3(window.web3.currentProvider);
	}
}else{
	//not in browser or no web3 available
	const provider = new Web3.providers.HttpProvider(
		"http://localhost:8545"
	);
	web3 = new Web3(provider);
}
// //window not available due to next hot module loading
// const web3 = new Web3(window.web3.currentProvider);

export default web3;
