import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { COLORS, SIZES, FONTS } from '@/constants/theme'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { register, isMutating } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    // More robust validation for registration
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The passwords do not match.')
      return
    }

    try {
      await register(email, password)
      // On success, we can optionally show an alert before redirection happens
      Alert.alert(
        'Success',
        'Your account has been created successfully!',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }] // Explicit redirect just in case
      )
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'An unknown error occurred.'
      )
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Join the Tafuta community today.</Text>

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
          secureTextEntry
          placeholderTextColor={COLORS.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={COLORS.gray}
        />

        <Button
          title="Create Account"
          onPress={handleRegister}
          isLoading={isMutating}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.link}>Log In</Text>
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  )
}

// You can reuse the exact same styles from login.tsx or copy them here.
// For simplicity, we'll copy them.
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
