import {MongoClient} from 'mongodb'
import {ConnectionParamsRaw, ConnectionParamsUrl, CopyValuesResult} from "./interfaces";
import {Errors} from "./errors";

export class MongoCopyField {
    private mongoClient: MongoClient | undefined
    private mongoDB: any

    private constructor(mClient: MongoClient) {
        this.mongoClient = mClient
        this.mongoDB = mClient.db()
    }

    static async connect(params: ConnectionParamsUrl | ConnectionParamsRaw) {
        if (!(MongoCopyField.validate(params))) throw Error(Errors.InvalidConnectionParams)
        const connectionUrl = MongoCopyField.constructConnectionUrl(params)

        const mClient = await MongoClient.connect(connectionUrl, {
            poolSize: 5,
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

        return new MongoCopyField(mClient)
    }

    async copyValues(collection: string, oldField: string, newField: string, deleteOldField: boolean = false): Promise<CopyValuesResult> {
        try {
            const selector = {[oldField]: {$exists: true}}
            const operations: object[] = [
                {$set: {[newField]: `$${oldField}`}}
            ]
            if (deleteOldField) {
                operations.push({$unset: [`${oldField}`]})
            }

            const updResult = await this.mongoDB.collection(collection).updateMany(selector, operations)

            return {
                matchedCount: updResult.matchedCount,
                modifiedCount: updResult.modifiedCount,
                upsertedCount: updResult.upsertedCount,
            }
        } catch (e) {
            throw e
        }
    }

    private static constructConnectionUrl(params: ConnectionParamsUrl | ConnectionParamsRaw): string {
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

    private static validate(params: ConnectionParamsUrl | ConnectionParamsRaw): boolean {
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
