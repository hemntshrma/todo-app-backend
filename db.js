import { MongoClient } from 'mongodb'

let db = null;

const CLUSTER_URL = "mongodb+srv://pvttpndt:pvttpndt@cluster0.3auluw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(CLUSTER_URL)

// async make a function asynchronous, we can use await
async function connectToDatabase(dbName) {
    if (db == null) {
        try {
            // await waits for a mongodb connection to finish before moving to the next line in an async function.
            await client.connect();
            db = client.db(dbName)
            console.log("database connected successfull")
        } catch (e) {
            console.log(`database connection, error ${e.message}`)
        }
    } else {
        console.log("database not connected")
    }
    return db;
}

export default connectToDatabase;