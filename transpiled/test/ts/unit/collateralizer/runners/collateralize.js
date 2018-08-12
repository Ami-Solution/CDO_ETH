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
// modules
const chai_1 = require("chai");
const ABIDecoder = require("abi-decoder");
const lodash_1 = require("lodash");
// utils
const constants_1 = require("../../../test_utils/constants");
// logs
const collateralized_contract_1 = require("../../../logs/collateralized_contract");
class CollateralizeRunner {
    constructor() {
        this.testScenario = this.testScenario.bind(this);
    }
    initialize(contracts, accounts) {
        this.contracts = contracts;
        this.accounts = accounts;
    }
    testScenario(scenario) {
        let ATTACKER;
        let COLLATERALIZER;
        let MOCK_DEBT_KERNEL_ADDRESS;
        let MOCK_TERMS_CONTRACT_ADDRESS;
        let collateralizer;
        let mockDebtRegistry;
        let mockCollateralToken;
        let mockTokenRegistry;
        let mockTokenTransferProxy;
        let txHash;
        describe(scenario.description, () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                ATTACKER = this.accounts.ATTACKER;
                COLLATERALIZER = this.accounts.COLLATERALIZER;
                MOCK_DEBT_KERNEL_ADDRESS = this.accounts.MOCK_DEBT_KERNEL_ADDRESS;
                MOCK_TERMS_CONTRACT_ADDRESS = this.accounts.MOCK_TERMS_CONTRACT_ADDRESS;
                collateralizer = this.contracts.collateralizer;
                mockDebtRegistry = this.contracts.mockDebtRegistry;
                mockCollateralToken = this.contracts.mockCollateralToken;
                mockTokenRegistry = this.contracts.mockTokenRegistry;
                mockTokenTransferProxy = this.contracts.mockTokenTransferProxy;
                yield mockDebtRegistry.reset.sendTransactionAsync();
                yield mockCollateralToken.reset.sendTransactionAsync();
                yield mockTokenRegistry.reset.sendTransactionAsync();
                // Mock the collateral token's presence in the token registry at
                // the specified index
                yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(scenario.collateralTokenIndexInRegistry, mockCollateralToken.address);
                // Mock collateral token's balance for collateralizer
                yield mockCollateralToken.mockBalanceOfFor.sendTransactionAsync(COLLATERALIZER, scenario.collateralTokenBalance);
                // Mock `debtRegistry.getTerms` return value
                yield mockDebtRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(scenario.agreementId, scenario.termsContract(MOCK_TERMS_CONTRACT_ADDRESS, ATTACKER), scenario.termsContractParameters);
                // Mock the collateral token's presence in the token registry at
                // the specified index
                yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(scenario.collateralTokenIndexInRegistry, this.contracts.mockCollateralToken.address);
                // Mock collateral token's allowance for proxy.
                yield mockCollateralToken.mockAllowanceFor.sendTransactionAsync(COLLATERALIZER, mockTokenTransferProxy.address, scenario.collateralTokenAllowance);
                ABIDecoder.addABI(collateralizer.abi);
            }));
            after(() => {
                ABIDecoder.removeABI(collateralizer.abi);
            });
            if (scenario.succeeds) {
                it("should return a valid transaction hash", () => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield collateralizer.collateralize.sendTransactionAsync(scenario.agreementId, COLLATERALIZER, { from: scenario.from(MOCK_TERMS_CONTRACT_ADDRESS, ATTACKER) });
                    chai_1.expect(txHash.length).to.equal(66);
                }));
                it("should store record of collateralization", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(collateralizer.agreementToCollateralizer.callAsync(scenario.agreementId)).to.eventually.equal(COLLATERALIZER);
                }));
                it("should emit log that collateral has been secured", () => __awaiter(this, void 0, void 0, function* () {
                    const receipt = yield web3.eth.getTransactionReceipt(txHash);
                    const [collateralLockedLog] = lodash_1.compact(ABIDecoder.decodeLogs(receipt.logs));
                    chai_1.expect(collateralLockedLog).to.deep.equal(collateralized_contract_1.CollateralLocked(collateralizer.address, scenario.agreementId, mockCollateralToken.address, scenario.expectedCollateralAmount));
                }));
                it("should transfer collateral from debtor to collateralizer contract via proxy", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(mockTokenTransferProxy.wasTransferFromCalledWith.callAsync(mockCollateralToken.address, COLLATERALIZER, collateralizer.address, scenario.expectedCollateralAmount)).to.eventually.be.true;
                }));
                it("should throw on subsequent calls with same agreement id", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(collateralizer.collateralize.sendTransactionAsync(scenario.agreementId, COLLATERALIZER, { from: scenario.from(MOCK_TERMS_CONTRACT_ADDRESS, ATTACKER) })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }
            else {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(collateralizer.collateralize.sendTransactionAsync(scenario.agreementId, COLLATERALIZER, { from: scenario.from(MOCK_TERMS_CONTRACT_ADDRESS, ATTACKER) })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }
        });
    }
}
exports.CollateralizeRunner = CollateralizeRunner;
//# sourceMappingURL=collateralize.js.map