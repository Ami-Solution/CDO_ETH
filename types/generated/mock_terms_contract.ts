/**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at https://github.com/0xProject/0x.js/tree/development/packages/abi-gen-templates.
 */
// tslint:disable-next-line:no-unused-variable
import {TxData, TxDataPayable} from '../common';
import {promisify} from '@0xproject/utils';
import {classUtils} from '../common';
import {BigNumber} from 'bignumber.js';
import * as fs from "fs-extra";
import * as Web3 from 'web3';

import {BaseContract} from '../base_contract';

export class MockTermsContractContract extends BaseContract {
    public mockRegisterRepaymentReturnValue = {
        async sendTransactionAsync(
            success: boolean,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.mockRegisterRepaymentReturnValue.estimateGasAsync.bind(
                    self,
                    success,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.mockRegisterRepaymentReturnValue, self.web3ContractInstance,
            )(
                success,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            success: boolean,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.mockRegisterRepaymentReturnValue.estimateGas, self.web3ContractInstance,
            )(
                success,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            success: boolean,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.mockRegisterRepaymentReturnValue.getData, self.web3ContractInstance,
            )(
                success,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getMockReturnValue = {
        async callAsync(
            functionName: string,
            argsSignature: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as MockTermsContractContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.getMockReturnValue.call,
                self.web3ContractInstance,
            )(
                functionName,
                argsSignature,
            );
            return result;
        },
    };
    public getTermEndTimestamp = {
        async callAsync(
            agreementId: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as MockTermsContractContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getTermEndTimestamp.call,
                self.web3ContractInstance,
            )(
                agreementId,
            );
            return result;
        },
    };
    public registerRepayment = {
        async sendTransactionAsync(
            agreementId: string,
            payer: string,
            beneficiary: string,
            unitsOfRepayment: BigNumber,
            tokenAddress: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.registerRepayment.estimateGasAsync.bind(
                    self,
                    agreementId,
                    payer,
                    beneficiary,
                    unitsOfRepayment,
                    tokenAddress,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.registerRepayment, self.web3ContractInstance,
            )(
                agreementId,
                payer,
                beneficiary,
                unitsOfRepayment,
                tokenAddress,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            agreementId: string,
            payer: string,
            beneficiary: string,
            unitsOfRepayment: BigNumber,
            tokenAddress: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.registerRepayment.estimateGas, self.web3ContractInstance,
            )(
                agreementId,
                payer,
                beneficiary,
                unitsOfRepayment,
                tokenAddress,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            agreementId: string,
            payer: string,
            beneficiary: string,
            unitsOfRepayment: BigNumber,
            tokenAddress: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.registerRepayment.getData, self.web3ContractInstance,
            )(
                agreementId,
                payer,
                beneficiary,
                unitsOfRepayment,
                tokenAddress,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public mockRegisterTermStartReturnValue = {
        async sendTransactionAsync(
            agreementId: string,
            debtor: string,
            success: boolean,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.mockRegisterTermStartReturnValue.estimateGasAsync.bind(
                    self,
                    agreementId,
                    debtor,
                    success,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.mockRegisterTermStartReturnValue, self.web3ContractInstance,
            )(
                agreementId,
                debtor,
                success,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            agreementId: string,
            debtor: string,
            success: boolean,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.mockRegisterTermStartReturnValue.estimateGas, self.web3ContractInstance,
            )(
                agreementId,
                debtor,
                success,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            agreementId: string,
            debtor: string,
            success: boolean,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.mockRegisterTermStartReturnValue.getData, self.web3ContractInstance,
            )(
                agreementId,
                debtor,
                success,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public wasRegisterRepaymentCalledWith = {
        async callAsync(
            agreementId: string,
            payer: string,
            beneficiary: string,
            unitsOfRepayment: BigNumber,
            tokenAddress: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as MockTermsContractContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.wasRegisterRepaymentCalledWith.call,
                self.web3ContractInstance,
            )(
                agreementId,
                payer,
                beneficiary,
                unitsOfRepayment,
                tokenAddress,
            );
            return result;
        },
    };
    public mockReturnValue = {
        async sendTransactionAsync(
            functionName: string,
            argsSignature: string,
            returnValue: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.mockReturnValue.estimateGasAsync.bind(
                    self,
                    functionName,
                    argsSignature,
                    returnValue,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.mockReturnValue, self.web3ContractInstance,
            )(
                functionName,
                argsSignature,
                returnValue,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            functionName: string,
            argsSignature: string,
            returnValue: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.mockReturnValue.estimateGas, self.web3ContractInstance,
            )(
                functionName,
                argsSignature,
                returnValue,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            functionName: string,
            argsSignature: string,
            returnValue: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.mockReturnValue.getData, self.web3ContractInstance,
            )(
                functionName,
                argsSignature,
                returnValue,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public registerTermStart = {
        async sendTransactionAsync(
            agreementId: string,
            debtor: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.registerTermStart.estimateGasAsync.bind(
                    self,
                    agreementId,
                    debtor,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.registerTermStart, self.web3ContractInstance,
            )(
                agreementId,
                debtor,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            agreementId: string,
            debtor: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.registerTermStart.estimateGas, self.web3ContractInstance,
            )(
                agreementId,
                debtor,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            agreementId: string,
            debtor: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.registerTermStart.getData, self.web3ContractInstance,
            )(
                agreementId,
                debtor,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public mockTermEndTimestamp = {
        async sendTransactionAsync(
            agreementId: string,
            timestamp: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.mockTermEndTimestamp.estimateGasAsync.bind(
                    self,
                    agreementId,
                    timestamp,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.mockTermEndTimestamp, self.web3ContractInstance,
            )(
                agreementId,
                timestamp,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            agreementId: string,
            timestamp: BigNumber,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.mockTermEndTimestamp.estimateGas, self.web3ContractInstance,
            )(
                agreementId,
                timestamp,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            agreementId: string,
            timestamp: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.mockTermEndTimestamp.getData, self.web3ContractInstance,
            )(
                agreementId,
                timestamp,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public wasRegisterTermStartCalledWith = {
        async callAsync(
            agreementId: string,
            debtor: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as MockTermsContractContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.wasRegisterTermStartCalledWith.call,
                self.web3ContractInstance,
            )(
                agreementId,
                debtor,
            );
            return result;
        },
    };
    public reset = {
        async sendTransactionAsync(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.reset.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.reset, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            txData: TxData = {},
        ): Promise<number> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.reset.estimateGas, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as MockTermsContractContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.reset.getData, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    async deploy(...args: any[]): Promise<any> {
        const wrapper = this;
        const rejected = false;

        return new Promise((resolve, reject) => {
            wrapper.web3ContractInstance.new(wrapper.defaults, (err: string, contract: Web3.ContractInstance) => {
                if (err) {
                    reject(err);
                } else if (contract.address) {
                    wrapper.web3ContractInstance = wrapper.web3ContractInstance.at(contract.address);
                    wrapper.address = contract.address;
                    resolve();
                }
            })
        });
    }
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<MockTermsContractContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new MockTermsContractContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<MockTermsContractContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new MockTermsContractContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/MockTermsContract.json", "utf8");
            const { abi, networks } = JSON.parse(artifact);
            return { abi, networks };
        } catch (e) {
            console.error("Artifacts malformed or nonexistent: " + e.toString());
        }
    }
    constructor(web3ContractInstance: Web3.ContractInstance, defaults: Partial<TxData>) {
        super(web3ContractInstance, defaults);
        classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
    }
} // tslint:disable:max-file-line-count
