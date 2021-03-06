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
class IncompatibleTermsContractContract extends base_contract_1.BaseContract {
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
        this.getTermEndTimestamp = {
            callAsync(_agreementId, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.getTermEndTimestamp.call, self.web3ContractInstance)(_agreementId);
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
            return new IncompatibleTermsContractContract(web3ContractInstance, defaults);
        });
    }
    static at(address, web3, defaults) {
        return __awaiter(this, void 0, void 0, function* () {
            const { abi } = yield this.getArtifactsData(web3);
            const web3ContractInstance = web3.eth.contract(abi).at(address);
            return new IncompatibleTermsContractContract(web3ContractInstance, defaults);
        });
    }
    static getArtifactsData(web3) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const artifact = yield fs.readFile("build/contracts/IncompatibleTermsContract.json", "utf8");
                const { abi, networks } = JSON.parse(artifact);
                return { abi, networks };
            }
            catch (e) {
                console.error("Artifacts malformed or nonexistent: " + e.toString());
            }
        });
    }
} // tslint:disable:max-file-line-count
exports.IncompatibleTermsContractContract = IncompatibleTermsContractContract;
//# sourceMappingURL=incompatible_terms_contract.js.map