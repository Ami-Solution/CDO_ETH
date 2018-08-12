"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../../types/common");
const LogUtils = require("./log_utils");
var EventNames;
(function (EventNames) {
    EventNames["ContractAddressUpdated"] = "ContractAddressUpdated";
})(EventNames = exports.EventNames || (exports.EventNames = {}));
function ContractAddressUpdated(contract, contractType, oldAddress, newAddress) {
    return {
        address: contract,
        events: [
            LogUtils.generateParam("contractType", common_1.SolidityType.uint8, contractType),
            LogUtils.generateParam("oldAddress", common_1.SolidityType.address, oldAddress),
            LogUtils.generateParam("newAddress", common_1.SolidityType.address, newAddress),
        ],
        name: EventNames.ContractAddressUpdated,
    };
}
exports.ContractAddressUpdated = ContractAddressUpdated;
//# sourceMappingURL=contract_registry.js.map