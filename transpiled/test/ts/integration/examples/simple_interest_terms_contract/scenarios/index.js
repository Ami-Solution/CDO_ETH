"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const Units = require("../../../../test_utils/units");
const terms_contract_parameters_1 = require("../../../../factories/terms_contract_parameters");
exports.DEFAULT_REGISTER_TERM_START_ARGS = {
    principalAmount: Units.ether(1),
    interestRateFixedPoint: Units.interestRateFixedPoint(2.5),
    amortizationUnitType: new bignumber_js_1.BigNumber(1),
    termLengthUnits: new bignumber_js_1.BigNumber(4),
    invokedByDebtKernel: true,
    principalTokenInRegistry: true,
    succeeds: true,
    reverts: false,
    termsContractParameters: (terms) => terms_contract_parameters_1.SimpleInterestParameters.pack(terms),
};
exports.DEFAULT_REGISTER_REPAYMENT_ARGS = {
    principalAmount: Units.ether(1),
    interestRateFixedPoint: Units.interestRateFixedPoint(2.5),
    amortizationUnitType: new bignumber_js_1.BigNumber(1),
    termLengthUnits: new bignumber_js_1.BigNumber(4),
    repaymentAmount: Units.ether(1.29),
    repaymentToken: (principalToken, otherToken) => principalToken,
    debtOrder: (debtOrder) => debtOrder,
    principalTokenInRegistry: true,
    repayFromRouter: true,
    succeeds: true,
    reverts: false,
};
//# sourceMappingURL=index.js.map