const { Client, Account, Users } = require('node-appwrite');

const hasAppwriteConfig = Boolean(
    process.env.APPWRITE_ENDPOINT &&
    process.env.APPWRITE_PROJECT_ID &&
    process.env.APPWRITE_API_KEY
);

let client = null;
let account = null;
let users = null;

if (hasAppwriteConfig) {
    client = new Client();
    client
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    account = new Account(client);
    users = new Users(client);
}

module.exports = {
    client,
    account,
    users,
    hasAppwriteConfig
};
