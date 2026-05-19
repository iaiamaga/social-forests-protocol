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
        contractId: "CDYBW7E33UT73BFVE73K6CWRCWK33O7DHCMZC6Z4HU2BX635ONPD7T6D",
    }
};
export const OrchestratorError = {
    1: { message: "AlreadyInitialized" },
    2: { message: "Unauthorized" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJTGVhZlRva2VuAAAAAAAAAAAAAAAAAAALU2J0R3VhcmRpYW4AAAAAAAAAAAAAAAAKU2J0Q29tcGFueQAAAAAAAAAAAAAAAAALTWFzdGVyQ2hpZWYAAAAAAAAAAAAAAAALTXl0aG9zVmF1bHQA",
            "AAAABAAAAAAAAAAAAAAAEU9yY2hlc3RyYXRvckVycm9yAAAAAAAAAgAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAC",
            "AAAAAAAAADxJbmljaWFsaXphIGEgT3JxdWVzdHJhIGNvbSBvcyBJRHMgZGUgdG9kb3Mgb3MgY29udHJhdG9zIGNvcmUAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARsZWFmAAAAEwAAAAAAAAAFc2J0X2cAAAAAAAATAAAAAAAAAAVzYnRfYwAAAAAAABMAAAAAAAAABm1hc3RlcgAAAAAAEwAAAAAAAAAGbXl0aG9zAAAAAAATAAAAAA==",
            "AAAAAAAAAAAAAAAKcGxhbnRfdHJlZQAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAACWxlYWZfY29zdAAAAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAMZm9yZ2VfbXl0aG9zAAAAAwAAAAAAAAAEdXNlcgAAABMAAAAAAAAAA2lkcwAAAAPqAAAABAAAAAAAAAADZmVlAAAAAAsAAAAA",
            "AAAAAAAAAAAAAAAYaW5zdGl0dXRpb25hbF9vbmJvYXJkaW5nAAAABQAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAV1bml0cwAAAAAAAAQAAAAAAAAAC2NhcmJvbl9kZWJ0AAAAAAsAAAAAAAAAC25vdGFyeV9oYXNoAAAAABAAAAAAAAAADWxlYWZfY2FzaGJhY2sAAAAAAAALAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        plant_tree: (this.txFromJSON),
        forge_mythos: (this.txFromJSON),
        institutional_onboarding: (this.txFromJSON)
    };
}
