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

export class CDOFactoryContract extends BaseContract {
    public deployedCDOs = {
        async callAsync(
            index_0: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as CDOFactoryContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.deployedCDOs.call,
                self.web3ContractInstance,
            )(
                index_0,
            );
            return result;
        },
    };
    public createCDO = {
        async sendTransactionAsync(
            _termsContract: string,
            _trancheToken: string,
            _dummyToken: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOFactoryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.createCDO.estimateGasAsync.bind(
                    self,
                    _termsContract,
                    _trancheToken,
                    _dummyToken,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.createCDO, self.web3ContractInstance,
            )(
                _termsContract,
                _trancheToken,
                _dummyToken,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            _termsContract: string,
            _trancheToken: string,
            _dummyToken: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as CDOFactoryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.createCDO.estimateGas, self.web3ContractInstance,
            )(
                _termsContract,
                _trancheToken,
                _dummyToken,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            _termsContract: string,
            _trancheToken: string,
            _dummyToken: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as CDOFactoryContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.createCDO.getData, self.web3ContractInstance,
            )(
                _termsContract,
                _trancheToken,
                _dummyToken,
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
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<CDOFactoryContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new CDOFactoryContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<CDOFactoryContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new CDOFactoryContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/CDOFactory.json", "utf8");
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
