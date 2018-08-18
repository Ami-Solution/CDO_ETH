
import web3 from './web3Config';
import DebtKernel from '../build/contracts/DebtKernel.json';

const fund = new web3.eth.Contract(
	Fund.abi,
	'0x9065695b910e00f3cfaa4057904267c5040d8851'
);

export default fund;