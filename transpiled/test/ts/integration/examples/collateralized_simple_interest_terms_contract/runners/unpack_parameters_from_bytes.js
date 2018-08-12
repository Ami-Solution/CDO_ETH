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
// External libraries
const chai_1 = require("chai");
// This is testing a "pure" function, and so it does
// not need the setup provided in CollateralizedSimpleInterestTermsContractRunner.
class UnpackParametersFromBytesRunner {
    constructor() {
        this.testScenario = this.testScenario.bind(this);
    }
    initialize(collateralizedSimpleInterestTermsContract) {
        this.collateralizedSimpleInterestTermsContract = collateralizedSimpleInterestTermsContract;
    }
    testScenario(scenario) {
        describe(`when given ${scenario.input}`, () => {
            it(`should return ${JSON.stringify(scenario.expectedTerms)}`, () => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.collateralizedSimpleInterestTermsContract.unpackParametersFromBytes.callAsync(scenario.input);
                // E.g. '["0","1000000000000000000","2500","1","4"]' - BigNumber components are stringified.
                const resultString = JSON.stringify(result);
                const expectedValuesString = JSON.stringify(Object.values(scenario.expectedTerms));
                chai_1.expect(resultString).to.equal(expectedValuesString);
            }));
        });
    }
}
exports.UnpackParametersFromBytesRunner = UnpackParametersFromBytesRunner;
//# sourceMappingURL=unpack_parameters_from_bytes.js.map