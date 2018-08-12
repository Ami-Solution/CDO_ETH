"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const bignumber_js_1 = require("bignumber.js");
const moment = require("moment");
// utils
const Units = require("../../../test_utils/units");
const defaultArgs = {
    collateralAmount: Units.ether(1),
    gracePeriodInDays: new bignumber_js_1.BigNumber(7),
    valueRepaidToDate: Units.ether(0),
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
    succeeds: true,
};
exports.SUCCESSFUL_SEIZURE_SCENARIOS = [
    Object.assign({ description: "(Grace Period = 0 Days) Debt entered default > grace period's length ago, no repayments since" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(0), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(1, "hours")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #1") }),
    Object.assign({ description: "(Grace Period = 0 Days) Debt entered default > grace period's length ago, from non-beneficiary" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(0), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(1, "hours")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], from: (beneficiary, other) => other, agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #2") }),
    Object.assign({ description: "(Grace Period = 0 Days) Debt entered default > grace period's length ago, insufficient repayment since" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(0), valueRepaidToDate: Units.ether(0.5).minus(1), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(1, "hours")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #3") }),
    Object.assign({ description: "(Grace Period = 7 Days) Debt entered default > grace period's length ago, no repayments since" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(7), agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #4") }),
    Object.assign({ description: "(Grace Period = 7 Days) Debt entered default > grace period's length ago, from non-beneficiary" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(7), from: (beneficiary, other) => other, agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #5") }),
    Object.assign({ description: "(Grace Period = 7 Days) Debt entered default > grace period's length ago, insufficient repayments since" }, defaultArgs, { valueRepaidToDate: Units.ether(0.5).minus(1), gracePeriodInDays: new bignumber_js_1.BigNumber(7), agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #6") }),
    Object.assign({ description: "(Grace Period = 90 Days) Debt entered default > grace period's length ago, no repayments since" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(90), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(91, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #7") }),
    Object.assign({ description: "(Grace Period = 90 Days) Debt entered default > grace period's length ago, from non-beneficiary" }, defaultArgs, { gracePeriodInDays: new bignumber_js_1.BigNumber(90), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(91, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], from: (beneficiary, other) => other, agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #8") }),
    Object.assign({ description: "(Grace Period = 90 Days) Debt entered default > grace period's length ago, insufficient repayments since" }, defaultArgs, { valueRepaidToDate: Units.ether(0.5).minus(1), gracePeriodInDays: new bignumber_js_1.BigNumber(90), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(91, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
        ], agreementId: web3.sha3("Arbitrary 32 byte id for successful seizure scenario #9") }),
];
//# sourceMappingURL=successful_seizure.js.map