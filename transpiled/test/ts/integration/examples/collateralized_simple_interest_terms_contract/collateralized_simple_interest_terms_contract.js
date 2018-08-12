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
// Test Utils
const bignumber_setup_1 = require("../../../test_utils/bignumber_setup");
const chai_setup_1 = require("../../../test_utils/chai_setup");
// Wrappers
const debt_kernel_1 = require("../../../../../types/generated/debt_kernel");
const debt_registry_1 = require("../../../../../types/generated/debt_registry");
const debt_token_1 = require("../../../../../types/generated/debt_token");
const dummy_token_1 = require("../../../../../types/generated/dummy_token");
const repayment_router_1 = require("../../../../../types/generated/repayment_router");
const collateralized_simple_interest_terms_contract_1 = require("../../../../../types/generated/collateralized_simple_interest_terms_contract");
const token_registry_1 = require("../../../../../types/generated/token_registry");
const token_transfer_proxy_1 = require("../../../../../types/generated/token_transfer_proxy");
const collateralizer_1 = require("../../../../../types/generated/collateralizer");
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Set up Chai
chai_setup_1.default.configure();
// Scenarios
const successful_register_repayment_1 = require("./scenarios/successful_register_repayment");
const unsuccessful_register_repayment_1 = require("./scenarios/unsuccessful_register_repayment");
const successful_register_term_start_1 = require("./scenarios/successful_register_term_start");
const unsuccessful_register_term_start_1 = require("./scenarios/unsuccessful_register_term_start");
const unpack_parameters_from_bytes_1 = require("./scenarios/unpack_parameters_from_bytes");
// Scenario Runners
const runners_1 = require("./runners");
contract("Collateralized Simple Interest Terms Contract (Integration Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    let kernel;
    let repaymentRouter;
    let collateralizedSimpleInterestTermsContract;
    let tokenTransferProxy;
    let debtTokenContract;
    let debtRegistryContract;
    let dummyTokenRegistryContract;
    let collateralizerContract;
    let dummyREPToken;
    let dummyZRXToken;
    const CONTRACT_OWNER = ACCOUNTS[0];
    const DEBTOR_1 = ACCOUNTS[5];
    const CREDITOR_1 = ACCOUNTS[8];
    const UNDERWRITER = ACCOUNTS[11];
    const RELAYER = ACCOUNTS[12];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4712388 };
    const registerRepaymentRunner = new runners_1.RegisterRepaymentRunner(web3);
    const registerTermStartRunner = new runners_1.RegisterTermStartRunner(web3);
    const unpackParametersFromBytes = new runners_1.UnpackParametersFromBytesRunner();
    before(() => __awaiter(this, void 0, void 0, function* () {
        dummyTokenRegistryContract = yield token_registry_1.TokenRegistryContract.deployed(web3, TX_DEFAULTS);
        const dummyREPTokenAddress = yield dummyTokenRegistryContract.getTokenAddressBySymbol.callAsync("REP");
        const dummyZRXTokenAddress = yield dummyTokenRegistryContract.getTokenAddressBySymbol.callAsync("ZRX");
        dummyREPToken = yield dummy_token_1.DummyTokenContract.at(dummyREPTokenAddress, web3, TX_DEFAULTS);
        dummyZRXToken = yield dummy_token_1.DummyTokenContract.at(dummyZRXTokenAddress, web3, TX_DEFAULTS);
        debtTokenContract = yield debt_token_1.DebtTokenContract.deployed(web3, TX_DEFAULTS);
        debtRegistryContract = yield debt_registry_1.DebtRegistryContract.deployed(web3, TX_DEFAULTS);
        collateralizedSimpleInterestTermsContract = yield collateralized_simple_interest_terms_contract_1.CollateralizedSimpleInterestTermsContractContract.deployed(web3, TX_DEFAULTS);
        collateralizerContract = yield collateralizer_1.CollateralizerContract.deployed(web3, TX_DEFAULTS);
        tokenTransferProxy = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        kernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
        const testAccounts = {
            UNDERWRITER,
            CONTRACT_OWNER,
            DEBTOR_1,
            CREDITOR_1,
            RELAYER,
        };
        const testContracts = {
            collateralizerContract,
            tokenTransferProxy,
            kernel,
            dummyREPToken,
            dummyZRXToken,
            collateralizedSimpleInterestTermsContract,
            repaymentRouter,
            dummyTokenRegistryContract,
            debtTokenContract,
        };
        registerRepaymentRunner.initialize(testAccounts, testContracts);
        registerTermStartRunner.initialize(testAccounts, testContracts);
        unpackParametersFromBytes.initialize(collateralizedSimpleInterestTermsContract);
    }));
    describe("#registerTermStart", () => {
        describe("Successful register term start", () => {
            successful_register_term_start_1.SUCCESSFUL_REGISTER_TERM_START_SCENARIOS.forEach(registerTermStartRunner.testScenario);
        });
        describe("Unsuccessful register term start", () => {
            unsuccessful_register_term_start_1.UNSUCCESSFUL_REGISTER_TERM_START_SCENARIOS.forEach(registerTermStartRunner.testScenario);
        });
    });
    describe("#registerRepayment", () => {
        describe("Unsuccessful register repayment", () => {
            unsuccessful_register_repayment_1.UNSUCCESSFUL_REGISTER_REPAYMENT_SCENARIOS.forEach(registerRepaymentRunner.testScenario);
        });
        describe("Successful register repayment", () => {
            successful_register_repayment_1.SUCCESSFUL_REGISTER_REPAYMENT_SCENARIOS.forEach(registerRepaymentRunner.testScenario);
        });
    });
    describe("#unpackParametersFromBytes", () => {
        unpack_parameters_from_bytes_1.UNPACK_PARAMETERS_FROM_BYTES_SCENARIOS.forEach(unpackParametersFromBytes.testScenario);
    });
}));
//# sourceMappingURL=collateralized_simple_interest_terms_contract.js.map