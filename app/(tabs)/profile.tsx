import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useAuth } from '@/context/AuthContext'
import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/Button'
import { FONTS, SIZES } from '@/constants/theme'

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth()

  // Here, you would fetch the full user profile if `user` object in context is minimal
  // For now, we'll just display the email from the context.

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.emailText}>
          Logged in as: {user ? user.email : '...'}
        </Text>
        <Button
          title="Log Out"
          onPress={logout}
          isLoading={isLoading}
          variant="secondary"
        />
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    marginBottom: SIZES.padding,
  },
  emailText: {
    ...FONTS.body3,
    marginBottom: SIZES.padding * 2,
  },
})
