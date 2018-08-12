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
const chai = require("chai");
// Utils
const chai_setup_1 = require("../test_utils/chai_setup");
// Wrappers
const collateralizer_1 = require("../../../types/generated/collateralizer");
const debt_kernel_1 = require("../../../types/generated/debt_kernel");
const debt_token_1 = require("../../../types/generated/debt_token");
const debt_registry_1 = require("../../../types/generated/debt_registry");
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
const repayment_router_1 = require("../../../types/generated/repayment_router");
const token_transfer_proxy_1 = require("../../../types/generated/token_transfer_proxy");
const contract_registry_1 = require("../../../types/generated/contract_registry");
chai_setup_1.default.configure();
const expect = chai.expect;
contract("Migration #6: Transferring Ownership to Multisig", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let multisig;
    before(() => __awaiter(this, void 0, void 0, function* () {
        multisig = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
    }));
    describe("Deployment", () => {
        it("should transfer ownership of `DebtRegistry` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield debt_registry_1.DebtRegistryContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
        it("should transfer ownership of `DebtToken` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield debt_token_1.DebtTokenContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
        it("should transfer ownership of `DebtKernel` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
        it("should transfer ownership of `TokenTransferProxy` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
        it("should transfer ownership of `RepaymentRouter` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
        it("should transfer ownership of `Collateralizer` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield collateralizer_1.CollateralizerContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
        it("should transfer ownership of `ContractRegistry` to the Multisig Wallet", () => __awaiter(this, void 0, void 0, function* () {
            const contract = yield contract_registry_1.ContractRegistryContract.deployed(web3, TX_DEFAULTS);
            const owner = yield contract.owner.callAsync();
            expect(owner).to.equal(multisig.address);
        }));
    });
}));
//# sourceMappingURL=6_transfer_ownership_to_multisig.js.map