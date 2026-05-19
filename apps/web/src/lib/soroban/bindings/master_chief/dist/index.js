import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
if (typeof window !== "undefined") {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CB5ZWH43V7BLLTFYLOYJCFRBQBKQWIPTRJMS4HEFJQX5SHYZEM2V5K3C",
    }
};
export const MasterError = {
    1: { message: "NotInitialized" },
    2: { message: "InsufficientCredits" },
    3: { message: "Unauthorized" },
    4: { message: "ArithmeticOverflow" },
    5: { message: "AlreadyInitialized" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALU2J0Q29udHJhY3QAAAAAAQAAAAAAAAAIUG9zaXRpb24AAAABAAAAEw==",
            "AAAABAAAAAAAAAAAAAAAC01hc3RlckVycm9yAAAAAAUAAAAAAAAADk5vdEluaXRpYWxpemVkAAAAAAABAAAAAAAAABNJbnN1ZmZpY2llbnRDcmVkaXRzAAAAAAIAAAAAAAAADFVuYXV0aG9yaXplZAAAAAMAAAAAAAAAEkFyaXRobWV0aWNPdmVyZmxvdwAAAAAABAAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAAF",
            "AAAAAQAAAAAAAAAAAAAAEFNidEVtcHJlc2FSZWNvcmQAAAAGAAAAAAAAAApiaW9tYXNzX2tnAAAAAAALAAAAAAAAAA5jX2NyZWRfYmFsYW5jZQAAAAAACwAAAAAAAAAOY19kZWJ0X2JhbGFuY2UAAAAAAAsAAAAAAAAADGNhcmJvbl9zZXFfZwAAAAsAAAAAAAAACm9kc19iYWRnZXMAAAAAA+oAAAAEAAAAAAAAAAh2ZXJpZmllZAAAAAE=",
            "AAAABQAAAAAAAAAAAAAAEEV2ZW50RGVidFNldHRsZWQAAAACAAAABm1hc3RlcgAAAAAADGRlYnRfc2V0dGxlZAAAAAIAAAAAAAAAB2NvbXBhbnkAAAAAEwAAAAAAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAC",
            "AAAABQAAAAAAAAAAAAAAEUV2ZW50Q3JlZGl0VHJhZGVkAAAAAAAAAgAAAAZtYXN0ZXIAAAAAAA1jcmVkaXRfdHJhZGVkAAAAAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAC",
            "AAAAAQAAAAAAAAAAAAAAEkNvbGxhdGVyYWxQb3NpdGlvbgAAAAAAAwAAAAAAAAAKYXNzZXRfdHlwZQAAAAAABAAAAAAAAAAQbGFzdF9zeW5jX2xlZGdlcgAAAAQAAAAAAAAAC3RvdGFsX3VuaXRzAAAAAAQ=",
            "AAAABQAAAAAAAAAAAAAAE0V2ZW50SW52ZW50b3J5QWRkZWQAAAAAAgAAAAZtYXN0ZXIAAAAAAA9pbnZlbnRvcnlfYWRkZWQAAAAAAgAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAAAAAAFdW5pdHMAAAAAAAAEAAAAAAAAAAI=",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAxzYnRfY29udHJhY3QAAAATAAAAAA==",
            "AAAAAAAAAEYzLiBDT01QRU5TQcOHw4NPOiAiQXBvc2VudGEiIGNyw6lkaXRvcyBwYXJhIGFiYXRlciBhIGTDrXZpZGEgYW1iaWVudGFsAAAAAAALc2V0dGxlX2RlYnQAAAAAAgAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAMZ2V0X3Bvc2l0aW9uAAAAAQAAAAAAAAAHY29tcGFueQAAAAATAAAAAQAAB9AAAAASQ29sbGF0ZXJhbFBvc2l0aW9uAAA=",
            "AAAAAAAAAD4xLiBHRVNUw4NPIERFIElOVkVOVMOBUklPOiBBZGljaW9uYSBtdWRhcyBhbyBsYXN0cm8gZGEgZW1wcmVzYQAAAAAADWFkZF9pbnZlbnRvcnkAAAAAAAADAAAAAAAAAAdjb21wYW55AAAAABMAAAAAAAAABXVuaXRzAAAAAAAABAAAAAAAAAAKYXNzZXRfdHlwZQAAAAAABAAAAAA=",
            "AAAAAAAAAEYyLiBERUZJIE1BUktFVFBMQUNFOiBOZWdvY2lhIEMtQ3JlZCBleGNlZGVudGUgZW50cmUgZW1wcmVzYXMgcGFyY2VpcmFzAAAAAAANdHJhZGVfY3JlZGl0cwAAAAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        settle_debt: (this.txFromJSON),
        get_position: (this.txFromJSON),
        add_inventory: (this.txFromJSON),
        trade_credits: (this.txFromJSON)
    };
}
