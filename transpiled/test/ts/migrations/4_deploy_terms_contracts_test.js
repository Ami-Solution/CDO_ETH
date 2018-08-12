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
const web3_utils_1 = require("../../../utils/web3_utils");
const chai_setup_1 = require("../test_utils/chai_setup");
// Terms Contracts
const simple_interest_terms_contract_1 = require("../../../types/generated/simple_interest_terms_contract");
const collateralized_simple_interest_terms_contract_1 = require("../../../types/generated/collateralized_simple_interest_terms_contract");
const incompatible_terms_contract_1 = require("../../../types/generated/incompatible_terms_contract");
// Contract Registry
const contract_registry_1 = require("../../../types/generated/contract_registry");
chai_setup_1.default.configure();
const expect = chai.expect;
const web3Utils = new web3_utils_1.Web3Utils(web3);
contract("Migration #4: Deploying Terms Contracts", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let simpleInterestTermsContract;
    let collateralizedTermsContract;
    let incompatibleTermsContract;
    let contractRegistry;
    before(() => __awaiter(this, void 0, void 0, function* () {
        // Terms contracts.
        simpleInterestTermsContract = yield simple_interest_terms_contract_1.SimpleInterestTermsContractContract.deployed(web3, TX_DEFAULTS);
        collateralizedTermsContract = yield collateralized_simple_interest_terms_contract_1.CollateralizedSimpleInterestTermsContractContract.deployed(web3, TX_DEFAULTS);
        incompatibleTermsContract = yield incompatible_terms_contract_1.IncompatibleTermsContractContract.deployed(web3, TX_DEFAULTS);
        // Contract registry.
        contractRegistry = yield contract_registry_1.ContractRegistryContract.deployed(web3, TX_DEFAULTS);
    }));
    describe("#IncompatibleTermsContract", () => {
        it("should be deployed to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(incompatibleTermsContract.address)).to.eventually.be.true;
        }));
    });
    describe("#SimpleInterestTermsContract", () => {
        it("should be deployed to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(simpleInterestTermsContract.address)).to.eventually.be.true;
        }));
        it("references the deployed instance of the contract registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(simpleInterestTermsContract.contractRegistry.callAsync()).to.eventually.equal(contractRegistry.address);
        }));
    });
    describe("#CollateralizedSimpleInterestTermsContract", () => {
        it("should be deployed to the current network", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(web3Utils.doesContractExistAtAddressAsync(collateralizedTermsContract.address)).to.eventually.be.true;
        }));
        it("references the deployed instance of the contract registry", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizedTermsContract.contractRegistry.callAsync()).to.eventually.equal(contractRegistry.address);
        }));
    });
}));
//# sourceMappingURL=4_deploy_terms_contracts_test.js.map