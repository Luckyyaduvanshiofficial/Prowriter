import { account, serverDatabases, DATABASE_ID, COLLECTIONS } from './appwrite'
import { ID, Query } from 'appwrite'
export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
export async function signUp(email: string, password: string, name?: string) {
  try {
    const user = await account.create(ID.unique(), email, password, name)
    await account.createEmailPasswordSession(email, password)
    await createUserProfile(user., email, name)
    return { success: true, user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return { success: true, session }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
export async function signOut() {
  try {
    await account.deleteSession('current')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await account.get()
    return {
      id: user.,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerification,
      createdAt: user.,
      updatedAt: user.,
    }
  } catch (error) {
    return null
  }
}
async function createUserProfile(userId: string, email: string, name?: string) {
  try {
    await serverDatabases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), {
      userId,
      email,
      name: name || '',
      plan: 'free',
      articlesGeneratedToday: 0,
      subscriptionStatus: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Create profile error:', error)
  }
}
export async function getUserProfile(userId: string) {
  try {
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.USERS,
      [Query.equal('userId', userId)]
    )
    return response.documents.length > 0 ? response.documents[0] : null
  } catch (error) {
    return null
  }
}
export async function updateUserProfile(userId: string, data: any) {
  try {
    const profile = await getUserProfile(userId)
    if (!profile) return { success: false, error: 'Profile not found' }
    await serverDatabases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      profile.,
      { ...data, updatedAt: new Date().toISOString() }
    )
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
