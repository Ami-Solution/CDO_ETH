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
const chai = require("chai");
const Units = require("../test_utils/units");
const ABIDecoder = require("abi-decoder");
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const moment = require("moment");
// Wrappers
const repayment_router_1 = require("../../../types/generated/repayment_router");
const simple_interest_terms_contract_1 = require("../../../types/generated/simple_interest_terms_contract");
const mock_debt_registry_1 = require("../../../types/generated/mock_debt_registry");
const mock_e_r_c20_token_1 = require("../../../types/generated/mock_e_r_c20_token");
const mock_token_transfer_proxy_1 = require("../../../types/generated/mock_token_transfer_proxy");
const mock_token_registry_1 = require("../../../types/generated/mock_token_registry");
const contract_registry_1 = require("../../../types/generated/contract_registry");
// Test Utils
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
const constants_1 = require("../test_utils/constants");
const simple_interest_terms_contract_2 = require("../logs/simple_interest_terms_contract");
const terms_contract_parameters_1 = require("../factories/terms_contract_parameters");
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
const repaymentRouterContract = artifacts.require("RepaymentRouter");
const simpleInterestTermsContract = artifacts.require("SimpleInterestTermsContract");
const mockTokenContract = artifacts.require("MockERC20Token");
const contractRegistryArtifact = artifacts.require("ContractRegistry");
contract("SimpleInterestTermsContract (Unit Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    let termsContract;
    let router;
    let mockToken;
    let mockRegistry;
    let mockTokenTransferProxy;
    let mockTokenRegistry;
    let contractRegistry;
    const CONTRACT_OWNER = ACCOUNTS[0];
    const DEBTOR = ACCOUNTS[1];
    const PAYER = ACCOUNTS[2];
    const BENEFICIARY = ACCOUNTS[3];
    const MOCK_DEBT_KERNEL_ADDRESS = ACCOUNTS[4];
    const MOCK_DEBT_TOKEN_ADDRESS = ACCOUNTS[5];
    const MOCK_COLLATERALIZER_ADDRESS = ACCOUNTS[6];
    const ATTACKER = ACCOUNTS[7];
    const TERMS_CONTRACT_PARAMETERS = web3.sha3("any 32 byte hex value can represent the terms contract's parameters");
    const ARBITRARY_AGREEMENT_ID = web3.sha3("any 32 byte hex value can represent an agreement id");
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    before(() => __awaiter(this, void 0, void 0, function* () {
        mockRegistry = yield mock_debt_registry_1.MockDebtRegistryContract.deployed(web3, TX_DEFAULTS);
        mockToken = yield mock_e_r_c20_token_1.MockERC20TokenContract.deployed(web3, TX_DEFAULTS);
        mockTokenTransferProxy = yield mock_token_transfer_proxy_1.MockTokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        mockTokenRegistry = yield mock_token_registry_1.MockTokenRegistryContract.deployed(web3, TX_DEFAULTS);
        const repaymentRouterTruffle = yield repaymentRouterContract.new(mockRegistry.address, mockTokenTransferProxy.address);
        const contractRegistryTruffle = yield contractRegistryArtifact.new(MOCK_COLLATERALIZER_ADDRESS, MOCK_DEBT_KERNEL_ADDRESS, mockRegistry.address, MOCK_DEBT_TOKEN_ADDRESS, repaymentRouterTruffle.address, mockTokenRegistry.address, mockTokenTransferProxy.address, { from: CONTRACT_OWNER });
        const termsContractTruffle = yield simpleInterestTermsContract.new(contractRegistryTruffle.address);
        // The typings we use ingest vanilla Web3 contracts, so we convert the
        // contract instance deployed by truffle into a Web3 contract instance
        const repaymentRouterWeb3Contract = web3.eth
            .contract(repaymentRouterTruffle.abi)
            .at(repaymentRouterTruffle.address);
        const termsContractWeb3Contract = web3.eth
            .contract(simpleInterestTermsContract.abi)
            .at(termsContractTruffle.address);
        const contractRegistryAsWeb3Contract = web3.eth
            .contract(contractRegistryArtifact.abi)
            .at(contractRegistryTruffle.address);
        router = new repayment_router_1.RepaymentRouterContract(repaymentRouterWeb3Contract, TX_DEFAULTS);
        termsContract = new simple_interest_terms_contract_1.SimpleInterestTermsContractContract(termsContractWeb3Contract, TX_DEFAULTS);
        contractRegistry = new contract_registry_1.ContractRegistryContract(contractRegistryAsWeb3Contract, TX_DEFAULTS);
        // PAYER begins with a balance of 5 ether.
        yield mockToken.mockBalanceOfFor.sendTransactionAsync(PAYER, Units.ether(5));
        // TransferProxy is granted an allowance of 3 ether from PAYER.
        yield mockToken.mockAllowanceFor.sendTransactionAsync(PAYER, mockTokenTransferProxy.address, Units.ether(3));
        ABIDecoder.addABI(termsContract.abi);
    }));
    after(() => {
        ABIDecoder.removeABI(termsContract.abi);
    });
    describe("Initialization", () => {
        it("points to the Contract Registry passed in through the constructor", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(termsContract.contractRegistry.callAsync()).to.eventually.equal(contractRegistry.address);
        }));
    });
    describe("#registerTermStart", () => __awaiter(this, void 0, void 0, function* () {
        describe("agent who is not DebtKernel calls registerTermStart", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(termsContract.registerTermStart.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, DEBTOR, {
                    from: ATTACKER,
                })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("agent who is DebtKernel calls registerTermStart", () => {
            const principalTokenIndex = new bignumber_js_1.BigNumber(8); // token at index 8
            const principalAmount = Units.ether(1); // 1 ether.
            const interestRateFixedPoint = Units.interestRateFixedPoint(2.5); // 2.5% interest rate.
            const amortizationUnitType = new bignumber_js_1.BigNumber(2); // unit code for weeks.
            const termLengthUnits = new bignumber_js_1.BigNumber(4); // term is for 4 weeks.
            const termsParams = terms_contract_parameters_1.SimpleInterestParameters.pack({
                principalTokenIndex,
                principalAmount,
                interestRateFixedPoint,
                amortizationUnitType,
                termLengthUnits,
            });
            describe("agreement refers to different terms contract", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield mockRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, NULL_ADDRESS, // NOT the terms contract's address
                    termsParams);
                    yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(principalTokenIndex, mockToken.address);
                }));
                it("should not emit log indicating success", () => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield termsContract.registerTermStart.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, DEBTOR, {
                        from: MOCK_DEBT_KERNEL_ADDRESS,
                    });
                    const receipt = yield web3.eth.getTransactionReceipt(txHash);
                    expect(_.compact(ABIDecoder.decodeLogs(receipt.logs))).to.be.empty;
                }));
            });
            describe("terms contract parameters are invalid", () => {
                describe("token at principalTokenIndex is undefined in registry", () => {
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        yield mockRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address, termsParams);
                        yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(principalTokenIndex, NULL_ADDRESS);
                    }));
                    it("should not emit log indicating success", () => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield termsContract.registerTermStart.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, DEBTOR, {
                            from: MOCK_DEBT_KERNEL_ADDRESS,
                        });
                        const receipt = yield web3.eth.getTransactionReceipt(txHash);
                        expect(_.compact(ABIDecoder.decodeLogs(receipt.logs))).to.be.empty;
                    }));
                });
                describe("amortizationUnitType is not a valid value", () => {
                    before(() => __awaiter(this, void 0, void 0, function* () {
                        const invalidTermsParams = terms_contract_parameters_1.SimpleInterestParameters.pack({
                            principalTokenIndex,
                            principalAmount,
                            interestRateFixedPoint,
                            // Invalid value for the amortizationUnitType
                            amortizationUnitType: new bignumber_js_1.BigNumber(5),
                            termLengthUnits,
                        });
                        yield mockRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address, invalidTermsParams);
                        yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(principalTokenIndex, mockToken.address);
                    }));
                    it("should not emit log indicating success", () => __awaiter(this, void 0, void 0, function* () {
                        const txHash = yield termsContract.registerTermStart.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, DEBTOR, {
                            from: MOCK_DEBT_KERNEL_ADDRESS,
                        });
                        const receipt = yield web3.eth.getTransactionReceipt(txHash);
                        expect(_.compact(ABIDecoder.decodeLogs(receipt.logs))).to.be.empty;
                    }));
                });
            });
            describe("Terms are valid for SimpleInterestTermsContract", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield mockRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address, termsParams);
                    yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(principalTokenIndex, mockToken.address);
                }));
                it("should emit log indicating success", () => __awaiter(this, void 0, void 0, function* () {
                    const txHash = yield termsContract.registerTermStart.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, DEBTOR, {
                        from: MOCK_DEBT_KERNEL_ADDRESS,
                    });
                    const receipt = yield web3.eth.getTransactionReceipt(txHash);
                    const [logTermStart] = _.compact(ABIDecoder.decodeLogs(receipt.logs));
                    expect(logTermStart).to.deep.equal(simple_interest_terms_contract_2.LogSimpleInterestTermStart(termsContract.address, ARBITRARY_AGREEMENT_ID, mockToken.address, principalAmount, interestRateFixedPoint, amortizationUnitType, termLengthUnits));
                }));
            });
        });
    }));
    describe("#registerRepayment", () => {
        describe("agent who is not RepaymentRouter calls registerRepayment", () => {
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(termsContract.registerRepayment.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, PAYER, BENEFICIARY, Units.ether(1), mockToken.address, { from: ATTACKER })).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("RepaymentRouter calls registerRepayment", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                const principalTokenIndex = new bignumber_js_1.BigNumber(0);
                const principalAmount = Units.ether(1);
                const interestRateFixedPoint = Units.interestRateFixedPoint(1);
                const amortizationUnitType = new bignumber_js_1.BigNumber(0);
                const termLengthUnits = new bignumber_js_1.BigNumber(3);
                const termsContractParameters = terms_contract_parameters_1.SimpleInterestParameters.pack({
                    principalTokenIndex,
                    principalAmount,
                    interestRateFixedPoint,
                    amortizationUnitType,
                    termLengthUnits,
                });
                yield mockRegistry.mockGetBeneficiaryReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, BENEFICIARY);
                yield mockRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address, termsContractParameters);
                yield mockRegistry.mockGetTermsContractReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address);
                yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(new bignumber_js_1.BigNumber(0), mockToken.address);
            }));
            describe("...with a different `tokenAddress` than expected by the terms contract", () => {
                let dummyToken;
                before(() => __awaiter(this, void 0, void 0, function* () {
                    const mockTokenContractTruffle = yield mockTokenContract.new();
                    const mockTokenContractWeb3 = web3.eth
                        .contract(mockTokenContractTruffle.abi)
                        .at(mockTokenContractTruffle.address);
                    dummyToken = new mock_e_r_c20_token_1.MockERC20TokenContract(mockTokenContractWeb3, TX_DEFAULTS);
                    yield router.repay.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, Units.ether(10), dummyToken.address);
                }));
                it("should not record the repayment", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getValueRepaidToDate.callAsync(ARBITRARY_AGREEMENT_ID)).to.eventually.bignumber.equal(Units.ether(0));
                }));
            });
            describe("...with terms contract's expected `tokenAddress`", () => {
                const AMOUNT = Units.ether(1);
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield router.repay.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, AMOUNT, mockToken.address, // this is the address it's expecting.
                    { from: PAYER });
                }));
                it("should record the repayment", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getValueRepaidToDate.callAsync(ARBITRARY_AGREEMENT_ID)).to.eventually.bignumber.equal(AMOUNT);
                }));
            });
        });
    });
    describe("#getValueRepaidToDate", () => {
        describe("non-existent debt agreement", () => {
            const NON_EXISTENT_AGREEMENT_ID = web3.sha3("this agreement id doesn't exist!");
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield mockRegistry.mockGetBeneficiaryReturnValueFor.sendTransactionAsync(NON_EXISTENT_AGREEMENT_ID, NULL_ADDRESS);
                yield router.repay.sendTransactionAsync(NON_EXISTENT_AGREEMENT_ID, Units.ether(1), mockToken.address);
            }));
            it("should not register any repayment", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(termsContract.getValueRepaidToDate.callAsync(NON_EXISTENT_AGREEMENT_ID)).to.eventually.bignumber.equal(Units.ether(0));
            }));
        });
        describe("extant debt agreement", () => {
            const EXTANT_AGREEMENT_ID = web3.sha3("this agreement id exists!");
            const principalTokenIndex = new bignumber_js_1.BigNumber(2); // token at index 2 of token registry.
            const principalAmount = Units.ether(100); // 100 ether.
            const interestRate = 1.0; // 1% interest rate (decimal)
            const interestRateFixedPoint = Units.interestRateFixedPoint(interestRate); // 1% interest rate (fixed point)
            const amortizationUnitType = new bignumber_js_1.BigNumber(2); // unit code for weeks.
            const termLengthUnits = new bignumber_js_1.BigNumber(10); // term is for 10 weeks.
            const inputParamsAsHex = terms_contract_parameters_1.SimpleInterestParameters.pack({
                principalTokenIndex,
                principalAmount,
                interestRateFixedPoint,
                amortizationUnitType,
                termLengthUnits,
            });
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield mockRegistry.mockGetBeneficiaryReturnValueFor.sendTransactionAsync(EXTANT_AGREEMENT_ID, BENEFICIARY);
                yield mockRegistry.mockGetTermsReturnValueFor.sendTransactionAsync(EXTANT_AGREEMENT_ID, termsContract.address, inputParamsAsHex);
                yield mockRegistry.mockGetTermsContractReturnValueFor.sendTransactionAsync(EXTANT_AGREEMENT_ID, termsContract.address);
                yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(new bignumber_js_1.BigNumber(2), mockToken.address);
            }));
            describe("at time N, PAYER has made an initial payment of 1 ether", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield router.repay.sendTransactionAsync(EXTANT_AGREEMENT_ID, Units.ether(1), mockToken.address, { from: PAYER });
                }));
                it("returns 1 ether", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getValueRepaidToDate.callAsync(EXTANT_AGREEMENT_ID)).to.eventually.bignumber.equal(Units.ether(1));
                }));
            });
            describe("at time M, PAYER has made an additional payment of 1 ether", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield router.repay.sendTransactionAsync(EXTANT_AGREEMENT_ID, Units.ether(1), mockToken.address, { from: PAYER });
                }));
                it("returns 2 ether", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getValueRepaidToDate.callAsync(EXTANT_AGREEMENT_ID)).to.eventually.bignumber.equal(Units.ether(2));
                }));
            });
        });
    });
    describe("#unpackParametersFromBytes", () => {
        const principalTokenIndex = new bignumber_js_1.BigNumber(6); // token at index 6 of token registry.
        const principalAmount = Units.ether(200); // 200 ether.
        const interestRateFixedPoint = Units.interestRateFixedPoint(1.5); // 1.5% interest rate (fixed point).
        const amortizationUnitType = new bignumber_js_1.BigNumber(4); // unit code for years.
        const termLengthUnits = new bignumber_js_1.BigNumber(10); // term is for 10 years.
        const inputParamsAsHex = terms_contract_parameters_1.SimpleInterestParameters.pack({
            principalTokenIndex,
            principalAmount,
            interestRateFixedPoint,
            amortizationUnitType,
            termLengthUnits,
        });
        it("correctly unpacks parameters into their respective types given raw byte data", () => __awaiter(this, void 0, void 0, function* () {
            const [unpackedPrincipalTokenIndex, unpackedPrincipalAmount, unpackedFixedPointInterestRate, unpackedAmortizationUnitType, unpackedTermLength,] = yield termsContract.unpackParametersFromBytes.callAsync(inputParamsAsHex);
            expect(unpackedPrincipalTokenIndex).to.bignumber.equal(principalTokenIndex);
            expect(unpackedPrincipalAmount).to.bignumber.equal(principalAmount);
            expect(unpackedFixedPointInterestRate).to.bignumber.equal(interestRateFixedPoint);
            expect(unpackedAmortizationUnitType).to.bignumber.equal(amortizationUnitType);
            expect(unpackedTermLength).to.bignumber.equal(termLengthUnits);
        }));
    });
    describe("#getExpectedRepaymentValue", () => {
        describe("when termsContract associated w/ debt agreement is not `this`", () => {
            before(() => __awaiter(this, void 0, void 0, function* () {
                yield mockRegistry.mockGetTermsContractReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, ATTACKER);
            }));
            it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(moment().unix()))).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
            }));
        });
        describe("when termsContractParameters associated w/ debt agreement malformed", () => {
            const principalTokenIndex = new bignumber_js_1.BigNumber(0);
            const principalAmount = Units.ether(10);
            const interestRateFixedPoint = Units.interestRateFixedPoint(1);
            const amortizationUnitType = new bignumber_js_1.BigNumber(10); // invalid unit code.
            const termLengthUnits = new bignumber_js_1.BigNumber(10);
            const invalidTermsParams = terms_contract_parameters_1.SimpleInterestParameters.pack({
                principalTokenIndex,
                principalAmount,
                interestRateFixedPoint,
                amortizationUnitType,
                termLengthUnits,
            });
            describe("amortizationUnitType is not one of the valid types", () => {
                before(() => __awaiter(this, void 0, void 0, function* () {
                    yield mockRegistry.mockGetTermsContractReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address);
                    yield mockRegistry.mockGetTermsContractParameters.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, invalidTermsParams);
                    yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(principalTokenIndex, mockToken.address);
                }));
                it("should throw", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(moment().unix()))).to.eventually.be.rejectedWith(constants_1.REVERT_ERROR);
                }));
            });
        });
        describe("when termsContractParameters associated w/ debt agreement are well-formed", () => {
            /*
            The params define a simple interest contract with the below valid terms:
              - Principal: 12 ether
              - Interest rate: 1%
              - Amortization Unit Type: year
              - Term length: 3
            */
            const principalTokenIndex = new bignumber_js_1.BigNumber(0); // arbitrary index for principal token in registry
            const principalAmount = Units.ether(12); // 12 ether principal.
            const interestRateDecimalPercentage = 1; // 1% interest rate (decimal percentage).
            const interestRateFixedPoint = Units.interestRateFixedPoint(1); // 1% interest rate (fixed point).
            const amortizationUnitType = new bignumber_js_1.BigNumber(4); // unit code for years.
            const termLengthUnits = new bignumber_js_1.BigNumber(3); // term is three years.
            const validTermsParams = terms_contract_parameters_1.SimpleInterestParameters.pack({
                principalTokenIndex,
                principalAmount,
                interestRateFixedPoint,
                amortizationUnitType,
                termLengthUnits,
            });
            const PERCENTAGE_SCALING_FACTOR = 100;
            const ORIGIN_MOMENT = moment();
            const BLOCK_ISSUANCE_TIMESTAMP = ORIGIN_MOMENT.unix();
            const ZERO_AMOUNT = Units.ether(0);
            let INSTALLMENT_AMOUNT;
            let FULL_AMOUNT;
            before(() => __awaiter(this, void 0, void 0, function* () {
                const TOTAL_INTEREST = principalAmount
                    .mul(interestRateDecimalPercentage)
                    .div(PERCENTAGE_SCALING_FACTOR);
                FULL_AMOUNT = principalAmount.add(TOTAL_INTEREST);
                INSTALLMENT_AMOUNT = FULL_AMOUNT.div(termLengthUnits);
                yield mockRegistry.mockGetTermsContractReturnValueFor.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, termsContract.address);
                yield mockRegistry.mockGetTermsContractParameters.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, validTermsParams);
                yield mockRegistry.mockGetIssuanceBlockTimestamp.sendTransactionAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(BLOCK_ISSUANCE_TIMESTAMP));
                yield mockTokenRegistry.mockGetTokenAddressByIndex.sendTransactionAsync(principalTokenIndex, mockToken.address);
            }));
            describe("timestamps that occur BEFORE the block issuance's timestamp", () => {
                const ONE_YEAR_BEFORE = moment(ORIGIN_MOMENT)
                    .subtract(1, "year")
                    .unix(); // zero-amount
                const ONE_DAY_BEFORE = moment(ORIGIN_MOMENT)
                    .subtract(1, "day")
                    .unix(); // zero-amount
                it("should return an expected value of 0", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(ONE_YEAR_BEFORE))).to.eventually.bignumber.equal(ZERO_AMOUNT);
                }));
                it("should return an expected value of 0", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(ONE_DAY_BEFORE))).to.eventually.bignumber.equal(ZERO_AMOUNT);
                }));
            });
            describe("timestamps that occur DURING the issuance's term length", () => {
                const SIXTEEN_DAYS_AFTER = moment(ORIGIN_MOMENT)
                    .add(16, "days")
                    .unix(); // zero-amount
                const ONE_YEAR_AFTER = moment(ORIGIN_MOMENT)
                    .add(1, "year")
                    .unix(); // one-installment
                const TWO_YEARS_AFTER = moment(ORIGIN_MOMENT)
                    .add(2, "years")
                    .unix(); // two-installments
                const TWO_PLUS_YEARS_AFTER = moment(ORIGIN_MOMENT)
                    .add(2, "years")
                    .add(4, "months")
                    .unix(); // two-installments
                const THREE_YEARS_AFTER = moment(ORIGIN_MOMENT)
                    .add(3, "years")
                    .unix(); // full-amount
                it("should return an expected value of 0", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(SIXTEEN_DAYS_AFTER))).to.eventually.bignumber.equal(ZERO_AMOUNT);
                }));
                it("should return an expected value equivalent to one installment", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(ONE_YEAR_AFTER))).to.eventually.bignumber.equal(INSTALLMENT_AMOUNT);
                }));
                it("should return an expected value equivalent to two installments", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(TWO_YEARS_AFTER))).to.eventually.bignumber.equal(INSTALLMENT_AMOUNT.mul(2));
                }));
                it("should return an expected value equivalent to two installments", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(TWO_PLUS_YEARS_AFTER))).to.eventually.bignumber.equal(INSTALLMENT_AMOUNT.mul(2));
                }));
                it("should return the full amount of the principal plus interest", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(THREE_YEARS_AFTER))).to.eventually.bignumber.equal(FULL_AMOUNT);
                }));
            });
            describe("timestamps that occur AFTER the issuance's full term has elapsed", () => {
                const ONE_DAY_AFTER_EXPIRATION = moment(ORIGIN_MOMENT)
                    .add(3, "years")
                    .add(1, "day")
                    .unix(); // full-amount
                const FOUR_YEARS_AFTER = moment(ORIGIN_MOMENT)
                    .add(4, "years")
                    .unix(); // full-amount
                it("should return the full amount of the principal plus interest", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(ONE_DAY_AFTER_EXPIRATION))).to.eventually.bignumber.equal(FULL_AMOUNT);
                }));
                it("should return the full amount of the principal plus interest", () => __awaiter(this, void 0, void 0, function* () {
                    yield expect(termsContract.getExpectedRepaymentValue.callAsync(ARBITRARY_AGREEMENT_ID, new bignumber_js_1.BigNumber(FOUR_YEARS_AFTER))).to.eventually.bignumber.equal(FULL_AMOUNT);
                }));
            });
        });
    });
}));
//# sourceMappingURL=simple_interest_terms_contract.js.map