"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External Libraries
const bignumber_js_1 = require("bignumber.js");
// Utils
const Units = require("../../../test_utils/units");
const defaultArgs = {
    collateralTokenAllowance: Units.ether(1),
    collateralTokenBalance: Units.ether(1),
    collateralTokenIndexInRegistry: new bignumber_js_1.BigNumber(2),
    from: (kernel, attacker) => kernel,
    succeeds: false,
    termsContract: (collateralizedContract, attacker) => collateralizedContract,
    // By default, we encode the following collateralization parameters into the parameters string
    //      Collateral Token Index: 2
    //      Collateral Amount: 1 ether
    //      Grace Period: 1 Day
    termsContractParameters: "0x00000000000000000000000000000000000000200000000de0b6b3a764000001",
};
exports.UNSUCCESSFUL_COLLATERALIZATION_SCENARIOS = [
    Object.assign({ description: "Caller is not terms contract" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful collateralization scenario #1"), from: (kernel, attacker) => attacker }),
    Object.assign({ description: "Agreement refers to different terms contract" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful collateralization scenario #2"), termsContract: (collateralizedContract, attacker) => attacker }),
    Object.assign({ description: "Amount being put up for collateral is zero" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful collateralization scenario #3"), termsContractParameters: "0x0000000000000000000000000000000000000020000000000000000000000001" }),
    Object.assign({ description: "Collateralizer's balance in collateral token is insufficient" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful collateralization scenario #4"), collateralTokenBalance: Units.ether(1).minus(1) }),
    Object.assign({ description: "Allowance granted to collateral contract is insufficient" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful collateralization scenario #5"), collateralTokenAllowance: Units.ether(1).minus(1) }),
    Object.assign({ description: "Specified collateral token is not stored in token registry" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for unsuccessful collateralization scenario #6"), termsContractParameters: "0x0000000000000000000000000000000000000ff00000000de0b6b3a764000001" }),
];
//# sourceMappingURL=unsuccessful_collateralization.js.map