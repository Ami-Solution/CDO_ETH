"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const Units = require("../../../../test_utils/units");
const defaultTerms = {
    principalTokenIndex: new bignumber_js_1.BigNumber(0),
    principalAmount: Units.ether(1),
    interestRateFixedPoint: Units.interestRateFixedPoint(2.5),
    amortizationUnitType: new bignumber_js_1.BigNumber(1),
    termLengthUnits: new bignumber_js_1.BigNumber(4),
};
exports.UNPACK_PARAMETERS_FROM_BYTES_SCENARIOS = [
    {
        input: "0x00000000000de0b6b3a76400000061a810004000000000000000000000000000",
        expectedTerms: defaultTerms,
    },
    {
        input: "0x01000000000de0b6b3a76400000061a810004000000000000000000000000000",
        expectedTerms: Object.assign({}, defaultTerms, { principalTokenIndex: new bignumber_js_1.BigNumber(1) }),
    },
    {
        input: "0x00000000001bc16d674ec800000061a810004000000000000000000000000000",
        expectedTerms: Object.assign({}, defaultTerms, { principalAmount: Units.ether(2) }),
    },
    {
        input: "0x00000000000de0b6b3a76400000088b810004000000000000000000000000000",
        expectedTerms: Object.assign({}, defaultTerms, { interestRateFixedPoint: Units.interestRateFixedPoint(3.5) }),
    },
    {
        input: "0x00000000000de0b6b3a76400000061a820004000000000000000000000000000",
        expectedTerms: Object.assign({}, defaultTerms, { amortizationUnitType: new bignumber_js_1.BigNumber(2) }),
    },
    {
        input: "0x00000000000de0b6b3a76400000061a810005000000000000000000000000000",
        expectedTerms: Object.assign({}, defaultTerms, { termLengthUnits: new bignumber_js_1.BigNumber(5) }),
    },
];
//# sourceMappingURL=unpack_parameters_from_bytes.js.map