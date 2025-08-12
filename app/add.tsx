import React, { useState } from 'react'
import { View, StyleSheet, Text, Image, Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Button from '@/components/Button'
import { COLORS, FONTS, SIZES } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'

export default function AddContentScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null)

  const pickImageFromGallery = async () => {
    // This function works on all platforms
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  const takePhotoWithCamera = async () => {
    // This function is mobile-only
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Camera access is required to take photos.'
      )
      return
    }

    // ✅ FIX: Changed from Image.launchCameraAsync to ImagePicker.launchCameraAsync
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Add a Photo</Text>
        <Text style={styles.subtitle}>
          {Platform.OS === 'web'
            ? 'Choose a file from your computer.'
            : 'Choose from your gallery or take a new picture.'}
        </Text>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              Your selected image will appear here
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {/* ✅ FIX: Use Platform.select to show the correct button(s) */}
          {Platform.OS === 'web' ? (
            <Button title="Choose File" onPress={pickImageFromGallery} />
          ) : (
            <>
              <Button
                title="Choose from Gallery"
                onPress={pickImageFromGallery}
              />
              <View style={{ marginVertical: 10 }} />
              <Button
                title="Take Photo"
                onPress={takePhotoWithCamera}
                variant="secondary"
              />
            </>
          )}
        </View>

        {imageUri && (
          <Button
            title="Clear Image"
            onPress={() => setImageUri(null)}
            variant="secondary" // Changed variant for better UI
          />
        )}
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.light,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...FONTS.body4,
    color: COLORS.secondary,
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: SIZES.radius,
    resizeMode: 'cover',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 30,
  },
})
