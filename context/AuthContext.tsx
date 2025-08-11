import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { authApi } from '@/lib/authApi'

const TOKEN_KEY = 'tafuta-auth-token'
console.log('AuthContext file is being read.')

// Storage abstraction layer
const createStorage = () => {
  // Check if we're in a web environment
  if (typeof window !== 'undefined') {
    return {
      async getItem(key: string): Promise<string | null> {
        try {
          return localStorage.getItem(key)
        } catch (error) {
          console.error('Error getting item from localStorage:', error)
          return null
        }
      },
      async setItem(key: string, value: string): Promise<void> {
        try {
          localStorage.setItem(key, value)
        } catch (error) {
          console.error('Error setting item in localStorage:', error)
        }
      },
      async removeItem(key: string): Promise<void> {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          console.error('Error removing item from localStorage:', error)
        }
      },
    }
  }

  // For React Native/Expo environments
  try {
    // Dynamic import to avoid issues in web environments
    const SecureStore = require('expo-secure-store')
    return {
      async getItem(key: string): Promise<string | null> {
        try {
          return await SecureStore.getItemAsync(key)
        } catch (error) {
          console.error('Error getting item from SecureStore:', error)
          return null
        }
      },
      async setItem(key: string, value: string): Promise<void> {
        try {
          await SecureStore.setItemAsync(key, value)
        } catch (error) {
          console.error('Error setting item in SecureStore:', error)
        }
      },
      async removeItem(key: string): Promise<void> {
        try {
          await SecureStore.deleteItemAsync(key)
        } catch (error) {
          console.error('Error removing item from SecureStore:', error)
        }
      },
    }
  } catch (error) {
    console.warn('SecureStore not available, falling back to memory storage')
    // Fallback to in-memory storage (not persistent)
    let memoryStorage: { [key: string]: string } = {}
    return {
      async getItem(key: string): Promise<string | null> {
        return memoryStorage[key] || null
      },
      async setItem(key: string, value: string): Promise<void> {
        memoryStorage[key] = value
      },
      async removeItem(key: string): Promise<void> {
        delete memoryStorage[key]
      },
    }
  }
}

const storage = createStorage()

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean // For initial app load
  isMutating: boolean // For login/register/logout actions
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)

  useEffect(() => {
    const loadToken = async () => {
      console.log('[Auth] Checking for stored token...')
      try {
        const storedToken = await storage.getItem(TOKEN_KEY)
        if (storedToken) {
          console.log('[Auth] Token found in storage!')
          setToken(storedToken)
          setUser({ id: 'cached-user', email: 'Logged in from storage' })
        } else {
          console.log('[Auth] No token found in storage.')
        }
      } catch (error) {
        console.error('[Auth] Error loading token from storage:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadToken()
  }, [])

  const login = async (email: string, pass: string) => {
    setIsMutating(true)
    console.log('[Auth] Attempting login via context...')
    try {
      const { token: newToken, user: newUser } = await authApi.login(
        email,
        pass
      )
      console.log('[Auth] Login API call successful. Setting state.')
      setToken(newToken)
      setUser(newUser)
      await storage.setItem(TOKEN_KEY, newToken)
    } catch (error) {
      console.error('[Auth] Login API call failed:', error)
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  const register = async (email: string, pass: string) => {
    setIsMutating(true)
    console.log('[Auth] Attempting register via context...')
    try {
      const { token: newToken, user: newUser } = await authApi.register(
        email,
        pass
      )
      console.log('[Auth] Register API call successful. Setting state.')
      setToken(newToken)
      setUser(newUser)
      await storage.setItem(TOKEN_KEY, newToken)
    } catch (error) {
      console.error('[Auth] Register API call failed:', error)
      throw error
    } finally {
      setIsMutating(false)
    }
  }

  const logout = async () => {
    setIsMutating(true)
    console.log('[Auth] Logging out...')
    try {
      await authApi.logout()
      setUser(null)
      setToken(null)
      await storage.removeItem(TOKEN_KEY)
      console.log('[Auth] Logout complete. Token removed.')
    } catch (error) {
      console.error('[Auth] Error during logout:', error)
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isMutating, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook remains the same
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
