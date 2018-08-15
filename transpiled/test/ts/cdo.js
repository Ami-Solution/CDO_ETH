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
const moment = require("moment");
const Units = require("./test_utils/units");
const debt_kernel_1 = require("../../types/generated/debt_kernel");
const debt_token_1 = require("../../types/generated/debt_token");
const dummy_token_1 = require("../../types/generated/dummy_token");
const token_registry_1 = require("../../types/generated/token_registry");
const repayment_router_1 = require("../../types/generated/repayment_router");
const simple_interest_terms_contract_1 = require("../../types/generated/simple_interest_terms_contract");
const token_transfer_proxy_1 = require("../../types/generated/token_transfer_proxy");
const bignumber_setup_1 = require("./test_utils/bignumber_setup");
const chai_setup_1 = require("./test_utils/chai_setup");
const terms_contract_parameters_1 = require("./factories/terms_contract_parameters");
const debt_order_factory_1 = require("./factories/debt_order_factory");
const c_d_o_factory_1 = require("../../types/generated/c_d_o_factory");
const cdo_1 = require("../../types/generated/cdo");
const tranche_token_1 = require("../../types/generated/tranche_token");
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
// Set up Chai
chai_setup_1.default.configure();
const expect = chai.expect;
// const simpleInterestTermsContract = artifacts.require("SimpleInterestTermsContract");
// const CDOFactory = artifacts.require("CDOFactory");
// const CDO = artifacts.require("CDO");
// const TrancheToken = artifacts.require("TrancheToken");
contract("Collateralized Debt Obligation", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    let repaymentRouter;
    let kernel;
    let debtToken;
    let principalToken;
    let termsContract;
    let tokenTransferProxy;
    let cdoFactory;
    let cdo;
    let trancheToken;
    let orderFactory;
    const CONTRACT_OWNER = ACCOUNTS[0];
    const DEBTOR_1 = ACCOUNTS[1];
    const DEBTOR_2 = ACCOUNTS[2];
    const DEBTOR_3 = ACCOUNTS[3];
    const DEBTORS = [DEBTOR_1, DEBTOR_2, DEBTOR_3];
    const CREDITOR_1 = ACCOUNTS[4];
    const CREDITOR_2 = ACCOUNTS[5];
    const CREDITOR_3 = ACCOUNTS[6];
    const CREDITORS = [CREDITOR_1, CREDITOR_2, CREDITOR_3];
    const PAYER = ACCOUNTS[7];
    const LOAN_AGGREGATOR = ACCOUNTS[9];
    const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    before(() => __awaiter(this, void 0, void 0, function* () {
        const dummyTokenRegistryContract = yield token_registry_1.TokenRegistryContract.deployed(web3, TX_DEFAULTS);
        const dummyREPTokenAddress = yield dummyTokenRegistryContract.getTokenAddressBySymbol.callAsync("REP");
        const dummyREPTokenIndex = yield dummyTokenRegistryContract.getTokenIndexBySymbol.callAsync("REP");
        principalToken = yield dummy_token_1.DummyTokenContract.at(dummyREPTokenAddress, web3, TX_DEFAULTS);
        kernel = yield debt_kernel_1.DebtKernelContract.deployed(web3, TX_DEFAULTS);
        debtToken = yield debt_token_1.DebtTokenContract.deployed(web3, TX_DEFAULTS);
        tokenTransferProxy = yield token_transfer_proxy_1.TokenTransferProxyContract.deployed(web3, TX_DEFAULTS);
        termsContract = yield simple_interest_terms_contract_1.SimpleInterestTermsContractContract.deployed(web3, TX_DEFAULTS);
        repaymentRouter = yield repayment_router_1.RepaymentRouterContract.deployed(web3, TX_DEFAULTS);
        cdoFactory = yield c_d_o_factory_1.CDOFactoryContract.deployed(web3, TX_DEFAULTS);
        trancheToken = yield tranche_token_1.TrancheTokenContract.deployed(web3, TX_DEFAULTS);
        yield principalToken.setBalance.sendTransactionAsync(CREDITOR_1, Units.ether(100));
        yield principalToken.setBalance.sendTransactionAsync(CREDITOR_2, Units.ether(100));
        yield principalToken.setBalance.sendTransactionAsync(CREDITOR_3, Units.ether(100));
        yield principalToken.approve.sendTransactionAsync(tokenTransferProxy.address, Units.ether(100), { from: DEBTOR_1 });
        yield principalToken.approve.sendTransactionAsync(tokenTransferProxy.address, Units.ether(100), { from: DEBTOR_2 });
        yield principalToken.approve.sendTransactionAsync(tokenTransferProxy.address, Units.ether(100), { from: DEBTOR_3 });
        yield principalToken.approve.sendTransactionAsync(tokenTransferProxy.address, Units.ether(100), { from: CREDITOR_1 });
        yield principalToken.approve.sendTransactionAsync(tokenTransferProxy.address, Units.ether(100), { from: CREDITOR_2 });
        yield principalToken.approve.sendTransactionAsync(tokenTransferProxy.address, Units.ether(100), { from: CREDITOR_3 });
        const termsContractParameters = terms_contract_parameters_1.SimpleInterestParameters.pack({
            principalTokenIndex: dummyREPTokenIndex,
            principalAmount: Units.ether(1),
            interestRateFixedPoint: Units.interestRateFixedPoint(2.5),
            amortizationUnitType: new bignumber_js_1.BigNumber(1),
            termLengthUnits: new bignumber_js_1.BigNumber(4),
        });
        const defaultOrderParams = {
            creditorFee: Units.ether(0),
            debtKernelContract: kernel.address,
            debtOrderVersion: kernel.address,
            debtTokenContract: debtToken.address,
            debtor: DEBTOR_1,
            debtorFee: Units.ether(0),
            expirationTimestampInSec: new bignumber_js_1.BigNumber(moment()
                .add(1, "days")
                .unix()),
            issuanceVersion: repaymentRouter.address,
            orderSignatories: { debtor: DEBTOR_1, creditor: CREDITOR_1 },
            principalAmount: Units.ether(1),
            principalTokenAddress: principalToken.address,
            relayer: NULL_ADDRESS,
            relayerFee: Units.ether(0),
            termsContract: termsContract.address,
            termsContractParameters,
            underwriter: NULL_ADDRESS,
            underwriterFee: Units.ether(0),
            underwriterRiskRating: Units.underwriterRiskRatingFixedPoint(0),
        };
        orderFactory = new debt_order_factory_1.DebtOrderFactory(defaultOrderParams);
        ABIDecoder.addABI(repaymentRouter.abi);
    }));
    after(() => {
        ABIDecoder.removeABI(repaymentRouter.abi);
    });
    describe("CDO Tests", () => {
        let signedDebtOrder;
        let agreementId;
        let receipt;
        before(() => __awaiter(this, void 0, void 0, function* () {
            // NOTE: For purposes of this assignment, we hard code a default principal + interest amount of 1.1 ether
            // If you're interested in how to vary this amount, poke around in the setup code above :)
            signedDebtOrder = yield orderFactory.generateDebtOrder({
                creditor: CREDITOR_2,
                debtor: DEBTOR_2,
                orderSignatories: { debtor: DEBTOR_2, creditor: CREDITOR_2 },
            });
            // The unique id we use to refer to the debt agreement is the hash of its associated issuance commitment.
            agreementId = signedDebtOrder.getIssuanceCommitment().getHash();
            // Creditor fills the signed debt order, creating a debt agreement with a unique associated debt token
            const txHash = yield kernel.fillDebtOrder.sendTransactionAsync(signedDebtOrder.getCreditor(), signedDebtOrder.getOrderAddresses(), signedDebtOrder.getOrderValues(), signedDebtOrder.getOrderBytes32(), signedDebtOrder.getSignaturesV(), signedDebtOrder.getSignaturesR(), signedDebtOrder.getSignaturesS());
            receipt = yield web3.eth.getTransactionReceipt(txHash);
        }));
        it("should issue creditor a unique debt token", () => __awaiter(this, void 0, void 0, function* () {
            yield expect(debtToken.ownerOf.callAsync(new bignumber_js_1.BigNumber(agreementId))).to.eventually.equal(CREDITOR_2);
        }));
        it("should allow debtor to make repayment", () => __awaiter(this, void 0, void 0, function* () {
            const creditorBalanceBefore = yield principalToken.balanceOf.callAsync(CREDITOR_2);
            yield repaymentRouter.repay.sendTransactionAsync(agreementId, Units.ether(1), // amount
            principalToken.address, // token type
            { from: DEBTOR_2 });
            yield expect(principalToken.balanceOf.callAsync(CREDITOR_2)).to.eventually.bignumber.equal(creditorBalanceBefore.plus(Units.ether(1)));
        }));
        it("should allow creditor to transfer debt token to different address", () => __awaiter(this, void 0, void 0, function* () {
            yield debtToken.transfer.sendTransactionAsync(CREDITOR_1, // to
            new bignumber_js_1.BigNumber(agreementId), // tokenId
            { from: CREDITOR_2 });
            yield expect(debtToken.ownerOf.callAsync(new bignumber_js_1.BigNumber(agreementId))).to.eventually.equal(CREDITOR_1);
        }));
        it("should allow creation of multiple debt agreements", () => __awaiter(this, void 0, void 0, function* () {
            let i;
            let agreementsIds;
            for (i = 0; i < DEBTORS.length; i++) {
                signedDebtOrder = yield orderFactory.generateDebtOrder({
                    creditor: CREDITORS[i],
                    debtor: DEBTORS[i],
                    orderSignatories: { debtor: DEBTORS[i], creditor: CREDITORS[i] },
                });
                // The unique id we use to refer to the debt agreement is the hash of its associated issuance commitment.
                agreementId = signedDebtOrder.getIssuanceCommitment().getHash();
                // Creditor fills the signed debt order, creating a debt agreement with a unique associated debt token
                const txHash = yield kernel.fillDebtOrder.sendTransactionAsync(signedDebtOrder.getCreditor(), signedDebtOrder.getOrderAddresses(), signedDebtOrder.getOrderValues(), signedDebtOrder.getOrderBytes32(), signedDebtOrder.getSignaturesV(), signedDebtOrder.getSignaturesR(), signedDebtOrder.getSignaturesS());
                receipt = yield web3.eth.getTransactionReceipt(txHash);
                yield expect(debtToken.ownerOf.callAsync(new bignumber_js_1.BigNumber(agreementId))).to.eventually.equal(CREDITORS[i]);
                //transfer debt tokens to a loan agreegator
                yield debtToken.transfer.sendTransactionAsync(LOAN_AGGREGATOR, // to
                new bignumber_js_1.BigNumber(agreementId), // tokenId
                { from: CREDITORS[i] });
            }
        }));
        // before(async () => {
        //     await 
        // });
        it("should allow a LOAN_AGGREGATOR to create a CDO via CDOFactory", () => __awaiter(this, void 0, void 0, function* () {
            const txHash = yield cdoFactory.createCDO.sendTransactionAsync(termsContract.address, trancheToken.address, principalToken.address, { from: LOAN_AGGREGATOR });
            // console.log("txHash: ", txHash);
            receipt = yield web3.eth.getTransactionReceipt(txHash);
            // console.log("receipt :", receipt);
            const _cdoAddress = yield cdoFactory.deployedCDOs.callAsync(new bignumber_js_1.BigNumber(0));
            console.log("cdo address: ", _cdoAddress);
            cdo = yield cdo_1.CDOContract.at(_cdoAddress, web3, TX_DEFAULTS);
            yield expect(cdo.creator.callAsync()).to.eventually.equal(LOAN_AGGREGATOR);
        }));
    });
}));
//# sourceMappingURL=cdo.js.map