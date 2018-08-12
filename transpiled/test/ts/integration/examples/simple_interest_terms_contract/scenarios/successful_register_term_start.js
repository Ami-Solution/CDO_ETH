"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const Units = require("../../../../test_utils/units");
// Scenarios
const _1 = require("./");
exports.SUCCESSFUL_REGISTER_TERM_START_SCENARIOS = [
    Object.assign({ description: "when invoked by the filling of a debt order" }, _1.DEFAULT_REGISTER_TERM_START_ARGS),
    Object.assign({ description: "when the interest rate is 0" }, _1.DEFAULT_REGISTER_TERM_START_ARGS, { interestRateFixedPoint: Units.interestRateFixedPoint(0) }),
    Object.assign({ description: "when the interest rate is 100" }, _1.DEFAULT_REGISTER_TERM_START_ARGS, { interestRateFixedPoint: Units.interestRateFixedPoint(100) }),
    Object.assign({ description: "when the terms length is 0" }, _1.DEFAULT_REGISTER_TERM_START_ARGS, { termLengthUnits: new bignumber_js_1.BigNumber(0) }),
    Object.assign({ description: "when the terms length is 100" }, _1.DEFAULT_REGISTER_TERM_START_ARGS, { termLengthUnits: new bignumber_js_1.BigNumber(100) }),
    Object.assign({ description: "when the amortization unit type is 4" }, _1.DEFAULT_REGISTER_TERM_START_ARGS, { amortizationUnitType: new bignumber_js_1.BigNumber(4) }),
];
//# sourceMappingURL=successful_register_term_start.js.map