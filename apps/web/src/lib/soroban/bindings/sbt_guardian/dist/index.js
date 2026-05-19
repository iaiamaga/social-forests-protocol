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
        contractId: "CATUQHSIINJTJGIMSROVY47M2IJI2HDTQ2COXGI43Z4UNXQQXIW7WYEB",
    }
};
export const GuardianError = {
    1: { message: "AlreadyInitialized" },
    2: { message: "NotInitialized" },
    3: { message: "Unauthorized" },
    4: { message: "SoulboundToken" },
    5: { message: "ArithmeticOverflow" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAHVXNlclNidAAAAAABAAAAEw==",
            "AAAAAQAAAAAAAAAAAAAAC0d1YXJkaWFuU2J0AAAAAAQAAAAAAAAAA2VyYQAAAAAEAAAAAAAAAAlqb2luX2RhdGUAAAAAAAAGAAAAAAAAAAVsZXZlbAAAAAAAAAQAAAAAAAAAAnhwAAAAAAAE",
            "AAAABQAAAAAAAAAAAAAADEV2ZW50TGV2ZWxVcAAAAAIAAAAKcmVwdXRhdGlvbgAAAAAACGxldmVsX3VwAAAAAwAAAAAAAAAEdXNlcgAAABMAAAAAAAAAAAAAAAluZXdfbGV2ZWwAAAAAAAAEAAAAAAAAAAAAAAADZXJhAAAAAAQAAAAAAAAAAg==",
            "AAAABAAAAAAAAAAAAAAADUd1YXJkaWFuRXJyb3IAAAAAAAAFAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADk5vdEluaXRpYWxpemVkAAAAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAA5Tb3VsYm91bmRUb2tlbgAAAAAABAAAAAAAAAASQXJpdGhtZXRpY092ZXJmbG93AAAAAAAF",
            "AAAABQAAAAAAAAAAAAAADUV2ZW50WHBHYWluZWQAAAAAAAACAAAACnJlcHV0YXRpb24AAAAAAAl4cF9nYWluZWQAAAAAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAAAAAACHRvdGFsX3hwAAAABAAAAAAAAAAC",
            "AAAAAAAAADRBdHJpYnVpIFhQIGFvIHV0aWxpemFkb3IgKGNoYW1hZG8gcGVsbyBPcnF1ZXN0cmFkb3IpAAAABmFkZF94cAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABmFtb3VudAAAAAAABAAAAAEAAAAE",
            "AAAAAAAAAAAAAAAHZ2V0X3NidAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAfQAAAAC0d1YXJkaWFuU2J0AA==",
            "AAAAAAAAAB3wn5uh77iPIFNPVUxCT1VORCBFTkZPUkNFTUVOVAAAAAAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        add_xp: (this.txFromJSON),
        get_sbt: (this.txFromJSON),
        transfer: (this.txFromJSON),
        initialize: (this.txFromJSON)
    };
}
