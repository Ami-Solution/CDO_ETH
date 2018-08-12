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
// External Libraries
const chai = require("chai");
const bignumber_js_1 = require("bignumber.js");
// Test Utils
const bignumber_setup_1 = require("../test_utils/bignumber_setup");
const chai_setup_1 = require("../test_utils/chai_setup");
const format_1 = require("../test_utils/format");
const multisig_1 = require("../test_utils/multisig");
// Wrappers
const token_registry_1 = require("../../../types/generated/token_registry");
const dharma_multi_sig_wallet_1 = require("../../../types/generated/dharma_multi_sig_wallet");
chai_setup_1.default.configure();
// Configure BigNumber exponentiation
bignumber_setup_1.BigNumberSetup.configure();
const expect = chai.expect;
contract("Token Registry (Integration Tests)", (ACCOUNTS) => __awaiter(this, void 0, void 0, function* () {
    const CONTRACT_OWNER = ACCOUNTS[0];
    const TX_DEFAULTS = { from: CONTRACT_OWNER, gas: 4000000 };
    let registry;
    /**
     * The currently index of the Wrapped Ether token in the registry.
     *
     * Since we add tokens to the registry asynchronously, we cannot know for certain
     * what the index will be until the migrations have completed.
     */
    let wethIndex;
    before(() => __awaiter(this, void 0, void 0, function* () {
        registry = yield token_registry_1.TokenRegistryContract.deployed(web3, TX_DEFAULTS);
        wethIndex = yield registry.getTokenIndexBySymbol.callAsync("WETH");
    }));
    describe("#getTokenNameBySymbol", () => {
        describe("when given 'WETH'", () => {
            it("returns 'Canonical Wrapped Ether", () => __awaiter(this, void 0, void 0, function* () {
                expect(yield registry.getTokenNameBySymbol.callAsync("WETH")).to.equal("Canonical Wrapped Ether");
            }));
        });
        describe("when given 'REP'", () => {
            it("returns 'Augur REP", () => __awaiter(this, void 0, void 0, function* () {
                expect(yield registry.getTokenNameBySymbol.callAsync("REP")).to.equal("Augur REP");
            }));
        });
    });
    describe("#getNumDecimalsFromSymbol", () => {
        describe("when given 'WETH'", () => {
            it("returns '18'", () => __awaiter(this, void 0, void 0, function* () {
                const numDecimals = yield registry.getNumDecimalsFromSymbol.callAsync("WETH");
                expect(numDecimals.toNumber()).to.equal(18);
            }));
        });
        describe("when given 'TRX'", () => {
            it("returns '6", () => __awaiter(this, void 0, void 0, function* () {
                const numDecimals = yield registry.getNumDecimalsFromSymbol.callAsync("TRX");
                expect(numDecimals.toNumber()).to.equal(6);
            }));
        });
    });
    describe("#getNumDecimalsByIndex", () => {
        describe("when given the index for the WETH token", () => {
            it("returns '18'", () => __awaiter(this, void 0, void 0, function* () {
                const numDecimals = yield registry.getNumDecimalsByIndex.callAsync(wethIndex);
                expect(numDecimals.toNumber()).to.equal(18);
            }));
        });
    });
    describe("#getTokenSymbolByIndex", () => {
        describe("when given the index for the WETH token", () => {
            it("returns 'WETH'", () => __awaiter(this, void 0, void 0, function* () {
                const symbol = yield registry.getTokenSymbolByIndex.callAsync(wethIndex);
                expect(symbol).to.equal("WETH");
            }));
        });
    });
    describe("#getTokenIndexBySymbol", () => {
        describe("when given 'WETH'", () => {
            it("returns a number", () => __awaiter(this, void 0, void 0, function* () {
                const index = yield registry.getTokenIndexBySymbol.callAsync("WETH");
                expect(index.toNumber()).to.be.at.least(0);
            }));
        });
    });
    describe("#getTokenAddressBySymbol", () => {
        describe("when given 'WETH'", () => {
            it("returns a valid address", () => __awaiter(this, void 0, void 0, function* () {
                const address = yield registry.getTokenAddressBySymbol.callAsync("WETH");
                expect(format_1.isNonNullAddress(address)).to.equal(true);
            }));
        });
    });
    describe("#getTokenAddressByIndex", () => {
        describe("when given '0'", () => {
            it("returns a valid address", () => __awaiter(this, void 0, void 0, function* () {
                const address = yield registry.getTokenAddressByIndex.callAsync(new bignumber_js_1.BigNumber(0));
                expect(format_1.isNonNullAddress(address)).to.equal(true);
            }));
        });
    });
    describe("#getTokenAttributesBySymbol", () => {
        describe("when given 'WETH'", () => {
            it("returns an array of attributes for WETH", () => __awaiter(this, void 0, void 0, function* () {
                const [address, index, name, numDecimals,] = yield registry.getTokenAttributesBySymbol.callAsync("WETH");
                expect(numDecimals.toNumber()).to.equal(18);
                expect(name).to.equal("Canonical Wrapped Ether");
                expect(format_1.isNonNullAddress(address)).to.equal(true);
                expect(index.toNumber()).to.be.at.least(0);
            }));
        });
    });
    describe("#getTokenAttributesByIndex", () => {
        describe("when given the index of the WETH token", () => {
            it("returns an array of attributes for WETH", () => __awaiter(this, void 0, void 0, function* () {
                const [address, symbol, name, numDecimals,] = yield registry.getTokenAttributesByIndex.callAsync(wethIndex);
                expect(numDecimals.toNumber()).to.equal(18);
                expect(name).to.equal("Canonical Wrapped Ether");
                expect(symbol).to.equal("WETH");
                expect(format_1.isNonNullAddress(address)).to.equal(true);
            }));
        });
    });
    describe("#setTokenAttributes", () => {
        const symbol = "WETH";
        const testAttributes = {
            address: "0x1111000011110000111100001111000011110000",
            name: "Test Wrapped Ether",
            numDecimals: new bignumber_js_1.BigNumber(2),
        };
        // The contract owner.
        let multiSig;
        // Store the token's original attributes, so that we can restore them after tests.
        let originalAddress;
        let originalIndex;
        let originalName;
        let originalNumDecimals;
        describe("when called by the multi-sig contract owner", () => {
            before("store the original token attributes and then set the new ones", () => __awaiter(this, void 0, void 0, function* () {
                multiSig = yield dharma_multi_sig_wallet_1.DharmaMultiSigWalletContract.deployed(web3, TX_DEFAULTS);
                [
                    originalAddress,
                    originalIndex,
                    originalName,
                    originalNumDecimals,
                ] = yield registry.getTokenAttributesBySymbol.callAsync(symbol);
                yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, registry, "setTokenAttributes", ACCOUNTS, [
                    symbol,
                    testAttributes.address,
                    testAttributes.name,
                    testAttributes.numDecimals,
                ]);
            }));
            after("restore the original token attributes to the registry", () => __awaiter(this, void 0, void 0, function* () {
                yield multisig_1.multiSigExecuteAfterTimelock(web3, multiSig, registry, "setTokenAttributes", ACCOUNTS, [symbol, originalAddress, originalName, originalNumDecimals]);
            }));
            it("sets the token's name", () => __awaiter(this, void 0, void 0, function* () {
                expect(yield registry.getTokenNameBySymbol.callAsync(symbol)).to.equal(testAttributes.name);
            }));
            it("sets the token's address", () => __awaiter(this, void 0, void 0, function* () {
                expect(yield registry.getTokenAddressBySymbol.callAsync(symbol)).to.equal(testAttributes.address);
            }));
            it("sets the token's numDecimals", () => __awaiter(this, void 0, void 0, function* () {
                const result = yield registry.getNumDecimalsFromSymbol.callAsync(symbol);
                expect(result.toNumber()).to.deep.equal(testAttributes.numDecimals.toNumber());
            }));
        });
    });
}));
//# sourceMappingURL=token_registry.js.map