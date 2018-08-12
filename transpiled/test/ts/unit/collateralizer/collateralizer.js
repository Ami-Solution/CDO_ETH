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
const chai = require("chai");
const Units = require("../../test_utils/units");
// Utils
const bignumber_setup_1 = require("../../test_utils/bignumber_setup");
const chai_setup_1 = require("../../test_utils/chai_setup");
const constants_1 = require("../../test_utils/constants");
// Generated Types
const collateralizer_1 = require("../../../../types/generated/collateralizer");
const token_registry_1 = require("../../../../types/generated/token_registry");
const mock_debt_registry_1 = require("../../../../types/generated/mock_debt_registry");
const mock_e_r_c20_token_1 = require("../../../../types/generated/mock_e_r_c20_token");
const mock_token_registry_1 = require("../../../../types/generated/mock_token_registry");
const mock_token_transfer_proxy_1 = require("../../../../types/generated/mock_token_transfer_proxy");
const mock_collateralized_terms_contract_1 = require("../../../../types/generated/mock_collateralized_terms_contract");
// Scenario Runners
const runners_1 = require("./runners");
// Scenario Constants
const successful_collateralization_1 = require("./scenarios/successful_collateralization");
const unsuccessful_collateralization_1 = require("./scenarios/unsuccessful_collateralization");
const successful_return_1 = require("./scenarios/successful_return");
const unsuccessful_return_1 = require("./scenarios/unsuccessful_return");
const successful_seizure_1 = require("./scenarios/successful_seizure");
const unsuccessful_seizure_1 = require("./scenarios/unsuccessful_seizure");
const permissions_lib_1 = require("../../logs/permissions_lib");
const log_utils_1 = require("../../logs/log_utils");
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
const collateralizer = artifacts.require("Collateralizer");
contract("CollateralizedContract (Unit Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    let collateralizerContract;
    let tokenRegistry;
    let mockToken;
    let mockDebtRegistry;
    let mockTokenRegistry;
    let mockTokenTransferProxy;
    let mockTermsContract;
    const collateralizeRunner = new runners_1.CollateralizeRunner();
    const returnCollateralRunner = new runners_1.ReturnCollateralRunner(web3);
    const seizeCollateralRunner = new runners_1.SeizeCollateralRunner(web3);
    const CONTRACT_OWNER = ACCOUNTS[0];
    const COLLATERALIZER = ACCOUNTS[1];
    const NON_COLLATERALIZER = ACCOUNTS[2];
    const BENEFICIARY_1 = ACCOUNTS[3];
    const BENEFICIARY_2 = ACCOUNTS[4];
    const MOCK_DEBT_KERNEL_ADDRESS = ACCOUNTS[5];
    // The following MOCK_TERMS_CONTRACT_ADDRESS is used in cases where collateralized tested using the "from" modifier.
    // In such cases, the deployed mockTermsContract's address will not be a recognized sender account.
    const MOCK_TERMS_CONTRACT_ADDRESS = ACCOUNTS[6];
    const AGENT = ACCOUNTS[7];
    const ATTACKER = ACCOUNTS[8];
    const NULL_PARAMETERS = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    before(() => __awaiter(this, void 0, void 0, function* () {
        tokenRegistry = yield token_registry_1.TokenRegistryContract.deployed(web3, TX_DEFAULTS);
        mockDebtRegistry = yield mock_debt_registry_1.MockDebtRegistryContract.deployed(web3, TX_DEFAULTS);
        mockToken = yield mock_e_r_c20_token_1.MockERC20TokenContract.deployed(web3, TX_DEFAULTS);
        mockTokenRegistry = yield mock_token_registry_1.MockTokenRegistryContract.deployed(web3, TX_DEFAULTS);
        mockTokenTransferProxy = yield mock_token_transfer_proxy_1.MockTokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        mockTermsContract = yield mock_collateralized_terms_contract_1.MockCollateralizedTermsContractContract.deployed(web3, TX_DEFAULTS);
        /*
        In our test environment, we want to interact with the contract being
        unit tested as a statically-typed entity. In order to accomplish this,
        we take the following steps:

          1 - Instantiate an instance of the contract through the Truffle
              framework.
          2 - Instantiate an instance of the contract through the Web3 API using
              the truffle instance's ABI.
          3 - Use the Web3 contract instance to instantiate a statically-typed
              version of the contract as handled by ABI-GEN, which generates
              a contract wrapper with types pulled from the contract's ABI.
         */
        // Step 1: Instantiate a truffle instance of the contract.
        const collateralContractTruffle = yield collateralizer.new(MOCK_DEBT_KERNEL_ADDRESS, mockDebtRegistry.address, mockTokenRegistry.address, mockTokenTransferProxy.address, { from: CONTRACT_OWNER });
        // Step 2: Instantiate a web3 instance of the contract.
        const collateralContractWeb3Contract = web3.eth
            .contract(collateralizer.abi)
            .at(collateralContractTruffle.address);
        // Step 3: Instantiate a statically-typed version of the contract.
        collateralizerContract = new collateralizer_1.CollateralizerContract(collateralContractWeb3Contract, TX_DEFAULTS);
        const testContracts = {
            collateralizer: collateralizerContract,
            mockCollateralToken: mockToken,
            mockDebtRegistry,
            mockTokenRegistry,
            mockTokenTransferProxy,
            mockTermsContract,
        };
        const testAccounts = {
            ATTACKER,
            BENEFICIARY_1,
            BENEFICIARY_2,
            COLLATERALIZER,
            NON_COLLATERALIZER,
            MOCK_DEBT_KERNEL_ADDRESS,
            MOCK_TERMS_CONTRACT_ADDRESS,
        };
        // Grant the terms contract authorization to call the `collateralize` function.
        yield collateralizerContract.addAuthorizedCollateralizeAgent.sendTransactionAsync(mockTermsContract.address);
        // Grant the arbitrary MOCK_TERMS_CONTRACT_ADDRESS permission to act as a collateralizer.
        // Outside of a mocked unit-testing environment this would be the address of a terms contract.
        yield collateralizerContract.addAuthorizedCollateralizeAgent.sendTransactionAsync(MOCK_TERMS_CONTRACT_ADDRESS);
        // Initialize runners.
        collateralizeRunner.initialize(testContracts, testAccounts);
        returnCollateralRunner.initialize(testContracts, testAccounts);
        seizeCollateralRunner.initialize(testContracts, testAccounts);
        // Initialize ABI Decoder for deciphering log receipts
        ABIDecoder.addABI(collateralizerContract.abi);
    }));
    after(() => {
        ABIDecoder.removeABI(collateralizerContract.abi);
    });
    describe("Initialization", () => {
        it("points to the DebtKernel passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizerContract.debtKernelAddress.callAsync()).to.eventually.equal(MOCK_DEBT_KERNEL_ADDRESS);
        }));
        it("points to the DebtRegistry passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizerContract.debtRegistry.callAsync()).to.eventually.equal(mockDebtRegistry.address);
        }));
        it("points to the TokenRegistry passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(collateralizerContract.tokenRegistry.callAsync()).to.eventually.equal(mockTokenRegistry.address);
        }));
    });
    describe("Permissioning", () => {
        describe("#addAuthorizedCollateralizeAgent", () => {
            describe("non-owner adds collateralize agent", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(collateralizerContract.addAuthorizedCollateralizeAgent.sendTransactionAsync(AGENT, { from: ATTACKER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("owner adds collateralize agent", () => {
                let txHash;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield collateralizerContract.addAuthorizedCollateralizeAgent.sendTransactionAsync(AGENT, { from: CONTRACT_OWNER });
                }));
                it("adds specified agent to the set of authorized agents", () => __awaiter(this, void 0, void 0, function* () {
                    const authorizedAgents = yield collateralizerContract.getAuthorizedCollateralizeAgents.callAsync();
                    expect(authorizedAgents.includes(AGENT)).to.be.true;
                }));
                it("emits event broadcasting authorization of agent", () => __awaiter(this, void 0, void 0, function* () {
                    const expectedLogEntry = permissions_lib_1.Authorized(collateralizerContract.address, AGENT, "collateralizer");
                    const resultingLog = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.Authorized);
                    expect(resultingLog).to.deep.equal(expectedLogEntry);
                }));
            });
        });
        describe("#revokeCollateralizeAuthorization", () => {
            describe("non-owner revokes authorization for collateralize agent", () => {
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(collateralizerContract.revokeCollateralizeAuthorization.sendTransactionAsync(AGENT, { from: ATTACKER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
            describe("owner revokes authorization for collateralize agent", () => {
                let txHash;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    txHash = yield collateralizerContract.revokeCollateralizeAuthorization.sendTransactionAsync(AGENT);
                }));
                it("removes specified agent from set of authorized agents", () => __awaiter(this, void 0, void 0, function* () {
                    const authorizedAgents = yield collateralizerContract.getAuthorizedCollateralizeAgents.callAsync();
                    expect(authorizedAgents.includes(AGENT)).to.be.false;
                }));
                it("emits event broadcasting revoking authorization of agent", () => __awaiter(this, void 0, void 0, function* () {
                    const expectedLogEntry = permissions_lib_1.AuthorizationRevoked(collateralizerContract.address, AGENT, "collateralizer");
                    const resultingLog = yield log_utils_1.queryLogsForEvent(txHash, permissions_lib_1.EventNames.AuthorizationRevoked);
                    expect(resultingLog).to.deep.equal(expectedLogEntry);
                }));
            });
        });
    });
    describe("#unpackCollateralParametersFromBytes", () => {
        describe("it should unpack collateral parameters correctly", () => {
            it("Scenario #1", () => __awaiter(this, void 0, void 0, function* () {
                const packedParameters = NULL_PARAMETERS;
                const expectedUnpackedParameters = [0, 0, 0];
                const unpackedParameters = yield collateralizerContract.unpackCollateralParametersFromBytes.callAsync(packedParameters);
                expect(unpackedParameters[0]).to.bignumber.equal(expectedUnpackedParameters[0]);
                expect(unpackedParameters[1]).to.bignumber.equal(expectedUnpackedParameters[1]);
                expect(unpackedParameters[2]).to.bignumber.equal(expectedUnpackedParameters[2]);
            }));
            it("Scenario #2", () => __awaiter(this, void 0, void 0, function* () {
                const packedParameters = "0x0000000000000000000000000000000000000ff00000000de0b6b3a764000001";
                const expectedUnpackedParameters = [255, Units.ether(1), 1];
                const unpackedParameters = yield collateralizerContract.unpackCollateralParametersFromBytes.callAsync(packedParameters);
                expect(unpackedParameters[0]).to.bignumber.equal(expectedUnpackedParameters[0]);
                expect(unpackedParameters[1]).to.bignumber.equal(expectedUnpackedParameters[1]);
                expect(unpackedParameters[2]).to.bignumber.equal(expectedUnpackedParameters[2]);
            }));
            it("Scenario #3", () => __awaiter(this, void 0, void 0, function* () {
                const packedParameters = "0x00000abcd000000000000000000000000000012008060e0dbc5d6766800000ff";
                const expectedUnpackedParameters = [18, Units.ether(9700000), 255];
                const unpackedParameters = yield collateralizerContract.unpackCollateralParametersFromBytes.callAsync(packedParameters);
                expect(unpackedParameters[0]).to.bignumber.equal(expectedUnpackedParameters[0]);
                expect(unpackedParameters[1]).to.bignumber.equal(expectedUnpackedParameters[1]);
                expect(unpackedParameters[2]).to.bignumber.equal(expectedUnpackedParameters[2]);
            }));
        });
    });
    describe("#collateralize", () => {
        describe("Successful collateralization", () => {
            successful_collateralization_1.SUCCESSFUL_COLLATERALIZATION_SCENARIOS.forEach(collateralizeRunner.testScenario);
        });
        describe("Unsuccessful collateralization", () => {
            unsuccessful_collateralization_1.UNSUCCESSFUL_COLLATERALIZATION_SCENARIOS.forEach(collateralizeRunner.testScenario);
        });
    });
    describe("#returnCollateral", () => {
        describe("Successful collateral return", () => {
            successful_return_1.SUCCESSFUL_RETURN_SCENARIOS.forEach(returnCollateralRunner.testScenario);
        });
        describe("Unsuccessful collateral return", () => {
            unsuccessful_return_1.UNSUCCESSFUL_RETURN_SCENARIOS.forEach(returnCollateralRunner.testScenario);
        });
    });
    describe("#seizeCollateral", () => {
        describe("Unsuccessful Collateral Seizure", () => {
            unsuccessful_seizure_1.UNSUCCESSFUL_SEIZURE_SCENARIOS.forEach(seizeCollateralRunner.testScenario);
        });
        describe("Successful Collateral Seizure", () => {
            successful_seizure_1.SUCCESSFUL_SEIZURE_SCENARIOS.forEach(seizeCollateralRunner.testScenario);
        });
    });
}));
//# sourceMappingURL=collateralizer.js.map