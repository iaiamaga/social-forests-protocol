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
        contractId: "CDYOBV2F6URPOR6OPHJ2W4OZUWR2TLNUQGNL6VHSGMMYFN64PAGZEOUD",
    }
};
export const SbtError = {
    1: { message: "AlreadyInitialized" },
    2: { message: "NotInitialized" },
    3: { message: "Unauthorized" },
    4: { message: "SbtNotFound" },
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
        super(new ContractSpec(["AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAGT3JhY2xlAAAAAAABAAAAAAAAAAdFbXByZXNhAAAAAAEAAAAT",
            "AAAABAAAAAAAAAAAAAAACFNidEVycm9yAAAABQAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAA5Ob3RJbml0aWFsaXplZAAAAAAAAgAAAAAAAAAMVW5hdXRob3JpemVkAAAAAwAAAAAAAAALU2J0Tm90Rm91bmQAAAAABAAAAAAAAAASQXJpdGhtZXRpY092ZXJmbG93AAAAAAAF",
            "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAAZvcmFjbGUAAAAAABMAAAAA",
            "AAAAAAAAAAAAAAALaXNfdmVyaWZpZWQAAAAAAQAAAAAAAAAHY29tcGFueQAAAAATAAAAAQAAAAE=",
            "AAAABQAAAAAAAAAAAAAAD0V2ZW50QmFkZ2VBZGRlZAAAAAACAAAAA3NidAAAAAALYmFkZ2VfYWRkZWQAAAAAAgAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAAAAAAGb2RzX2lkAAAAAAAEAAAAAAAAAAI=",
            "AAAAAQAAAAAAAAAAAAAAEFNidEVtcHJlc2FSZWNvcmQAAAAGAAAAAAAAAApiaW9tYXNzX2tnAAAAAAALAAAAAAAAAA5jX2NyZWRfYmFsYW5jZQAAAAAACwAAAAAAAAAOY19kZWJ0X2JhbGFuY2UAAAAAAAsAAAAAAAAADGNhcmJvbl9zZXFfZwAAAAsAAAAAAAAACm9kc19iYWRnZXMAAAAAA+oAAAAEAAAAAAAAAAh2ZXJpZmllZAAAAAE=",
            "AAAAAAAAAC5BdHJpYnVpIHNlbG9zIGRhIE9OVSBjb25mb3JtZSBtZXRhcyBhdGluZ2lkYXMuAAAAAAANYWRkX29kc19iYWRnZQAAAAAAAAIAAAAAAAAAB2NvbXBhbnkAAAAAEwAAAAAAAAAGb2RzX2lkAAAAAAAEAAAAAA==",
            "AAAABQAAAAAAAAAAAAAAEEV2ZW50RGVidFVwZGF0ZWQAAAACAAAAA3NidAAAAAALZGVidF91cGRhdGUAAAAAAgAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAAAAAAIbmV3X2RlYnQAAAALAAAAAAAAAAI=",
            "AAAAAAAAACpBdHVhbGl6YSBvIGJhbGFuw6dvIGRlIGNyw6lkaXRvcyAoQy1DcmVkKS4AAAAAAA51cGRhdGVfY3JlZGl0cwAAAAAAAgAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAAAAAAADJPbmJvYXJkaW5nIG9maWNpYWwgZGEgZW1wcmVzYSBjb20gcHJvdmEganVyw61kaWNhLgAAAAAADnZlcmlmeV9jb21wYW55AAAAAAACAAAAAAAAAAdjb21wYW55AAAAABMAAAAAAAAAC25vdGFyeV9oYXNoAAAAABAAAAAA",
            "AAAAAAAAAAAAAAAPZ2V0X2VtcHJlc2Ffc2J0AAAAAAEAAAAAAAAAB2NvbXBhbnkAAAAAEwAAAAEAAAfQAAAAEFNidEVtcHJlc2FSZWNvcmQ=",
            "AAAAAAAAAE9PIE9yw6FjdWxvIFZlcmVkYSBpbmpldGEgYSBkw612aWRhIChDLURlYnQpIGJhc2VhZGEgbmEgcGVnYWRhIGFudWFsIGRhIGVtcHJlc2EuAAAAAA9zZXRfY2FyYm9uX2RlYnQAAAAAAgAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
            "AAAABQAAAAAAAAAAAAAAEkV2ZW50Q3JlZGl0VXBkYXRlZAAAAAAAAgAAAANzYnQAAAAADWNyZWRpdF91cGRhdGUAAAAAAAACAAAAAAAAAAdjb21wYW55AAAAABMAAAAAAAAAAAAAAA1jcmVkaXRfY2hhbmdlAAAAAAAACwAAAAAAAAAC",
            "AAAABQAAAAAAAAAAAAAAFEV2ZW50Q29tcGFueVZlcmlmaWVkAAAAAgAAAANzYnQAAAAACHZlcmlmaWVkAAAAAQAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAI="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        is_verified: (this.txFromJSON),
        add_ods_badge: (this.txFromJSON),
        update_credits: (this.txFromJSON),
        verify_company: (this.txFromJSON),
        get_empresa_sbt: (this.txFromJSON),
        set_carbon_debt: (this.txFromJSON)
    };
}
