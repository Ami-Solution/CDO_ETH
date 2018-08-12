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
const ABIDecoder = require("abi-decoder");
const chai = require("chai");
const Units = require("../test_utils/units");
const debt_kernel_1 = require("../../../types/generated/debt_kernel");
const repayment_router_1 = require("../../../types/generated/repayment_router");
const token_transfer_proxy_1 = require("../../../types/generated/token_transfer_proxy");
const collateralizer_1 = require("../../../types/generated/collateralizer");
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
const mock_e_r_c20_token_1 = require("../../../types/generated/mock_e_r_c20_token");
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
const constants_1 = require("../test_utils/constants");
const multisig_1 = require("../test_utils/multisig");
const permissions_lib_1 = require("../logs/permissions_lib");
const log_utils_1 = require("../logs/log_utils");
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
contract("Token Transfer Proxy (Unit Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    let proxy;
    let kernel;
    let repaymentRouter;
    let mockToken;
    let collateralizer;
    let multiSig;
    const CONTRACT_OWNER = ACCOUNTS[0];
    const ATTACKER = ACCOUNTS[1];
    const AGENT = ACCOUNTS[2];
    const SENDER = ACCOUNTS[3];
    const SENDEE = ACCOUNTS[3];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    before(() => __awaiter(this, void 0, void 0, function* () {
        proxy = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        kernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
        mockToken = yield mock_e_r_c20_token_1.MockERC20TokenContract.deployed(web3, TX_DEFAULTS);
        collateralizer = yield collateralizer_1.CollateralizerContract.deployed(web3, TX_DEFAULTS);
        multiSig = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
    }));
    describe("Initialization", () => {
        it("should list the kernel and repayment router as authorized transfer agents", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(proxy.getAuthorizedTransferAgents.callAsync()).to.eventually.deep.equal([
                kernel.address,
                repaymentRouter.address,
                collateralizer.address,
            ]);
        }));
    });
    describe("Authorizing and Revoking Transfer Agents", () => {
        describe("non-contract owner attempts to authorize transfer agent", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(proxy.addAuthorizedTransferAgent.sendTransactionAsync(ATTACKER, {
                    from: ATTACKER,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("non-contract owner attempts to revoke transfer agent", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(proxy.revokeTransferAgentAuthorization.sendTransactionAsync(kernel.address, {
                    from: ATTACKER,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("multi-sig owners authorize transfer agent", () => {
            let txHash;
            before(() => __awaiter(this, void 0, void 0, function* () {
                txHash = yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, proxy, "addAuthorizedTransferAgent", ACCOUNTS, [AGENT]);
                ABIDecoder.addABI(proxy.abi);
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                ABIDecoder.removeABI(proxy.abi);
            }));
            it("should return agent as authorized", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(proxy.getAuthorizedTransferAgents.callAsync()).to.eventually.deep.equal([
                    kernel.address,
                    repaymentRouter.address,
                    collateralizer.address,
                    AGENT,
                ]);
            }));
            it("should emit event broadcasting authorization of transfer agent", () => __awaiter(this, void 0, void 0, function* () {
                const expectedLogEntry = permissions_lib_1.Authorized(proxy.address, AGENT, "token-transfer-proxy");
                const resultingLog = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.Authorized);
                expect(resultingLog).to.deep.equal(expectedLogEntry);
            }));
        });
        describe("multi-sig owners revokes transfer agent", () => {
            let txHash;
            before(() => __awaiter(this, void 0, void 0, function* () {
                txHash = yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, proxy, "revokeTransferAgentAuthorization", ACCOUNTS, [AGENT]);
                ABIDecoder.addABI(proxy.abi);
            }));
            after(() => __awaiter(this, void 0, void 0, function* () {
                ABIDecoder.removeABI(proxy.abi);
            }));
            it("should return agent as unauthorized", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(proxy.getAuthorizedTransferAgents.callAsync()).to.eventually.deep.equal([
                    kernel.address,
                    repaymentRouter.address,
                    collateralizer.address,
                ]);
            }));
            it("should emit event broadcasting revocation of transfer agent", () => __awaiter(this, void 0, void 0, function* () {
                const expectedLogEntry = permissions_lib_1.AuthorizationRevoked(proxy.address, AGENT, "token-transfer-proxy");
                const resultingLog = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.AuthorizationRevoked);
                expect(resultingLog).to.deep.equal(expectedLogEntry);
            }));
        });
    });
    describe("#transferFrom", () => {
        describe("unauthorized agent attempts to transfer tokens via transfer proxy", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(proxy.transferFrom.sendTransactionAsync(mockToken.address, CONTRACT_OWNER, ATTACKER, Units.ether(1))).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("authorized agent transfers tokens via transfer proxy", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, proxy, "addAuthorizedTransferAgent", ACCOUNTS, [AGENT]);
                yield proxy.transferFrom.sendTransactionAsync(mockToken.address, SENDER, SENDEE, Units.ether(1), { from: AGENT });
            }));
            it("should call transferFrom on specified token w/ specified parameters", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(mockToken.wasTransferFromCalledWith.callAsync(SENDER, SENDEE, Units.ether(1))).to.eventually.be.true;
            }));
        });
    });
}));
//# sourceMappingURL=token_transfer_proxy.js.map