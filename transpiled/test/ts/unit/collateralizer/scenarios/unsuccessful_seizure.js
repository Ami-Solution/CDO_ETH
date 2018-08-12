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
// external
const bignumber_js_1 = require("bignumber.js");
const moment = require("moment");
const _ = require("lodash");
// utils
const Units = require("../../../test_utils/units");
const defaultArgs = {
    collateralAmount: Units.ether(1),
    gracePeriodInDays: new bignumber_js_1.BigNumber(7),
    valueRepaidToDate: Units.ether(0.5).minus(1),
    expectedRepaymentValueSchedule: [
        {
            timestamp: (latestBlockTime) => moment
                .unix(latestBlockTime)
                .subtract(8, "days")
                .unix(),
            expectedRepaymentValue: Units.ether(0.5),
        },
    ],
    termsContract: (collateralizedContract, attacker) => collateralizedContract,
    beneficiary: (originalBeneficiary, other) => originalBeneficiary,
    from: (beneficiary, other) => beneficiary,
    debtAgreementExists: true,
    debtAgreementCollateralized: true,
    validTermsContract: true,
    succeeds: false,
};
exports.UNSUCCESSFUL_SEIZURE_SCENARIOS = [
    Object.assign({ description: "Debt agreement does not exist" }, defaultArgs, { debtAgreementExists: false, agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #0") }),
    Object.assign({ description: "Debt agreement does not point to collateralized terms contract" }, defaultArgs, { termsContract: (collateralizedContract, attacker) => attacker, validTermsContract: false, agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #1") }),
    Object.assign({ description: "Debt agreement points to collateralized terms contract but was never itself collateralized" }, defaultArgs, { debtAgreementCollateralized: false, agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #2") }),
    Object.assign({ description: "(Grace Period = 0 Days) Debt is not currently in state of default" }, defaultArgs, { valueRepaidToDate: _.last(defaultArgs.expectedRepaymentValueSchedule)
            .expectedRepaymentValue, gracePeriodInDays: new bignumber_js_1.BigNumber(0), agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #3") }),
    Object.assign({ description: "(Grace Period = 7 Days) Debt is not currently in state of default" }, defaultArgs, { valueRepaidToDate: _.last(defaultArgs.expectedRepaymentValueSchedule)
            .expectedRepaymentValue, agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #4") }),
    Object.assign({ description: "(Grace Period = 7 Days) Debt is currently in default, but grace period has not elapsed" }, defaultArgs, { expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(6, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #5") }),
    Object.assign({ description: "(Grace Period = 90 Days) Debt is not currently in state of default" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(90), valueRepaidToDate: Units.ether(0.5), agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #6") }),
    Object.assign({ description: "(Grace Period = 90 Days) Debt is currently in default, but grace period has not elapsed" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(90), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(89, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #7") }),
    Object.assign({ description: "Collateral has already been seized" }, defaultArgs, { before: (collateralizerContract) => __awaiter(this, void 0, void 0, function* () {
            yield collateralizerContract.seizeCollateral.sendTransactionAsync(web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #8"));
        }), agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #8") }),
    Object.assign({ description: "Collateral has already been returned" }, defaultArgs, { valueRepaidToDate: Units.ether(0.5), before: (collateralizerContract, termsContract) => __awaiter(this, void 0, void 0, function* () {
            const agreementId = web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #9");
            // Mock the debt term's ending timestamp as having lapsed so that we can return collateral
            yield termsContract.mockTermEndTimestamp.sendTransactionAsync(agreementId, new bignumber_js_1.BigNumber(0));
            yield collateralizerContract.returnCollateral.sendTransactionAsync(agreementId);
        }), agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #9") }),
    Object.assign({ description: "Expected repayment and value repaid to date both at 0" }, defaultArgs, { expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(6, "days")
                    .unix(),
                expectedRepaymentValue: new bignumber_js_1.BigNumber(0),
            },
        ], valueRepaidToDate: new bignumber_js_1.BigNumber(0), agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful seizure scenario #10") }),
];
//# sourceMappingURL=unsuccessful_seizure.js.map