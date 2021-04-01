import {MongoClient, Db} from 'mongodb'
import {ConnectionParamsRaw, ConnectionParamsUrl} from "./interfaces";
import {Errors} from "./errors";

export class MongoCopyField {
    private mongoClient
    private mongoDB
    public dbName

    constructor(params: ConnectionParamsUrl | ConnectionParamsRaw) {
        if (!(this.validate(params))) throw Error(Errors.InvalidConnectionParams)
        const connectionUrl = this.constructConnectionUrl(params)

        this.mongoClient = new MongoClient(connectionUrl, {
            poolSize: 5,
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        this.mongoDB = this.mongoClient.db()
        this.dbName = this.mongoDB.databaseName
    }

    private constructConnectionUrl(params: ConnectionParamsUrl | ConnectionParamsRaw): string {
        if ('url' in params) return params.url

        let connDBStr = 'mongodb://'
        if (params.username) {
            connDBStr += encodeURIComponent(params.username);
            if (params.password) {
                connDBStr += ':' + encodeURIComponent(params.password);
            }
            connDBStr += '@';
        }
        connDBStr += params.host;
        if (params.port) {
            connDBStr += ':' + params.port;
        }
        if (params.db) {
            connDBStr += '/' + encodeURIComponent(params.db);
        }

        return connDBStr
    }

    private validate(params: ConnectionParamsUrl | ConnectionParamsRaw): boolean {
        if ('url' in params) return true

        if (
            !('host' in params) ||
            !('port' in params) ||
            !('db' in params) ||
            !('username' in params) ||
            !('password' in params)
        ) return false

        return true
    }
}
