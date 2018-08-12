"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0xproject/utils");
const common_1 = require("../common");
const fs = require("fs-extra");
const base_contract_1 = require("../base_contract");
class MockCollateralizedTermsContractContract extends base_contract_1.BaseContract {
    constructor(web3ContractInstance, defaults) {
        super(web3ContractInstance, defaults);
        this.getValueRepaidToDate = {
            callAsync(agreementId, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.getValueRepaidToDate.call, self.web3ContractInstance)(agreementId);
                    return result;
                });
            },
        };
        this.mockRegisterRepaymentReturnValue = {
            sendTransactionAsync(success, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.mockRegisterRepaymentReturnValue.estimateGasAsync.bind(self, success));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.mockRegisterRepaymentReturnValue, self.web3ContractInstance)(success, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(success, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.mockRegisterRepaymentReturnValue.estimateGas, self.web3ContractInstance)(success, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(success, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.mockRegisterRepaymentReturnValue.getData, self.web3ContractInstance)(success, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.mockDummyValueRepaid = {
            sendTransactionAsync(agreementId, amount, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.mockDummyValueRepaid.estimateGasAsync.bind(self, agreementId, amount));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.mockDummyValueRepaid, self.web3ContractInstance)(agreementId, amount, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, amount, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.mockDummyValueRepaid.estimateGas, self.web3ContractInstance)(agreementId, amount, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, amount, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.mockDummyValueRepaid.getData, self.web3ContractInstance)(agreementId, amount, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.getMockReturnValue = {
            callAsync(functionName, argsSignature, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.getMockReturnValue.call, self.web3ContractInstance)(functionName, argsSignature);
                    return result;
                });
            },
        };
        this.getTermEndTimestamp = {
            callAsync(agreementId, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.getTermEndTimestamp.call, self.web3ContractInstance)(agreementId);
                    return result;
                });
            },
        };
        this.registerRepayment = {
            sendTransactionAsync(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.registerRepayment.estimateGasAsync.bind(self, agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.registerRepayment, self.web3ContractInstance)(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.registerRepayment.estimateGas, self.web3ContractInstance)(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.registerRepayment.getData, self.web3ContractInstance)(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.mockCallCollateralize = {
            sendTransactionAsync(_collateralizer, _agreementId, _debtor, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.mockCallCollateralize.estimateGasAsync.bind(self, _collateralizer, _agreementId, _debtor));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.mockCallCollateralize, self.web3ContractInstance)(_collateralizer, _agreementId, _debtor, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(_collateralizer, _agreementId, _debtor, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.mockCallCollateralize.estimateGas, self.web3ContractInstance)(_collateralizer, _agreementId, _debtor, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(_collateralizer, _agreementId, _debtor, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.mockCallCollateralize.getData, self.web3ContractInstance)(_collateralizer, _agreementId, _debtor, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.wasRegisterRepaymentCalledWith = {
            callAsync(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.wasRegisterRepaymentCalledWith.call, self.web3ContractInstance)(agreementId, payer, beneficiary, unitsOfRepayment, tokenAddress);
                    return result;
                });
            },
        };
        this.mockReturnValue = {
            sendTransactionAsync(functionName, argsSignature, returnValue, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.mockReturnValue.estimateGasAsync.bind(self, functionName, argsSignature, returnValue));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.mockReturnValue, self.web3ContractInstance)(functionName, argsSignature, returnValue, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(functionName, argsSignature, returnValue, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.mockReturnValue.estimateGas, self.web3ContractInstance)(functionName, argsSignature, returnValue, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(functionName, argsSignature, returnValue, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.mockReturnValue.getData, self.web3ContractInstance)(functionName, argsSignature, returnValue, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.registerTermStart = {
            sendTransactionAsync(agreementId, debtor, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.registerTermStart.estimateGasAsync.bind(self, agreementId, debtor));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.registerTermStart, self.web3ContractInstance)(agreementId, debtor, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, debtor, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.registerTermStart.estimateGas, self.web3ContractInstance)(agreementId, debtor, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, debtor, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.registerTermStart.getData, self.web3ContractInstance)(agreementId, debtor, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.getExpectedRepaymentValue = {
            callAsync(agreementId, timestamp, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.getExpectedRepaymentValue.call, self.web3ContractInstance)(agreementId, timestamp);
                    return result;
                });
            },
        };
        this.mockTermEndTimestamp = {
            sendTransactionAsync(agreementId, timestamp, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.mockTermEndTimestamp.estimateGasAsync.bind(self, agreementId, timestamp));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.mockTermEndTimestamp, self.web3ContractInstance)(agreementId, timestamp, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, timestamp, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.mockTermEndTimestamp.estimateGas, self.web3ContractInstance)(agreementId, timestamp, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, timestamp, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.mockTermEndTimestamp.getData, self.web3ContractInstance)(agreementId, timestamp, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.wasRegisterTermStartCalledWith = {
            callAsync(agreementId, debtor, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.wasRegisterTermStartCalledWith.call, self.web3ContractInstance)(agreementId, debtor);
                    return result;
                });
            },
        };
        this.mockExpectedRepaymentValue = {
            sendTransactionAsync(agreementId, timestamp, amount, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.mockExpectedRepaymentValue.estimateGasAsync.bind(self, agreementId, timestamp, amount));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.mockExpectedRepaymentValue, self.web3ContractInstance)(agreementId, timestamp, amount, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, timestamp, amount, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.mockExpectedRepaymentValue.estimateGas, self.web3ContractInstance)(agreementId, timestamp, amount, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, timestamp, amount, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.mockExpectedRepaymentValue.getData, self.web3ContractInstance)(agreementId, timestamp, amount, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.reset = {
            sendTransactionAsync(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.reset.estimateGasAsync.bind(self));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.reset, self.web3ContractInstance)(txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.reset.estimateGas, self.web3ContractInstance)(txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.reset.getData, self.web3ContractInstance)(txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.reset = {
            sendTransactionAsync(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.reset.estimateGasAsync.bind(self, agreementId));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.reset, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.reset.estimateGas, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.reset.getData, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        common_1.classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
    }
    deploy(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const wrapper = this;
            const rejected = false;
            return new Promise((resolve, reject) => {
                wrapper.web3ContractInstance.new(wrapper.defaults, (err, contract) => {
                    if (err) {
                        reject(err);
                    }
                    else if (contract.address) {
                        wrapper.web3ContractInstance = wrapper.web3ContractInstance.at(contract.address);
                        wrapper.address = contract.address;
                        resolve();
                    }
                });
            });
        });
    }
    static deployed(web3, defaults) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentNetwork = web3.version.network;
            const { abi, networks } = yield this.getArtifactsData(web3);
            const web3ContractInstance = web3.eth.contract(abi).at(networks[currentNetwork].address);
            return new MockCollateralizedTermsContractContract(web3ContractInstance, defaults);
        });
    }
    static at(address, web3, defaults) {
        return __awaiter(this, void 0, void 0, function* () {
            const { abi } = yield this.getArtifactsData(web3);
            const web3ContractInstance = web3.eth.contract(abi).at(address);
            return new MockCollateralizedTermsContractContract(web3ContractInstance, defaults);
        });
    }
    static getArtifactsData(web3) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const artifact = yield fs.readFile("build/contracts/MockCollateralizedTermsContract.json", "utf8");
                const { abi, networks } = JSON.parse(artifact);
                return { abi, networks };
            }
            catch (e) {
                console.error("Artifacts malformed or nonexistent: " + e.toString());
            }
        });
    }
} // tslint:disable:max-file-line-count
exports.MockCollateralizedTermsContractContract = MockCollateralizedTermsContractContract;
//# sourceMappingURL=mock_collateralized_terms_contract.js.map