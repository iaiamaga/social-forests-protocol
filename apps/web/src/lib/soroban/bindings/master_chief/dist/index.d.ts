import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CB5ZWH43V7BLLTFYLOYJCFRBQBKQWIPTRJMS4HEFJQX5SHYZEM2V5K3C";
    };
};
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "SbtContract";
    values: void;
} | {
    tag: "Position";
    values: readonly [string];
};
export declare const MasterError: {
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
    initialize: ({ admin, sbt_contract }: {
        admin: string;
        sbt_contract: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a settle_debt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 3. COMPENSAÇÃO: "Aposenta" créditos para abater a dívida ambiental
     */
    settle_debt: ({ company, amount }: {
        company: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_position transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_position: ({ company }: {
        company: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<CollateralPosition>>;
    /**
     * Construct and simulate a add_inventory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 1. GESTÃO DE INVENTÁRIO: Adiciona mudas ao lastro da empresa
     */
    add_inventory: ({ company, units, asset_type }: {
        company: string;
        units: u32;
        asset_type: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a trade_credits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * 2. DEFI MARKETPLACE: Negocia C-Cred excedente entre empresas parceiras
     */
    trade_credits: ({ from, to, amount }: {
        from: string;
        to: string;
        amount: i128;
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
        settle_debt: (json: string) => AssembledTransaction<null>;
        get_position: (json: string) => AssembledTransaction<CollateralPosition>;
        add_inventory: (json: string) => AssembledTransaction<null>;
        trade_credits: (json: string) => AssembledTransaction<null>;
    };
}
