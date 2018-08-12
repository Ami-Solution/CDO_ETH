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
const ABIDecoder = require("abi-decoder");
const bignumber_js_1 = require("bignumber.js");
const chai = require("chai");
const _ = require("lodash");
const Units = require("../test_utils/units");
// Contracts
const debt_token_1 = require("../../../types/generated/debt_token");
const mock_debt_registry_1 = require("../../../types/generated/mock_debt_registry");
const mock_e_r_c20_token_1 = require("../../../types/generated/mock_e_r_c20_token");
const mock_e_r_c721_receiver_1 = require("../../../types/generated/mock_e_r_c721_receiver");
const entry_1 = require("../../../types/registry/entry");
// Logs
const debt_token_2 = require("../logs/debt_token");
const permissions_lib_1 = require("../logs/permissions_lib");
const log_utils_1 = require("../logs/log_utils");
// Test utils
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
const constants_1 = require("../test_utils/constants");
const send_transactions_1 = require("../test_utils/send_transactions");
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
const debtTokenContract = artifacts.require("DebtToken");
const repaymentRouterContract = artifacts.require("RepaymentRouter");
contract("Debt Token (Unit Tests)", (ACCOUNTS) => {
    let debtToken;
    let debtTokenWeb3ContractInstance;
    let receiver;
    let mockRegistry;
    let mockToken;
    let debtEntries;
    const NFT_NAME = "DebtToken";
    const NFT_SYMBOL = "DDT";
    const CONTRACT_OWNER = ACCOUNTS[0];
    const NON_CONTRACT_OWNER = ACCOUNTS[1];
    const AUTHORIZED_MINT_AGENT = ACCOUNTS[2];
    const AUTHORIZED_URI_AGENT = ACCOUNTS[3];
    const UNAUTHORIZED_MINT_AGENT = ACCOUNTS[4];
    const UNAUTHORIZED_URI_AGENT = ACCOUNTS[5];
    const TOKEN_OWNER_1 = ACCOUNTS[6];
    const TOKEN_OWNER_2 = ACCOUNTS[7];
    const TOKEN_OWNER_3 = ACCOUNTS[8];
    const TOKEN_OWNERS = [TOKEN_OWNER_1, TOKEN_OWNER_2, TOKEN_OWNER_3];
    const UNDERWRITER_1 = ACCOUNTS[9];
    const UNDERWRITER_2 = ACCOUNTS[10];
    const UNDERWRITER_3 = ACCOUNTS[11];
    const UNDERWRITERS = [UNDERWRITER_1, UNDERWRITER_2, UNDERWRITER_3];
    const BROKER = ACCOUNTS[12];
    const DEBTOR = ACCOUNTS[13];
    const MALICIOUS_EXCHANGE_CONTRACT = ACCOUNTS[15];
    const INDEX_0 = new bignumber_js_1.BigNumber(0);
    const INDEX_1 = new bignumber_js_1.BigNumber(1);
    const INDEX_2 = new bignumber_js_1.BigNumber(2);
    const NONEXISTENT_TOKEN_ID = new bignumber_js_1.BigNumber(13);
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
    const TERMS_CONTRACT_ADDRESS = ACCOUNTS[14];
    const ARBITRARY_TERMS_CONTRACT_PARAMS = [
        web3.sha3("#1: arbitrary terms contract param string"),
        web3.sha3("#2: arbitrary terms contract param string"),
        web3.sha3("#3: arbitrary terms contract param string"),
    ];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    const resetContracts = () => __awaiter(this, void 0, void 0, function* () {
        mockRegistry = yield mock_debt_registry_1.MockDebtRegistryContract.deployed(web3, TX_DEFAULTS);
        yield mockRegistry.reset.sendTransactionAsync();
        mockToken = yield mock_e_r_c20_token_1.MockERC20TokenContract.deployed(web3, TX_DEFAULTS);
        debtTokenWeb3ContractInstance = yield debtTokenContract.new(mockRegistry.address, {
            from: CONTRACT_OWNER,
        });
        receiver = yield mock_e_r_c721_receiver_1.MockERC721ReceiverContract.deployed(web3, TX_DEFAULTS);
        yield receiver.reset.sendTransactionAsync();
        // The typings we use ingest vanilla Web3 contracts, so we convert the
        // contract instance deployed by truffle into a Web3 contract instance
        const debtTokenWeb3Contract = web3.eth
            .contract(debtTokenWeb3ContractInstance.abi)
            .at(debtTokenWeb3ContractInstance.address);
        debtToken = new debt_token_1.DebtTokenContract(debtTokenWeb3Contract, TX_DEFAULTS);
        const repaymentRouterContractInstance = yield repaymentRouterContract.deployed();
        debtEntries = _.map(TOKEN_OWNERS, (tokenOwner, i) => {
            return new entry_1.DebtRegistryEntry({
                beneficiary: tokenOwner,
                debtor: DEBTOR,
                termsContract: TERMS_CONTRACT_ADDRESS,
                termsContractParameters: ARBITRARY_TERMS_CONTRACT_PARAMS[i],
                underwriter: UNDERWRITERS[i],
                underwriterRiskRating: Units.underwriterRiskRatingFixedPoint(3.4),
                version: repaymentRouterContractInstance.address,
            });
        });
        // Initialize ABI Decoders for deciphering log receipts
        ABIDecoder.addABI(debtTokenContract.abi);
    });
    const initState = () => __awaiter(this, void 0, void 0, function* () {
        yield debtToken.addAuthorizedMintAgent.sendTransactionAsync(AUTHORIZED_MINT_AGENT, {
            from: CONTRACT_OWNER,
        });
        for (const entry of debtEntries) {
            yield mockRegistry.mockInsertReturnValue.sendTransactionAsync(entry.getIssuanceHash());
            yield debtToken.create.sendTransactionAsync(entry.getVersion(), entry.getBeneficiary(), entry.getDebtor(), entry.getUnderwriter(), entry.getUnderwriterRiskRating(), entry.getTermsContract(), entry.getTermsContractParameters(), entry.getSalt(), { from: AUTHORIZED_MINT_AGENT });
        }
    });
    const resetAndInitState = () => __awaiter(this, void 0, void 0, function* () {
        yield resetContracts();
        yield initState();
    });
    before(resetContracts);
    after(() => {
        // Tear down ABIDecoder before next set of tests
        ABIDecoder.removeABI(debtTokenContract.abi);
    });
    describe("Permissions", () => {
        describe("Token Creation", () => {
            it("should initialize with no authorizations", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.getAuthorizedMintAgents.callAsync()).to.eventually.deep.equal([]);
            }));
            describe("non-owner adds mint authorization", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.addAuthorizedMintAgent.sendTransactionAsync(UNAUTHORIZED_MINT_AGENT, {
                        from: NON_CONTRACT_OWNER,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("#addAuthorizedMintAgent", () => {
                let txHash;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield debtToken.addAuthorizedMintAgent.sendTransactionAsync(AUTHORIZED_MINT_AGENT, { from: CONTRACT_OWNER });
                }));
                it("should emit event broadcasting mint authorization", () => __awaiter(this, void 0, void 0, function* () {
                    const expectedLogEntry = permissions_lib_1.Authorized(debtToken.address, AUTHORIZED_MINT_AGENT, "debt-token-creation");
                    const queryResult = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.Authorized);
                    expect(queryResult).to.deep.equal(expectedLogEntry);
                }));
                it("should return agent as authorized to mint", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getAuthorizedMintAgents.callAsync()).to.eventually.deep.equal([AUTHORIZED_MINT_AGENT]);
                }));
            });
            describe("#revokeMintAgentAuthorization", () => {
                describe("non-owner revokes mint authorization", () => {
                    it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.addAuthorizedMintAgent.sendTransactionAsync(UNAUTHORIZED_MINT_AGENT, { from: NON_CONTRACT_OWNER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
                describe("owner revokes mint authorization", () => {
                    let txHash;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        txHash = yield debtToken.revokeMintAgentAuthorization.sendTransactionAsync(AUTHORIZED_MINT_AGENT, { from: CONTRACT_OWNER });
                    }));
                    it("should emit event broadcasting revoking mint authorization", () => __awaiter(this, void 0, void 0, function* () {
                        const expectedLogEntry = permissions_lib_1.AuthorizationRevoked(debtToken.address, AUTHORIZED_MINT_AGENT, "debt-token-creation");
                        const queryResult = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.AuthorizationRevoked);
                        expect(queryResult).to.deep.equal(expectedLogEntry);
                    }));
                    it("should not list agent as authorized", () => __awaiter(this, void 0, void 0, function* () {
                        const authorizedAgents = yield debtToken.getAuthorizedMintAgents.callAsync();
                        yield expect(authorizedAgents.includes(AUTHORIZED_MINT_AGENT)).to.be.false;
                    }));
                });
            });
        });
        describe("Token URI", () => {
            it("should initialize with no authorizations", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.getAuthorizedTokenURIAgents.callAsync()).to.eventually.deep.equal([]);
            }));
            describe("non-owner adds uri authorization", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.addAuthorizedTokenURIAgent.sendTransactionAsync(UNAUTHORIZED_URI_AGENT, {
                        from: NON_CONTRACT_OWNER,
                    })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("#addAuthorizedTokenURIAgent", () => {
                let txHash;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield debtToken.addAuthorizedTokenURIAgent.sendTransactionAsync(AUTHORIZED_URI_AGENT, { from: CONTRACT_OWNER });
                }));
                it("should emit event broadcasting uri authorization", () => __awaiter(this, void 0, void 0, function* () {
                    const expectedLogEntry = permissions_lib_1.Authorized(debtToken.address, AUTHORIZED_URI_AGENT, "debt-token-uri");
                    const queryResult = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.Authorized);
                    expect(queryResult).to.deep.equal(expectedLogEntry);
                }));
                it("should return agent as authorized to set token uri", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getAuthorizedTokenURIAgents.callAsync()).to.eventually.deep.equal([AUTHORIZED_URI_AGENT]);
                }));
            });
            describe("#revokeTokenURIAuthorization", () => {
                describe("non-owner revokes uri authorization", () => {
                    it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                        yield expect(debtToken.revokeTokenURIAuthorization.sendTransactionAsync(AUTHORIZED_URI_AGENT, {
                            from: NON_CONTRACT_OWNER,
                        })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    }));
                });
                describe("owner revokes uri authorization", () => {
                    let txHash;
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        txHash = yield debtToken.revokeTokenURIAuthorization.sendTransactionAsync(AUTHORIZED_URI_AGENT, { from: CONTRACT_OWNER });
                    }));
                    it("should emit event broadcasting revoking uri authorization", () => __awaiter(this, void 0, void 0, function* () {
                        const expectedLogEntry = permissions_lib_1.AuthorizationRevoked(debtToken.address, AUTHORIZED_URI_AGENT, "debt-token-uri");
                        const queryResult = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.AuthorizationRevoked);
                        expect(queryResult).to.deep.equal(expectedLogEntry);
                    }));
                    it("should not list agent as authorized", () => __awaiter(this, void 0, void 0, function* () {
                        const authorizedAgents = yield debtToken.getAuthorizedTokenURIAgents.callAsync();
                        yield expect(authorizedAgents.includes(AUTHORIZED_URI_AGENT)).to.be.false;
                    }));
                });
            });
        });
    });
    describe("Minting", () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield debtToken.addAuthorizedMintAgent.sendTransactionAsync(AUTHORIZED_MINT_AGENT, {
                from: CONTRACT_OWNER,
            });
        }));
        describe("unauthorized agent tries to mint debt token", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.create.sendTransactionAsync(debtEntries[0].getVersion(), debtEntries[0].getBeneficiary(), debtEntries[0].getDebtor(), debtEntries[0].getUnderwriter(), debtEntries[0].getUnderwriterRiskRating(), debtEntries[0].getTermsContract(), debtEntries[0].getTermsContractParameters(), debtEntries[0].getSalt(), { from: UNAUTHORIZED_MINT_AGENT })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("authorized agent mints debt token", () => {
            let transferLog;
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield mockRegistry.mockInsertReturnValue.sendTransactionAsync(debtEntries[0].getIssuanceHash());
                const txHash = yield debtToken.create.sendTransactionAsync(debtEntries[0].getVersion(), debtEntries[0].getBeneficiary(), debtEntries[0].getDebtor(), debtEntries[0].getUnderwriter(), debtEntries[0].getUnderwriterRiskRating(), debtEntries[0].getTermsContract(), debtEntries[0].getTermsContractParameters(), debtEntries[0].getSalt(), { from: AUTHORIZED_MINT_AGENT });
                const res = yield web3.eth.getTransactionReceipt(txHash);
                [transferLog] = _.compact(ABIDecoder.decodeLogs(res.logs));
            }));
            it("should call registry.insert function with issuance arguments", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mockRegistry.wasInsertCalledWith.callAsync(debtEntries[0].getVersion(), debtEntries[0].getBeneficiary(), debtEntries[0].getDebtor(), debtEntries[0].getUnderwriter(), debtEntries[0].getUnderwriterRiskRating(), debtEntries[0].getTermsContract(), debtEntries[0].getTermsContractParameters(), debtEntries[0].getSalt())).to.eventually.equal(true);
            }));
            it("should emit transfer log event", () => {
                const logExpected = debt_token_2.LogTransfer(debtToken.address, NULL_ADDRESS, debtEntries[0].getBeneficiary(), debtEntries[0].getTokenId());
                expect(transferLog).to.deep.equal(logExpected);
            });
            it("should increase total supply by 1", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.totalSupply.callAsync()).to.eventually.bignumber.equal(1);
            }));
            it("should update owner's token list", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(debtEntries[0].getBeneficiary(), INDEX_0)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(debtEntries[0].getBeneficiary(), INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("authorized agent mints second debt token to same creditor", () => {
            let res;
            let secondDebt;
            before(() => __awaiter(this, void 0, void 0, function* () {
                secondDebt = new entry_1.DebtRegistryEntry({
                    beneficiary: debtEntries[0].getBeneficiary(),
                    debtor: DEBTOR,
                    termsContract: debtEntries[1].getTermsContract(),
                    termsContractParameters: debtEntries[1].getTermsContractParameters(),
                    underwriter: debtEntries[1].getUnderwriter(),
                    underwriterRiskRating: debtEntries[1].getUnderwriterRiskRating(),
                    version: debtEntries[1].getVersion(),
                });
                yield mockRegistry.mockInsertReturnValue.sendTransactionAsync(secondDebt.getIssuanceHash());
                const txHash = yield debtToken.create.sendTransactionAsync(secondDebt.getVersion(), secondDebt.getBeneficiary(), secondDebt.getDebtor(), secondDebt.getUnderwriter(), secondDebt.getUnderwriterRiskRating(), secondDebt.getTermsContract(), secondDebt.getTermsContractParameters(), secondDebt.getSalt(), { from: AUTHORIZED_MINT_AGENT });
                res = yield web3.eth.getTransactionReceipt(txHash);
            }));
            it("should call registry.insert function with issuance arguments", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mockRegistry.wasInsertCalledWith.callAsync(secondDebt.getVersion(), secondDebt.getBeneficiary(), secondDebt.getDebtor(), secondDebt.getUnderwriter(), secondDebt.getUnderwriterRiskRating(), secondDebt.getTermsContract(), secondDebt.getTermsContractParameters(), secondDebt.getSalt())).to.eventually.equal(true);
            }));
            it("should emit transfer log event", () => {
                const [transferLog] = _.compact(ABIDecoder.decodeLogs(res.logs));
                const logExpected = debt_token_2.LogTransfer(debtToken.address, NULL_ADDRESS, secondDebt.getBeneficiary(), secondDebt.getTokenId());
                expect(transferLog).to.deep.equal(logExpected);
            });
            it("should increase total supply by 1", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.totalSupply.callAsync()).to.eventually.bignumber.equal(2);
            }));
            it("should update owner's token list", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(secondDebt.getBeneficiary(), INDEX_0)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(secondDebt.getBeneficiary(), INDEX_1)).to.eventually.bignumber.equal(secondDebt.getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(secondDebt.getBeneficiary(), INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
    });
    describe("#supportsInterface()", () => __awaiter(this, void 0, void 0, function* () {
        it("0xffffffff should return false", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.supportsInterface.callAsync("0xffffffff")).to.eventually.equal(false);
        }));
        it("should return true for ERC721", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.supportsInterface.callAsync("0x80ac58cd")).to.eventually.equal(true);
        }));
    }));
    describe("General NFT Metadata", () => {
        it("should expose name variable", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.name.callAsync()).to.eventually.equal(NFT_NAME);
        }));
        it("should expose symbol variable", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.symbol.callAsync()).to.eventually.equal(NFT_SYMBOL);
        }));
    });
    describe("#totalSupply()", () => {
        before(resetAndInitState);
        it("should return 3 for total supply", () => __awaiter(this, void 0, void 0, function* () {
            const totalSupply = yield debtToken.totalSupply.callAsync();
            expect(totalSupply).to.bignumber.equal(3);
        }));
    });
    describe("#balanceOf()", () => {
        before(resetAndInitState);
        it("should return 1 for each owner's balance", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
            yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(1);
            yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
        }));
    });
    describe("#tokenOfOwnerByIndex()", () => __awaiter(this, void 0, void 0, function* () {
        before(resetAndInitState);
        it("should return current token at index 0 for each user", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(debtEntries[1].getTokenId());
            yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(debtEntries[2].getTokenId());
        }));
        describe("owner is zero address", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(NULL_ADDRESS, INDEX_0)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("index > balanceOf(owner)", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("index = balanceOf(owner)", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
    }));
    describe("#ownerOf()", () => __awaiter(this, void 0, void 0, function* () {
        before(resetAndInitState);
        describe("user calls ownerOf on a given tokenId", () => __awaiter(this, void 0, void 0, function* () {
            it("should return the owner of the given token at that point in time", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.ownerOf.callAsync(debtEntries[1].getTokenId())).to.eventually.equal(TOKEN_OWNER_2);
            }));
            describe("...when token is burned / doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.ownerOf.callAsync(NONEXISTENT_TOKEN_ID)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            }));
        }));
    }));
    describe("#exists()", () => {
        before(resetAndInitState);
        describe("token exists", () => {
            it("should return true", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.exists.callAsync(debtEntries[0].getTokenId())).to.eventually.equal(true);
            }));
        });
        describe("token does not exist", () => {
            it("should return false", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.exists.callAsync(NONEXISTENT_TOKEN_ID)).to.eventually.equal(false);
            }));
        });
    });
    describe("#transfer()", () => __awaiter(this, void 0, void 0, function* () {
        before(resetAndInitState);
        describe("user transfers token he doesn't own", () => __awaiter(this, void 0, void 0, function* () {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_1, debtEntries[1].getTokenId(), {
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
            let transferLog;
            before(() => __awaiter(this, void 0, void 0, function* () {
                const txHash = yield debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                const res = yield web3.eth.getTransactionReceipt(txHash);
                [transferLog] = _.compact(ABIDecoder.decodeLogs(res.logs));
            }));
            it("should call modifyBeneficiary on debt registry", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mockRegistry.wasModifyBeneficiaryCalledWith.callAsync(debtEntries[0].getIssuanceHash(), TOKEN_OWNER_2)).to.eventually.be.true;
            }));
            it("should emit transfer log", () => __awaiter(this, void 0, void 0, function* () {
                const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_2, debtEntries[0].getTokenId());
                expect(transferLog).to.deep.equal(logExpected);
            }));
            it("should update owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(0);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
            }));
            it("should update owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                // TOKEN_OWNER_1
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                // TOKEN_OWNER_2
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(debtEntries[1].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                // TOKEN_OWNER_3
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(debtEntries[2].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        }));
        describe("user transfers token he no longer owns", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), {
                    from: TOKEN_OWNER_1,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("user transfers token he owns to 0", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.transfer.sendTransactionAsync(NULL_ADDRESS, debtEntries[0].getTokenId(), {
                    from: TOKEN_OWNER_1,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("user transfers token he owns to himself", () => {
            let transferLog;
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield mockRegistry.reset.sendTransactionAsync();
                yield mockRegistry.mockGetBeneficiaryReturnValueFor.sendTransactionAsync(debtEntries[0].getIssuanceHash(), TOKEN_OWNER_2);
                const txHash = yield debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_2 });
                const res = yield web3.eth.getTransactionReceipt(txHash);
                [transferLog] = ABIDecoder.decodeLogs(res.logs);
            }));
            it("should NOT call registry.modifyBeneficiary", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mockRegistry.wasModifyBeneficiaryCalledWith.callAsync(debtEntries[0].getIssuanceHash(), TOKEN_OWNER_2)).to.eventually.be.false;
            }));
            it("should emit transfer log", () => __awaiter(this, void 0, void 0, function* () {
                const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_2, TOKEN_OWNER_2, debtEntries[0].getTokenId());
                expect(transferLog).to.deep.equal(logExpected);
            }));
            it("should maintain owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(0);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
            }));
            it("should not modify owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                // TOKEN_OWNER_1
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                // TOKEN_OWNER_2
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(debtEntries[1].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                // TOKEN_OWNER_3
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(debtEntries[2].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("user transfers token with outstanding approval", () => {
            let approvalLog;
            let transferLog;
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield mockRegistry.mockGetBeneficiaryReturnValueFor.sendTransactionAsync(debtEntries[2].getIssuanceHash(), TOKEN_OWNER_3);
                yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_1, debtEntries[2].getTokenId(), {
                    from: TOKEN_OWNER_3,
                });
                const txHash = yield debtToken.transfer.sendTransactionAsync(TOKEN_OWNER_1, debtEntries[2].getTokenId(), { from: TOKEN_OWNER_3 });
                const res = yield web3.eth.getTransactionReceipt(txHash);
                [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
            }));
            it("should call modifyBeneficiary on debt registry", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mockRegistry.wasModifyBeneficiaryCalledWith.callAsync(debtEntries[2].getIssuanceHash(), TOKEN_OWNER_1)).to.eventually.be.true;
            }));
            it("should emit approval clear log", () => {
                const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_3, NULL_ADDRESS, debtEntries[2].getTokenId());
                expect(approvalLog).to.deep.equal(logExpected);
            });
            it("should emit transfer log", () => {
                const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_3, TOKEN_OWNER_1, debtEntries[2].getTokenId());
                expect(transferLog).to.deep.equal(logExpected);
            });
            it("should update owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(1);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(0);
            }));
            it("should update owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                // TOKEN_OWNER_1
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.bignumber.equal(debtEntries[2].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                // TOKEN_OWNER_2
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(debtEntries[1].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                // TOKEN_OWNER_3
                yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
    }));
    describe("#approve()", () => {
        before(resetAndInitState);
        describe("user approves transfer for token he doesn't own", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                expect(debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), {
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
                expect(debtToken.approve.sendTransactionAsync(TOKEN_OWNER_1, debtEntries[0].getTokenId(), {
                    from: TOKEN_OWNER_1,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("user owns token", () => {
            describe("user clears unset approval", () => {
                let res;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.approve.sendTransactionAsync(NULL_ADDRESS, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                }));
                it("should NOT emit approval event", () => __awaiter(this, void 0, void 0, function* () {
                    expect(res.logs.length).to.equal(0);
                }));
                it("should maintain cleared approval", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getApproved.callAsync(debtEntries[0].getTokenId())).to.eventually.equal(NULL_ADDRESS);
                }));
            });
            describe("user sets new approval", () => {
                let res;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                }));
                it("should return newly approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getApproved.callAsync(debtEntries[0].getTokenId())).to.eventually.equal(TOKEN_OWNER_2);
                }));
                it("should emit approval log", () => {
                    const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_2, debtEntries[0].getTokenId());
                    expect(approvalLog).to.deep.equal(logExpected);
                });
            });
            describe("user changes token approval", () => {
                let res;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_3, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                }));
                it("should return newly approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getApproved.callAsync(debtEntries[0].getTokenId())).to.eventually.equal(TOKEN_OWNER_3);
                }));
                it("should emit approval log", () => {
                    const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_3, debtEntries[0].getTokenId());
                    expect(approvalLog).to.deep.equal(logExpected);
                });
            });
            describe("user reaffirms approval", () => {
                let res;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_3, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                }));
                it("should return same approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getApproved.callAsync(debtEntries[0].getTokenId())).to.eventually.equal(TOKEN_OWNER_3);
                }));
                it("should emit approval log", () => {
                    const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_3, debtEntries[0].getTokenId());
                    expect(approvalLog).to.deep.equal(logExpected);
                });
            });
            describe("user clears set approval", () => {
                let res;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.approve.sendTransactionAsync(NULL_ADDRESS, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                }));
                it("should return newly approved user as approved", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getApproved.callAsync(debtEntries[0].getTokenId())).to.eventually.equal(NULL_ADDRESS);
                }));
                it("should emit approval log", () => {
                    const [approvalLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, NULL_ADDRESS, debtEntries[0].getTokenId());
                    expect(approvalLog).to.deep.equal(logExpected);
                });
            });
        });
    });
    describe("#setApprovalForAll()", () => {
        before(resetAndInitState);
        const SENDER = TOKEN_OWNER_1;
        describe("operator is the owner", () => {
            const OPERATOR = SENDER;
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, {
                    from: OPERATOR,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("operator is not the owner", () => {
            const OPERATOR = TOKEN_OWNER_2;
            describe("no operator approval set by the sender", () => {
                let res;
                let logs;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, { from: SENDER });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                    logs = ABIDecoder.decodeLogs(res.logs);
                }));
                it("approves the operator", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.isApprovedForAll.callAsync(SENDER, OPERATOR)).to.eventually.equal(true);
                }));
                it("emits an approval event", () => __awaiter(this, void 0, void 0, function* () {
                    const [approvalForAllLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApprovalForAll(debtToken.address, SENDER, OPERATOR, true);
                    expect(logs.length).equal(1);
                    expect(approvalForAllLog).to.deep.equal(logExpected);
                }));
            });
            describe("operator was set as not approved", () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, false, {
                        from: SENDER,
                    });
                }));
                it("approves the operator", () => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, {
                        from: SENDER,
                    });
                    yield expect(debtToken.isApprovedForAll.callAsync(SENDER, OPERATOR)).to.eventually.equal(true);
                }));
                it("emits an approval event", () => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, { from: SENDER });
                    const res = yield web3.eth.getTransactionReceipt(txHash);
                    const [approvalForAllLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApprovalForAll(debtToken.address, SENDER, OPERATOR, true);
                    expect(approvalForAllLog).to.deep.equal(logExpected);
                }));
                it("can unset the operator approval", () => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, false, {
                        from: SENDER,
                    });
                    yield expect(debtToken.isApprovedForAll.callAsync(SENDER, OPERATOR)).to.eventually.equal(false);
                }));
            });
            describe("operator was already approved", () => {
                beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, {
                        from: SENDER,
                    });
                }));
                it("keeps the approval to the given address", () => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, {
                        from: SENDER,
                    });
                    yield expect(debtToken.isApprovedForAll.callAsync(SENDER, OPERATOR)).to.eventually.equal(true);
                }));
                it("emits an approval event", () => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, { from: SENDER });
                    const res = yield web3.eth.getTransactionReceipt(txHash);
                    const [approvalForAllLog] = ABIDecoder.decodeLogs(res.logs);
                    const logExpected = debt_token_2.LogApprovalForAll(debtToken.address, SENDER, OPERATOR, true);
                    expect(approvalForAllLog).to.deep.equal(logExpected);
                }));
            });
        });
    });
    describe("#getApproved()", () => {
        const SENDER = TOKEN_OWNER_1;
        let SENDER_TOKEN_ID;
        const APPROVED = TOKEN_OWNER_2;
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield resetAndInitState();
            // debtEntries is filled after resetAndInitState is called
            SENDER_TOKEN_ID = debtEntries[0].getTokenId();
        }));
        describe("token is approved", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield debtToken.approve.sendTransactionAsync(APPROVED, SENDER_TOKEN_ID, {
                    from: SENDER,
                });
            }));
            it("should return correct approved address", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.getApproved.callAsync(SENDER_TOKEN_ID)).to.eventually.equal(APPROVED);
            }));
        });
        describe("token is not approved", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                // clear approval for sender's token
                yield debtToken.approve.sendTransactionAsync(NULL_ADDRESS, SENDER_TOKEN_ID, {
                    from: SENDER,
                });
            }));
            it("should return zero address", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.getApproved.callAsync(SENDER_TOKEN_ID)).to.eventually.bignumber.equal(NULL_ADDRESS);
            }));
        });
    });
    describe("#isApprovedForAll", () => {
        before(resetAndInitState);
        const OWNER = TOKEN_OWNER_1;
        const OPERATOR = TOKEN_OWNER_2;
        describe("operator is approved for an owner", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, true, {
                    from: OWNER,
                });
            }));
            it("should return true", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.isApprovedForAll.callAsync(OWNER, OPERATOR)).to.eventually.equal(true);
            }));
        });
        describe("operator is not approved for an owner", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield debtToken.setApprovalForAll.sendTransactionAsync(OPERATOR, false, {
                    from: OWNER,
                });
            }));
            it("should return false", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.isApprovedForAll.callAsync(OWNER, OPERATOR)).to.eventually.equal(false);
            }));
        });
    });
    describe("#transferFrom()", () => {
        before(resetAndInitState);
        describe("user transfers token from owner w/o approval...", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_3, debtEntries[1].getTokenId(), { from: TOKEN_OWNER_3 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("user transfers non-existent token", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_2, TOKEN_OWNER_3, NONEXISTENT_TOKEN_ID, { from: TOKEN_OWNER_3 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("user transfers token from owner w/ approval...", () => {
            describe("...from himself to himself", () => {
                let res;
                let approvalLog;
                let transferLog;
                let debtEntry;
                let TOKEN_ID;
                const OWNER = TOKEN_OWNER_1;
                const APPROVED_OWNER = TOKEN_OWNER_2;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    TOKEN_ID = debtEntries[0].getTokenId();
                    debtEntry = debtEntries[0];
                    yield debtToken.approve.sendTransactionAsync(APPROVED_OWNER, TOKEN_ID, {
                        from: OWNER,
                    });
                    const txHash = yield debtToken.transferFrom.sendTransactionAsync(OWNER, OWNER, TOKEN_ID, { from: OWNER });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                    [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
                }));
                it("should not call registry.modifyBeneficiary with his own address", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(mockRegistry.wasModifyBeneficiaryCalledWith.callAsync(debtEntry.getIssuanceHash(), OWNER)).to.eventually.be.false;
                }));
                it("keeps ownership of the token", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.ownerOf.callAsync(TOKEN_ID)).to.eventually.be.equal(OWNER);
                }));
                it("clears the approval for the token ID", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.getApproved.callAsync(TOKEN_ID)).to.eventually.be.equal(NULL_ADDRESS);
                }));
                it("should emit approval clear log", () => {
                    const logExpected = debt_token_2.LogApproval(debtToken.address, OWNER, NULL_ADDRESS, TOKEN_ID);
                    expect(approvalLog).to.deep.equal(logExpected);
                });
                it("should emit transfer log", () => {
                    const logExpected = debt_token_2.LogTransfer(debtToken.address, OWNER, OWNER, TOKEN_ID);
                    expect(transferLog).to.deep.equal(logExpected);
                });
                it("keeps the owner balance", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.balanceOf.callAsync(OWNER)).to.be.eventually.bignumber.equal(1);
                }));
                it("keeps same tokens by index", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(OWNER, INDEX_0)).to.eventually.bignumber.equal(TOKEN_ID);
                    // balance of OWNER is 1. Hence INDEX_1 should throw
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(OWNER, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("...to null address", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, NULL_ADDRESS, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_2 })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("...from other owner to himself", () => {
                let res;
                let approvalLog;
                let transferLog;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield debtToken.approve.sendTransactionAsync(TOKEN_OWNER_2, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_1 });
                    const txHash = yield debtToken.transferFrom.sendTransactionAsync(TOKEN_OWNER_1, TOKEN_OWNER_2, debtEntries[0].getTokenId(), { from: TOKEN_OWNER_2 });
                    res = yield web3.eth.getTransactionReceipt(txHash);
                    [approvalLog, transferLog] = ABIDecoder.decodeLogs(res.logs);
                }));
                it("should call registry.modifyBeneficiary with his own address", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(mockRegistry.wasModifyBeneficiaryCalledWith.callAsync(debtEntries[0].getIssuanceHash(), TOKEN_OWNER_2)).to.eventually.be.true;
                }));
                it("should emit approval clear log", () => {
                    const logExpected = debt_token_2.LogApproval(debtToken.address, TOKEN_OWNER_1, NULL_ADDRESS, debtEntries[0].getTokenId());
                    expect(approvalLog).to.deep.equal(logExpected);
                });
                it("should emit transfer log", () => {
                    const logExpected = debt_token_2.LogTransfer(debtToken.address, TOKEN_OWNER_1, TOKEN_OWNER_2, debtEntries[0].getTokenId());
                    expect(transferLog).to.deep.equal(logExpected);
                });
                it("should update owners' token balances correctly", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_1)).to.eventually.bignumber.equal(0);
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_2)).to.eventually.bignumber.equal(2);
                    yield expect(debtToken.balanceOf.callAsync(TOKEN_OWNER_3)).to.eventually.bignumber.equal(1);
                }));
                it("should update owners' iterable token lists", () => __awaiter(this, void 0, void 0, function* () {
                    // TOKEN_OWNER_1
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_1, INDEX_0)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    // TOKEN_OWNER_2
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_0)).to.eventually.bignumber.equal(debtEntries[1].getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_1)).to.eventually.bignumber.equal(debtEntries[0].getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_2, INDEX_2)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    // TOKEN_OWNER_3
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_0)).to.eventually.bignumber.equal(debtEntries[2].getTokenId());
                    yield expect(debtToken.tokenOfOwnerByIndex.callAsync(TOKEN_OWNER_3, INDEX_1)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
        });
    });
    describe("#safeTransferFrom()", () => {
        beforeEach(resetAndInitState);
        const safelyTransferWithData = (from, to, tokenID, data) => __awaiter(this, void 0, void 0, function* () {
            return yield send_transactions_1.sendTransaction(debtTokenWeb3ContractInstance, "safeTransferFrom", "address,address,uint256,bytes", [from, to, tokenID, data], { from: from });
        });
        const safelyTransferWithoutData = (from, to, tokenID) => __awaiter(this, void 0, void 0, function* () {
            return yield send_transactions_1.sendTransaction(debtTokenWeb3ContractInstance, "safeTransferFrom", "address,address,uint256", [from, to, tokenID], { from: from });
        });
        const shouldSafelyTransfer = (to) => __awaiter(this, void 0, void 0, function* () {
            describe("with data", () => {
                it("should call `onERC721Received`", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const data = "0x42";
                        const tokenID = debtEntries[0].getTokenId();
                        yield safelyTransferWithData(TOKEN_OWNER_1, to ? to : receiver.address, tokenID, data);
                        expect(receiver.wasOnERC721ReceivedCalledWith.callAsync(TOKEN_OWNER_1, tokenID, data)).to.eventually.be.true;
                    });
                });
            });
            describe("without data", () => {
                it("should call `onERC721Received`", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tokenID = debtEntries[0].getTokenId();
                        yield safelyTransferWithoutData(TOKEN_OWNER_1, to ? to : receiver.address, tokenID);
                        expect(receiver.wasOnERC721ReceivedCalledWith.callAsync(TOKEN_OWNER_1, tokenID, "")).to.eventually.be.true;
                    });
                });
            });
        });
        const shouldNotSafelyTransfer = (toReceiver = true) => __awaiter(this, void 0, void 0, function* () {
            describe("with data", () => {
                it("should revert", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const data = "0x42";
                        const tokenID = debtEntries[0].getTokenId();
                        expect(safelyTransferWithData(TOKEN_OWNER_1, toReceiver ? receiver.address : mockRegistry.address, tokenID, data)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    });
                });
            });
            describe("without data", () => {
                it("should revert", function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const tokenID = debtEntries[0].getTokenId();
                        expect(safelyTransferWithoutData(TOKEN_OWNER_1, toReceiver ? receiver.address : mockRegistry.address, tokenID)).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                    });
                });
            });
        });
        describe("to a valid receiver contract", () => {
            shouldSafelyTransfer();
        });
        describe("to a receiver contract returning an unexpected value", () => {
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                yield receiver.setReturnValueForERC721ReceivedHook.sendTransactionAsync("0x42");
            }));
            shouldNotSafelyTransfer();
        });
        describe("to a receiver contract that throws", () => {
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                yield receiver.setShouldRevert.sendTransactionAsync(true);
            }));
            shouldNotSafelyTransfer();
        });
        describe("to a contract that does not implement the required function", () => {
            shouldNotSafelyTransfer(false);
        });
    });
});
//# sourceMappingURL=debt_token.js.map