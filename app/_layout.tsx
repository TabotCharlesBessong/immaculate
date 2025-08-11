import React, { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { COLORS } from '@/constants/theme'

const RootLayoutNav = () => {
  const { token, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    console.log(
      `[Layout] useEffect triggered. isLoading: ${isLoading}, token: ${!!token}, segments: ${segments.join('/')}`
    )
    if (isLoading) {
      // Don't do anything while we're still loading the initial token.
      return
    }

    const inAuthGroup = segments[0] === '(auth)'

    if (token && inAuthGroup) {
      // User is authenticated but is in the auth screen group.
      // This happens after a successful login. Redirect to the main app.
      console.log(
        '[Layout] User is authenticated, redirecting from auth to tabs.'
      )
      router.replace('/(tabs)')
    } else if (!token && !inAuthGroup) {
      // User is not authenticated and is not in the auth group.
      // Redirect them to the login screen.
      console.log('[Layout] User is not authenticated, redirecting to login.')
      router.replace('/(auth)/login')
    }
  }, [token, isLoading, segments,router]) // The dependencies are key

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
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

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Or your app's background color
  },
})
