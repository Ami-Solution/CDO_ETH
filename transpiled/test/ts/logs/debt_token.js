"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogUtils = require("./log_utils");
function LogTransfer(contract, from, to, tokenId) {
    return {
        address: contract,
        events: LogUtils.getParams([["_from", from], ["_to", to], ["_tokenId", tokenId]]),
        name: "Transfer",
    };
}
exports.LogTransfer = LogTransfer;
function LogApproval(contract, owner, approved, tokenId) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["_owner", owner],
            ["_approved", approved],
            ["_tokenId", tokenId],
        ]),
        name: "Approval",
    };
}
exports.LogApproval = LogApproval;
function LogApprovalForAll(contract, owner, operator, approved) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["_owner", owner],
            ["_operator", operator],
            ["_approved", approved],
        ]),
        name: "ApprovalForAll",
    };
}
exports.LogApprovalForAll = LogApprovalForAll;
//# sourceMappingURL=debt_token.js.map