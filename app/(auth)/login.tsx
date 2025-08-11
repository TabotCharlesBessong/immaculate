import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { COLORS, SIZES, FONTS } from '@/constants/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading } = useAuth()
  // const router = useRouter()

  const handleLogin = async () => {
    try {
      await login(email, password)
      // The router will automatically redirect on successful login
      // due to the logic in our root layout (see next ticket)
    } catch (error: any) {
      Alert.alert('Login Failed', error.message)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
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
        <Button title="Login" onPress={handleLogin} isLoading={isLoading} />
        <View style={styles.footer}>
          <Text>Don&#39;t have an account? </Text>
          <Link href="/register" style={styles.link}>
            Register
          </Link>
        </View>
      </View>
    </ScreenWrapper>
  )
}

// Add styles...
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
