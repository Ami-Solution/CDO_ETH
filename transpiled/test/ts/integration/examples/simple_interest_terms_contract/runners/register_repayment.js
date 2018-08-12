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
// Wrappers
const dummy_token_1 = require("../../../../../../types/generated/dummy_token");
// Logs
const simple_interest_terms_contract_1 = require("../../../../logs/simple_interest_terms_contract");
// Runners
const simple_interest_terms_contract_2 = require("./simple_interest_terms_contract");
const DEFAULT_GAS_AMOUNT = 4712388;
class RegisterRepaymentRunner extends simple_interest_terms_contract_2.SimpleInterestTermsContractRunner {
    testScenario(scenario) {
        let txHash;
        let dummyREPToken;
        let dummyZRXToken;
        let repaidAmountBefore;
        describe(scenario.description, () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield this.setupDebtOrder(scenario);
                dummyZRXToken = yield this.setupDummyZRXToken();
                dummyREPToken = this.contracts.dummyREPToken;
                const { CONTRACT_OWNER, DEBTOR_1, } = this.accounts;
                const { tokenTransferProxy, simpleInterestTermsContract, } = this.contracts;
                // Fill a debt order, against which to test repayments.
                yield this.fillDebtOrder();
                yield dummyREPToken.setBalance.sendTransactionAsync(DEBTOR_1, scenario.repaymentAmount, {
                    from: CONTRACT_OWNER,
                });
                yield dummyREPToken.approve.sendTransactionAsync(tokenTransferProxy.address, scenario.repaymentAmount, { from: DEBTOR_1 });
                repaidAmountBefore = yield this.contracts.simpleInterestTermsContract
                    .getValueRepaidToDate.callAsync(this.agreementId);
                // Setup ABI decoder in order to decode logs
                ABIDecoder.addABI(simpleInterestTermsContract.abi);
            }));
            after(() => {
                ABIDecoder.removeABI(this.contracts.simpleInterestTermsContract.abi);
            });
            if (scenario.reverts) {
                it("should revert the transaction", () => __awaiter(this, void 0, void 0, function* () {
                    // The transaction can be reverted via the router, or the terms contract itself.
                    let transaction;
                    if (scenario.repayFromRouter) {
                        transaction = this.repayWithRouter(scenario.repaymentAmount, scenario.repaymentToken(dummyREPToken, dummyZRXToken).address);
                    }
                    else {
                        // The transaction is attempted on the terms contract itself.
                        transaction = this.registerRepayment(scenario.repaymentAmount);
                    }
                    yield chai_1.expect(transaction).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }
            else {
                // If the scenario does not revert, we can call the function and get the txHash.
                before(() => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield this.repayWithRouter(scenario.repaymentAmount, scenario.repaymentToken(dummyREPToken, dummyZRXToken).address);
                }));
            }
            if (scenario.succeeds) {
                it("should record the repayment", () => __awaiter(this, void 0, void 0, function* () {
                    const { simpleInterestTermsContract } = this.contracts;
                    const agreementId = this.agreementId;
                    yield chai_1.expect(simpleInterestTermsContract.getValueRepaidToDate.callAsync(agreementId)).to.eventually.bignumber.equal(repaidAmountBefore.add(scenario.repaymentAmount));
                }));
                it("should emit a LogRegisterRepayment event", () => __awaiter(this, void 0, void 0, function* () {
                    const { DEBTOR_1, CREDITOR_1 } = this.accounts;
                    const returnedLog = yield this.getLogs(txHash, "LogRegisterRepayment");
                    const expectedLog = simple_interest_terms_contract_1.LogRegisterRepayment(this.contracts.simpleInterestTermsContract.address, this.agreementId, DEBTOR_1, CREDITOR_1, scenario.repaymentAmount, this.debtOrder.getPrincipalTokenAddress());
                    chai_1.expect(returnedLog).to.deep.equal(expectedLog);
                }));
            }
            else {
                // A repayment should never be recorded if the scenario fails.
                it("should not record a repayment", () => __awaiter(this, void 0, void 0, function* () {
                    const { simpleInterestTermsContract } = this.contracts;
                    const agreementId = this.agreementId;
                    yield chai_1.expect(simpleInterestTermsContract.getValueRepaidToDate.callAsync(agreementId)).to.eventually.bignumber.equal(repaidAmountBefore);
                }));
                // If the scenario does not revert, we can check the logs from the txHash to
                // ensure that no logs were emitted for repayments.
                if (!scenario.reverts) {
                    it("should not emit a LogRegisterRepayment event", () => __awaiter(this, void 0, void 0, function* () {
                        const returnedLog = yield this.getLogs(txHash, "LogRegisterRepayment");
                        chai_1.expect(returnedLog).to.be.undefined;
                    }));
                }
            }
        });
    }
    // Calls registerRepayment() directly on the terms contract.
    registerRepayment(amount) {
        const { simpleInterestTermsContract } = this.contracts;
        const { DEBTOR_1, CREDITOR_1 } = this.accounts;
        return simpleInterestTermsContract.registerRepayment.sendTransactionAsync(this.agreementId, DEBTOR_1, CREDITOR_1, amount, this.debtOrder.getPrincipalTokenAddress(), { from: DEBTOR_1 });
    }
    repayWithRouter(amount, tokenAddress) {
        return this.contracts.repaymentRouter.repay.sendTransactionAsync(this.agreementId, amount, tokenAddress, { from: this.accounts.DEBTOR_1 });
    }
    setupDummyZRXToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const dummyZRXTokenAddress = yield this.contracts.dummyTokenRegistryContract.getTokenAddressBySymbol.callAsync("ZRX");
            return dummy_token_1.DummyTokenContract.at(dummyZRXTokenAddress, web3, { from: this.accounts.CONTRACT_OWNER, gas: DEFAULT_GAS_AMOUNT });
        });
    }
}
exports.RegisterRepaymentRunner = RegisterRepaymentRunner;
//# sourceMappingURL=register_repayment.js.map