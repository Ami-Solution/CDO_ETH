"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_utils_1 = require("./log_utils");
const common_1 = require("../../../types/common");
var EventNames;
(function (EventNames) {
    EventNames["Authorized"] = "Authorized";
    EventNames["AuthorizationRevoked"] = "AuthorizationRevoked";
})(EventNames = exports.EventNames || (exports.EventNames = {}));
function Authorized(contract, agent, callingContext) {
    return {
        address: contract,
        events: [
            log_utils_1.generateParam("agent", common_1.SolidityType.address, agent),
            log_utils_1.generateParam("callingContext", common_1.SolidityType.string, callingContext),
        ],
        name: EventNames.Authorized,
    };
}
exports.Authorized = Authorized;
function AuthorizationRevoked(contract, agent, callingContext) {
    return {
        address: contract,
        events: [
            log_utils_1.generateParam("agent", common_1.SolidityType.address, agent),
            log_utils_1.generateParam("callingContext", common_1.SolidityType.string, callingContext),
        ],
        name: EventNames.AuthorizationRevoked,
    };
}
exports.AuthorizationRevoked = AuthorizationRevoked;
//# sourceMappingURL=permissions_lib.js.map