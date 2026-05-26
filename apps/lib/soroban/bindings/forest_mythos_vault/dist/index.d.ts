import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, u64 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CAZ3URJTTXQCDFQTJFW6DN5ZGI7DEAAYDHEJBWQDUJ3PCFXJMK5RWBJ3";
    };
};
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Oracle";
    values: void;
} | {
    tag: "TokenCounter";
    values: void;
} | {
    tag: "Token";
    values: readonly [u32];
};
export declare const DnftError: {
    1: {
        message: string;
    };
    2: {
        message: string;
    };
    3: {
        message: string;
    };
    4: {
        message: string;
    };
    5: {
        message: string;
    };
    6: {
        message: string;
    };
};
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
    get_dnft: ({ token_id }: {
        token_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<DnftRecord>>;
    /**
     * Construct and simulate a mint_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 1. MINT: Nascimento da árvore (Fase 1 - Trancada)
     */
    mint_dnft: ({ to }: {
        to: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a forge_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 2. FORJA: Fusão Biológica (Queima N tokens para evoluir Tier)
     */
    forge_dnft: ({ user, ids }: {
        user: string;
        ids: Array<u32>;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: ({ admin, oracle }: {
        admin: string;
        oracle: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a transfer_dnft transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 4. TRANSFERÊNCIA: Com verificação de Lock Temporal
     */
    transfer_dnft: ({ from, to, token_id }: {
        from: string;
        to: string;
        token_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a process_oracle_report transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 3. PROOF OF GROWTH: Oráculo injeta dados reais
     */
    process_oracle_report: ({ token_id, biomass, carbon, phase }: {
        token_id: u32;
        biomass: u32;
        carbon: u32;
        phase: u32;
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
        get_dnft: (json: string) => AssembledTransaction<DnftRecord>;
        mint_dnft: (json: string) => AssembledTransaction<number>;
        forge_dnft: (json: string) => AssembledTransaction<number>;
        initialize: (json: string) => AssembledTransaction<null>;
        transfer_dnft: (json: string) => AssembledTransaction<null>;
        process_oracle_report: (json: string) => AssembledTransaction<null>;
    };
}
