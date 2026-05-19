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
    contractId: "CATUQHSIINJTJGIMSROVY47M2IJI2HDTQ2COXGI43Z4UNXQQXIW7WYEB",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "UserSbt", values: readonly [string]};


export interface GuardianSbt {
  era: u32;
  join_date: u64;
  level: u32;
  xp: u32;
}


export const GuardianError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"NotInitialized"},
  3: {message:"Unauthorized"},
  4: {message:"SoulboundToken"},
  5: {message:"ArithmeticOverflow"}
}


export interface Client {
  /**
   * Construct and simulate a add_xp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Atribui XP ao utilizador (chamado pelo Orquestrador)
   */
  add_xp: ({user, amount}: {user: string, amount: u32}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_sbt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_sbt: ({user}: {user: string}, options?: MethodOptions) => Promise<AssembledTransaction<GuardianSbt>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 🛡️ SOULBOUND ENFORCEMENT
   */
  transfer: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin}: {admin: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAQAAAAAAAAAHVXNlclNidAAAAAABAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAC0d1YXJkaWFuU2J0AAAAAAQAAAAAAAAAA2VyYQAAAAAEAAAAAAAAAAlqb2luX2RhdGUAAAAAAAAGAAAAAAAAAAVsZXZlbAAAAAAAAAQAAAAAAAAAAnhwAAAAAAAE",
        "AAAABQAAAAAAAAAAAAAADEV2ZW50TGV2ZWxVcAAAAAIAAAAKcmVwdXRhdGlvbgAAAAAACGxldmVsX3VwAAAAAwAAAAAAAAAEdXNlcgAAABMAAAAAAAAAAAAAAAluZXdfbGV2ZWwAAAAAAAAEAAAAAAAAAAAAAAADZXJhAAAAAAQAAAAAAAAAAg==",
        "AAAABAAAAAAAAAAAAAAADUd1YXJkaWFuRXJyb3IAAAAAAAAFAAAAAAAAABJBbHJlYWR5SW5pdGlhbGl6ZWQAAAAAAAEAAAAAAAAADk5vdEluaXRpYWxpemVkAAAAAAACAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAADAAAAAAAAAA5Tb3VsYm91bmRUb2tlbgAAAAAABAAAAAAAAAASQXJpdGhtZXRpY092ZXJmbG93AAAAAAAF",
        "AAAABQAAAAAAAAAAAAAADUV2ZW50WHBHYWluZWQAAAAAAAACAAAACnJlcHV0YXRpb24AAAAAAAl4cF9nYWluZWQAAAAAAAACAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAAAAAACHRvdGFsX3hwAAAABAAAAAAAAAAC",
        "AAAAAAAAADRBdHJpYnVpIFhQIGFvIHV0aWxpemFkb3IgKGNoYW1hZG8gcGVsbyBPcnF1ZXN0cmFkb3IpAAAABmFkZF94cAAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAABmFtb3VudAAAAAAABAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAHZ2V0X3NidAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAfQAAAAC0d1YXJkaWFuU2J0AA==",
        "AAAAAAAAAB3wn5uh77iPIFNPVUxCT1VORCBFTkZPUkNFTUVOVAAAAAAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAQAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    add_xp: this.txFromJSON<u32>,
        get_sbt: this.txFromJSON<GuardianSbt>,
        transfer: this.txFromJSON<null>,
        initialize: this.txFromJSON<null>
  }
}