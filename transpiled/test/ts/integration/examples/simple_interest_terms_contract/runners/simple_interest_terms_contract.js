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
// External libraries
const ABIDecoder = require("abi-decoder");
const _ = require("lodash");
const bignumber_js_1 = require("bignumber.js");
const Units = require("../../../../test_utils/units");
const moment = require("moment");
const dummy_token_1 = require("../../../../../../types/generated/dummy_token");
// Factories
const terms_contract_parameters_1 = require("../../../../factories/terms_contract_parameters");
const debt_order_factory_1 = require("../../../../factories/debt_order_factory");
// Utils
const web3_utils_1 = require("../../../../../../utils/web3_utils");
const DEFAULT_GAS_AMOUNT = 4712388;
class SimpleInterestTermsContractRunner {
    constructor(web3) {
        this.web3Utils = new web3_utils_1.Web3Utils(web3);
        this.testScenario = this.testScenario.bind(this);
    }
    initialize(testAccounts, testContracts) {
        this.accounts = testAccounts;
        this.contracts = testContracts;
    }
    getLogs(txHash, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield web3.eth.getTransactionReceipt(txHash);
            return _.find(ABIDecoder.decodeLogs(receipt.logs), { name: event });
        });
    }
    fillDebtOrder() {
        const { UNDERWRITER } = this.accounts;
        const { kernel } = this.contracts;
        const debtOrder = this.debtOrder;
        return kernel.fillDebtOrder.sendTransactionAsync(debtOrder.getCreditor(), debtOrder.getOrderAddresses(), debtOrder.getOrderValues(), debtOrder.getOrderBytes32(), debtOrder.getSignaturesV(), debtOrder.getSignaturesR(), debtOrder.getSignaturesS(), { from: UNDERWRITER });
    }
    setupDebtOrder(scenario) {
        return __awaiter(this, void 0, void 0, function* () {
            const { simpleInterestTermsContract, kernel, repaymentRouter, debtTokenContract, dummyREPToken, dummyTokenRegistryContract, } = this.contracts;
            const { DEBTOR_1, CREDITOR_1, UNDERWRITER, RELAYER } = this.accounts;
            const principalTokenIndex = yield dummyTokenRegistryContract.getTokenIndexBySymbol.callAsync("REP");
            const nonExistentTokenIndex = new bignumber_js_1.BigNumber(99);
            const termsContractParameters = terms_contract_parameters_1.SimpleInterestParameters.pack({
                principalTokenIndex: scenario.principalTokenInRegistry
                    ? principalTokenIndex
                    : nonExistentTokenIndex,
                principalAmount: scenario.principalAmount,
                interestRateFixedPoint: scenario.interestRateFixedPoint,
                amortizationUnitType: scenario.amortizationUnitType,
                termLengthUnits: scenario.termLengthUnits,
            });
            const latestBlockTime = yield this.web3Utils.getLatestBlockTime();
            const defaultOrderParams = {
                creditor: CREDITOR_1,
                creditorFee: Units.ether(0.002),
                debtKernelContract: kernel.address,
                debtOrderVersion: kernel.address,
                debtTokenContract: debtTokenContract.address,
                debtor: DEBTOR_1,
                debtorFee: Units.ether(0.001),
                expirationTimestampInSec: new bignumber_js_1.BigNumber(moment
                    .unix(latestBlockTime)
                    .add(30, "days")
                    .unix()),
                issuanceVersion: repaymentRouter.address,
                orderSignatories: { debtor: DEBTOR_1, creditor: CREDITOR_1, underwriter: UNDERWRITER },
                principalAmount: scenario.principalAmount,
                principalTokenAddress: dummyREPToken.address,
                relayer: RELAYER,
                relayerFee: Units.ether(0.0015),
                termsContract: simpleInterestTermsContract.address,
                termsContractParameters,
                underwriter: UNDERWRITER,
                underwriterFee: Units.ether(0.0015),
                underwriterRiskRating: Units.underwriterRiskRatingFixedPoint(1.35),
            };
            const orderFactory = new debt_order_factory_1.DebtOrderFactory(defaultOrderParams);
            const debtOrder = yield orderFactory.generateDebtOrder();
            const agreementId = debtOrder.getIssuanceCommitment().getHash();
            this.debtOrder = debtOrder;
            this.agreementId = agreementId;
            yield this.setBalances();
        });
    }
    setBalances() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokenTransferProxy } = this.contracts;
            const { CONTRACT_OWNER } = this.accounts;
            const debtOrder = this.debtOrder;
            const token = yield dummy_token_1.DummyTokenContract.at(debtOrder.getPrincipalTokenAddress(), web3, {
                from: CONTRACT_OWNER,
                gas: DEFAULT_GAS_AMOUNT,
            });
            const debtor = debtOrder.getDebtor();
            const creditor = debtOrder.getCreditor();
            yield token.setBalance.sendTransactionAsync(debtor, new bignumber_js_1.BigNumber(0), {
                from: CONTRACT_OWNER,
            });
            yield token.approve.sendTransactionAsync(tokenTransferProxy.address, new bignumber_js_1.BigNumber(0), {
                from: debtor,
            });
            const creditorBalanceAndAllowance = debtOrder
                .getPrincipalAmount()
                .plus(debtOrder.getCreditorFee());
            yield token.setBalance.sendTransactionAsync(creditor, creditorBalanceAndAllowance, {
                from: CONTRACT_OWNER,
            });
            yield token.approve.sendTransactionAsync(tokenTransferProxy.address, creditorBalanceAndAllowance, { from: creditor });
        });
    }
}
exports.SimpleInterestTermsContractRunner = SimpleInterestTermsContractRunner;
//# sourceMappingURL=simple_interest_terms_contract.js.map