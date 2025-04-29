import mongoose from "mongoose";

// Global variable to store the connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
    if (cached.conn) {
        return;
    }

    if (!cached.promise) {
        const options = {
            bufferCommands: true,
            maxPoolSIze: 10
        }
        cached.promise = mongoose.connect(process.env.MONGODB_URI as string, options)
            .then((mongoose) => {
                return mongoose.connection;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDb;