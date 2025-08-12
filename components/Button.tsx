import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { COLORS, FONTS, SIZES } from '@/constants/theme'

interface ButtonProps {
  title: string
  onPress: () => void
  isLoading?: boolean
  variant?: 'primary' | 'secondary'
}

const Button = ({
  title,
  onPress,
  isLoading = false,
  variant = 'primary',
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  text: {
    color: COLORS.white,
    ...FONTS.h3,
  },
})

export default Button
