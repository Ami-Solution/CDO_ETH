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

export class ZeroX_TokenTransferProxyContract extends BaseContract {
    public transferFrom = {
        async sendTransactionAsync(
            token: string,
            from: string,
            to: string,
            value: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.transferFrom.estimateGasAsync.bind(
                    self,
                    token,
                    from,
                    to,
                    value,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.transferFrom, self.web3ContractInstance,
            )(
                token,
                from,
                to,
                value,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            token: string,
            from: string,
            to: string,
            value: BigNumber,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.transferFrom.estimateGas, self.web3ContractInstance,
            )(
                token,
                from,
                to,
                value,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            token: string,
            from: string,
            to: string,
            value: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.transferFrom.getData, self.web3ContractInstance,
            )(
                token,
                from,
                to,
                value,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public addAuthorizedAddress = {
        async sendTransactionAsync(
            target: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.addAuthorizedAddress.estimateGasAsync.bind(
                    self,
                    target,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.addAuthorizedAddress, self.web3ContractInstance,
            )(
                target,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            target: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.addAuthorizedAddress.estimateGas, self.web3ContractInstance,
            )(
                target,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            target: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.addAuthorizedAddress.getData, self.web3ContractInstance,
            )(
                target,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public authorities = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroX_TokenTransferProxyContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.authorities.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public removeAuthorizedAddress = {
        async sendTransactionAsync(
            target: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.removeAuthorizedAddress.estimateGasAsync.bind(
                    self,
                    target,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.removeAuthorizedAddress, self.web3ContractInstance,
            )(
                target,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            target: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.removeAuthorizedAddress.estimateGas, self.web3ContractInstance,
            )(
                target,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            target: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.removeAuthorizedAddress.getData, self.web3ContractInstance,
            )(
                target,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public owner = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroX_TokenTransferProxyContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.owner.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public authorized = {
        async callAsync(
            index_0: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as ZeroX_TokenTransferProxyContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.authorized.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public getAuthorizedAddresses = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string[]
    > {
            const self = this as ZeroX_TokenTransferProxyContract;
            const result = await promisify<string[]
    >(
                self.web3ContractInstance.getAuthorizedAddresses.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public transferOwnership = {
        async sendTransactionAsync(
            newOwner: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenTransferProxyContract;
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
            const self = this as ZeroX_TokenTransferProxyContract;
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
            const self = this as ZeroX_TokenTransferProxyContract;
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
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<ZeroX_TokenTransferProxyContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new ZeroX_TokenTransferProxyContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<ZeroX_TokenTransferProxyContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new ZeroX_TokenTransferProxyContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/ZeroX_TokenTransferProxy.json", "utf8");
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
