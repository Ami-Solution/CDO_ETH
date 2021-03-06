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
const ABIDecoder = require("abi-decoder");
const _ = require("lodash");
const chai = require("chai");
const moment = require("moment");
const bignumber_js_1 = require("bignumber.js");
// Test Utils
const Units = require("../test_utils/units");
const multisig_1 = require("../test_utils/multisig");
const chai_setup_1 = require("../test_utils/chai_setup");
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const web3_utils_1 = require("../../../utils/web3_utils");
// Logs
const debt_token_1 = require("../logs/debt_token");
const debt_kernel_1 = require("../logs/debt_kernel");
const debt_registry_1 = require("../logs/debt_registry");
// Factories
const terms_contract_parameters_1 = require("../factories/terms_contract_parameters");
const debt_order_factory_1 = require("../factories/debt_order_factory");
// Wrappers
const debt_kernel_2 = require("../../../types/generated/debt_kernel");
const debt_registry_2 = require("../../../types/generated/debt_registry");
const entry_1 = require("../../../types/registry/entry");
const debt_token_2 = require("../../../types/generated/debt_token");
const dummy_token_1 = require("../../../types/generated/dummy_token");
const incompatible_terms_contract_1 = require("../../../types/generated/incompatible_terms_contract");
const repayment_router_1 = require("../../../types/generated/repayment_router");
const simple_interest_terms_contract_1 = require("../../../types/generated/simple_interest_terms_contract");
const token_registry_1 = require("../../../types/generated/token_registry");
const token_transfer_proxy_1 = require("../../../types/generated/token_transfer_proxy");
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
// Constants
const constants_1 = require("../test_utils/constants");
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
// Set up utils
const web3Utils = new web3_utils_1.Web3Utils(web3);
const debtKernelContract = artifacts.require("DebtKernel");
contract("Debt Kernel (Integration Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    let kernel;
    let repaymentRouter;
    let simpleInterestTermsContract;
    let tokenTransferProxy;
    let debtTokenContract;
    let debtRegistryContract;
    let dummyREPToken;
    let incompatibleTermsContractAddress;
    let defaultOrderParams;
    let orderFactory;
    let multiSig;
    const CONTRACT_OWNER = ACCOUNTS[0];
    const ATTACKER = ACCOUNTS[1];
    const DEBTOR_1 = ACCOUNTS[2];
    const CREDITOR_1 = ACCOUNTS[3];
    const UNDERWRITER = ACCOUNTS[4];
    const RELAYER = ACCOUNTS[6];
    const MALICIOUS_TERMS_CONTRACTS = ACCOUNTS[7];
    const ALTERNATIVE_TOKEN_ADDRESS = ACCOUNTS[8];
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4712388 };
    const reset = () => __awaiter(this, void 0, void 0, function* () {
        const dummyTokenRegistryContract = yield token_registry_1.TokenRegistryContract.deployed(web3, TX_DEFAULTS);
        const dummyREPTokenAddress = yield dummyTokenRegistryContract.getTokenAddressBySymbol.callAsync("REP");
        dummyREPToken = yield dummy_token_1.DummyTokenContract.at(dummyREPTokenAddress, web3, TX_DEFAULTS);
        const incompatibleTermsContract = yield incompatible_terms_contract_1.IncompatibleTermsContractContract.deployed(web3, TX_DEFAULTS);
        incompatibleTermsContractAddress = incompatibleTermsContract.address;
        debtTokenContract = yield debt_token_2.DebtTokenContract.deployed(web3, TX_DEFAULTS);
        debtRegistryContract = yield debt_registry_2.DebtRegistryContract.deployed(web3, TX_DEFAULTS);
        simpleInterestTermsContract = yield simple_interest_terms_contract_1.SimpleInterestTermsContractContract.deployed(web3, TX_DEFAULTS);
        tokenTransferProxy = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        kernel = yield debt_kernel_2.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        multiSig = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
        repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
        const termsContractParameters = terms_contract_parameters_1.SimpleInterestParameters.pack({
            principalTokenIndex: new bignumber_js_1.BigNumber(0),
            principalAmount: Units.ether(1),
            interestRateFixedPoint: Units.interestRateFixedPoint(2.5),
            amortizationUnitType: new bignumber_js_1.BigNumber(1),
            termLengthUnits: new bignumber_js_1.BigNumber(4),
        });
        const latestBlockTime = yield web3Utils.getLatestBlockTime();
        defaultOrderParams = {
            creditor: CREDITOR_1,
            creditorFee: Units.ether(0.002),
            debtKernelContract: kernel.address,
            debtOrderVersion: kernel.address,
            debtTokenContract: debtTokenContract.address,
            debtor: DEBTOR_1,
            debtorFee: Units.ether(0.001),
            expirationTimestampInSec: new bignumber_js_1.BigNumber(moment
                .unix(latestBlockTime)
                .add(30, "days")
                .unix()),
            issuanceVersion: repaymentRouter.address,
            orderSignatories: { debtor: DEBTOR_1, creditor: CREDITOR_1, underwriter: UNDERWRITER },
            principalAmount: Units.ether(1),
            principalTokenAddress: dummyREPToken.address,
            relayer: RELAYER,
            relayerFee: Units.ether(0.0015),
            termsContract: simpleInterestTermsContract.address,
            termsContractParameters,
            underwriter: UNDERWRITER,
            underwriterFee: Units.ether(0.0015),
            underwriterRiskRating: Units.underwriterRiskRatingFixedPoint(1.35),
        };
        orderFactory = new debt_order_factory_1.DebtOrderFactory(defaultOrderParams);
        // Setup ABI decoder in order to decode logs
        ABIDecoder.addABI(debtKernelContract.abi);
        ABIDecoder.addABI(debtTokenContract.abi);
        ABIDecoder.addABI(debtRegistryContract.abi);
    });
    before(reset);
    after(() => {
        // Tear down ABIDecoder before next set of tests
        ABIDecoder.removeABI(debtKernelContract.abi);
    });
    describe("Initialization & Upgrades", () => __awaiter(this, void 0, void 0, function* () {
        describe("#setDebtToken", () => {
            describe("when called by a non-owner", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    expect(kernel.setDebtToken.sendTransactionAsync(debtTokenContract.address, {
                        from: ATTACKER,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("when executed via the multi-sig", () => {
                // The kernel is already set to use debtTokenContract.address,
                // so we test using an alternative address.
                const newAddress = ALTERNATIVE_TOKEN_ADDRESS;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, kernel, "setDebtToken", ACCOUNTS, [newAddress]);
                }));
                after(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, kernel, "setDebtToken", ACCOUNTS, [debtTokenContract.address]);
                }));
                it("sets the debtToken address to the new address", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(kernel.debtToken.callAsync()).to.eventually.equal(newAddress);
                }));
            });
        });
    }));
    describe("#fillDebtOrder", () => {
        let debtOrder;
        const testShouldReturnError = (order, errorCode, signaturesR, signaturesS, signaturesV) => __awaiter(this, void 0, void 0, function* () {
            const txHash = yield kernel.fillDebtOrder.sendTransactionAsync(order.getCreditor(), order.getOrderAddresses(), order.getOrderValues(), order.getOrderBytes32(), signaturesV || order.getSignaturesV(), signaturesR || order.getSignaturesR(), signaturesS || order.getSignaturesS());
            const receipt = yield web3.eth.getTransactionReceipt(txHash);
            const [errorLog] = _.compact(ABIDecoder.decodeLogs(receipt.logs));
            expect(errorLog).to.deep.equal(debt_kernel_1.LogError(kernel.address, errorCode, order.getDebtOrderHash()));
        });
        const setupBalancesAndAllowances = () => __awaiter(this, void 0, void 0, function* () {
            const token = yield dummy_token_1.DummyTokenContract.at(debtOrder.getPrincipalTokenAddress(), web3, TX_DEFAULTS);
            const debtor = debtOrder.getDebtor();
            const creditor = debtOrder.getCreditor();
            yield token.setBalance.sendTransactionAsync(debtor, new bignumber_js_1.BigNumber(0), {
                from: CONTRACT_OWNER,
            });
            yield token.approve.sendTransactionAsync(tokenTransferProxy.address, new bignumber_js_1.BigNumber(0), {
                from: debtor,
            });
            const creditorBalanceAndAllowance = debtOrder
                .getPrincipalAmount()
                .plus(debtOrder.getCreditorFee());
            yield token.setBalance.sendTransactionAsync(creditor, creditorBalanceAndAllowance, {
                from: CONTRACT_OWNER,
            });
            yield token.approve.sendTransactionAsync(tokenTransferProxy.address, creditorBalanceAndAllowance, { from: creditor });
            return [new bignumber_js_1.BigNumber(0), creditorBalanceAndAllowance];
        });
        const getAgentBalances = (principalToken) => __awaiter(this, void 0, void 0, function* () {
            const debtorBalance = yield principalToken.balanceOf.callAsync(debtOrder.getDebtor());
            const creditorBalance = yield principalToken.balanceOf.callAsync(debtOrder.getCreditor());
            const underwriterBalance = yield principalToken.balanceOf.callAsync(debtOrder.getIssuanceCommitment().getUnderwriter());
            const relayerBalance = yield principalToken.balanceOf.callAsync(debtOrder.getRelayer());
            return [debtorBalance, creditorBalance, underwriterBalance, relayerBalance];
        });
        const testOrderFill = (filler, setupDebtOrder) => {
            return () => {
                let principalToken;
                let debtorBalanceBefore;
                let creditorBalanceBefore;
                let underwriterBalanceBefore;
                let relayerBalanceBefore;
                let receipt;
                let block;
                let logs;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield setupDebtOrder();
                    yield setupBalancesAndAllowances();
                    principalToken = yield dummy_token_1.DummyTokenContract.at(debtOrder.getPrincipalTokenAddress(), web3, TX_DEFAULTS);
                    [
                        debtorBalanceBefore,
                        creditorBalanceBefore,
                        underwriterBalanceBefore,
                        relayerBalanceBefore,
                    ] = yield getAgentBalances(principalToken);
                    const txHash = yield kernel.fillDebtOrder.sendTransactionAsync(debtOrder.getCreditor(), debtOrder.getOrderAddresses(), debtOrder.getOrderValues(), debtOrder.getOrderBytes32(), debtOrder.getSignaturesV(), debtOrder.getSignaturesR(), debtOrder.getSignaturesS(), { from: filler });
                    receipt = yield web3.eth.getTransactionReceipt(txHash);
                    block = yield web3.eth.getBlock(receipt.blockNumber);
                    logs = _.compact(ABIDecoder.decodeLogs(receipt.logs));
                }));
                it("should mint debt token to creditor", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtTokenContract.ownerOf.callAsync(new bignumber_js_1.BigNumber(debtOrder.getIssuanceCommitment().getHash()))).to.eventually.equal(debtOrder.getCreditor());
                }));
                it("should make issuance parameters retrievable from registry", () => __awaiter(this, void 0, void 0, function* () {
                    const [version, beneficiary, underwriter, underwriterRiskRating, termsContract, termsContractParameters, issuanceBlockTimestamp,] = yield debtRegistryContract.get.callAsync(debtOrder.getIssuanceCommitment().getHash());
                    expect(version).to.equal(debtOrder.getIssuanceCommitment().getVersion());
                    expect(beneficiary).to.equal(debtOrder.getCreditor());
                    expect(underwriter).to.equal(debtOrder.getIssuanceCommitment().getUnderwriter());
                    expect(underwriterRiskRating).to.bignumber.equal(debtOrder.getIssuanceCommitment().getUnderwriterRiskRating());
                    expect(termsContract).to.equal(debtOrder.getIssuanceCommitment().getTermsContract());
                    expect(termsContractParameters).to.equal(debtOrder.getIssuanceCommitment().getTermsContractParameters());
                    expect(issuanceBlockTimestamp).to.bignumber.equal(block.timestamp);
                }));
                it("should debit principal + creditor fee from creditor", () => __awaiter(this, void 0, void 0, function* () {
                    const delta = debtOrder.getPrincipalAmount().plus(debtOrder.getCreditorFee());
                    yield expect(principalToken.balanceOf.callAsync(debtOrder.getCreditor())).to.eventually.bignumber.equal(creditorBalanceBefore.minus(delta));
                }));
                it("should credit principal - debtor fee to debtor", () => __awaiter(this, void 0, void 0, function* () {
                    const delta = debtOrder.getPrincipalAmount().minus(debtOrder.getDebtorFee());
                    yield expect(principalToken.balanceOf.callAsync(debtOrder.getDebtor())).to.eventually.bignumber.equal(debtorBalanceBefore.plus(delta));
                }));
                it("should credit underwriter fee to underwriter", () => __awaiter(this, void 0, void 0, function* () {
                    const delta = debtOrder.getUnderwriterFee();
                    yield expect(principalToken.balanceOf.callAsync(debtOrder.getIssuanceCommitment().getUnderwriter())).to.eventually.bignumber.equal(underwriterBalanceBefore.plus(delta));
                }));
                it("should credit relayer fee to relayer", () => __awaiter(this, void 0, void 0, function* () {
                    const delta = debtOrder.getRelayerFee();
                    yield expect(principalToken.balanceOf.callAsync(debtOrder.getRelayer())).to.eventually.bignumber.equal(relayerBalanceBefore.plus(delta));
                }));
                describe("Logs Emitted:", () => {
                    it("should emit registry insert log", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(logs.shift()).to.deep.equal(debt_registry_1.LogInsertEntry(debtRegistryContract.address, new entry_1.DebtRegistryEntry({
                            beneficiary: debtOrder.getCreditor(),
                            debtor: debtOrder.getDebtor(),
                            termsContract: debtOrder
                                .getIssuanceCommitment()
                                .getTermsContract(),
                            termsContractParameters: debtOrder
                                .getIssuanceCommitment()
                                .getTermsContractParameters(),
                            underwriter: debtOrder
                                .getIssuanceCommitment()
                                .getUnderwriter(),
                            underwriterRiskRating: debtOrder
                                .getIssuanceCommitment()
                                .getUnderwriterRiskRating(),
                            version: debtOrder.getIssuanceCommitment().getVersion(),
                        }, debtOrder.getIssuanceCommitment().getSalt())));
                    }));
                    it("should emit debt token transfer log", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(logs.shift()).to.deep.equal(debt_token_1.LogTransfer(debtTokenContract.address, NULL_ADDRESS, debtOrder.getCreditor(), new bignumber_js_1.BigNumber(debtOrder.getIssuanceCommitment().getHash())));
                    }));
                    it("should emit transfer log from creditor to debtor (if principal - debtor fee > 0)", () => __awaiter(this, void 0, void 0, function* () {
                        if (debtOrder
                            .getPrincipalAmount()
                            .minus(debtOrder.getDebtorFee())
                            .gt(0)) {
                            yield expect(logs.shift()).to.deep.equal(debt_token_1.LogTransfer(debtOrder.getPrincipalTokenAddress(), debtOrder.getCreditor(), debtOrder.getDebtor(), debtOrder.getPrincipalAmount().minus(debtOrder.getDebtorFee())));
                        }
                    }));
                    it("should emit transfer log from creditor to underwriter (if present)", () => __awaiter(this, void 0, void 0, function* () {
                        if (debtOrder.getIssuanceCommitment().getUnderwriter() !== NULL_ADDRESS) {
                            yield expect(logs.shift()).to.deep.equal(debt_token_1.LogTransfer(debtOrder.getPrincipalTokenAddress(), debtOrder.getCreditor(), debtOrder.getIssuanceCommitment().getUnderwriter(), debtOrder.getUnderwriterFee()));
                        }
                    }));
                    it("should emit transfer log from kernel to relayer (if present)", () => __awaiter(this, void 0, void 0, function* () {
                        if (debtOrder.getRelayer() !== NULL_ADDRESS) {
                            yield expect(logs.shift()).to.deep.equal(debt_token_1.LogTransfer(debtOrder.getPrincipalTokenAddress(), debtOrder.getCreditor(), debtOrder.getRelayer(), debtOrder.getRelayerFee()));
                        }
                    }));
                    it("should emit order filled log", () => {
                        expect(logs.shift()).to.deep.equal(debt_kernel_1.LogDebtOrderFilled(kernel.address, debtOrder.getIssuanceCommitment().getHash(), debtOrder.getPrincipalAmount(), debtOrder.getPrincipalTokenAddress(), debtOrder.getIssuanceCommitment().getUnderwriter(), debtOrder.getUnderwriterFee(), debtOrder.getRelayer(), debtOrder.getRelayerFee()));
                    });
                });
            };
        };
        before(reset);
        describe("User fills valid, consensual debt order", () => {
            describe("...and debt kernel is paused by owner via multi-sig execution", () => __awaiter(this, void 0, void 0, function* () {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder();
                    // "Pause" operations can be executed without waiting for the timelock
                    // to lapse -- a stipulation that exists for emergencies.
                    yield multisig_1.multiSigExecutePauseImmediately(web3, multiSig, kernel, "pause", ACCOUNTS);
                }));
                after(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, kernel, "unpause", ACCOUNTS);
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(kernel.fillDebtOrder.sendTransactionAsync(debtOrder.getCreditor(), debtOrder.getOrderAddresses(), debtOrder.getOrderValues(), debtOrder.getOrderBytes32(), debtOrder.getSignaturesV(), debtOrder.getSignaturesR(), debtOrder.getSignaturesS())).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }));
            describe("...with underwriter and relayer", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder();
            })));
            describe("...with neither underwriter nor relayer", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    creditorFee: new bignumber_js_1.BigNumber(0),
                    debtorFee: new bignumber_js_1.BigNumber(0),
                    relayer: NULL_ADDRESS,
                    relayerFee: new bignumber_js_1.BigNumber(0),
                    underwriter: NULL_ADDRESS,
                    underwriterFee: new bignumber_js_1.BigNumber(0),
                    underwriterRiskRating: new bignumber_js_1.BigNumber(0),
                });
            })));
            describe("...with relayer but no underwriter", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    creditorFee: defaultOrderParams.relayerFee.minus(defaultOrderParams.debtorFee),
                    underwriter: NULL_ADDRESS,
                    underwriterFee: new bignumber_js_1.BigNumber(0),
                    underwriterRiskRating: new bignumber_js_1.BigNumber(0),
                });
            })));
            describe("...with underwriter but no relayer", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    relayer: NULL_ADDRESS,
                    relayerFee: new bignumber_js_1.BigNumber(0),
                    underwriterFee: defaultOrderParams.creditorFee.plus(defaultOrderParams.debtorFee),
                });
            })));
            describe("...with no principal and no creditor / debtor fees", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    creditorFee: new bignumber_js_1.BigNumber(0),
                    debtorFee: new bignumber_js_1.BigNumber(0),
                    principalAmount: new bignumber_js_1.BigNumber(0),
                    relayer: NULL_ADDRESS,
                    relayerFee: new bignumber_js_1.BigNumber(0),
                    underwriter: NULL_ADDRESS,
                    underwriterFee: new bignumber_js_1.BigNumber(0),
                    underwriterRiskRating: new bignumber_js_1.BigNumber(0),
                });
            })));
            describe("...with no principal and nonzero creditor fee", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    creditorFee: Units.ether(0.002),
                    debtorFee: new bignumber_js_1.BigNumber(0),
                    principalAmount: new bignumber_js_1.BigNumber(0),
                    relayer: NULL_ADDRESS,
                    relayerFee: new bignumber_js_1.BigNumber(0),
                    underwriter: UNDERWRITER,
                    underwriterFee: Units.ether(0.002),
                });
            })));
            describe("...when creditor and debtor are same address", testOrderFill(CONTRACT_OWNER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    creditor: CREDITOR_1,
                    creditorFee: new bignumber_js_1.BigNumber(0),
                    debtor: CREDITOR_1,
                    debtorFee: new bignumber_js_1.BigNumber(0),
                    orderSignatories: {
                        creditor: CREDITOR_1,
                        debtor: CREDITOR_1,
                    },
                    principalAmount: new bignumber_js_1.BigNumber(0),
                    relayer: NULL_ADDRESS,
                    relayerFee: new bignumber_js_1.BigNumber(0),
                    underwriter: NULL_ADDRESS,
                    underwriterFee: new bignumber_js_1.BigNumber(0),
                    underwriterRiskRating: new bignumber_js_1.BigNumber(0),
                });
            })));
            describe("...when submitted by creditor *without* creditor signature attached", testOrderFill(CREDITOR_1, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    creditor: CREDITOR_1,
                    orderSignatories: {
                        debtor: DEBTOR_1,
                        underwriter: UNDERWRITER,
                    },
                });
            })));
            describe("...when submitted by debtor *without* debtor signature attached", testOrderFill(DEBTOR_1, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    debtor: DEBTOR_1,
                    orderSignatories: {
                        creditor: CREDITOR_1,
                        underwriter: UNDERWRITER,
                    },
                });
            })));
            describe("...when submitted by underwriter *without* underwriter signature attached", testOrderFill(UNDERWRITER, () => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder({
                    orderSignatories: {
                        creditor: CREDITOR_1,
                        debtor: DEBTOR_1,
                    },
                    underwriter: UNDERWRITER,
                });
            })));
        });
        describe("User fills invalid debt order", () => {
            describe("...where there is no underwriter, but underwriter fee is nonzero", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        creditorFee: defaultOrderParams.relayerFee
                            .plus(Units.ether(0.001))
                            .dividedBy(2),
                        debtorFee: defaultOrderParams.relayerFee
                            .plus(Units.ether(0.001))
                            .dividedBy(2),
                        underwriter: NULL_ADDRESS,
                        underwriterFee: Units.ether(0.001),
                        underwriterRiskRating: new bignumber_js_1.BigNumber(0),
                    });
                    yield setupBalancesAndAllowances();
                }));
                it("should return UNSPECIFIED_FEE_RECIPIENT error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 6 /* ORDER_INVALID_UNSPECIFIED_FEE_RECIPIENT */);
                }));
            });
            describe("...where there is no relayer, but relayer fee is nonzero", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        relayer: NULL_ADDRESS,
                        relayerFee: Units.ether(0.003),
                        underwriterFee: new bignumber_js_1.BigNumber(0),
                    });
                    yield setupBalancesAndAllowances();
                }));
                it("should return UNSPECIFIED_FEE_RECIPIENT error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 6 /* ORDER_INVALID_UNSPECIFIED_FEE_RECIPIENT */);
                }));
            });
            describe("...when creditor + debtor fees < underwriter + relayer fees", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        creditorFee: Units.ether(0.001),
                        debtorFee: Units.ether(0.001),
                        relayerFee: Units.ether(0.0025),
                        underwriterFee: Units.ether(0.0025),
                    });
                    yield setupBalancesAndAllowances();
                }));
                it("should return INSUFFICIENT_OR_EXCESSIVE_FEES error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 4 /* ORDER_INVALID_INSUFFICIENT_OR_EXCESSIVE_FEES */);
                }));
            });
            describe("...when creditor + debtor fees > underwriter + relayer fees", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        creditorFee: Units.ether(0.006),
                        debtorFee: Units.ether(0.001),
                        relayerFee: Units.ether(0.0025),
                        underwriterFee: Units.ether(0.0025),
                    });
                    yield setupBalancesAndAllowances();
                }));
                it("should return INSUFFICIENT_OR_EXCESSIVE_FEES error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 4 /* ORDER_INVALID_INSUFFICIENT_OR_EXCESSIVE_FEES */);
                }));
            });
            describe("...when creditorFee + principal > 0, proxy does not have sufficient allowance", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder();
                    yield setupBalancesAndAllowances();
                    const token = yield dummy_token_1.DummyTokenContract.at(debtOrder.getPrincipalTokenAddress(), web3, TX_DEFAULTS);
                    yield token.approve.sendTransactionAsync(tokenTransferProxy.address, debtOrder.getPrincipalAmount().plus(debtOrder.getCreditorFee().minus(1)), { from: debtOrder.getCreditor() });
                }));
                it("should return CREDITOR_BALANCE_OR_ALLOWANCE_INSUFFICIENT error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 8 /* CREDITOR_BALANCE_OR_ALLOWANCE_INSUFFICIENT */);
                }));
            });
            describe("...when creditorFee + principal > 0, but creditor does not have sufficient balance", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder();
                    const token = yield dummy_token_1.DummyTokenContract.at(debtOrder.getPrincipalTokenAddress(), web3, TX_DEFAULTS);
                    yield token.setBalance.sendTransactionAsync(debtOrder.getCreditor(), debtOrder.getPrincipalAmount().plus(debtOrder.getCreditorFee().minus(1)), { from: CONTRACT_OWNER });
                }));
                it("should return CREDITOR_BALANCE_OR_ALLOWANCE_INSUFFICIENT error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 8 /* CREDITOR_BALANCE_OR_ALLOWANCE_INSUFFICIENT */);
                }));
            });
            describe("...when debtorFee > principal", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        creditorFee: Units.ether(0),
                        debtorFee: Units.ether(1.1),
                        principalAmount: Units.ether(1),
                        relayerFee: Units.ether(0.55),
                        underwriterFee: Units.ether(0.55),
                    });
                    yield setupBalancesAndAllowances();
                }));
                it("should return INSUFFICIENT_PRINCIPAL error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 5 /* ORDER_INVALID_INSUFFICIENT_PRINCIPAL */);
                }));
            });
            describe("...when order has expired", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        expirationTimestampInSec: new bignumber_js_1.BigNumber(moment()
                            .subtract(1, "days")
                            .unix()),
                    });
                    yield setupBalancesAndAllowances();
                }));
                it("should return EXPIRED error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 1 /* ORDER_INVALID_EXPIRED */);
                }));
            });
            describe("...when debt order has already been filled", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder();
                    yield setupBalancesAndAllowances();
                    yield kernel.fillDebtOrder.sendTransactionAsync(debtOrder.getCreditor(), debtOrder.getOrderAddresses(), debtOrder.getOrderValues(), debtOrder.getOrderBytes32(), debtOrder.getSignaturesV(), debtOrder.getSignaturesR(), debtOrder.getSignaturesS());
                }));
                it("should return DEBT_ISSUED error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 0 /* DEBT_ISSUED */);
                }));
            });
            describe("...when issuance has been cancelled", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder();
                    yield setupBalancesAndAllowances();
                    yield kernel.cancelIssuance.sendTransactionAsync(debtOrder.getIssuanceCommitment().getVersion(), debtOrder.getIssuanceCommitment().getDebtor(), debtOrder.getIssuanceCommitment().getTermsContract(), debtOrder.getIssuanceCommitment().getTermsContractParameters(), debtOrder.getIssuanceCommitment().getUnderwriter(), debtOrder.getIssuanceCommitment().getUnderwriterRiskRating(), debtOrder.getIssuanceCommitment().getSalt(), { from: debtOrder.getIssuanceCommitment().getUnderwriter() });
                }));
                it("should return ISSUANCE_CANCELLED error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 2 /* ISSUANCE_CANCELLED */);
                }));
            });
            describe("...when debt order has been cancelled", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder();
                    yield setupBalancesAndAllowances();
                    yield kernel.cancelDebtOrder.sendTransactionAsync(debtOrder.getOrderAddresses(), debtOrder.getOrderValues(), debtOrder.getOrderBytes32(), { from: debtOrder.getDebtor() });
                }));
                it("should return ORDER_INVALID_CANCELLED error", () => __awaiter(this, void 0, void 0, function* () {
                    yield testShouldReturnError(debtOrder, 3 /* ORDER_INVALID_CANCELLED */);
                }));
            });
            describe("...when terms contract returns false for `registerTermStart`", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    debtOrder = yield orderFactory.generateDebtOrder({
                        termsContract: incompatibleTermsContractAddress,
                    });
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(kernel.fillDebtOrder.sendTransactionAsync(debtOrder.getCreditor(), debtOrder.getOrderAddresses(), debtOrder.getOrderValues(), debtOrder.getOrderBytes32(), debtOrder.getSignaturesV(), debtOrder.getSignaturesR(), debtOrder.getSignaturesS(), { from: debtOrder.getCreditor() })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
        });
        describe("User fills valid, nonconsensual debt order", () => {
            let mismatchedOrder;
            const getMismatchedSignatures = (debtorsDebtOrder, creditorsDebtOrder, underwritersDebtOrder) => __awaiter(this, void 0, void 0, function* () {
                const signaturesR = [
                    underwritersDebtOrder.getUnderwriterSignature().r,
                    debtorsDebtOrder.getDebtorSignature().r,
                    creditorsDebtOrder.getCreditorSignature().r,
                ];
                const signaturesS = [
                    underwritersDebtOrder.getUnderwriterSignature().s,
                    debtorsDebtOrder.getDebtorSignature().s,
                    creditorsDebtOrder.getCreditorSignature().s,
                ];
                const signaturesV = [
                    underwritersDebtOrder.getUnderwriterSignature().v,
                    debtorsDebtOrder.getDebtorSignature().v,
                    creditorsDebtOrder.getCreditorSignature().v,
                ];
                return [signaturesR, signaturesS, signaturesV];
            });
            before(() => __awaiter(this, void 0, void 0, function* () {
                debtOrder = yield orderFactory.generateDebtOrder();
                yield setupBalancesAndAllowances();
            }));
            describe("...with mismatched issuance parameters", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                        termsContract: MALICIOUS_TERMS_CONTRACTS,
                    });
                }));
                describe("creditor's signature commits to issuance parameters =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to issuance parameters =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("underwriter's signature commits to issuance parameters =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, debtOrder, mismatchedOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched underwriter fee", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                        underwriterFee: Units.ether(0.001),
                    });
                }));
                describe("creditor's signature commits to underwriter fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to underwriter fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("underwriter's signature commits to underwriter fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, debtOrder, mismatchedOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched underwriter", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                        underwriter: ATTACKER,
                    });
                }));
                describe("creditor's signature commits to underwriter =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to underwriter =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("underwriter's signature commits to underwriter =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, debtOrder, mismatchedOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched principal amount", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        principalAmount: Units.ether(1.1),
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to principal amount =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to principal amount =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("underwriter's signature commits to principal amount =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, debtOrder, mismatchedOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched principal token", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        principalTokenAddress: NULL_ADDRESS,
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to principal token =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to principal token =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("underwriter's signature commits to principal token =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, debtOrder, mismatchedOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched debtor fee", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        debtorFee: Units.ether(0.0004),
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to debtor fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to debtor fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched creditor fee", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        creditorFee: Units.ether(0.0004),
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to creditor fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to creditor fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched relayer", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        relayer: NULL_ADDRESS,
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to relayer =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to relayer =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched relayer fee", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        relayerFee: new bignumber_js_1.BigNumber(0),
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to relayer fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to relayer fee =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
            describe("...with mismatched expiration", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    mismatchedOrder = yield orderFactory.generateDebtOrder({
                        expirationTimestampInSec: new bignumber_js_1.BigNumber(moment()
                            .add(2, "days")
                            .unix()),
                        salt: debtOrder.getIssuanceCommitment().getSalt(),
                    });
                }));
                describe("creditor's signature commits to expiration =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, mismatchedOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("debtor's signature commits to expiration =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(mismatchedOrder, debtOrder, debtOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
                describe("underwriter's signature commits to expiration =/= order's", () => __awaiter(this, void 0, void 0, function* () {
                    it("should return ORDER_INVALID_NON_CONSENSUAL error", () => __awaiter(this, void 0, void 0, function* () {
                        const [signaturesR, signaturesS, signaturesV,] = yield getMismatchedSignatures(debtOrder, debtOrder, mismatchedOrder);
                        yield testShouldReturnError(debtOrder, 7 /* ORDER_INVALID_NON_CONSENSUAL */, signaturesR, signaturesS, signaturesV);
                    }));
                }));
            });
        });
    });
}));
//# sourceMappingURL=debt_kernel.js.map