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
    collateralAmount: Units.ether(3),
    gracePeriodInDays: new bignumber_js_1.BigNumber(7),
    valueRepaidToDate: Units.ether(1),
    expectedRepaymentValueSchedule: [
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
    ],
    termEndTimestamp: (latestBlockTime) => moment
        .unix(latestBlockTime)
        .subtract(1, "hours")
        .unix(),
    termsContract: (collateralizedContract, attacker) => collateralizedContract,
    from: (collateralizer, other) => collateralizer,
    debtAgreementExists: true,
    debtAgreementCollateralized: true,
    succeeds: false,
};
exports.UNSUCCESSFUL_RETURN_SCENARIOS = [
    Object.assign({ description: "Debt agreement does not exist" }, defaultArgs, { debtAgreementExists: false, agreementId: web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #1") }),
    Object.assign({ description: "Debt agreement is not collateralized in this contract" }, defaultArgs, { debtAgreementCollateralized: false, agreementId: web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #2") }),
    Object.assign({ description: "Debt's term has lapsed BUT debt has NOT been repaid" }, defaultArgs, { valueRepaidToDate: Units.ether(0), agreementId: web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #4") }),
    Object.assign({ description: "Debt's term has lapsed BUT debt has only PARTIALLY been repaid" }, defaultArgs, { valueRepaidToDate: _.last(defaultArgs.expectedRepaymentValueSchedule).expectedRepaymentValue.minus(1), agreementId: web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #5") }),
    Object.assign({ description: "Debt's term has lapsed BUT collateral has already been seized" }, defaultArgs, { valueRepaidToDate: Units.ether(0), before: (collateralizerContract, termsContract) => __awaiter(this, void 0, void 0, function* () {
            const agreementId = web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #6");
            yield collateralizerContract.seizeCollateral.sendTransactionAsync(agreementId);
            // We mock the debt as subsequently having been repaid
            yield termsContract.mockDummyValueRepaid.sendTransactionAsync(agreementId, Units.ether(1));
        }), agreementId: web3.sha3("Arbitrary 32 byte string for unsuccessful return scenario #6") }),
];
//# sourceMappingURL=unsuccessful_return.js.map