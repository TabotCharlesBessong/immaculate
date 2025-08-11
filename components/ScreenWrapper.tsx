import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '@/constants/theme'

interface ScreenWrapperProps {
  children: React.ReactNode
}

const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
})

export default ScreenWrapper
