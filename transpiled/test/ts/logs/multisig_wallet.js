"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = require("bignumber.js");
const LogUtils = require("./log_utils");
function Submission(contract, transactionId) {
    return {
        address: contract,
        events: LogUtils.getParams([["transactionId", new bignumber_js_1.BigNumber(transactionId)]]),
        name: "Submission",
    };
}
exports.Submission = Submission;
function Confirmation(contract, sender, transactionId) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["sender", sender],
            ["transactionId", new bignumber_js_1.BigNumber(transactionId)],
        ]),
        name: "Confirmation",
    };
}
exports.Confirmation = Confirmation;
function Execution(contract, transactionId) {
    return {
        address: contract,
        events: LogUtils.getParams([["transactionId", new bignumber_js_1.BigNumber(transactionId)]]),
        name: "Execution",
    };
}
exports.Execution = Execution;
//# sourceMappingURL=multisig_wallet.js.map