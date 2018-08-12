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
class CollateralizerContract extends base_contract_1.BaseContract {
    constructor(web3ContractInstance, defaults) {
        super(web3ContractInstance, defaults);
        this.debtKernelAddress = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.debtKernelAddress.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.tokenTransferProxy = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.tokenTransferProxy.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.CONTEXT = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.CONTEXT.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.debtRegistry = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.debtRegistry.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.unpause = {
            sendTransactionAsync(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.unpause.estimateGasAsync.bind(self));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.unpause, self.web3ContractInstance)(txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.unpause.estimateGas, self.web3ContractInstance)(txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.unpause.getData, self.web3ContractInstance)(txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.returnCollateral = {
            sendTransactionAsync(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.returnCollateral.estimateGasAsync.bind(self, agreementId));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.returnCollateral, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.returnCollateral.estimateGas, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.returnCollateral.getData, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.timestampAdjustedForGracePeriod = {
            callAsync(gracePeriodInDays, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.timestampAdjustedForGracePeriod.call, self.web3ContractInstance)(gracePeriodInDays);
                    return result;
                });
            },
        };
        this.paused = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.paused.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.SECONDS_IN_DAY = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.SECONDS_IN_DAY.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.collateralize = {
            sendTransactionAsync(agreementId, collateralizer, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.collateralize.estimateGasAsync.bind(self, agreementId, collateralizer));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.collateralize, self.web3ContractInstance)(agreementId, collateralizer, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, collateralizer, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.collateralize.estimateGas, self.web3ContractInstance)(agreementId, collateralizer, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, collateralizer, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.collateralize.getData, self.web3ContractInstance)(agreementId, collateralizer, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.pause = {
            sendTransactionAsync(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.pause.estimateGasAsync.bind(self));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.pause, self.web3ContractInstance)(txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.pause.estimateGas, self.web3ContractInstance)(txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.pause.getData, self.web3ContractInstance)(txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.owner = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.owner.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.revokeCollateralizeAuthorization = {
            sendTransactionAsync(agent, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.revokeCollateralizeAuthorization.estimateGasAsync.bind(self, agent));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.revokeCollateralizeAuthorization, self.web3ContractInstance)(agent, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agent, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.revokeCollateralizeAuthorization.estimateGas, self.web3ContractInstance)(agent, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agent, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.revokeCollateralizeAuthorization.getData, self.web3ContractInstance)(agent, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.tokenRegistry = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.tokenRegistry.call, self.web3ContractInstance)();
                    return result;
                });
            },
        };
        this.addAuthorizedCollateralizeAgent = {
            sendTransactionAsync(agent, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.addAuthorizedCollateralizeAgent.estimateGasAsync.bind(self, agent));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.addAuthorizedCollateralizeAgent, self.web3ContractInstance)(agent, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agent, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.addAuthorizedCollateralizeAgent.estimateGas, self.web3ContractInstance)(agent, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agent, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.addAuthorizedCollateralizeAgent.getData, self.web3ContractInstance)(agent, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.unpackCollateralParametersFromBytes = {
            callAsync(parameters, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.unpackCollateralParametersFromBytes.call, self.web3ContractInstance)(parameters);
                    return result;
                });
            },
        };
        this.agreementToCollateralizer = {
            callAsync(index_0, defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.agreementToCollateralizer.call, self.web3ContractInstance)(index_0);
                    return result;
                });
            },
        };
        this.seizeCollateral = {
            sendTransactionAsync(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.seizeCollateral.estimateGasAsync.bind(self, agreementId));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.seizeCollateral, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.seizeCollateral.estimateGas, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(agreementId, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.seizeCollateral.getData, self.web3ContractInstance)(agreementId, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.transferOwnership = {
            sendTransactionAsync(newOwner, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData, self.transferOwnership.estimateGasAsync.bind(self, newOwner));
                    const txHash = yield utils_1.promisify(self.web3ContractInstance.transferOwnership, self.web3ContractInstance)(newOwner, txDataWithDefaults);
                    return txHash;
                });
            },
            estimateGasAsync(newOwner, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const gas = yield utils_1.promisify(self.web3ContractInstance.transferOwnership.estimateGas, self.web3ContractInstance)(newOwner, txDataWithDefaults);
                    return gas;
                });
            },
            getABIEncodedTransactionData(newOwner, txData = {}) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const txDataWithDefaults = yield self.applyDefaultsToTxDataAsync(txData);
                    const abiEncodedTransactionData = yield utils_1.promisify(self.web3ContractInstance.transferOwnership.getData, self.web3ContractInstance)(newOwner, txDataWithDefaults);
                    return abiEncodedTransactionData;
                });
            },
        };
        this.getAuthorizedCollateralizeAgents = {
            callAsync(defaultBlock) {
                return __awaiter(this, void 0, void 0, function* () {
                    const self = this;
                    const result = yield utils_1.promisify(self.web3ContractInstance.getAuthorizedCollateralizeAgents.call, self.web3ContractInstance)();
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
            return new CollateralizerContract(web3ContractInstance, defaults);
        });
    }
    static at(address, web3, defaults) {
        return __awaiter(this, void 0, void 0, function* () {
            const { abi } = yield this.getArtifactsData(web3);
            const web3ContractInstance = web3.eth.contract(abi).at(address);
            return new CollateralizerContract(web3ContractInstance, defaults);
        });
    }
    static getArtifactsData(web3) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const artifact = yield fs.readFile("build/contracts/Collateralizer.json", "utf8");
                const { abi, networks } = JSON.parse(artifact);
                return { abi, networks };
            }
            catch (e) {
                console.error("Artifacts malformed or nonexistent: " + e.toString());
            }
        });
    }
} // tslint:disable:max-file-line-count
exports.CollateralizerContract = CollateralizerContract;
//# sourceMappingURL=collateralizer.js.map