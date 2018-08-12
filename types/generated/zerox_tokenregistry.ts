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

export class ZeroX_TokenRegistryContract extends BaseContract {
    public removeToken = {
        async sendTransactionAsync(
            _token: string,
            _index: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.removeToken.estimateGasAsync.bind(
                    self,
                    _token,
                    _index,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.removeToken, self.web3ContractInstance,
            )(
                _token,
                _index,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _token: string,
            _index: BigNumber,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.removeToken.estimateGas, self.web3ContractInstance,
            )(
                _token,
                _index,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _token: string,
            _index: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.removeToken.getData, self.web3ContractInstance,
            )(
                _token,
                _index,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getTokenAddressByName = {
        async callAsync(
            _name: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.getTokenAddressByName.call,
                self.web3ContractInstance,
            )(
                _name,
            );
            return result;
        },
    };
    public getTokenAddressBySymbol = {
        async callAsync(
            _symbol: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.getTokenAddressBySymbol.call,
                self.web3ContractInstance,
            )(
                _symbol,
            );
            return result;
        },
    };
    public setTokenSwarmHash = {
        async sendTransactionAsync(
            _token: string,
            _swarmHash: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.setTokenSwarmHash.estimateGasAsync.bind(
                    self,
                    _token,
                    _swarmHash,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.setTokenSwarmHash, self.web3ContractInstance,
            )(
                _token,
                _swarmHash,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _token: string,
            _swarmHash: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.setTokenSwarmHash.estimateGas, self.web3ContractInstance,
            )(
                _token,
                _swarmHash,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _token: string,
            _swarmHash: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.setTokenSwarmHash.getData, self.web3ContractInstance,
            )(
                _token,
                _swarmHash,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getTokenMetaData = {
        async callAsync(
            _token: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<[string, string, string, BigNumber, string, string]
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<[string, string, string, BigNumber, string, string]
    >(
                self.web3ContractInstance.getTokenMetaData.call,
                self.web3ContractInstance,
            )(
                _token,
            );
            return result;
        },
    };
    public owner = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.owner.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public addToken = {
        async sendTransactionAsync(
            _token: string,
            _name: string,
            _symbol: string,
            _decimals: number|BigNumber,
            _ipfsHash: string,
            _swarmHash: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.addToken.estimateGasAsync.bind(
                    self,
                    _token,
                    _name,
                    _symbol,
                    _decimals,
                    _ipfsHash,
                    _swarmHash,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.addToken, self.web3ContractInstance,
            )(
                _token,
                _name,
                _symbol,
                _decimals,
                _ipfsHash,
                _swarmHash,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _token: string,
            _name: string,
            _symbol: string,
            _decimals: number|BigNumber,
            _ipfsHash: string,
            _swarmHash: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.addToken.estimateGas, self.web3ContractInstance,
            )(
                _token,
                _name,
                _symbol,
                _decimals,
                _ipfsHash,
                _swarmHash,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _token: string,
            _name: string,
            _symbol: string,
            _decimals: number|BigNumber,
            _ipfsHash: string,
            _swarmHash: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.addToken.getData, self.web3ContractInstance,
            )(
                _token,
                _name,
                _symbol,
                _decimals,
                _ipfsHash,
                _swarmHash,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public setTokenName = {
        async sendTransactionAsync(
            _token: string,
            _name: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.setTokenName.estimateGasAsync.bind(
                    self,
                    _token,
                    _name,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.setTokenName, self.web3ContractInstance,
            )(
                _token,
                _name,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _token: string,
            _name: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.setTokenName.estimateGas, self.web3ContractInstance,
            )(
                _token,
                _name,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _token: string,
            _name: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.setTokenName.getData, self.web3ContractInstance,
            )(
                _token,
                _name,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public tokens = {
        async callAsync(
            index_0: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<[string, string, string, BigNumber, string, string]
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<[string, string, string, BigNumber, string, string]
    >(
                self.web3ContractInstance.tokens.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public tokenAddresses = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.tokenAddresses.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public getTokenByName = {
        async callAsync(
            _name: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<[string, string, string, BigNumber, string, string]
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<[string, string, string, BigNumber, string, string]
    >(
                self.web3ContractInstance.getTokenByName.call,
                self.web3ContractInstance,
            )(
                _name,
            );
            return result;
        },
    };
    public getTokenAddresses = {
        async callAsync(
            defaultBlock?: Web3.BlockParam,
        ): Promise<string[]
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<string[]
    >(
                self.web3ContractInstance.getTokenAddresses.call,
                self.web3ContractInstance,
            )(
            );
            return result;
        },
    };
    public setTokenIpfsHash = {
        async sendTransactionAsync(
            _token: string,
            _ipfsHash: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.setTokenIpfsHash.estimateGasAsync.bind(
                    self,
                    _token,
                    _ipfsHash,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.setTokenIpfsHash, self.web3ContractInstance,
            )(
                _token,
                _ipfsHash,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _token: string,
            _ipfsHash: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.setTokenIpfsHash.estimateGas, self.web3ContractInstance,
            )(
                _token,
                _ipfsHash,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _token: string,
            _ipfsHash: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.setTokenIpfsHash.getData, self.web3ContractInstance,
            )(
                _token,
                _ipfsHash,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getTokenBySymbol = {
        async callAsync(
            _symbol: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<[string, string, string, BigNumber, string, string]
    > {
            const self = this as ZeroX_TokenRegistryContract;
            const result = await promisify<[string, string, string, BigNumber, string, string]
    >(
                self.web3ContractInstance.getTokenBySymbol.call,
                self.web3ContractInstance,
            )(
                _symbol,
            );
            return result;
        },
    };
    public setTokenSymbol = {
        async sendTransactionAsync(
            _token: string,
            _symbol: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.setTokenSymbol.estimateGasAsync.bind(
                    self,
                    _token,
                    _symbol,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.setTokenSymbol, self.web3ContractInstance,
            )(
                _token,
                _symbol,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _token: string,
            _symbol: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.setTokenSymbol.estimateGas, self.web3ContractInstance,
            )(
                _token,
                _symbol,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _token: string,
            _symbol: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroX_TokenRegistryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.setTokenSymbol.getData, self.web3ContractInstance,
            )(
                _token,
                _symbol,
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
            const self = this as ZeroX_TokenRegistryContract;
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
            const self = this as ZeroX_TokenRegistryContract;
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
            const self = this as ZeroX_TokenRegistryContract;
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
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<ZeroX_TokenRegistryContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new ZeroX_TokenRegistryContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<ZeroX_TokenRegistryContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new ZeroX_TokenRegistryContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/ZeroX_TokenRegistry.json", "utf8");
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
