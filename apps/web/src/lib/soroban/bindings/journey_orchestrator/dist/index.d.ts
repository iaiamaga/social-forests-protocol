import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CDYBW7E33UT73BFVE73K6CWRCWK33O7DHCMZC6Z4HU2BX635ONPD7T6D";
    };
};
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "LeafToken";
    values: void;
} | {
    tag: "SbtGuardian";
    values: void;
} | {
    tag: "SbtCompany";
    values: void;
} | {
    tag: "MasterChief";
    values: void;
} | {
    tag: "MythosVault";
    values: void;
};
export declare const OrchestratorError: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
};
export interface Client {
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Inicializa a Orquestra com os IDs de todos os contratos core
     */
    initialize: ({ admin, leaf, sbt_g, sbt_c, master, mythos }: {
        admin: string;
        leaf: string;
        sbt_g: string;
        sbt_c: string;
        master: string;
        mythos: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a plant_tree transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    plant_tree: ({ user, leaf_cost }: {
        user: string;
        leaf_cost: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a forge_mythos transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    forge_mythos: ({ user, ids, fee }: {
        user: string;
        ids: Array<u32>;
        fee: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a institutional_onboarding transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    institutional_onboarding: ({ company, units, carbon_debt, notary_hash, leaf_cashback }: {
        company: string;
        units: u32;
        carbon_debt: i128;
        notary_hash: string;
        leaf_cashback: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        initialize: (json: string) => AssembledTransaction<null>;
        plant_tree: (json: string) => AssembledTransaction<null>;
        forge_mythos: (json: string) => AssembledTransaction<null>;
        institutional_onboarding: (json: string) => AssembledTransaction<null>;
    };
}
