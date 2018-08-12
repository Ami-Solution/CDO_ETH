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
// External libraries
const ABIDecoder = require("abi-decoder");
const chai_1 = require("chai");
// Test Utils
const constants_1 = require("../../../../test_utils/constants");
// Logs
const simple_interest_terms_contract_1 = require("../../../../logs/simple_interest_terms_contract");
// Runners
const simple_interest_terms_contract_2 = require("./simple_interest_terms_contract");
class RegisterTermStartRunner extends simple_interest_terms_contract_2.SimpleInterestTermsContractRunner {
    testScenario(scenario) {
        let txHash;
        describe(scenario.description, () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield this.setupDebtOrder(scenario);
                if (scenario.invokedByDebtKernel && !scenario.reverts) {
                    // Fill the debt order, thereby invoking registerTermsStart from the debt kernel.
                    txHash = yield this.fillDebtOrder();
                }
                // Setup ABI decoder in order to decode logs
                ABIDecoder.addABI(this.contracts.simpleInterestTermsContract.abi);
            }));
            after(() => {
                // Tear down ABIDecoder before next set of tests
                ABIDecoder.removeABI(this.contracts.simpleInterestTermsContract.abi);
            });
            if (scenario.succeeds) {
                it("should emit a LogSimpleInterestTermStart event", () => __awaiter(this, void 0, void 0, function* () {
                    const { simpleInterestTermsContract } = this.contracts;
                    const debtOrder = this.debtOrder;
                    const expectedLog = simple_interest_terms_contract_1.LogSimpleInterestTermStart(simpleInterestTermsContract.address, this.agreementId, debtOrder.getPrincipalTokenAddress(), debtOrder.getPrincipalAmount(), scenario.interestRateFixedPoint, scenario.amortizationUnitType, scenario.termLengthUnits);
                    const returnedLog = yield this.getLogs(txHash, "LogSimpleInterestTermStart");
                    chai_1.expect(returnedLog).to.deep.equal(expectedLog);
                }));
            }
            else {
                if (scenario.reverts) {
                    it("should revert the transaction", () => __awaiter(this, void 0, void 0, function* () {
                        if (!scenario.invokedByDebtKernel) {
                            chai_1.expect(this.registerTermsStart()).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                        }
                        else {
                            chai_1.expect(this.fillDebtOrder()).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                        }
                    }));
                }
                else {
                    it("should not emit a LogSimpleInterestTermStart event", () => __awaiter(this, void 0, void 0, function* () {
                        const returnedLog = yield this.getLogs(txHash, "LogSimpleInterestTermStart");
                        chai_1.expect(returnedLog).to.be.undefined;
                    }));
                }
            }
        });
    }
    registerTermsStart() {
        const { DEBTOR_1, UNDERWRITER } = this.accounts;
        const { simpleInterestTermsContract } = this.contracts;
        return simpleInterestTermsContract.registerTermStart.sendTransactionAsync(this.agreementId, DEBTOR_1, { from: UNDERWRITER });
    }
}
exports.RegisterTermStartRunner = RegisterTermStartRunner;
//# sourceMappingURL=register_term_start.js.map