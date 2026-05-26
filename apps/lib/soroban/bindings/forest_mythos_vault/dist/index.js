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
        contractId: "CAZ3URJTTXQCDFQTJFW6DN5ZGI7DEAAYDHEJBWQDUJ3PCFXJMK5RWBJ3",
    }
};
export const DnftError = {
    1: { message: "AlreadyInitialized" },
    2: { message: "TokenNotFound" },
    3: { message: "Unauthorized" },
    4: { message: "PhaseLocked" },
    5: { message: "InvalidTier" },
    6: { message: "ArithmeticOverflow" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAGT3JhY2xlAAAAAAAAAAAAAAAAAAxUb2tlbkNvdW50ZXIAAAABAAAAAAAAAAVUb2tlbgAAAAAAAAEAAAAE",
            "AAAABAAAAAAAAAAAAAAACURuZnRFcnJvcgAAAAAAAAYAAAAAAAAAEkFscmVhZHlJbml0aWFsaXplZAAAAAAAAQAAAAAAAAANVG9rZW5Ob3RGb3VuZAAAAAAAAAIAAAAAAAAADFVuYXV0aG9yaXplZAAAAAMAAAAAAAAAC1BoYXNlTG9ja2VkAAAAAAQAAAAAAAAAC0ludmFsaWRUaWVyAAAAAAUAAAAAAAAAEkFyaXRobWV0aWNPdmVyZmxvdwAAAAAABg==",
            "AAAAAQAAAAAAAAAAAAAACkRuZnRSZWNvcmQAAAAAAAcAAAAAAAAACmJpb21hc3Nfa2cAAAAAAAQAAAAAAAAACmJpcnRoX2RhdGUAAAAAAAYAAAAAAAAACGNhcmJvbl9nAAAABAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAVwaGFzZQAAAAAAAAQAAAAAAAAABHRpZXIAAAAEAAAAAAAAAAp0cmVlX2NvdW50AAAAAAAE",
            "AAAABQAAAAAAAAAAAAAADkV2ZW50RG5mdEdyb3duAAAAAAACAAAABGRuZnQAAAAGZ3Jvd3RoAAAAAAADAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAAAAAApiaW9tYXNzX2tnAAAAAAAEAAAAAAAAAAAAAAAFcGhhc2UAAAAAAAAEAAAAAAAAAAI=",
            "AAAABQAAAAAAAAAAAAAAD0V2ZW50RG5mdEZvcmdlZAAAAAACAAAABGRuZnQAAAAGZm9yZ2VkAAAAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAAAAAAAxuZXdfdG9rZW5faWQAAAAEAAAAAAAAAAAAAAAKdHJlZV9jb3VudAAAAAAABAAAAAAAAAAC",
            "AAAABQAAAAAAAAAAAAAAD0V2ZW50RG5mdE1pbnRlZAAAAAACAAAABGRuZnQAAAAEbWludAAAAAIAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAAAAAACHRva2VuX2lkAAAABAAAAAAAAAAC",
            "AAAAAAAAAAAAAAAIZ2V0X2RuZnQAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAH0AAAAApEbmZ0UmVjb3JkAAA=",
            "AAAAAAAAADIxLiBNSU5UOiBOYXNjaW1lbnRvIGRhIMOhcnZvcmUgKEZhc2UgMSAtIFRyYW5jYWRhKQAAAAAACW1pbnRfZG5mdAAAAAAAAAEAAAAAAAAAAnRvAAAAAAATAAAAAQAAAAQ=",
            "AAAAAAAAAD8yLiBGT1JKQTogRnVzw6NvIEJpb2zDs2dpY2EgKFF1ZWltYSBOIHRva2VucyBwYXJhIGV2b2x1aXIgVGllcikAAAAACmZvcmdlX2RuZnQAAAAAAAIAAAAAAAAABHVzZXIAAAATAAAAAAAAAANpZHMAAAAD6gAAAAQAAAABAAAABA==",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAZvcmFjbGUAAAAAABMAAAAA",
            "AAAAAAAAADU0LiBUUkFOU0ZFUsOKTkNJQTogQ29tIHZlcmlmaWNhw6fDo28gZGUgTG9jayBUZW1wb3JhbAAAAAAAAA10cmFuc2Zlcl9kbmZ0AAAAAAAAAwAAAAAAAAAEZnJvbQAAABMAAAAAAAAAAnRvAAAAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAA",
            "AAAAAAAAAC8zLiBQUk9PRiBPRiBHUk9XVEg6IE9yw6FjdWxvIGluamV0YSBkYWRvcyByZWFpcwAAAAAVcHJvY2Vzc19vcmFjbGVfcmVwb3J0AAAAAAAABAAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAAAdiaW9tYXNzAAAAAAQAAAAAAAAABmNhcmJvbgAAAAAABAAAAAAAAAAFcGhhc2UAAAAAAAAEAAAAAA=="]), options);
        this.options = options;
    }
    fromJSON = {
        get_dnft: (this.txFromJSON),
        mint_dnft: (this.txFromJSON),
        forge_dnft: (this.txFromJSON),
        initialize: (this.txFromJSON),
        transfer_dnft: (this.txFromJSON),
        process_oracle_report: (this.txFromJSON)
    };
}
