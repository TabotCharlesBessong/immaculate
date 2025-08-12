import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { COLORS, SIZES, FONTS } from '@/constants/theme'

export default function LoginScreen() {
  // We pre-fill the state for easier testing during development.
  // For production, you would start with empty strings: useState('').
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password')

  // Get the login function and the loading state from our context
  const { login, isMutating } = useAuth()

  const handleLogin = async () => {
    // Basic validation to ensure fields are not empty
    if (!email || !password) {
      Alert.alert(
        'Missing Information',
        'Please enter both email and password.'
      )
      return
    }

    try {
      // Call the login function from the context
      await login(email, password)
      // On success, the redirection is handled automatically by our root layout (_layout.tsx)
    } catch (error: any) {
      // On failure, show an alert with the error message from our mock API
      Alert.alert('Login Failed', error.message || 'An unknown error occurred.')
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Log in to continue with Tafuta.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.gray}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Hides the password characters
          placeholderTextColor={COLORS.gray}
        />

        <Button title="Login" onPress={handleLogin} isLoading={isMutating} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&#39;t have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.link}>Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  input: {
    height: 55,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.white,
    fontSize: SIZES.body3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.dark,
  },
  link: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
})
