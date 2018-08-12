"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const bignumber_js_1 = require("bignumber.js");
const moment = require("moment");
// utils
const Units = require("../../../test_utils/units");
const defaultArgs = {
    succeeds: true,
    debtAgreementExists: true,
    debtAgreementCollateralized: true,
    termsContract: (collateralizedContract, attacker) => collateralizedContract,
    // Some time past the last date in the repayment schedule.
    termEndTimestamp: (latestBlockTime) => moment
        .unix(latestBlockTime)
        .subtract(5, "days")
        .unix(),
};
exports.SUCCESSFUL_RETURN_SCENARIOS = [
    Object.assign({ description: "Debt's term has lapsed and debt has been repaid" }, defaultArgs, { collateralAmount: Units.ether(3), gracePeriodInDays: new bignumber_js_1.BigNumber(7), valueRepaidToDate: Units.ether(1), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(14, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(0.5),
            },
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(7, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(1),
            },
        ], from: (collateralizer, other) => collateralizer, agreementId: web3.sha3("Arbitrary 32 byte string for successful return scenario #1") }),
    Object.assign({ description: "Debt's term has lapsed and debt has been more than repaid, called by non-collateralizer" }, defaultArgs, { collateralAmount: Units.ether(0.5), gracePeriodInDays: new bignumber_js_1.BigNumber(3), valueRepaidToDate: Units.ether(3), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .subtract(7, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(2),
            },
        ], from: (collateralizer, other) => other, agreementId: web3.sha3("Arbitrary 32 byte string for successful return scenario #2") }),
    Object.assign({ description: "Debt's term has not yet lapsed, and debt has been fully repaid, called by non-collateralizer" }, defaultArgs, { collateralAmount: Units.ether(0.5), gracePeriodInDays: new bignumber_js_1.BigNumber(3), valueRepaidToDate: Units.ether(3), expectedRepaymentValueSchedule: [
            {
                timestamp: (latestBlockTime) => moment
                    .unix(latestBlockTime)
                    .add(1, "days")
                    .unix(),
                expectedRepaymentValue: Units.ether(2),
            },
        ], from: (collateralizer, other) => other, termEndTimestamp: (latestBlockTime) => moment
            .unix(latestBlockTime)
            .add(1, "days")
            .unix(), agreementId: web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #3") }),
];
//# sourceMappingURL=successful_return.js.map