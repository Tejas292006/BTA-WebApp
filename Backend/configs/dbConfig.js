import mongoose from "mongoose"

const connectDatabase = async () => {
    const dbUri = process.env.DB_URI || "mongodb://127.0.0.1:27017/bta_webapp";
    try {
        const data = await mongoose.connect(dbUri);
        console.log(`mongodb connected with server : ${data.connection.host}`);
    } catch (err) {
        console.log(`mongodb not connected due to ${err.message}`);
    }
}

export default connectDatabase;