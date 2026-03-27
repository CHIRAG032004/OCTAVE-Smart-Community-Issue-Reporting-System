const mongoose = require('mongoose');

const DEFAULT_MONGODB_URI = 'mongodb://localhost:27017/smart-community';
const DEFAULT_MONGODB_DB_NAME = 'smart-community';
const DEFAULT_MONGODB_OPTIONS = 'retryWrites=true&w=majority&appName=SmartCommunity';

const buildAtlasUri = () => {
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;
    const cluster = process.env.MONGODB_CLUSTER;

    if (!username || !password || !cluster) {
        return null;
    }

    const databaseName = process.env.MONGODB_DB_NAME || DEFAULT_MONGODB_DB_NAME;
    const options = process.env.MONGODB_OPTIONS || DEFAULT_MONGODB_OPTIONS;

    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${databaseName}?${options}`;
};

const getMongoUri = () => {
    return process.env.MONGODB_URI || buildAtlasUri() || DEFAULT_MONGODB_URI;
};

const maskMongoUri = (uri) => {
    return uri.replace(/\/\/([^:/?#]+):([^@]+)@/, '//$1:***@');
};

const connectDatabase = async () => {
    const mongoUri = getMongoUri();

    try {
        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB: ${maskMongoUri(mongoUri)}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = {
    connectDatabase,
    DEFAULT_MONGODB_URI,
    DEFAULT_MONGODB_DB_NAME,
    DEFAULT_MONGODB_OPTIONS,
    buildAtlasUri,
    getMongoUri
};
