import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u32, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CDYOBV2F6URPOR6OPHJ2W4OZUWR2TLNUQGNL6VHSGMMYFN64PAGZEOUD";
    };
};
export type DataKey = {
    tag: "Admin";
    values: void;
} | {
    tag: "Oracle";
    values: void;
} | {
    tag: "Empresa";
    values: readonly [string];
};
export declare const SbtError: {
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
export interface Client {
    /**
     * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    initialize: ({ admin, oracle }: {
        admin: string;
        oracle: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a is_verified transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    is_verified: ({ company }: {
        company: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<boolean>>;
    /**
     * Construct and simulate a add_ods_badge transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Atribui selos da ONU conforme metas atingidas.
     */
    add_ods_badge: ({ company, ods_id }: {
        company: string;
        ods_id: u32;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a update_credits transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Atualiza o balanço de créditos (C-Cred).
     */
    update_credits: ({ company, amount }: {
        company: string;
        amount: i128;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a verify_company transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * Onboarding oficial da empresa com prova jurídica.
     */
    verify_company: ({ company, notary_hash }: {
        company: string;
        notary_hash: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_empresa_sbt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_empresa_sbt: ({ company }: {
        company: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<SbtEmpresaRecord>>;
    /**
     * Construct and simulate a set_carbon_debt transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     * O Oráculo Vereda injeta a dívida (C-Debt) baseada na pegada anual da empresa.
     */
    set_carbon_debt: ({ company, amount }: {
        company: string;
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
        is_verified: (json: string) => AssembledTransaction<boolean>;
        add_ods_badge: (json: string) => AssembledTransaction<null>;
        update_credits: (json: string) => AssembledTransaction<null>;
        verify_company: (json: string) => AssembledTransaction<null>;
        get_empresa_sbt: (json: string) => AssembledTransaction<SbtEmpresaRecord>;
        set_carbon_debt: (json: string) => AssembledTransaction<null>;
    };
}
