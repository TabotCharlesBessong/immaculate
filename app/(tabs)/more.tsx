import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { useAuth } from '@/context/AuthContext'
import ScreenWrapper from '@/components/ScreenWrapper'
import { COLORS, FONTS, SIZES } from '@/constants/theme'

// Reusable list item component for this screen
const MenuListItem = ({
  href,
  title,
  icon,
}: {
  href: string
  title: string
  icon: React.ComponentProps<typeof FontAwesome>['name']
}) => (
  // @ts-ignore
  <Link href={href} asChild>
    <TouchableOpacity style={styles.listItem}>
      <FontAwesome
        name={icon}
        size={20}
        color={COLORS.secondary}
        style={styles.icon}
      />
      <Text style={styles.listItemText}>{title}</Text>
      <FontAwesome name="chevron-right" size={16} color={COLORS.gray} />
    </TouchableOpacity>
  </Link>
)

export default function MoreScreen() {
  const { logout } = useAuth()

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.header}>Menu</Text>

        <View style={styles.menuContainer}>
          <MenuListItem href="/scanner" title="Scanner" icon="qrcode" />
          <View style={styles.separator} />
          <MenuListItem href="/add" title="Add Photo" icon="plus-square" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
  },
  header: {
    ...FONTS.h1,
    marginBottom: SIZES.padding,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
  },
  icon: {
    width: 30,
  },
  listItemText: {
    ...FONTS.body3,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.light,
    marginHorizontal: -SIZES.padding,
  },
  logoutButton: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  logoutText: {
    ...FONTS.h3,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
})
