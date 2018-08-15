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

export class CDOContract extends BaseContract {
    public withdraw = {
        async sendTransactionAsync(
            _tokenId: BigNumber,
            _to: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.withdraw.estimateGasAsync.bind(
                    self,
                    _tokenId,
                    _to,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.withdraw, self.web3ContractInstance,
            )(
                _tokenId,
                _to,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _tokenId: BigNumber,
            _to: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.withdraw.estimateGas, self.web3ContractInstance,
            )(
                _tokenId,
                _to,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _tokenId: BigNumber,
            _to: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.withdraw.getData, self.web3ContractInstance,
            )(
                _tokenId,
                _to,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public creator = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as CDOContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.creator.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public expectedRepayment = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.expectedRepayment.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public mezzanines = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.mezzanines.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public getTotalJuniorsPayout = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getTotalJuniorsPayout.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public finalize = {
        async sendTransactionAsync(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.finalize.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.finalize, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.finalize.estimateGas, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.finalize.getData, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public seniors = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.seniors.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public seniorEntitlements = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.seniorEntitlements.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public juniorEntitlements = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.juniorEntitlements.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public allocatedEntitlements = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.allocatedEntitlements.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public remainingJuniorEntitlement = {
        async sendTransactionAsync(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.remainingJuniorEntitlement.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.remainingJuniorEntitlement, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.remainingJuniorEntitlement.estimateGas, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.remainingJuniorEntitlement.getData, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public squared = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as CDOContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.squared.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public remainingMezzanineEntitlement = {
        async sendTransactionAsync(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.remainingMezzanineEntitlement.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.remainingMezzanineEntitlement, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.remainingMezzanineEntitlement.estimateGas, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.remainingMezzanineEntitlement.getData, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public juniors = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.juniors.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public remainingSeniorEntitlement = {
        async sendTransactionAsync(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.remainingSeniorEntitlement.estimateGasAsync.bind(
                    self,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.remainingSeniorEntitlement, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.remainingSeniorEntitlement.estimateGas, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.remainingSeniorEntitlement.getData, self.web3ContractInstance,
            )(
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getTotalSeniorsPayout = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getTotalSeniorsPayout.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public mezzanineEntitlements = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.mezzanineEntitlements.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public finalized = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as CDOContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.finalized.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public getTotalUnderlyingDebtAssets = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getTotalUnderlyingDebtAssets.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public underlyingDebtAssets = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.underlyingDebtAssets.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public getTotalMezzaninesPayout = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as CDOContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getTotalMezzaninesPayout.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public onERC721Received = {
        async sendTransactionAsync(
            _from: string,
            _tokenId: BigNumber,
            index_2: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.onERC721Received.estimateGasAsync.bind(
                    self,
                    _from,
                    _tokenId,
                    index_2,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.onERC721Received, self.web3ContractInstance,
            )(
                _from,
                _tokenId,
                index_2,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _from: string,
            _tokenId: BigNumber,
            index_2: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.onERC721Received.estimateGas, self.web3ContractInstance,
            )(
                _from,
                _tokenId,
                index_2,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _from: string,
            _tokenId: BigNumber,
            index_2: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.onERC721Received.getData, self.web3ContractInstance,
            )(
                _from,
                _tokenId,
                index_2,
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
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<CDOContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new CDOContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<CDOContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new CDOContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/CDO.json", "utf8");
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
