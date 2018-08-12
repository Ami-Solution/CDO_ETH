"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const _1 = require("./");
// These default args by themselves will fail (i.e. registering term start will succeed), so each
// scenario should modify one property, such that the test fails.
const defaultArgs = _1.DEFAULT_REGISTER_TERM_START_ARGS;
defaultArgs.succeeds = false;
exports.UNSUCCESSFUL_REGISTER_TERM_START_SCENARIOS = [
    Object.assign({ description: "when invoked outside of the debt kernel" }, defaultArgs, { reverts: true, invokedByDebtKernel: false }),
    Object.assign({ description: "when the amortization unit type is 5" }, defaultArgs, { reverts: true, amortizationUnitType: new bignumber_js_1.BigNumber(5) }),
    Object.assign({ description: "when the principal amount is 0" }, defaultArgs, { principalAmount: new bignumber_js_1.BigNumber(0) }),
    Object.assign({ description: "when there is no token at the given token index in the terms contract parameters" }, defaultArgs, { reverts: true, principalTokenInRegistry: false }),
];
//# sourceMappingURL=unsuccessful_register_term_start.js.map