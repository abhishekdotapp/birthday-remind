import {Client, Account, Databases, Functions} from "appwrite";

// Configuration with fallbacks
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '68b9b6670028f76a3e46';

// Log configuration for debugging (safe since these are public)
console.log('Appwrite Config:', { endpoint, projectId });

// Validate configuration
if (!endpoint || !projectId) {
    throw new Error('Missing Appwrite configuration. Please check your environment variables.');
}

const client = new Client();

client
    .setEndpoint(endpoint)
    .setProject(projectId)

export const account = new Account(client);
export const database = new Databases(client);
export const functions = new Functions(client);

export default client;
