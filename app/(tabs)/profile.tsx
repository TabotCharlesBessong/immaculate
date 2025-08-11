import { StyleSheet, Text, View } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/Button'
import React from 'react'

export default function ProfileScreen() {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Profile Screen</Text>
        <Text style={styles.apiKeyText}>
          Google Maps Key: {apiKey ? 'Loaded ✅' : 'Not Found ❌'}
        </Text>
        <Button title="Log Out" onPress={() => alert('Logging out!')} />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  apiKeyText: {
    marginBottom: 20,
    textAlign: 'center',
  },
})
