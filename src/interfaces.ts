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
