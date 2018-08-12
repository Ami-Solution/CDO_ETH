"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogUtils = require("./log_utils");
function CollateralLocked(contract, agreementID, token, amount) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["agreementID", agreementID],
            ["token", token],
            ["amount", amount],
        ]),
        name: "CollateralLocked",
    };
}
exports.CollateralLocked = CollateralLocked;
function CollateralReturned(contract, agreementID, collateralizer, token, amount) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["agreementID", agreementID],
            ["collateralizer", collateralizer],
            ["token", token],
            ["amount", amount],
        ]),
        name: "CollateralReturned",
    };
}
exports.CollateralReturned = CollateralReturned;
function CollateralSeized(contract, agreementID, beneficiary, token, amount) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["agreementID", agreementID],
            ["beneficiary", beneficiary],
            ["token", token],
            ["amount", amount],
        ]),
        name: "CollateralSeized",
    };
}
exports.CollateralSeized = CollateralSeized;
//# sourceMappingURL=collateralized_contract.js.map