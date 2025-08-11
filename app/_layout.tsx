import React, { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ActivityIndicator, View } from 'react-native'
import { COLORS } from '@/constants/theme'

// This component handles the redirection logic
const RootLayoutNav = () => {
  const { token, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return // Don't redirect until we've checked for a token

    const inAuthGroup = segments[0] === '(auth)'

    if (token && !inAuthGroup) {
      // User is authenticated but not in the main app group, redirect
      router.replace('/login')
    } else if (!token && !inAuthGroup) {
      router.replace('/(tabs)')
      // User is not authenticated and not in the auth group, redirect
    }
  }, [token, isLoading, segments,router]) // Rerun effect when token or loading state changes

  if (isLoading) {
    // Show a loading spinner or splash screen while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}

// This is the main export which wraps everything in the AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
