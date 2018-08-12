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
// External
const chai = require("chai");
const bignumber_js_1 = require("bignumber.js");
// Wrappers
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
const mock_debt_token_1 = require("../../../types/generated/mock_debt_token");
// Test Utils
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
const constants_1 = require("../test_utils/constants");
const multisig_1 = require("../test_utils/multisig");
const web3_utils_1 = require("../../../utils/web3_utils");
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
const dharmaMultiSigWallet = artifacts.require("DharmaMultiSigWallet");
contract("DharmaMultiSigWallet (Integration Tests)", (ACCOUNTS) => {
    const OWNERS = ACCOUNTS.slice(0, 5);
    const NON_OWNER = ACCOUNTS[5];
    const CONFIRMATION_THRESHOLD = 3;
    const TIMELOCK_IN_SECONDS = 60 * 60 * 24 * 7; // 7 days
    let multisig;
    let mockDebtToken;
    const TX_DEFAULTS = { from: OWNERS[0], gas: 4000000 };
    before(() => __awaiter(this, void 0, void 0, function* () {
        multisig = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
        mockDebtToken = yield mock_debt_token_1.MockDebtTokenContract.deployed(web3, TX_DEFAULTS);
        yield mockDebtToken.reset.sendTransactionAsync();
    }));
    describe("Initialization", () => {
        it("should have correct test owners", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(multisig.getOwners.callAsync()).to.eventually.deep.equal(OWNERS);
        }));
        it("should have correct confirmation threshold", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(multisig.required.callAsync()).to.eventually.bignumber.equal(CONFIRMATION_THRESHOLD);
        }));
        it("should have correct timelock in seconds", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(multisig.timelockInSeconds.callAsync()).to.eventually.bignumber.equal(TIMELOCK_IN_SECONDS);
        }));
    });
    describe("#changeTimeLock", () => {
        const ALTERNATIVE_TIMELOCK_IN_SECONDS = 60 * 60 * 24 * 14; // 14 days
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield multisig_1.multiSigExecuteAfterTimelock(web3, multisig, multisig, "changeTimeLock", ACCOUNTS, [ALTERNATIVE_TIMELOCK_IN_SECONDS]);
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield multisig_1.multiSigExecuteAfterTimelock(web3, multisig, multisig, "changeTimeLock", ACCOUNTS, [TIMELOCK_IN_SECONDS], ALTERNATIVE_TIMELOCK_IN_SECONDS);
        }));
        it("should change time lock period", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(multisig.timelockInSeconds.callAsync()).to.eventually.bignumber.equal(ALTERNATIVE_TIMELOCK_IN_SECONDS);
        }));
    });
    describe("#confirmTransaction", () => {
        const UNSUBMITTED_TRANSACTION_INDEX = new bignumber_js_1.BigNumber(13);
        describe("tx has not been submitted yet", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(multisig.confirmTransaction.sendTransactionAsync(UNSUBMITTED_TRANSACTION_INDEX, { from: OWNERS[0] })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("tx has been submitted", () => {
            let transactionId;
            before(() => __awaiter(this, void 0, void 0, function* () {
                transactionId = yield multisig_1.submitMultiSigTransaction(multisig, mockDebtToken, "addAuthorizedMintAgent", [NON_OWNER], { from: OWNERS[0] });
            }));
            describe("non-owner confirms tx", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                        from: NON_OWNER,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("owner confirms tx", () => {
                describe("when he has not yet confirmed it", () => {
                    it("should successfully confirm", () => __awaiter(this, void 0, void 0, function* () {
                        yield multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                            from: OWNERS[1],
                        });
                        // If tx is confirmed successfully, it should now have 2 confirmations,
                        // given that the transaction submission endowed it with one confirmation
                        // at the outset.
                        const expectedConfirmationCount = 2;
                        yield expect(multisig.getConfirmationCount.callAsync(transactionId)).to.eventually.bignumber.equal(expectedConfirmationCount);
                    }));
                });
                describe("when he has already confirmed it", () => {
                    it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                            from: OWNERS[1],
                        })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
            });
        });
    });
    describe("#revokeConfirmation", () => {
        const UNSUBMITTED_TRANSACTION_INDEX = new bignumber_js_1.BigNumber(13);
        describe("tx has not been submitted yet", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(multisig.revokeConfirmation.sendTransactionAsync(UNSUBMITTED_TRANSACTION_INDEX, { from: OWNERS[0] })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("tx has been submitted", () => {
            let transactionId;
            before(() => __awaiter(this, void 0, void 0, function* () {
                transactionId = yield multisig_1.submitMultiSigTransaction(multisig, mockDebtToken, "addAuthorizedMintAgent", [NON_OWNER], { from: OWNERS[0] });
            }));
            describe("non-owner revokes confirmation", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(multisig.revokeConfirmation.sendTransactionAsync(transactionId, {
                        from: NON_OWNER,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("owner has not already confirmed it", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(multisig.revokeConfirmation.sendTransactionAsync(transactionId, {
                        from: OWNERS[1],
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("owner has already confirmed it", () => {
                it("should successfully revoke", () => __awaiter(this, void 0, void 0, function* () {
                    yield multisig.revokeConfirmation.sendTransactionAsync(transactionId, {
                        from: OWNERS[0],
                    });
                    // If tx is confirmed successfully, it should now have 0 confirmations,
                    // given that the transaction submission endowed it with one confirmation
                    // at the outset.
                    const expectedConfirmationCount = 0;
                    yield expect(multisig.getConfirmationCount.callAsync(transactionId)).to.eventually.bignumber.equal(expectedConfirmationCount);
                }));
            });
        });
    });
    describe("#executeTransaction", () => {
        const UNSUBMITTED_TRANSACTION_INDEX = new bignumber_js_1.BigNumber(13);
        describe("tx has not been submitted yet", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(multisig.executeTransaction.sendTransactionAsync(UNSUBMITTED_TRANSACTION_INDEX, { from: OWNERS[0] })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("transaction has been submitted", () => {
            let transactionId;
            before(() => __awaiter(this, void 0, void 0, function* () {
                transactionId = yield multisig_1.submitMultiSigTransaction(multisig, mockDebtToken, "addAuthorizedMintAgent", [NON_OWNER], { from: OWNERS[0] });
            }));
            describe("transaction has not been sufficiently confirmed", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                        from: OWNERS[1],
                    });
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(multisig.executeTransaction.sendTransactionAsync(transactionId)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("transaction has been sufficiently confirmed", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                        from: OWNERS[2],
                    });
                }));
                describe("timelock period has not yet passed", () => {
                    it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(multisig.executeTransaction.sendTransactionAsync(transactionId)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
                describe("timelock period has passed", () => {
                    it("should execute transaction", () => __awaiter(this, void 0, void 0, function* () {
                        const web3Utils = new web3_utils_1.Web3Utils(web3);
                        yield web3Utils.increaseTime(TIMELOCK_IN_SECONDS);
                        yield multisig.executeTransaction.sendTransactionAsync(transactionId);
                        yield expect(mockDebtToken.wasAddAuthorizedMintAgentCalledWith.callAsync(NON_OWNER)).to.eventually.be.true;
                    }));
                });
            });
        });
    });
    describe("#executePauseTransactionImmediately", () => {
        const UNSUBMITTED_TRANSACTION_INDEX = new bignumber_js_1.BigNumber(13);
        describe("tx has not been submitted yet", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(multisig.executePauseTransactionImmediately.sendTransactionAsync(UNSUBMITTED_TRANSACTION_INDEX, { from: OWNERS[0] })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("non-pause tx has been submitted w/ sufficient confirmations", () => {
            let transactionId;
            before(() => __awaiter(this, void 0, void 0, function* () {
                transactionId = yield multisig_1.submitMultiSigTransaction(multisig, mockDebtToken, "addAuthorizedMintAgent", [NON_OWNER], { from: OWNERS[0] });
                for (let i = 1; i < 3; i++) {
                    yield multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                        from: OWNERS[i],
                    });
                }
            }));
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(multisig.executePauseTransactionImmediately.sendTransactionAsync(transactionId)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("pause tx has been submitted already", () => {
            let transactionId;
            before(() => __awaiter(this, void 0, void 0, function* () {
                transactionId = yield multisig_1.submitMultiSigTransaction(multisig, mockDebtToken, "pause", [], { from: OWNERS[0] });
            }));
            describe("transaction has not been sufficiently confirmed", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                        from: OWNERS[1],
                    });
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(multisig.executeTransaction.sendTransactionAsync(transactionId)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(multisig.executePauseTransactionImmediately.sendTransactionAsync(transactionId)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("transaction has been sufficiently confirmed", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig.confirmTransaction.sendTransactionAsync(transactionId, {
                        from: OWNERS[2],
                    });
                }));
                it("should execute transaction", () => __awaiter(this, void 0, void 0, function* () {
                    yield multisig.executePauseTransactionImmediately.sendTransactionAsync(transactionId);
                    yield expect(mockDebtToken.wasPauseCalled.callAsync()).to.eventually.be.true;
                }));
            });
        });
    });
});
//# sourceMappingURL=dharma_multisig_wallet.js.map