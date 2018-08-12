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

export class ZeroExExchangeContract extends BaseContract {
    public isRoundingError = {
        async callAsync(
            numerator: BigNumber,
            denominator: BigNumber,
            target: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as ZeroExExchangeContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.isRoundingError.call,
                self.web3ContractInstance,
            )(
                numerator,
                denominator,
                target,
            );
            return result;
        },
    };
    public fillOrdersUpTo = {
        async sendTransactionAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmount: BigNumber,
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.fillOrdersUpTo.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    fillTakerTokenAmount,
                    shouldThrowOnInsufficientBalanceOrAllowance,
                    v,
                    r,
                    s,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.fillOrdersUpTo, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmount: BigNumber,
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.fillOrdersUpTo.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmount: BigNumber,
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.fillOrdersUpTo.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public cancelOrder = {
        async sendTransactionAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            cancelTakerTokenAmount: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.cancelOrder.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    cancelTakerTokenAmount,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.cancelOrder, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                cancelTakerTokenAmount,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            cancelTakerTokenAmount: BigNumber,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.cancelOrder.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                cancelTakerTokenAmount,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[],
            orderValues: BigNumber[],
            cancelTakerTokenAmount: BigNumber,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.cancelOrder.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                cancelTakerTokenAmount,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public batchFillOrKillOrders = {
        async sendTransactionAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmounts: BigNumber[],
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.batchFillOrKillOrders.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    fillTakerTokenAmounts,
                    v,
                    r,
                    s,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.batchFillOrKillOrders, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmounts,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmounts: BigNumber[],
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.batchFillOrKillOrders.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmounts,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmounts: BigNumber[],
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.batchFillOrKillOrders.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmounts,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public fillOrKillOrder = {
        async sendTransactionAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            fillTakerTokenAmount: BigNumber,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.fillOrKillOrder.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    fillTakerTokenAmount,
                    v,
                    r,
                    s,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.fillOrKillOrder, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            fillTakerTokenAmount: BigNumber,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.fillOrKillOrder.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[],
            orderValues: BigNumber[],
            fillTakerTokenAmount: BigNumber,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.fillOrKillOrder.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getUnavailableTakerTokenAmount = {
        async callAsync(
            orderHash: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as ZeroExExchangeContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getUnavailableTakerTokenAmount.call,
                self.web3ContractInstance,
            )(
                orderHash,
            );
            return result;
        },
    };
    public isValidSignature = {
        async callAsync(
            signer: string,
            hash: string,
            v: number|BigNumber,
            r: string,
            s: string,
            defaultBlock?: Web3.BlockParam,
        ): Promise<boolean
    > {
            const self = this as ZeroExExchangeContract;
            const result = await promisify<boolean
    >(
                self.web3ContractInstance.isValidSignature.call,
                self.web3ContractInstance,
            )(
                signer,
                hash,
                v,
                r,
                s,
            );
            return result;
        },
    };
    public getPartialAmount = {
        async callAsync(
            numerator: BigNumber,
            denominator: BigNumber,
            target: BigNumber,
            defaultBlock?: Web3.BlockParam,
        ): Promise<BigNumber
    > {
            const self = this as ZeroExExchangeContract;
            const result = await promisify<BigNumber
    >(
                self.web3ContractInstance.getPartialAmount.call,
                self.web3ContractInstance,
            )(
                numerator,
                denominator,
                target,
            );
            return result;
        },
    };
    public batchFillOrders = {
        async sendTransactionAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmounts: BigNumber[],
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.batchFillOrders.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    fillTakerTokenAmounts,
                    shouldThrowOnInsufficientBalanceOrAllowance,
                    v,
                    r,
                    s,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.batchFillOrders, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmounts,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmounts: BigNumber[],
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.batchFillOrders.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmounts,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            fillTakerTokenAmounts: BigNumber[],
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: Array<number|BigNumber>,
            r: string[],
            s: string[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.batchFillOrders.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmounts,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public batchCancelOrders = {
        async sendTransactionAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            cancelTakerTokenAmounts: BigNumber[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.batchCancelOrders.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    cancelTakerTokenAmounts,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.batchCancelOrders, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                cancelTakerTokenAmounts,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            cancelTakerTokenAmounts: BigNumber[],
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.batchCancelOrders.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                cancelTakerTokenAmounts,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[][],
            orderValues: BigNumber[][],
            cancelTakerTokenAmounts: BigNumber[],
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.batchCancelOrders.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                cancelTakerTokenAmounts,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public fillOrder = {
        async sendTransactionAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            fillTakerTokenAmount: BigNumber,
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
                self.fillOrder.estimateGasAsync.bind(
                    self,
                    orderAddresses,
                    orderValues,
                    fillTakerTokenAmount,
                    shouldThrowOnInsufficientBalanceOrAllowance,
                    v,
                    r,
                    s,
                ),
            );
            const txHash = await promisify<string>(
                self.web3ContractInstance.fillOrder, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return txHash;
        },
        async estimateGasAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            fillTakerTokenAmount: BigNumber,
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxData = {},
        ): Promise<number> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const gas = await promisify<number>(
                self.web3ContractInstance.fillOrder.estimateGas, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return gas;
        },
        async getABIEncodedTransactionData(
            orderAddresses: string[],
            orderValues: BigNumber[],
            fillTakerTokenAmount: BigNumber,
            shouldThrowOnInsufficientBalanceOrAllowance: boolean,
            v: number|BigNumber,
            r: string,
            s: string,
            txData: TxData = {},
        ): Promise<string> {
            const self = this as ZeroExExchangeContract;
            const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
                txData,
            );
            const abiEncodedTransactionData = await promisify<string>(
                self.web3ContractInstance.fillOrder.getData, self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
                fillTakerTokenAmount,
                shouldThrowOnInsufficientBalanceOrAllowance,
                v,
                r,
                s,
                txDataWithDefaults,
            );
            return abiEncodedTransactionData;
        },
    };
    public getOrderHash = {
        async callAsync(
            orderAddresses: string[],
            orderValues: BigNumber[],
            defaultBlock?: Web3.BlockParam,
        ): Promise<string
    > {
            const self = this as ZeroExExchangeContract;
            const result = await promisify<string
    >(
                self.web3ContractInstance.getOrderHash.call,
                self.web3ContractInstance,
            )(
                orderAddresses,
                orderValues,
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
    static async deployed(web3: Web3, defaults: Partial<TxData>): Promise<ZeroExExchangeContract> {
        const currentNetwork = web3.version.network;
        const { abi, networks } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);

        return new ZeroExExchangeContract(web3ContractInstance, defaults);
    }
    static async at(address: string, web3: Web3, defaults: Partial<TxData>): Promise<ZeroExExchangeContract> {
        const { abi } = await this.getArtifactsData(web3);
        const web3ContractInstance = web3.eth.contract(abi).at(address);

        return new ZeroExExchangeContract(web3ContractInstance, defaults);
    }
    private static async getArtifactsData(web3: Web3):
        Promise<any>
    {
        try {
            const artifact = await fs.readFile("build/contracts/ZeroExExchange.json", "utf8");
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
