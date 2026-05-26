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
    contractId: "CAKIQGO7DY2IG76M5F4XXUCTYDC5NSMOZL7SMRX4TZHY2CU6PMBTZFFF",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "PendingAdmin", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "Metadata", values: void} | {tag: "TotalSupply", values: void};



export const TokenError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"InsufficientBalance"},
  3: {message:"Unauthorized"},
  4: {message:"NegativeAmount"}
}


export interface TokenMetadata {
  decimals: u32;
  name: string;
  symbol: string;
}


export interface Client {
  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 2. QUEIMA (BURN): Usado para pagar Plantio/Forja
   */
  burn: ({from, amount}: {from: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 1. EMISSÃO (MINT): Usado no On-ramp B2B
   */
  mint: ({to, amount}: {to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  name: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  symbol: (options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  balance: ({id}: {id: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a decimals transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  decimals: (options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 3. TRANSFERÊNCIA (PADRÃO)
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, name, symbol, decimals}: {admin: string, name: string, symbol: string, decimals: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a accept_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Two-step admin transfer: new admin accepts
   */
  accept_admin: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a total_supply transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  total_supply: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a propose_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Two-step admin transfer: propose new admin
   */
  propose_admin: ({new_admin}: {new_admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAAAAADAyLiBRVUVJTUEgKEJVUk4pOiBVc2FkbyBwYXJhIHBhZ2FyIFBsYW50aW8vRm9yamEAAAAEYnVybgAAAAIAAAAAAAAABGZyb20AAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
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
        "AAAAAAAAACpUd28tc3RlcCBhZG1pbiB0cmFuc2ZlcjogcHJvcG9zZSBuZXcgYWRtaW4AAAAAAA1wcm9wb3NlX2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    burn: this.txFromJSON<null>,
        mint: this.txFromJSON<null>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        balance: this.txFromJSON<i128>,
        decimals: this.txFromJSON<u32>,
        transfer: this.txFromJSON<null>,
        initialize: this.txFromJSON<null>,
        accept_admin: this.txFromJSON<null>,
        total_supply: this.txFromJSON<i128>,
        propose_admin: this.txFromJSON<null>
  }
}