"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// External Libraries
const bignumber_js_1 = require("bignumber.js");
// Utils
const Units = require("../../../test_utils/units");
const defaultArgs = {
    collateralTokenAllowance: Units.ether(50000),
    collateralTokenBalance: Units.ether(50000),
    from: (kernel, attacker) => kernel,
    succeeds: true,
    termsContract: (collateralizedContract, attacker) => collateralizedContract,
};
exports.SUCCESSFUL_COLLATERALIZATION_SCENARIOS = [
    Object.assign({ description: "Collateralize 0.005 REP with 20 day grace period" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for REP collateralization test"), expectedCollateralAmount: Units.ether(0.005), expectedCollateralToken: "REP", expectedGracePeriodInDays: new bignumber_js_1.BigNumber(20), collateralTokenIndexInRegistry: new bignumber_js_1.BigNumber(0), 
        // We encode the following collateralization parameters into the parameters string
        //      Collateral Token Index: 0
        //      Collateral Amount: 0.005 REP
        //      Grace Period: 20 Days
        termsContractParameters: "0x00000000000000000000000000000000000000000000000011c37937e0800014" }),
    Object.assign({ description: "Collateralize 1 ZRX with 0 day grace period" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for ZRX collateralization test"), expectedCollateralAmount: Units.ether(1), expectedCollateralToken: "ZRX", expectedGracePeriodInDays: new bignumber_js_1.BigNumber(1), collateralTokenIndexInRegistry: new bignumber_js_1.BigNumber(2), 
        // We encode the following collateralization parameters into the parameters string
        //      Collateral Token Index: 2
        //      Collateral Amount: 1 ZRX
        //      Grace Period: 1 Day
        termsContractParameters: "0x00000000000000000000000000000000000000200000000de0b6b3a764000001" }),
    Object.assign({ description: "Collateralize 40312 MKR with 7 day grace period" }, defaultArgs, { agreementId: web3.sha3("Arbitrary 32 byte id for MKR collateralization test"), expectedCollateralAmount: Units.ether(40312), expectedCollateralToken: "MKR", expectedGracePeriodInDays: new bignumber_js_1.BigNumber(7), collateralTokenIndexInRegistry: new bignumber_js_1.BigNumber(1), 
        // We encode the following collateralization parameters into the parameters string
        //      Collateral Token Index: 1
        //      Collateral Amount: 40,312 MKR
        //      Grace Period: 7 Days
        termsContractParameters: "0x00000000000000000000000000000000000000100008895161d1decae0000007" }),
];
//# sourceMappingURL=successful_collateralization.js.map