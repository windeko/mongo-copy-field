export interface ConnectionParamsUrl {
    url: string;
}

export interface ConnectionParamsRaw {
    host: string,
    port?: number,
    db?: string,
    username?: string,
    password?: string,
    authSource?: string,
}

export interface CopyValuesResult {
    matchedCount: number,
    modifiedCount: number,
    upsertedCount: number,
}
