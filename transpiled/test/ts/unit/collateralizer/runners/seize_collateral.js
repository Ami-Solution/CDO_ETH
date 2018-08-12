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
// External Libraries
const chai_1 = require("chai");
const ABIDecoder = require("abi-decoder");
const lodash_1 = require("lodash");
const bignumber_js_1 = require("bignumber.js");
// Test Utils
const constants_1 = require("../../../test_utils/constants");
const web3_utils_1 = require("../../../../../utils/web3_utils");
// Logs
const collateralized_contract_1 = require("../../../logs/collateralized_contract");
// Factories
const terms_contract_parameters_1 = require("../../../factories/terms_contract_parameters");
class SeizeCollateralRunner {
    constructor(web3) {
        this.web3Utils = new web3_utils_1.Web3Utils(web3);
        this.testScenario = this.testScenario.bind(this);
    }
    initialize(contracts, accounts) {
        this.contracts = contracts;
        this.accounts = accounts;
    }
    testScenario(scenario) {
        let COLLATERALIZER;
        let NON_COLLATERALIZER;
        let BENEFICIARY_1;
        let BENEFICIARY_2;
        let ATTACKER;
        let collateralizer;
        let mockDebtRegistry;
        let mockCollateralToken;
        let mockTokenRegistry;
        let mockTokenTransferProxy;
        let mockTermsContract;
        let txHash;
        describe(scenario.description, () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                collateralizer = this.contracts.collateralizer;
                mockDebtRegistry = this.contracts.mockDebtRegistry;
                mockCollateralToken = this.contracts.mockCollateralToken;
                mockTokenRegistry = this.contracts.mockTokenRegistry;
                mockTokenTransferProxy = this.contracts.mockTokenTransferProxy;
                mockTermsContract = this.contracts.mockTermsContract;
                BENEFICIARY_1 = this.accounts.BENEFICIARY_1;
                BENEFICIARY_2 = this.accounts.BENEFICIARY_2;
                ATTACKER = this.accounts.ATTACKER;
                COLLATERALIZER = this.accounts.COLLATERALIZER;
                NON_COLLATERALIZER = this.accounts.NON_COLLATERALIZER;
                yield mockDebtRegistry.reset.sendTransactionAsync();
                yield mockCollateralToken.reset.sendTransactionAsync();
                yield mockTokenRegistry.reset.sendTransactionAsync();
                const latestBlockTime = yield this.web3Utils.getLatestBlockTime();
                // We mock the collateralized agreement by taking the following steps:
                // 1.  Mocking the collateral token as being placed at index 0
                //        in the token registry
                yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(new bignumber_js_1.BigNumber(0), mockCollateralToken.address);
                // 2.  Packing that index and other collateralization parameters
                //      into a terms contract parameter string.
                const termsContractParameters = terms_contract_parameters_1.CollateralizedSimpleInterestTermsParameters.pack({
                    collateralTokenIndex: new bignumber_js_1.BigNumber(0),
                    collateralAmount: scenario.collateralAmount,
                    gracePeriodInDays: scenario.gracePeriodInDays,
                });
                // 2. Mocking the terms of the debt agreement to correspond to the
                //      collateralized terms contract and our generated parameters
                //      (if agreement exists)
                if (scenario.debtAgreementExists) {
                    yield mockDebtRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(scenario.agreementId, scenario.termsContract(mockTermsContract.address, ATTACKER), termsContractParameters);
                }
                // 3. Mocking the debt's current beneficiary
                //        (if agreement exists)
                if (scenario.debtAgreementExists) {
                    yield mockDebtRegistry.mockGetBeneficiaryReturnValueFor.sendTransactionAsync(scenario.agreementId, BENEFICIARY_1);
                }
                /*
                    Actually perform collateralization before returning.
                 */
                // Mock collateral token's balance for collateralizer.
                yield mockCollateralToken.mockBalanceOfFor.sendTransactionAsync(COLLATERALIZER, scenario.collateralAmount);
                // Mock collateral token's allowance for proxy.
                yield mockCollateralToken.mockAllowanceFor.sendTransactionAsync(COLLATERALIZER, mockTokenTransferProxy.address, scenario.collateralAmount);
                if (scenario.debtAgreementExists &&
                    scenario.debtAgreementCollateralized &&
                    scenario.validTermsContract) {
                    yield mockTermsContract.mockCallCollateralize.sendTransactionAsync(collateralizer.address, scenario.agreementId, COLLATERALIZER);
                }
                // 5. Mocking the expected repayment schedule for the agreement id
                for (const repaymentDate of scenario.expectedRepaymentValueSchedule) {
                    yield mockTermsContract.mockExpectedRepaymentValue.sendTransactionAsync(scenario.agreementId, new bignumber_js_1.BigNumber(repaymentDate.timestamp(latestBlockTime)), repaymentDate.expectedRepaymentValue);
                }
                // 6.  Mocking the current value repaid to date
                yield mockTermsContract.mockDummyValueRepaid.sendTransactionAsync(scenario.agreementId, scenario.valueRepaidToDate);
                if (typeof scenario.before !== "undefined") {
                    yield scenario.before(collateralizer, mockTermsContract);
                }
                ABIDecoder.addABI(collateralizer.abi);
            }));
            after(() => {
                ABIDecoder.addABI(collateralizer.abi);
            });
            if (scenario.succeeds) {
                it("should not throw", () => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield collateralizer.seizeCollateral.sendTransactionAsync(scenario.agreementId, { from: scenario.from(BENEFICIARY_1, BENEFICIARY_2) });
                    chai_1.expect(txHash.length).to.equal(66);
                }));
                it("should erase record of current collateralization", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(collateralizer.agreementToCollateralizer.callAsync(scenario.agreementId)).to.eventually.equal(constants_1.NULL_ADDRESS);
                }));
                it("should emit log that collateral has been seized", () => __awaiter(this, void 0, void 0, function* () {
                    const receipt = yield web3.eth.getTransactionReceipt(txHash);
                    const [CollateralSeizedLog] = lodash_1.compact(ABIDecoder.decodeLogs(receipt.logs));
                    chai_1.expect(CollateralSeizedLog).to.deep.equal(collateralized_contract_1.CollateralSeized(collateralizer.address, scenario.agreementId, scenario.beneficiary(BENEFICIARY_1, BENEFICIARY_2), mockCollateralToken.address, scenario.collateralAmount));
                }));
                it("should transfer collateral from terms contract to current beneficiary", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(mockCollateralToken.wasTransferCalledWith.callAsync(scenario.beneficiary(BENEFICIARY_1, BENEFICIARY_2), scenario.collateralAmount)).to.eventually.be.true;
                }));
            }
            else {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield chai_1.expect(collateralizer.seizeCollateral.sendTransactionAsync(scenario.agreementId, {
                        from: scenario.from(BENEFICIARY_1, ATTACKER),
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }
        });
    }
}
exports.SeizeCollateralRunner = SeizeCollateralRunner;
//# sourceMappingURL=seize_collateral.js.map