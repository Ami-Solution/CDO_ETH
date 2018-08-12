"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const _1 = require("./");
// These default args by themselves will fail (i.e. registering term start will succeed), so each
// scenario should modify one property, such that the test fails.
const defaultArgs = _1.DEFAULT_REGISTER_TERM_START_ARGS;
defaultArgs.succeeds = false;
exports.UNSUCCESSFUL_REGISTER_TERM_START_SCENARIOS = [
    Object.assign({ description: "when invoked outside of the debt kernel" }, defaultArgs, { invokedByDebtKernel: false, reverts: true }),
    Object.assign({ description: "when the amortization unit type is 5" }, defaultArgs, { amortizationUnitType: new bignumber_js_1.BigNumber(5), reverts: true }),
    Object.assign({ description: "when the principal amount is 0" }, defaultArgs, { principalAmount: new bignumber_js_1.BigNumber(0) }),
    Object.assign({ description: "when there is no token at the given token index in the terms contract parameters" }, defaultArgs, { principalTokenInRegistry: false, reverts: true }),
    Object.assign({ description: "when there is no token at the given token index in the collateral parameters" }, defaultArgs, { collateralTokenInRegistry: false, reverts: true }),
    Object.assign({ description: "when the collateralized amount is 0" }, defaultArgs, { collateralAmount: new bignumber_js_1.BigNumber(0), reverts: true }),
    Object.assign({ description: "when the token proxy allowance granted by the debtor is less than the collateral amount" }, defaultArgs, { collateralTokenAllowance: new bignumber_js_1.BigNumber(0), reverts: true }),
    Object.assign({ description: "when the debtor's token balance is less than the collateral amount" }, defaultArgs, { collateralTokenBalance: new bignumber_js_1.BigNumber(0), reverts: true }),
];
//# sourceMappingURL=unsuccessful_register_term_start.js.map