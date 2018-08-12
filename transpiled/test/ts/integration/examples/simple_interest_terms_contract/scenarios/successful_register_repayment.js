"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Scenarios
const _1 = require("./");
exports.SUCCESSFUL_REGISTER_REPAYMENT_SCENARIOS = [
    Object.assign({ description: "when called with valid args from the RepaymentRouter" }, _1.DEFAULT_REGISTER_REPAYMENT_ARGS),
    Object.assign({ description: "when payment is greater than the principal amount" }, _1.DEFAULT_REGISTER_REPAYMENT_ARGS, { repaymentAmount: _1.DEFAULT_REGISTER_REPAYMENT_ARGS.principalAmount.add(1) }),
    Object.assign({ description: "when payment is less than the principal amount" }, _1.DEFAULT_REGISTER_REPAYMENT_ARGS, { repaymentAmount: _1.DEFAULT_REGISTER_REPAYMENT_ARGS.principalAmount.sub(1) }),
];
//# sourceMappingURL=successful_register_repayment.js.map