import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { COLORS, SIZES, FONTS } from '@/constants/theme'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, isLoading } = useAuth()

  const handleRegister = async () => {
    try {
      await register(email, password)
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          title="Register"
          onPress={handleRegister}
          isLoading={isLoading}
        />
        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <Link href="/login" style={styles.link}>
            Login
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  )
}

// Reuse the same styles as LoginScreen or create a new one
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: SIZES.padding },
  title: { ...FONTS.h1, textAlign: 'center', marginBottom: SIZES.padding * 2 },
  input: {
    height: 50,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: SIZES.radius,
    paddingHorizontal: 15,
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
  },
  link: { color: COLORS.primary, fontWeight: 'bold' },
})
