import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
// This import is correct
import * as SecureStore from 'expo-secure-store'
import { authApi } from '@/lib/authApi'

const TOKEN_KEY = 'tafuta-auth-token'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean // Changed to track initial load
  isMutating: boolean // Changed to track login/logout actions
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
      try {
        // This usage is correct
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY)
        if (storedToken) {
          setToken(storedToken)
          // In a real app, you'd fetch the user profile here. We'll fake it.
          setUser({ id: '1', email: 'user from storage' })
        }
      } catch (e) {
        console.error('Failed to load token from storage', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadToken()
  }, [])

  const handleAuthAction = async (
    action: Promise<{ token: string; user: User }>
  ) => {
    setIsMutating(true)
    try {
      const { token: newToken, user: newUser } = await action
      setUser(newUser)
      setToken(newToken)
      // This usage is correct
      await SecureStore.setItemAsync(TOKEN_KEY, newToken)
    } finally {
      setIsMutating(false)
    }
  }

  const login = (email: string, pass: string) =>
    handleAuthAction(authApi.login(email, pass))
  const register = (email: string, pass: string) =>
    handleAuthAction(authApi.register(email, pass))

  const logout = async () => {
    setIsMutating(true)
    try {
      await authApi.logout()
      setUser(null)
      setToken(null)
      // This usage is correct
      await SecureStore.deleteItemAsync(TOKEN_KEY)
    } catch (e) {
      console.error('Failed to log out', e)
    } finally {
      setIsMutating(false)
    }
  }

  const value = {
    user,
    token,
    isLoading,
    isMutating, // Provide this for loading spinners on buttons
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
