"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogUtils = require("./log_utils");
function LogInsertEntry(contract, entry) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["issuanceHash", entry.getIssuanceHash()],
            ["beneficiary", entry.getBeneficiary()],
            ["underwriter", entry.getUnderwriter()],
            ["underwriterRiskRating", entry.getUnderwriterRiskRating()],
            ["termsContract", entry.getTermsContract()],
            ["termsContractParameters", entry.getTermsContractParameters()],
        ]),
        name: "LogInsertEntry",
    };
}
exports.LogInsertEntry = LogInsertEntry;
function LogModifyEntryBeneficiary(contract, issuanceHash, previousBeneficiary, newBeneficiary) {
    return {
        address: contract,
        events: LogUtils.getParams([
            ["issuanceHash", issuanceHash],
            ["previousBeneficiary", previousBeneficiary],
            ["newBeneficiary", newBeneficiary],
        ]),
        name: "LogModifyEntryBeneficiary",
    };
}
exports.LogModifyEntryBeneficiary = LogModifyEntryBeneficiary;
//# sourceMappingURL=debt_registry.js.map