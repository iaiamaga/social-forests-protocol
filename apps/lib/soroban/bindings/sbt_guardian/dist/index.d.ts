import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CAZ3MEZJT4SDEMOUV2UB5LCDKMUIXQI4NO4JLNNUBC3JWCPLEYHCRJRT";
    };
};
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "UserSbt";
    values: readonly [string];
};
export interface GuardianSbt {
    era: u32;
    join_date: u64;
    level: u32;
    xp: u32;
}
export declare const GuardianError: {
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
};
export interface Client {
    /**
     * Construct and simulate a add_xp transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Atribui XP ao utilizador (chamado pelo Orquestrador)
     */
    add_xp: ({ user, amount }: {
        user: string;
        amount: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<u32>>;
    /**
     * Construct and simulate a get_sbt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_sbt: ({ user }: {
        user: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<GuardianSbt>>;
    /**
     * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 🛡️ SOULBOUND ENFORCEMENT
     */
    transfer: ({ from, to, amount }: {
        from: string;
        to: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: ({ admin }: {
        admin: string;
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
        add_xp: (json: string) => AssembledTransaction<number>;
        get_sbt: (json: string) => AssembledTransaction<GuardianSbt>;
        transfer: (json: string) => AssembledTransaction<null>;
        initialize: (json: string) => AssembledTransaction<null>;
    };
}
