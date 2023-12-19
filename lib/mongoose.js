import mongoose from "mongoose";

export async function mongooseConnect() {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection.asPromise();
        } else {
            const uri = process.env.MONGODB_URI;
            await mongoose.connect(uri);
            return mongoose.connection;
        }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}

// Event listeners for connection events
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});
