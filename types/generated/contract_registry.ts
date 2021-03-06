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

export class ContractRegistryContract extends BaseContract {
    public debtKernel = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.debtKernel.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public tokenTransferProxy = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.tokenTransferProxy.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public debtRegistry = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.debtRegistry.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public repaymentRouter = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.repaymentRouter.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public collateralizer = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.collateralizer.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public owner = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.owner.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public tokenRegistry = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.tokenRegistry.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public updateAddress = {
        async sendTransactionAsync(
            contractType: number|BigNumber,
            newAddress: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ContractRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.updateAddress.estimateGasAsync.bind(
                    self,
                    contractType,
                    newAddress,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.updateAddress, self.web3ContractInstance,
            )(
                contractType,
                newAddress,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            contractType: number|BigNumber,
            newAddress: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ContractRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.updateAddress.estimateGas, self.web3ContractInstance,
            )(
                contractType,
                newAddress,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            contractType: number|BigNumber,
            newAddress: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ContractRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.updateAddress.getData, self.web3ContractInstance,
            )(
                contractType,
                newAddress,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(
            newOwner: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ContractRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.transferOwnership.estimateGasAsync.bind(
                    self,
                    newOwner,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.transferOwnership, self.web3ContractInstance,
            )(
                newOwner,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            newOwner: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ContractRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.transferOwnership.estimateGas, self.web3ContractInstance,
            )(
                newOwner,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            newOwner: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ContractRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.transferOwnership.getData, self.web3ContractInstance,
            )(
                newOwner,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public debtToken = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ContractRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.debtToken.call,
                self.web3ContractInstance,
            )(
            );
            return result;
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
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<ContractRegistryContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new ContractRegistryContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<ContractRegistryContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new ContractRegistryContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/ContractRegistry.json", "utf8");
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
