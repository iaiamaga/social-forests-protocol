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
    contractId: "CB5ZWH43V7BLLTFYLOYJCFRBQBKQWIPTRJMS4HEFJQX5SHYZEM2V5K3C",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "SbtContract", values: void} | {tag: "Position", values: readonly [string]};

export const MasterError = {
  1: {message:"NotInitialized"},
  2: {message:"InsufficientCredits"},
  3: {message:"Unauthorized"},
  4: {message:"ArithmeticOverflow"},
  5: {message:"AlreadyInitialized"}
}


export interface SbtEmpresaRecord {
  biomass_kg: i128;
  c_cred_balance: i128;
  c_debt_balance: i128;
  carbon_seq_g: i128;
  ods_badges: Array<u32>;
  verified: boolean;
}




export interface CollateralPosition {
  asset_type: u32;
  last_sync_ledger: u32;
  total_units: u32;
}


export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: ({admin, sbt_contract}: {admin: string, sbt_contract: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a settle_debt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 3. COMPENSAÇÃO: "Aposenta" créditos para abater a dívida ambiental
   */
  settle_debt: ({company, amount}: {company: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_position transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_position: ({company}: {company: string}, options?: MethodOptions) => Promise<AssembledTransaction<CollateralPosition>>

  /**
   * Construct and simulate a add_inventory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 1. GESTÃO DE INVENTÁRIO: Adiciona mudas ao lastro da empresa
   */
  add_inventory: ({company, units, asset_type}: {company: string, units: u32, asset_type: u32}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a trade_credits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * 2. DEFI MARKETPLACE: Negocia C-Cred excedente entre empresas parceiras
   */
  trade_credits: ({from, to, amount}: {from: string, to: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAALU2J0Q29udHJhY3QAAAAAAQAAAAAAAAAIUG9zaXRpb24AAAABAAAAEw==",
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
        "AAAAAAAAAEYyLiBERUZJIE1BUktFVFBMQUNFOiBOZWdvY2lhIEMtQ3JlZCBleGNlZGVudGUgZW50cmUgZW1wcmVzYXMgcGFyY2VpcmFzAAAAAAANdHJhZGVfY3JlZGl0cwAAAAAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAGYW1vdW50AAAAAAALAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        settle_debt: this.txFromJSON<null>,
        get_position: this.txFromJSON<CollateralPosition>,
        add_inventory: this.txFromJSON<null>,
        trade_credits: this.txFromJSON<null>
  }
}