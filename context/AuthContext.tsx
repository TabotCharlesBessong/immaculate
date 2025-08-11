import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
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
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  register: (email: string, pass: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This effect runs on app startup to check for a stored token
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY)
      if (storedToken) {
        // In a real app, you'd validate the token with your backend here
        setToken(storedToken)
        // You might also fetch the user profile here based on the token
      }
      setIsLoading(false)
    }
    loadToken()
  }, [])

  const login = async (email: string, pass: string) => {
    const { token: newToken, user: newUser } = await authApi.login(email, pass)
    setUser(newUser)
    setToken(newToken)
    await SecureStore.setItemAsync(TOKEN_KEY, newToken)
  }

  const register = async (email: string, pass: string) => {
    const { token: newToken, user: newUser } = await authApi.register(
      email,
      pass
    )
    setUser(newUser)
    setToken(newToken)
    await SecureStore.setItemAsync(TOKEN_KEY, newToken)
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    setToken(null)
    await SecureStore.deleteItemAsync(TOKEN_KEY)
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
