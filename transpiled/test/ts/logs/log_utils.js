"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// External
const ABIDecoder = require("abi-decoder");
const BigNumber = require("bignumber.js");
const _ = require("lodash");
// Types
const common_1 = require("../../../types/common");
function getParams(args, types) {
    return _.map(args, (param, i) => {
        let type;
        const [name, value] = param;
        if (types && i < types.length) {
            type = types[i];
        }
        else {
            if (typeof value === "string") {
                if (/^(0x)?[0-9a-f]{40}$/i.test(value)) {
                    // check if it has the basic requirements of an address
                    type = "address";
                }
                else if (/^(0x)?[0-9a-f]{64}$/i.test(value)) {
                    type = "bytes32";
                }
                else {
                    type = "string";
                }
            }
            else if (typeof value === "number" || value instanceof BigNumber.BigNumber) {
                type = "uint256";
            }
            else if (typeof value === "boolean") {
                type = "bool";
            }
            else {
                throw new Error(`Could not recognize type of value ${value}`);
            }
        }
        return {
            name,
            type,
            value: type === "bool" ? value : value.toString(),
        };
    });
}
exports.getParams = getParams;
function generateParam(name, type, value) {
    return {
        name,
        type,
        value: type === common_1.SolidityType.boolean ? value : value.toString(),
    };
}
exports.generateParam = generateParam;
function queryLogsForEvent(txHash, eventName) {
    return __awaiter(this, void 0, void 0, function* () {
        const receipt = yield web3.eth.getTransactionReceipt(txHash);
        return _.find(ABIDecoder.decodeLogs(receipt.logs), { name: eventName });
    });
}
exports.queryLogsForEvent = queryLogsForEvent;
//# sourceMappingURL=log_utils.js.map