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
        contractId: "CDSK3UIEDWWLECIJ4IKEGSAK55IRPNNYOBSZ5QN4ZMOX3DL5SBKUYGPB",
    }
};
export const TokenError = {
    1: { message: "AlreadyInitialized" },
    2: { message: "InsufficientBalance" },
    3: { message: "Unauthorized" },
    4: { message: "NegativeAmount" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAADAyLiBRVUVJTUEgKEJVUk4pOiBVc2FkbyBwYXJhIHBhZ2FyIFBsYW50aW8vRm9yamEAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAACgxLiBFTUlTU8ODTyAoTUlOVCk6IFVzYWRvIG5vIE9uLXJhbXAgQjJCAAAABG1pbnQAAAACAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
            "AAAAAAAAAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMUGVuZGluZ0FkbWluAAAAAQAAAAAAAAAHQmFsYW5jZQAAAAABAAAAEwAAAAAAAAAAAAAACE1ldGFkYXRhAAAAAAAAAAAAAAALVG90YWxTdXBwbHkA",
            "AAAAAAAAAAAAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
            "AAAAAAAAAAAAAAAHYmFsYW5jZQAAAAABAAAAAAAAAAJpZAAAAAAAEwAAAAEAAAAL",
            "AAAABQAAAAAAAAAAAAAACUV2ZW50QnVybgAAAAAAAAIAAAAFdG9rZW4AAAAAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAI=",
            "AAAABQAAAAAAAAAAAAAACUV2ZW50TWludAAAAAAAAAIAAAAFdG9rZW4AAAAAAAAEbWludAAAAAIAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAI=",
            "AAAABAAAAAAAAAAAAAAAClRva2VuRXJyb3IAAAAAAAQAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAA5OZWdhdGl2ZUFtb3VudAAAAAAABA==",
            "AAAAAAAAAAAAAAAIZGVjaW1hbHMAAAAAAAAAAQAAAAQ=",
            "AAAAAAAAABszLiBUUkFOU0ZFUsOKTkNJQSAoUEFEUsODTykAAAAACHRyYW5zZmVyAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAABAAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQAAAAAAAAAAhkZWNpbWFscwAAAAQAAAAA",
            "AAAAAQAAAAAAAAAAAAAADVRva2VuTWV0YWRhdGEAAAAAAAADAAAAAAAAAAhkZWNpbWFscwAAAAQAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAZzeW1ib2wAAAAAABA=",
            "AAAABQAAAAAAAAAAAAAADUV2ZW50VHJhbnNmZXIAAAAAAAACAAAABXRva2VuAAAAAAAACHRyYW5zZmVyAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAC",
            "AAAAAAAAACpUd28tc3RlcCBhZG1pbiB0cmFuc2ZlcjogbmV3IGFkbWluIGFjY2VwdHMAAAAAAAxhY2NlcHRfYWRtaW4AAAAAAAAAAA==",
            "AAAAAAAAAAAAAAAMdG90YWxfc3VwcGx5AAAAAAAAAAEAAAAL",
            "AAAAAAAAACpUd28tc3RlcCBhZG1pbiB0cmFuc2ZlcjogcHJvcG9zZSBuZXcgYWRtaW4AAAAAAA1wcm9wb3NlX2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        burn: (this.txFromJSON),
        mint: (this.txFromJSON),
        name: (this.txFromJSON),
        symbol: (this.txFromJSON),
        balance: (this.txFromJSON),
        decimals: (this.txFromJSON),
        transfer: (this.txFromJSON),
        initialize: (this.txFromJSON),
        accept_admin: (this.txFromJSON),
        total_supply: (this.txFromJSON),
        propose_admin: (this.txFromJSON)
    };
}
