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
const bignumber_js_1 = require("bignumber.js");
const chai_1 = require("chai");
// Test Utils
const constants_1 = require("../../../../test_utils/constants");
// Logs
const simple_interest_terms_contract_1 = require("../../../../logs/simple_interest_terms_contract");
// Runners
const collateralized_simple_interest_terms_contract_1 = require("./collateralized_simple_interest_terms_contract");
const collateralized_contract_1 = require("../../../../logs/collateralized_contract");
class RegisterTermStartRunner extends collateralized_simple_interest_terms_contract_1.CollateralizedSimpleInterestTermsContractRunner {
    testScenario(scenario) {
        let txHash;
        describe(scenario.description, () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield this.setupDebtOrder(scenario);
                // Reset the collateralizer contract's balance for each example.
                yield this.contracts.dummyZRXToken.setBalance.sendTransactionAsync(this.contracts.collateralizerContract.address, new bignumber_js_1.BigNumber(0), {
                    from: this.accounts.CONTRACT_OWNER,
                });
                yield this.contracts.dummyZRXToken.setBalance.sendTransactionAsync(this.accounts.DEBTOR_1, scenario.collateralTokenBalance, {
                    from: this.accounts.CONTRACT_OWNER,
                });
                yield this.contracts.dummyZRXToken.approve.sendTransactionAsync(this.contracts.tokenTransferProxy.address, scenario.collateralTokenAllowance, { from: this.accounts.DEBTOR_1 });
                if (!scenario.permissionToCollateralize) {
                    yield this.contracts.collateralizerContract.revokeCollateralizeAuthorization.sendTransactionAsync(this.contracts.collateralizedSimpleInterestTermsContract.address, { from: this.accounts.CONTRACT_OWNER });
                }
                if (scenario.invokedByDebtKernel && !scenario.reverts) {
                    const latestBlockTime = yield this.web3Utils.getLatestBlockTime();
                    // Fill the debt order, thereby invoking registerTermsStart from the debt kernel.
                    txHash = yield this.fillDebtOrder();
                }
                // Setup ABI decoder in order to decode logs.
                ABIDecoder.addABI(this.contracts.collateralizedSimpleInterestTermsContract.abi);
                ABIDecoder.addABI(this.contracts.collateralizerContract.abi);
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                if (!scenario.permissionToCollateralize) {
                    yield this.contracts.collateralizerContract.addAuthorizedCollateralizeAgent.sendTransactionAsync(this.contracts.collateralizedSimpleInterestTermsContract.address, { from: this.accounts.CONTRACT_OWNER });
                }
                // Tear down ABIDecoder before next set of tests
                ABIDecoder.removeABI(this.contracts.collateralizedSimpleInterestTermsContract.abi);
                ABIDecoder.removeABI(this.contracts.collateralizerContract.abi);
            }));
            if (scenario.succeeds) {
                it("should emit a LogSimpleInterestTermStart event", () => __awaiter(this, void 0, void 0, function* () {
                    const { collateralizedSimpleInterestTermsContract } = this.contracts;
                    const debtOrder = this.debtOrder;
                    const expectedLog = simple_interest_terms_contract_1.LogSimpleInterestTermStart(collateralizedSimpleInterestTermsContract.address, this.agreementId, debtOrder.getPrincipalTokenAddress(), debtOrder.getPrincipalAmount(), scenario.interestRateFixedPoint, scenario.amortizationUnitType, scenario.termLengthUnits);
                    const returnedLog = yield this.getLogs(txHash, "LogSimpleInterestTermStart");
                    chai_1.expect(returnedLog).to.deep.equal(expectedLog);
                }));
                it("should emit a CollateralLocked event", () => __awaiter(this, void 0, void 0, function* () {
                    const { collateralizerContract } = this.contracts;
                    const expectedLog = collateralized_contract_1.CollateralLocked(collateralizerContract.address, this.agreementId, this.contracts.dummyZRXToken.address, scenario.collateralAmount);
                    const returnedLog = yield this.getLogs(txHash, "CollateralLocked");
                    chai_1.expect(returnedLog).to.deep.equal(expectedLog);
                }));
                it("should decrement the balance for the debtor by the collateral amount", () => __awaiter(this, void 0, void 0, function* () {
                    const balance = yield this.contracts.dummyZRXToken.balanceOf.callAsync(this.accounts.DEBTOR_1);
                    chai_1.expect(balance.toString()).to.equal(scenario.collateralTokenBalance.sub(scenario.collateralAmount).toString());
                }));
                it("should increment the collateralizer balance by the collateral amount", () => __awaiter(this, void 0, void 0, function* () {
                    const balance = yield this.contracts.dummyZRXToken.balanceOf.callAsync(this.contracts.collateralizerContract.address);
                    chai_1.expect(balance.toString()).to.equal(scenario.collateralAmount.toString());
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
        const { collateralizedSimpleInterestTermsContract } = this.contracts;
        return collateralizedSimpleInterestTermsContract.registerTermStart.sendTransactionAsync(this.agreementId, DEBTOR_1, { from: UNDERWRITER });
    }
}
exports.RegisterTermStartRunner = RegisterTermStartRunner;
//# sourceMappingURL=register_term_start.js.map