import mongoose from 'mongoose';

const connectDB = async (mongoURI) => {
    try {
        const data = await mongoose.connect(mongoURI, {
            dbName: "ASTRuleMaster",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to DB: ${data.connection.host}`);
    } catch (err) {
        console.error("Connection falied to DB",err.message);
        process.exit(1);
    }
};

export default connectDB;
