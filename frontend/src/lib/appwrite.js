import { Account, Client, ID } from 'appwrite';

export const isAppwriteConfigured = Boolean(
  import.meta.env.VITE_APPWRITE_ENDPOINT &&
  import.meta.env.VITE_APPWRITE_PROJECT_ID
);

let account = null;

if (isAppwriteConfigured) {
  const client = new Client();

  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  account = new Account(client);
}

export { account, ID };
