import { Client, Account, Databases, Storage, Teams } from 'appwrite'
import { Client as ServerClient, Databases as ServerDatabases, Users, Storage as ServerStorage } from 'node-appwrite'
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''
const apiKey = process.env.APPWRITE_API_KEY || ''
export const client = new Client().setEndpoint(endpoint).setProject(projectId)
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const teams = new Teams(client)
export const serverClient = new ServerClient().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
export const serverDatabases = new ServerDatabases(serverClient)
export const serverUsers = new Users(serverClient)
export const serverStorage = new ServerStorage(serverClient)
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'prowriter_db'
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
  ARTICLES: process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID || 'articles',
} as const
