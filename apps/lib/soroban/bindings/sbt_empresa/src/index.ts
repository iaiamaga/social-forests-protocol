import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
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
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "Oracle", values: void} | {tag: "Empresa", values: readonly [string]};

export const SbtError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"Unauthorized"},
  4: {message:"SbtNotFound"},
  5: {message:"ArithmeticOverflow"}
}



export interface SbtEmpresaRecord {
  biomass_kg: i128;
  c_cred_balance: i128;
  c_debt_balance: i128;
  carbon_seq_g: i128;
  ods_badges: Array<u32>;
  verified: boolean;
}




export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, oracle}: {admin: string, oracle: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_verified transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  is_verified: ({company}: {company: string}, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a add_ods_badge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Atribui selos da ONU conforme metas atingidas.
   */
  add_ods_badge: ({company, ods_id}: {company: string, ods_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a update_credits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Atualiza o balanço de créditos (C-Cred).
   */
  update_credits: ({company, amount}: {company: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a verify_company transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Onboarding oficial da empresa com prova jurídica.
   */
  verify_company: ({company, notary_hash}: {company: string, notary_hash: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_empresa_sbt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_empresa_sbt: ({company}: {company: string}, options?: MethodOptions) => Promise<AssembledTransaction<SbtEmpresaRecord>>

  /**
   * Construct and simulate a set_carbon_debt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * O Oráculo Vereda injeta a dívida (C-Debt) baseada na pegada anual da empresa.
   */
  set_carbon_debt: ({company, amount}: {company: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAGT3JhY2xlAAAAAAABAAAAAAAAAAdFbXByZXNhAAAAAAEAAAAT",
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
        "AAAABQAAAAAAAAAAAAAAFEV2ZW50Q29tcGFueVZlcmlmaWVkAAAAAgAAAANzYnQAAAAACHZlcmlmaWVkAAAAAQAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAI=" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        is_verified: this.txFromJSON<boolean>,
        add_ods_badge: this.txFromJSON<null>,
        update_credits: this.txFromJSON<null>,
        verify_company: this.txFromJSON<null>,
        get_empresa_sbt: this.txFromJSON<SbtEmpresaRecord>,
        set_carbon_debt: this.txFromJSON<null>
  }
}