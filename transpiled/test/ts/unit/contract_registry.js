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
const bignumber_js_1 = require("bignumber.js");
const ABIDecoder = require("abi-decoder");
const chai = require("chai");
const mock_debt_registry_1 = require("../../../types/generated/mock_debt_registry");
const debt_kernel_1 = require("../../../types/generated/debt_kernel");
const mock_debt_token_1 = require("../../../types/generated/mock_debt_token");
const mock_token_transfer_proxy_1 = require("../../../types/generated/mock_token_transfer_proxy");
const repayment_router_1 = require("../../../types/generated/repayment_router");
const mock_token_registry_1 = require("../../../types/generated/mock_token_registry");
const collateralizer_1 = require("../../../types/generated/collateralizer");
const contract_registry_1 = require("../../../types/generated/contract_registry");
const contract_registry_2 = require("../logs/contract_registry");
const log_utils_1 = require("../logs/log_utils");
const constants_1 = require("../test_utils/constants");
const chai_setup_1 = require("../test_utils/chai_setup");
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
const contractRegistryArtifact = artifacts.require("ContractRegistry");
const debtRegistryArtifact = artifacts.require("MockDebtRegistry");
contract("Contract Registry (Unit Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const ATTACKER = ACCOUNTS[1];
    const NEW_DEBT_REGISTRY_ADDRESS = ACCOUNTS[2];
    const NEW_DEBT_TOKEN_ADDRESS = ACCOUNTS[3];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let debtKernel;
    let repaymentRouter;
    let mockDebtRegistry;
    let mockDebtToken;
    let mockTokenTransferProxy;
    let mockTokenRegistry;
    let collateralizer;
    let contractRegistry;
    before(() => __awaiter(this, void 0, void 0, function* () {
        debtKernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        mockDebtRegistry = yield mock_debt_registry_1.MockDebtRegistryContract.deployed(web3, TX_DEFAULTS);
        mockTokenTransferProxy = yield mock_token_transfer_proxy_1.MockTokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        mockTokenRegistry = yield mock_token_registry_1.MockTokenRegistryContract.deployed(web3, TX_DEFAULTS);
        mockDebtToken = yield mock_debt_token_1.MockDebtTokenContract.deployed(web3, TX_DEFAULTS);
        repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
        collateralizer = yield collateralizer_1.CollateralizerContract.deployed(web3, TX_DEFAULTS);
        const contractRegistryTruffle = yield contractRegistryArtifact.new(collateralizer.address, debtKernel.address, mockDebtRegistry.address, mockDebtToken.address, repaymentRouter.address, mockTokenRegistry.address, mockTokenTransferProxy.address, { from: CONTRACT_OWNER });
        const contractRegistryAsWeb3Contract = web3.eth
            .contract(contractRegistryArtifact.abi)
            .at(contractRegistryTruffle.address);
        contractRegistry = new contract_registry_1.ContractRegistryContract(contractRegistryAsWeb3Contract, TX_DEFAULTS);
        ABIDecoder.addABI(contractRegistry.abi);
    }));
    after(() => {
        ABIDecoder.removeABI(contractRegistry.abi);
    });
    describe("Initialization", () => {
        it("points to the collateralizer passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.collateralizer.callAsync()).to.eventually.equal(collateralizer.address);
        }));
        it("points to the debt kernel passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.debtKernel.callAsync()).to.eventually.equal(debtKernel.address);
        }));
        it("points to the debt registry passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.debtRegistry.callAsync()).to.eventually.equal(mockDebtRegistry.address);
        }));
        it("points to the debt token passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.debtToken.callAsync()).to.eventually.equal(mockDebtToken.address);
        }));
        it("points to the repayment router passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.repaymentRouter.callAsync()).to.eventually.equal(repaymentRouter.address);
        }));
        it("points to the token registry passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.tokenRegistry.callAsync()).to.eventually.equal(mockTokenRegistry.address);
        }));
        it("points to the token transfer proxy passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(contractRegistry.tokenTransferProxy.callAsync()).to.eventually.equal(mockTokenTransferProxy.address);
        }));
    });
    describe("#updateAddress", () => {
        describe("successfully", () => {
            let txHash;
            const DEBT_REGISTRY_ENUM_RAW_VALUE = new bignumber_js_1.BigNumber(2);
            before(() => __awaiter(this, void 0, void 0, function* () {
                txHash = yield contractRegistry.updateAddress.sendTransactionAsync(DEBT_REGISTRY_ENUM_RAW_VALUE, NEW_DEBT_REGISTRY_ADDRESS, { from: CONTRACT_OWNER });
            }));
            it("updates the address of the debt registry", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(contractRegistry.debtRegistry.callAsync()).to.eventually.equal(NEW_DEBT_REGISTRY_ADDRESS);
            }));
            it("emits an event announcing the new address", () => __awaiter(this, void 0, void 0, function* () {
                const expectedLogEntry = contract_registry_2.ContractAddressUpdated(contractRegistry.address, DEBT_REGISTRY_ENUM_RAW_VALUE, mockDebtRegistry.address, NEW_DEBT_REGISTRY_ADDRESS);
                const resultingLog = yield log_utils_1.queryLogsForEvent(txHash, contract_registry_2.EventNames.ContractAddressUpdated);
                expect(resultingLog).to.deep.equal(expectedLogEntry);
            }));
        });
        describe("unsuccessfully", () => {
            const DEBT_TOKEN_ENUM_RAW_VALUE = new bignumber_js_1.BigNumber(3);
            it("reverts if an account other than the owner sends the transaction", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(contractRegistry.updateAddress.sendTransactionAsync(DEBT_TOKEN_ENUM_RAW_VALUE, NEW_DEBT_TOKEN_ADDRESS, { from: ATTACKER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
            it("reverts if the new address specified is the null address", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(contractRegistry.updateAddress.sendTransactionAsync(DEBT_TOKEN_ENUM_RAW_VALUE, constants_1.NULL_ADDRESS, { from: CONTRACT_OWNER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
            it("reverts if the new address specified is the existing address", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(contractRegistry.updateAddress.sendTransactionAsync(DEBT_TOKEN_ENUM_RAW_VALUE, mockDebtToken.address, { from: CONTRACT_OWNER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
            it("throws invalid opcode if the contract type specified is invalid", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(contractRegistry.updateAddress.sendTransactionAsync(new bignumber_js_1.BigNumber(7), // invalid value.
                NEW_DEBT_TOKEN_ADDRESS, { from: CONTRACT_OWNER })).to.eventually.be.rejectedWith(constants_1.INVALID_OPCODE);
            }));
        });
    });
}));
//# sourceMappingURL=contract_registry.js.map