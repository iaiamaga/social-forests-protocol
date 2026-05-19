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
    contractId: "CC3E5J47FPV7HZKSX3XE2Z6Y6X7VFC36HUYHGTC4NP3HMCOESPG7JP55",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "Oracle", values: void} | {tag: "TokenCounter", values: void} | {tag: "Token", values: readonly [u32]};

export const DnftError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"TokenNotFound"},
  3: {message:"Unauthorized"},
  4: {message:"PhaseLocked"},
  5: {message:"InvalidTier"},
  6: {message:"ArithmeticOverflow"}
}


export interface DnftRecord {
  biomass_kg: u32;
  birth_date: u64;
  carbon_g: u32;
  owner: string;
  phase: u32;
  tier: u32;
  tree_count: u32;
}




export interface Client {
  /**
   * Construct and simulate a get_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_dnft: ({token_id}: {token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<DnftRecord>>

  /**
   * Construct and simulate a mint_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 1. MINT: Nascimento da árvore (Fase 1 - Trancada)
   */
  mint_dnft: ({to}: {to: string}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a forge_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 2. FORJA: Fusão Biológica (Queima N tokens para evoluir Tier)
   */
  forge_dnft: ({user, ids}: {user: string, ids: Array<u32>}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, oracle}: {admin: string, oracle: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a transfer_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 4. TRANSFERÊNCIA: Com verificação de Lock Temporal
   */
  transfer_dnft: ({from, to, token_id}: {from: string, to: string, token_id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a process_oracle_report transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 3. PROOF OF GROWTH: Oráculo injeta dados reais
   */
  process_oracle_report: ({token_id, biomass, carbon, phase}: {token_id: u32, biomass: u32, carbon: u32, phase: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAGT3JhY2xlAAAAAAAAAAAAAAAAAAxUb2tlbkNvdW50ZXIAAAABAAAAAAAAAAVUb2tlbgAAAAAAAAEAAAAE",
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
        "AAAAAAAAAC8zLiBQUk9PRiBPRiBHUk9XVEg6IE9yw6FjdWxvIGluamV0YSBkYWRvcyByZWFpcwAAAAAVcHJvY2Vzc19vcmFjbGVfcmVwb3J0AAAAAAAABAAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAAAdiaW9tYXNzAAAAAAQAAAAAAAAABmNhcmJvbgAAAAAABAAAAAAAAAAFcGhhc2UAAAAAAAAEAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_dnft: this.txFromJSON<DnftRecord>,
        mint_dnft: this.txFromJSON<u32>,
        forge_dnft: this.txFromJSON<u32>,
        initialize: this.txFromJSON<null>,
        transfer_dnft: this.txFromJSON<null>,
        process_oracle_report: this.txFromJSON<null>
  }
}