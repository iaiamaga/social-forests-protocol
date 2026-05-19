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
    contractId: "CDYBW7E33UT73BFVE73K6CWRCWK33O7DHCMZC6Z4HU2BX635ONPD7T6D",
  }
} as const

export type DataKey = {tag: "Admin", values: void} | {tag: "LeafToken", values: void} | {tag: "SbtGuardian", values: void} | {tag: "SbtCompany", values: void} | {tag: "MasterChief", values: void} | {tag: "MythosVault", values: void};

export const OrchestratorError = {
  1: {message:"AlreadyInitialized"},
  2: {message:"Unauthorized"}
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Inicializa a Orquestra com os IDs de todos os contratos core
   */
  initialize: ({admin, leaf, sbt_g, sbt_c, master, mythos}: {admin: string, leaf: string, sbt_g: string, sbt_c: string, master: string, mythos: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a plant_tree transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  plant_tree: ({user, leaf_cost}: {user: string, leaf_cost: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a forge_mythos transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  forge_mythos: ({user, ids, fee}: {user: string, ids: Array<u32>, fee: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a institutional_onboarding transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  institutional_onboarding: ({company, units, carbon_debt, notary_hash, leaf_cashback}: {company: string, units: u32, carbon_debt: i128, notary_hash: string, leaf_cashback: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

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
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABgAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAJTGVhZlRva2VuAAAAAAAAAAAAAAAAAAALU2J0R3VhcmRpYW4AAAAAAAAAAAAAAAAKU2J0Q29tcGFueQAAAAAAAAAAAAAAAAALTWFzdGVyQ2hpZWYAAAAAAAAAAAAAAAALTXl0aG9zVmF1bHQA",
        "AAAABAAAAAAAAAAAAAAAEU9yY2hlc3RyYXRvckVycm9yAAAAAAAAAgAAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAABAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAC",
        "AAAAAAAAADxJbmljaWFsaXphIGEgT3JxdWVzdHJhIGNvbSBvcyBJRHMgZGUgdG9kb3Mgb3MgY29udHJhdG9zIGNvcmUAAAAKaW5pdGlhbGl6ZQAAAAAABgAAAAAAAAAFYWRtaW4AAAAAAAATAAAAAAAAAARsZWFmAAAAEwAAAAAAAAAFc2J0X2cAAAAAAAATAAAAAAAAAAVzYnRfYwAAAAAAABMAAAAAAAAABm1hc3RlcgAAAAAAEwAAAAAAAAAGbXl0aG9zAAAAAAATAAAAAA==",
        "AAAAAAAAAAAAAAAKcGxhbnRfdHJlZQAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAACWxlYWZfY29zdAAAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAMZm9yZ2VfbXl0aG9zAAAAAwAAAAAAAAAEdXNlcgAAABMAAAAAAAAAA2lkcwAAAAPqAAAABAAAAAAAAAADZmVlAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAYaW5zdGl0dXRpb25hbF9vbmJvYXJkaW5nAAAABQAAAAAAAAAHY29tcGFueQAAAAATAAAAAAAAAAV1bml0cwAAAAAAAAQAAAAAAAAAC2NhcmJvbl9kZWJ0AAAAAAsAAAAAAAAAC25vdGFyeV9oYXNoAAAAABAAAAAAAAAADWxlYWZfY2FzaGJhY2sAAAAAAAALAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<null>,
        plant_tree: this.txFromJSON<null>,
        forge_mythos: this.txFromJSON<null>,
        institutional_onboarding: this.txFromJSON<null>
  }
}