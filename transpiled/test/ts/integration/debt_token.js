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
const bignumber_js_1 = require("bignumber.js");
const chai = require("chai");
// Test Utils
const Units = require("../test_utils/units");
const multisig_1 = require("../test_utils/multisig");
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
const constants_1 = require("../test_utils/constants");
// Wrappers
const debt_registry_1 = require("../../../types/generated/debt_registry");
const debt_token_1 = require("../../../types/generated/debt_token");
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
const debt_kernel_1 = require("../../../types/generated/debt_kernel");
const entry_1 = require("../../../types/registry/entry");
// Logs
const debt_registry_2 = require("../logs/debt_registry");
const debt_token_2 = require("../logs/debt_token");
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
const debtRegistryContract = artifacts.require("DebtRegistry");
const debtTokenContract = artifacts.require("DebtToken");
contract("Debt Token (Integration Tests)", (ACCOUNTS) => {
    const NFT_NAME = "DebtToken";
    const NFT_SYMBOL = "DDT";
    const CONTRACT_OWNER = ACCOUNTS[0];
    const NON_CONTRACT_OWNER = ACCOUNTS[1];
    const AUTHORIZED_MINT_AGENT = ACCOUNTS[2];
    const UNAUTHORIZED_MINT_AGENT = ACCOUNTS[3];
    const TOKEN_OWNER_1 = ACCOUNTS[4];
    const TOKEN_OWNER_2 = ACCOUNTS[5];
    const TOKEN_OWNER_3 = ACCOUNTS[6];
    const UNDERWRITER = ACCOUNTS[7];
    const BROKER = ACCOUNTS[8];
    const DEBTOR = ACCOUNTS[9];
    const MOCK_REPAYMENT_ROUTER_ADDRESS = ACCOUNTS[10];
    const MOCK_TERMS_CONTRACT_ADDRESS = ACCOUNTS[11];
    const INDEX_0 = new bignumber_js_1.BigNumber(0);
    const INDEX_1 = new bignumber_js_1.BigNumber(1);
    const INDEX_2 = new bignumber_js_1.BigNumber(2);
    const NONEXISTENT_TOKEN_ID = new bignumber_js_1.BigNumber(13);
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    const [DEBT_ENTRY_1, DEBT_ENTRY_2, DEBT_ENTRY_3, DEBT_ENTRY_4] = [
        TOKEN_OWNER_1,
        TOKEN_OWNER_1,
        TOKEN_OWNER_2,
        TOKEN_OWNER_3,
    ].map(generateDebtEntry);
    function generateDebtEntry(creditor) {
        return new entry_1.DebtRegistryEntry({
            beneficiary: creditor,
            debtor: DEBTOR,
            termsContract: MOCK_TERMS_CONTRACT_ADDRESS,
            termsContractParameters: generateRandom32ByteString(),
            underwriter: UNDERWRITER,
            underwriterRiskRating: Units.underwriterRiskRatingFixedPoint(3.4),
            version: MOCK_REPAYMENT_ROUTER_ADDRESS,
        });
    }
    function generateRandom32ByteString() {
        return web3.sha3(Math.random().toString(36));
    }
    function mintDebtToken(entry, sender) {
        return __awaiter(this, void 0, void 0, function* () {
            return debtToken.create.sendTransactionAsync(entry.getVersion(), entry.getBeneficiary(), entry.getDebtor(), entry.getUnderwriter(), entry.getUnderwriterRiskRating(), entry.getTermsContract(), entry.getTermsContractParameters(), entry.getSalt(), { from: sender });
        });
    }
    function authorizeMintAgent(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            return multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, debtToken, "addAuthorizedMintAgent", ACCOUNTS, [agent]);
        });
    }
    function revokeMintAuthorization(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            return multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, debtToken, "revokeMintAgentAuthorization", ACCOUNTS, [agent]);
        });
    }
    function pauseDebtTokenContract() {
        return __awaiter(this, void 0, void 0, function* () {
            return multisig_1.multiSigExecutePauseImmediately(web3, multiSig, debtToken, "pause", ACCOUNTS);
        });
    }
    function unpauseDebtTokenContract() {
        return __awaiter(this, void 0, void 0, function* () {
            return multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, debtToken, "unpause", ACCOUNTS);
        });
    }
    let debtRegistry;
    let debtToken;
    let debtKernel;
    let multiSig;
    before(() => __awaiter(this, void 0, void 0, function* () {
        multiSig = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
        debtRegistry = yield debt_registry_1.DebtRegistryContract.deployed(web3, TX_DEFAULTS);
        debtToken = yield debt_token_1.DebtTokenContract.deployed(web3, TX_DEFAULTS);
        debtKernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        ABIDecoder.addABI(debtRegistryContract.abi);
        ABIDecoder.addABI(debtTokenContract.abi);
    }));
    after(() => {
        ABIDecoder.removeABI(debtRegistryContract.abi);
        ABIDecoder.removeABI(debtTokenContract.abi);
    });
    describe("Permissions", () => {
        it("should be deployed with the debt kernel as authorized to mint", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.getAuthorizedMintAgents.callAsync()).to.eventually.deep.equal([
                debtKernel.address,
            ]);
        }));
        describe("non-owner adds mint authorization", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.addAuthorizedMintAgent.sendTransactionAsync(UNAUTHORIZED_MINT_AGENT, {
                    from: NON_CONTRACT_OWNER,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("owner adds mint authorization", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield authorizeMintAgent(AUTHORIZED_MINT_AGENT);
            }));
            it("should return agent as authorized", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.getAuthorizedMintAgents.callAsync()).to.eventually.deep.equal([debtKernel.address, AUTHORIZED_MINT_AGENT]);
            }));
        });
        describe("owner revokes mint authorization", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield revokeMintAuthorization(AUTHORIZED_MINT_AGENT);
            }));
            it("should not return agent as authorized", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.getAuthorizedMintAgents.callAsync()).to.eventually.deep.equal([debtKernel.address]);
            }));
        });
    });
    describe("Minting", () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield authorizeMintAgent(AUTHORIZED_MINT_AGENT);
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield revokeMintAuthorization(AUTHORIZED_MINT_AGENT);
        }));
        describe("unauthorized agent tries to mint debt token", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mintDebtToken(DEBT_ENTRY_1, UNAUTHORIZED_MINT_AGENT)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("authorized agent mints debt token", () => {
            describe("...when debt token is paused", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield pauseDebtTokenContract();
                }));
                after(() => __awaiter(this, void 0, void 0, function* () {
                    yield unpauseDebtTokenContract();
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(mintDebtToken(DEBT_ENTRY_1, AUTHORIZED_MINT_AGENT)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("...when debt token not paused", () => {
                let insertRegistryLog;
                let transferLog;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield mintDebtToken(DEBT_ENTRY_1, AUTHORIZED_MINT_AGENT);
                    const res = yield web3.eth.getTransactionReceipt(txHash);
                    [insertRegistryLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
                }));
                it("should emit registry insert log event", () => {
                    const logExpected = debt_registry_2.LogInsertEntry(debtRegistry.address, DEBT_ENTRY_1);
                    expect(insertRegistryLog).to.deep.equal(logExpected);
                });
                it("should emit transfer log event", () => {
                    const logExpected = debt_token_2.LogTransfer(debtToken.address, constants_1.NULL_ADDRESS, DEBT_ENTRY_1.getBeneficiary(), DEBT_ENTRY_1.getTokenId());
                    expect(transferLog).to.deep.equal(logExpected);
                });
                it("should increase total supply by 1", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.totalSupply.callAsync()).to.eventually.bignumber.equal(1);
                }));
                it("should assign new token to creditor", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.ownerOf.callAsync(DEBT_ENTRY_1.getTokenId())).to.eventually.bignumber.equal(DEBT_ENTRY_1.getBeneficiary());
                }));
                it("should update owner's token list", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(DEBT_ENTRY_1.getBeneficiary(), INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(DEBT_ENTRY_1.getBeneficiary(), INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
        });
        describe("authorized agent mints second debt token to same creditor", () => {
            let res;
            before(() => __awaiter(this, void 0, void 0, function* () {
                const txHash = yield mintDebtToken(DEBT_ENTRY_2, AUTHORIZED_MINT_AGENT);
                res = yield web3.eth.getTransactionReceipt(txHash);
            }));
            it("should emit transfer log event", () => {
                const [insertRegistryLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
                const logExpected = debt_token_2.LogTransfer(debtToken.address, constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getBeneficiary(), DEBT_ENTRY_2.getTokenId());
                expect(transferLog).to.deep.equal(logExpected);
            });
            it("should increase total supply by 1", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.totalSupply.callAsync()).to.eventually.bignumber.equal(2);
            }));
            it("should assign new token to creditor", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.ownerOf.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.bignumber.equal(DEBT_ENTRY_2.getBeneficiary());
            }));
            it("should update owner's token list", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.bignumber.equal(DEBT_ENTRY_2.getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("authorized agent mints debt token that already exists", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mintDebtToken(DEBT_ENTRY_1, AUTHORIZED_MINT_AGENT)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
    });
    describe("General NFT Metadata", () => {
        it("should expose name variable", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.name.callAsync()).to.eventually.equal(NFT_NAME);
        }));
        it("should expose symbol variable", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.symbol.callAsync()).to.eventually.equal(NFT_SYMBOL);
        }));
    });
    describe("authorized mint agent mints an additional two debt tokens ", () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield authorizeMintAgent(AUTHORIZED_MINT_AGENT);
            yield mintDebtToken(DEBT_ENTRY_3, AUTHORIZED_MINT_AGENT);
            yield mintDebtToken(DEBT_ENTRY_4, AUTHORIZED_MINT_AGENT);
        }));
        after(() => __awaiter(this, void 0, void 0, function* () {
            yield revokeMintAuthorization(AUTHORIZED_MINT_AGENT);
        }));
        describe("#totalSupply()", () => {
            it("should return 4 for total supply", () => __awaiter(this, void 0, void 0, function* () {
                const totalSupply = yield debtToken.totalSupply.callAsync();
                expect(totalSupply).to.bignumber.equal(4);
            }));
        });
        describe("#balanceOf()", () => {
            it("should return the correct balances for each token holder", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(2);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(1);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
            }));
        });
        describe("#tokenOfOwnerByIndex()", () => __awaiter(this, void 0, void 0, function* () {
            it("should return current token at index 0 for each user", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_3.getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_4.getTokenId());
            }));
            it("should throw if called at index > balanceOf.callAsync(owner)", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        }));
        describe("#transfer()", () => __awaiter(this, void 0, void 0, function* () {
            describe("user transfers token he doesn't own", () => __awaiter(this, void 0, void 0, function* () {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_1, DEBT_ENTRY_3.getTokenId(), {
                        from: TOKEN_OWNER_1,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }));
            describe("user transfers token that doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_1, NONEXISTENT_TOKEN_ID, {
                        from: TOKEN_OWNER_1,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }));
            describe("user transfers token he owns", () => __awaiter(this, void 0, void 0, function* () {
                describe("...when debt token is paused", () => {
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        yield pauseDebtTokenContract();
                    }));
                    after(() => __awaiter(this, void 0, void 0, function* () {
                        yield unpauseDebtTokenContract();
                    }));
                    it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_1.getTokenId(), {
                            from: TOKEN_OWNER_1,
                        })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
                describe("...when debt token not paused", () => {
                    let modifyBeneficiaryLog;
                    let transferLog;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_1.getTokenId(), { from: TOKEN_OWNER_1 });
                        const res = yield web3.eth.getTransactionReceipt(txHash);
                        [modifyBeneficiaryLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
                    }));
                    it("should emit registry modification log", () => __awaiter(this, void 0, void 0, function* () {
                        const logExpected = debt_registry_2.LogModifyEntryBeneficiary(debtRegistry.address, DEBT_ENTRY_1.getIssuanceHash(), TOKEN_OWNER_1, TOKEN_OWNER_2);
                        expect(modifyBeneficiaryLog).to.deep.equal(logExpected);
                    }));
                    it("should emit transfer log", () => __awaiter(this, void 0, void 0, function* () {
                        const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_2, DEBT_ENTRY_1.getTokenId());
                        expect(transferLog).to.deep.equal(logExpected);
                    }));
                    it("should belong to new owner", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.ownerOf.callAsync(DEBT_ENTRY_1.getTokenId())).to.eventually.equal(TOKEN_OWNER_2);
                    }));
                    it("should update owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
                        yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                        yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
                    }));
                    it("should update owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                        // TOKEN_OWNER_1
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_2.getTokenId());
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                        // TOKEN_OWNER_2
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_3.getTokenId());
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                        // TOKEN_OWNER_3
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_4.getTokenId());
                        yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
            }));
            describe("user transfers token he no longer owns", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_1.getTokenId(), {
                        from: TOKEN_OWNER_1,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user transfers token he owns to 0", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transfer.sendTransactionAsync(constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getTokenId(), {
                        from: TOKEN_OWNER_1,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user transfers token he owns to himself", () => {
                let transferLog;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_1.getTokenId(), { from: TOKEN_OWNER_2 });
                    const res = yield web3.eth.getTransactionReceipt(txHash);
                    [transferLog] = ABIDecoder.decodeLogs(res.logs);
                }));
                it("should emit transfer log", () => __awaiter(this, void 0, void 0, function* () {
                    const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_2, TOKEN_OWNER_2, DEBT_ENTRY_1.getTokenId());
                    expect(transferLog).to.deep.equal(logExpected);
                }));
                it("should belong to same owner", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.ownerOf.callAsync(DEBT_ENTRY_1.getTokenId())).to.eventually.equal(TOKEN_OWNER_2);
                }));
                it("should maintain owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
                }));
                it("should not modify owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                    // TOKEN_OWNER_1
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_2.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    // TOKEN_OWNER_2
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_3.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    // TOKEN_OWNER_3
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_4.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user transfers token with outstanding approval", () => {
                let modifyBeneficiaryLog;
                let approvalLog;
                let transferLog;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_1, DEBT_ENTRY_4.getTokenId(), {
                        from: TOKEN_OWNER_3,
                    });
                    const txHash = yield debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_1, DEBT_ENTRY_4.getTokenId(), { from: TOKEN_OWNER_3 });
                    const res = yield web3.eth.getTransactionReceipt(txHash);
                    [modifyBeneficiaryLog, approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
                }));
                it("should emit registry modification log", () => {
                    const logExpected = debt_registry_2.LogModifyEntryBeneficiary(debtRegistry.address, DEBT_ENTRY_4.getIssuanceHash(), TOKEN_OWNER_3, TOKEN_OWNER_1);
                    expect(modifyBeneficiaryLog).to.deep.equal(logExpected);
                });
                it("should emit approval clear log", () => {
                    const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_3, constants_1.NULL_ADDRESS, DEBT_ENTRY_4.getTokenId());
                    expect(approvalLog).to.deep.equal(logExpected);
                });
                it("should emit transfer log", () => {
                    const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_3, TOKEN_OWNER_1, DEBT_ENTRY_4.getTokenId());
                    expect(transferLog).to.deep.equal(logExpected);
                });
                it("should belong to new owner", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.ownerOf.callAsync(DEBT_ENTRY_4.getTokenId())).to.eventually.equal(TOKEN_OWNER_1);
                }));
                it("should update owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(2);
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(0);
                }));
                it("should update owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                    // TOKEN_OWNER_1
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_2.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.bignumber.equal(DEBT_ENTRY_4.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    // TOKEN_OWNER_2
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_3.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    // TOKEN_OWNER_3
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
        }));
        describe("#approve()", () => {
            describe("user approves transfer for token he doesn't own", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    expect(debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_2.getTokenId(), {
                        from: TOKEN_OWNER_2,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user approves transfer for nonexistent token", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    expect(debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, NONEXISTENT_TOKEN_ID, {
                        from: TOKEN_OWNER_2,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user approves himself for transferring token he owns", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    expect(debtToken.approve.sendTransactionAsync(TOKEN_OWNER_1, DEBT_ENTRY_2.getTokenId(), {
                        from: TOKEN_OWNER_1,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user owns token", () => {
                describe("user clears unset approval", () => {
                    let res;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield debtToken.approve.sendTransactionAsync(constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_1 });
                        res = yield web3.eth.getTransactionReceipt(txHash);
                    }));
                    it("should NOT emit approval event", () => __awaiter(this, void 0, void 0, function* () {
                        expect(res.logs.length).to.equal(0);
                    }));
                    it("should maintain cleared approval", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.getApproved.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.equal(constants_1.NULL_ADDRESS);
                    }));
                });
                describe("user sets new approval", () => {
                    let res;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_1 });
                        res = yield web3.eth.getTransactionReceipt(txHash);
                    }));
                    it("should return newly approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.getApproved.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.equal(TOKEN_OWNER_2);
                    }));
                    it("should emit approval log", () => {
                        const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                        const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_2, DEBT_ENTRY_2.getTokenId());
                        expect(approvalLog).to.deep.equal(logExpected);
                    });
                });
                describe("user changes token approval", () => {
                    let res;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_1 });
                        res = yield web3.eth.getTransactionReceipt(txHash);
                    }));
                    it("should return newly approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.getApproved.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.equal(TOKEN_OWNER_3);
                    }));
                    it("should emit approval log", () => {
                        const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                        const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId());
                        expect(approvalLog).to.deep.equal(logExpected);
                    });
                });
                describe("user reaffirms approval", () => {
                    let res;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_1 });
                        res = yield web3.eth.getTransactionReceipt(txHash);
                    }));
                    it("should return same approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.getApproved.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.equal(TOKEN_OWNER_3);
                    }));
                    it("should emit approval log", () => {
                        const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                        const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId());
                        expect(approvalLog).to.deep.equal(logExpected);
                    });
                });
                describe("user clears set approval", () => {
                    let res;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield debtToken.approve.sendTransactionAsync(constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_1 });
                        res = yield web3.eth.getTransactionReceipt(txHash);
                    }));
                    it("should return null address user as approved", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.getApproved.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.equal(constants_1.NULL_ADDRESS);
                    }));
                    it("should emit approval log", () => {
                        const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                        const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getTokenId());
                        expect(approvalLog).to.deep.equal(logExpected);
                    });
                });
            });
        });
        describe("#transferFrom()", () => {
            describe("user transfers token from owner w/o approval...", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_3 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user transfers non-existent token", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_3, NONEXISTENT_TOKEN_ID, { from: TOKEN_OWNER_3 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("user transfers token from owner w/ approval...", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_1 });
                }));
                describe("...to null address", () => {
                    it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_2 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
                describe("...from other owner to himself", () => {
                    describe("...when debt token is paused", () => {
                        before(() => __awaiter(this, void 0, void 0, function* () {
                            yield pauseDebtTokenContract();
                        }));
                        after(() => __awaiter(this, void 0, void 0, function* () {
                            yield unpauseDebtTokenContract();
                        }));
                        it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                            yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_2 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                        }));
                    });
                    describe("...when debt token not paused", () => {
                        let res;
                        let approvalLog;
                        let transferLog;
                        let modifyBeneficiaryLog;
                        before(() => __awaiter(this, void 0, void 0, function* () {
                            const txHash = yield debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId(), { from: TOKEN_OWNER_2 });
                            res = yield web3.eth.getTransactionReceipt(txHash);
                            [
                                modifyBeneficiaryLog,
                                approvalLog,
                                transferLog,
                            ] = ABIDecoder.decodeLogs(res.logs);
                        }));
                        it("should emit registry modification log", () => __awaiter(this, void 0, void 0, function* () {
                            const logExpected = debt_registry_2.LogModifyEntryBeneficiary(debtRegistry.address, DEBT_ENTRY_2.getIssuanceHash(), TOKEN_OWNER_1, TOKEN_OWNER_3);
                            expect(modifyBeneficiaryLog).to.deep.equal(logExpected);
                        }));
                        it("should emit approval clear log", () => {
                            const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, constants_1.NULL_ADDRESS, DEBT_ENTRY_2.getTokenId());
                            expect(approvalLog).to.deep.equal(logExpected);
                        });
                        it("should emit transfer log", () => {
                            const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_3, DEBT_ENTRY_2.getTokenId());
                            expect(transferLog).to.deep.equal(logExpected);
                        });
                        it("should belong to new owner", () => __awaiter(this, void 0, void 0, function* () {
                            yield expect(debtToken.ownerOf.callAsync(DEBT_ENTRY_2.getTokenId())).to.eventually.equal(TOKEN_OWNER_3);
                        }));
                        it("should update owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                            yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
                            yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                            yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
                        }));
                        it("should update owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                            // TOKEN_OWNER_1
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_4.getTokenId());
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                            // TOKEN_OWNER_2
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_3.getTokenId());
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(DEBT_ENTRY_1.getTokenId());
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                            // TOKEN_OWNER_3
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(DEBT_ENTRY_2.getTokenId());
                            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                        }));
                    });
                });
            });
        });
        describe("#setTokenURI", () => {
            const tokenId = DEBT_ENTRY_1.getTokenId();
            const tokenURI = "https://www.example.com/image.jpeg";
            describe("when called by an account that has permission", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, debtToken, "addAuthorizedTokenURIAgent", ACCOUNTS, [NON_CONTRACT_OWNER]);
                }));
                it("sets the debt token's URI", () => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.setTokenURI.sendTransactionAsync(tokenId, tokenURI, {
                        from: NON_CONTRACT_OWNER,
                    });
                    expect(yield debtToken.tokenURI.callAsync(tokenId)).to.equal(tokenURI);
                }));
            });
            describe("when called by an account that does not have permission", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, debtToken, "revokeTokenURIAuthorization", ACCOUNTS, [NON_CONTRACT_OWNER]);
                }));
                it("reverts the transaction", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.setTokenURI.sendTransactionAsync(tokenId, tokenURI, {
                        from: NON_CONTRACT_OWNER,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
        });
    });
});
//# sourceMappingURL=debt_token.js.map