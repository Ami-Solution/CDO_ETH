"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogUtils = require("./log_utils");
function LogRegisterRepayment(contract, agreementID, payer, beneficiary, unitsOfRepayment, tokenAddress) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["agreementId", agreementID],
            ["payer", payer],
            ["beneficiary", beneficiary],
            ["unitsOfRepayment", unitsOfRepayment],
            ["tokenAddress", tokenAddress],
        ]),
        name: "LogRegisterRepayment",
    };
}
exports.LogRegisterRepayment = LogRegisterRepayment;
function LogSimpleInterestTermStart(contract, agreementID, principalToken, principalAmount, interestRate, amortizationUnitType, termLengthInAmortizationUnits) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["agreementId", agreementID],
            ["principalToken", principalToken],
            ["principalAmount", principalAmount],
            ["interestRate", interestRate],
            ["amortizationUnitType", amortizationUnitType],
            ["termLengthInAmortizationUnits", termLengthInAmortizationUnits],
        ]),
        name: "LogSimpleInterestTermStart",
    };
}
exports.LogSimpleInterestTermStart = LogSimpleInterestTermStart;
//# sourceMappingURL=simple_interest_terms_contract.js.map