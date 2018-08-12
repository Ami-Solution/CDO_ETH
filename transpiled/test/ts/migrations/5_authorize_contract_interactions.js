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
const migration_constants_js_1 = require("../../../migrations/migration_constants.js");
// Wrappers
const collateralized_simple_interest_terms_contract_1 = require("../../../types/generated/collateralized_simple_interest_terms_contract");
const collateralizer_1 = require("../../../types/generated/collateralizer");
const debt_kernel_1 = require("../../../types/generated/debt_kernel");
const debt_token_1 = require("../../../types/generated/debt_token");
const debt_registry_1 = require("../../../types/generated/debt_registry");
const token_transfer_proxy_1 = require("../../../types/generated/token_transfer_proxy");
const repayment_router_1 = require("../../../types/generated/repayment_router");
chai_setup_1.default.configure();
const expect = chai.expect;
contract("Migration #5: Authorizing Contract Interactions", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let collateralizer;
    let kernel;
    let debtToken;
    let registry;
    describe("Deployment", () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            collateralizer = yield collateralizer_1.CollateralizerContract.deployed(web3, TX_DEFAULTS);
            debtToken = yield debt_token_1.DebtTokenContract.deployed(web3, TX_DEFAULTS);
            kernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
            registry = yield debt_registry_1.DebtRegistryContract.deployed(web3, TX_DEFAULTS);
        }));
        it("should authorize `DebtToken` to insert into the registry", () => __awaiter(this, void 0, void 0, function* () {
            const approved = yield registry.getAuthorizedInsertAgents.callAsync();
            expect(approved).to.deep.eq([debtToken.address]);
        }));
        it("should authorize `DebtToken` to edit the registry", () => __awaiter(this, void 0, void 0, function* () {
            const approved = yield registry.getAuthorizedEditAgents.callAsync();
            expect(approved).to.deep.eq([debtToken.address]);
        }));
        it("should authorize the kernel to mint debt tokens", () => __awaiter(this, void 0, void 0, function* () {
            const approvals = yield debtToken.getAuthorizedMintAgents.callAsync();
            expect(approvals).to.deep.eq([kernel.address]);
        }));
        it("should set the kernel to point at current debt token contract", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(kernel.debtToken.callAsync()).to.eventually.equal(debtToken.address);
        }));
        it("should authorize only the kernel, repayment router, and collateralizer " +
            "to make `transferFrom` calls on the token transfer proxy", () => __awaiter(this, void 0, void 0, function* () {
            const proxy = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
            const repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
            const approved = yield proxy.getAuthorizedTransferAgents.callAsync();
            expect(approved).to.deep.eq([
                kernel.address,
                repaymentRouter.address,
                collateralizer.address,
            ]);
        }));
        it("should authorize the collateralized simple interest terms contract to invoke `collateralize`", () => __awaiter(this, void 0, void 0, function* () {
            const collateralizedTermsContract = yield collateralized_simple_interest_terms_contract_1.CollateralizedSimpleInterestTermsContractContract.deployed(web3, TX_DEFAULTS);
            const approved = yield collateralizer.getAuthorizedCollateralizeAgents.callAsync();
            expect(approved).to.deep.eq([collateralizedTermsContract.address]);
        }));
        it("should authorize the token-uri operator to call setTokenURI", () => __awaiter(this, void 0, void 0, function* () {
            const approved = yield debtToken.getAuthorizedTokenURIAgents.callAsync();
            expect(approved).to.deep.eq([migration_constants_js_1.TOKEN_URI_OPERATOR]);
        }));
    });
}));
//# sourceMappingURL=5_authorize_contract_interactions.js.map