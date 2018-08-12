"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// These default args by themselves will fail (the repayment will succeed), so each
// scenario should modify one property, such that the test fails.
const defaultArgs = _1.DEFAULT_REGISTER_REPAYMENT_ARGS;
defaultArgs.succeeds = false;
exports.UNSUCCESSFUL_REGISTER_REPAYMENT_SCENARIOS = [
    Object.assign({ description: "when called from outside the RepaymentRouter" }, defaultArgs, { repayFromRouter: false, reverts: true }),
    Object.assign({ description: "when payment is attempted with the incorrect token" }, defaultArgs, { repaymentToken: (principalToken, otherToken) => otherToken }),
];
//# sourceMappingURL=unsuccessful_register_repayment.js.map