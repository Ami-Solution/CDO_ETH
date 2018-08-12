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
const web3_utils_1 = require("../../../utils/web3_utils");
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
const web3Utils = new web3_utils_1.Web3Utils(web3);
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Import our set of test Contracts
const dummy_contract_1 = require("../../../types/generated/dummy_contract");
const mock_debt_registry_1 = require("../../../types/generated/mock_debt_registry");
const mock_e_r_c20_token_1 = require("../../../types/generated/mock_e_r_c20_token");
const mock_e_r_c721_token_1 = require("../../../types/generated/mock_e_r_c721_token");
const mock_e_r_c721_receiver_1 = require("../../../types/generated/mock_e_r_c721_receiver");
const mock_debt_token_1 = require("../../../types/generated/mock_debt_token");
const mock_terms_contract_1 = require("../../../types/generated/mock_terms_contract");
const mock_collateralized_terms_contract_1 = require("../../../types/generated/mock_collateralized_terms_contract");
const mock_token_registry_1 = require("../../../types/generated/mock_token_registry");
const mock_token_transfer_proxy_1 = require("../../../types/generated/mock_token_transfer_proxy");
contract("Migration #3: Deploying Test Contracts", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let dummyContract;
    let mockDebtRegistry;
    let mockERC20Token;
    let mockERC721Token;
    let mockERC721Receiver;
    let mockDebtToken;
    let mockTermsContract;
    let mockCollateralizedTermsContract;
    let mockTokenRegistry;
    let mockTokenTransferProxy;
    before(() => __awaiter(this, void 0, void 0, function* () {
        dummyContract = yield dummy_contract_1.DummyContractContract.deployed(web3, TX_DEFAULTS);
        mockDebtRegistry = yield mock_debt_registry_1.MockDebtRegistryContract.deployed(web3, TX_DEFAULTS);
        mockERC20Token = yield mock_e_r_c20_token_1.MockERC20TokenContract.deployed(web3, TX_DEFAULTS);
        mockERC721Token = yield mock_e_r_c721_token_1.MockERC721TokenContract.deployed(web3, TX_DEFAULTS);
        mockERC721Receiver = yield mock_e_r_c721_receiver_1.MockERC721ReceiverContract.deployed(web3, TX_DEFAULTS);
        mockDebtToken = yield mock_debt_token_1.MockDebtTokenContract.deployed(web3, TX_DEFAULTS);
        mockTermsContract = yield mock_terms_contract_1.MockTermsContractContract.deployed(web3, TX_DEFAULTS);
        mockCollateralizedTermsContract = yield mock_collateralized_terms_contract_1.MockCollateralizedTermsContractContract.deployed(web3, TX_DEFAULTS);
        mockTokenRegistry = yield mock_token_registry_1.MockTokenRegistryContract.deployed(web3, TX_DEFAULTS);
        mockTokenTransferProxy = yield mock_token_transfer_proxy_1.MockTokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
    }));
    describe("Deployment", () => {
        it("should deploy the `DummyContract` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(dummyContract.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockDebtRegistry` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockDebtRegistry.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockERC20Token` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockERC20Token.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockERC721Token` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockERC721Token.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockERC721Receiver` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockERC721Receiver.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockDebtToken` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockDebtToken.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockTermsContract` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockTermsContract.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockCollateralizedTermsContract` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockCollateralizedTermsContract.address)).to.eventually.be.true;
        }));
        it("should deploy the `MockTokenRegistry` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockTokenRegistry.address)).to
                .eventually.be.true;
        }));
        it("should deploy the `MockTokenTransferProxy` contract to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(mockTokenTransferProxy.address))
                .to.eventually.be.true;
        }));
    });
}));
//# sourceMappingURL=3_deploy_test_contracts_test.js.map