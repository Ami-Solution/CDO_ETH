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
const chai = require("chai");
const bignumber_js_1 = require("bignumber.js");
const web3_utils_1 = require("../../../utils/web3_utils");
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
const web3Utils = new web3_utils_1.Web3Utils(web3);
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Dharma Contracts
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
const debt_token_1 = require("../../../types/generated/debt_token");
const debt_registry_1 = require("../../../types/generated/debt_registry");
const repayment_router_1 = require("../../../types/generated/repayment_router");
const token_transfer_proxy_1 = require("../../../types/generated/token_transfer_proxy");
const debt_kernel_1 = require("../../../types/generated/debt_kernel");
const contract_registry_1 = require("../../../types/generated/contract_registry");
const collateralizer_1 = require("../../../types/generated/collateralizer");
const token_registry_1 = require("../../../types/generated/token_registry");
const constants_1 = require("../test_utils/constants");
const migration_constants_1 = require("../../../migrations/migration_constants");
contract("Migration #2: Deploying Dharma Contracts", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let wallet;
    let debtToken;
    let debtRegistry;
    let tokenTransferProxy;
    let repaymentRouter;
    let debtKernel;
    let collateralizer;
    let contractRegistry;
    let tokenRegistry;
    before(() => __awaiter(this, void 0, void 0, function* () {
        wallet = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
        debtRegistry = yield debt_registry_1.DebtRegistryContract.deployed(web3, TX_DEFAULTS);
        repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
        debtToken = yield debt_token_1.DebtTokenContract.deployed(web3, TX_DEFAULTS);
        tokenTransferProxy = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        debtKernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        collateralizer = yield collateralizer_1.CollateralizerContract.deployed(web3, TX_DEFAULTS);
        contractRegistry = yield contract_registry_1.ContractRegistryContract.deployed(web3, TX_DEFAULTS);
        tokenRegistry = yield token_registry_1.TokenRegistryContract.deployed(web3, TX_DEFAULTS);
    }));
    describe("Deployment", () => {
        it("should deploy the `DharmaMultiSigWallet` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(wallet.address)).to.eventually.be
                .true;
        }));
        it("should deploy the `DebtRegistry` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(debtRegistry.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `RepaymentRouter` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(repaymentRouter.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `DebtToken` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(debtToken.address)).to.eventually
                .be.true;
        }));
        it("should deploy the `TokenTransferProxy` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(tokenTransferProxy.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `DebtKernel` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(debtKernel.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `Collateralizer` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(collateralizer.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `ContractRegistry` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(contractRegistry.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `TokenRegistry` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(tokenRegistry.address)).to
                .eventually.be.true;
        }));
    });
    describe("#DebtToken", () => {
        it("references the deployed instance of the debt registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.registry.callAsync()).to.eventually.equal(debtRegistry.address);
        }));
    });
    describe("#RepaymentRouter", () => {
        it("references the deployed instance of the debt registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(repaymentRouter.debtRegistry.callAsync()).to.eventually.equal(debtRegistry.address);
        }));
        it("references the deployed instance of the token transfer proxy", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(repaymentRouter.tokenTransferProxy.callAsync()).to.eventually.equal(tokenTransferProxy.address);
        }));
    });
    describe("#DebtKernel", () => {
        it("references the deployed instance of the token transfer proxy", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtKernel.TOKEN_TRANSFER_PROXY.callAsync()).to.eventually.equal(tokenTransferProxy.address);
        }));
    });
    describe("#DharmaMultiSigWallet", () => {
        const contractOwners = ACCOUNTS.slice(0, 5);
        const required = new bignumber_js_1.BigNumber(3);
        it("lists the correct accounts as owner", () => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(contractOwners.map((owner) => __awaiter(this, void 0, void 0, function* () {
                return expect(wallet.isOwner.callAsync(owner)).to.eventually.be.true;
            })));
        }));
        it("lists the exact set of owners", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(wallet.getOwners.callAsync()).to.eventually.deep.equal(contractOwners);
        }));
        it("lists the correct number of required authorizations", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(wallet.required.callAsync()).to.eventually.bignumber.equal(required);
        }));
        it("lists the correct value for the timelock (in seconds)", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(wallet.timelockInSeconds.callAsync()).to.eventually.bignumber.equal(new bignumber_js_1.BigNumber(60 * 60 * 24 * 7));
        }));
    });
    describe("#Collateralizer", () => {
        it("references the deployed instance of the debt registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizer.debtRegistry.callAsync()).to.eventually.equal(debtRegistry.address);
        }));
        it("references the deployed instance of the token transfer proxy", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizer.tokenTransferProxy.callAsync()).to.eventually.equal(tokenTransferProxy.address);
        }));
        it("references the deployed instance of the token registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizer.tokenRegistry.callAsync()).to.eventually.equal(tokenRegistry.address);
        }));
    });
    describe("#TokenRegistry", () => {
        it("should populate the registry with a set of dummy tokens", () => __awaiter(this, void 0, void 0, function* () {
            migration_constants_1.TOKEN_LIST.forEach((token) => __awaiter(this, void 0, void 0, function* () {
                yield expect(tokenRegistry.getTokenAddressBySymbol.callAsync(token.symbol)).to.eventually.not.equal(constants_1.NULL_ADDRESS);
            }));
        }));
    });
    describe("#ContractRegistry", () => {
        it("references the deployed instance of the collateralizer", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.collateralizer.callAsync()).to.eventually.equal(collateralizer.address);
        }));
        it("references the deployed instance of the debt kernel", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.debtKernel.callAsync()).to.eventually.equal(debtKernel.address);
        }));
        it("references the deployed instance of the debt registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.debtRegistry.callAsync()).to.eventually.equal(debtRegistry.address);
        }));
        it("references the deployed instance of the debt token", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.debtToken.callAsync()).to.eventually.equal(debtToken.address);
        }));
        it("references the deployed instance of the repayment router", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.repaymentRouter.callAsync()).to.eventually.equal(repaymentRouter.address);
        }));
        it("references the deployed instance of the token registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.tokenRegistry.callAsync()).to.eventually.equal(tokenRegistry.address);
        }));
        it("references the deployed instance of the token transfer proxy", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.tokenTransferProxy.callAsync()).to.eventually.equal(tokenTransferProxy.address);
        }));
    });
}));
//# sourceMappingURL=2_deploy_dharma_contracts_test.js.map