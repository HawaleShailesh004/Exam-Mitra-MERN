import { Client, Account, Databases, ID, Permission, Role, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT) // ✅ Your endpoint
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID); // ✅ Your project ID

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);

export { client, account, databases, ID, Permission, Role, functions};
