import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'
// ✅ CORRECT IMPORT: Import CameraView as default and useCameraPermissions as named
import { CameraView, useCameraPermissions } from 'expo-camera'
import Button from '@/components/Button'
import { COLORS, FONTS, SIZES } from '@/constants/theme'

// Define a simple type for the barcode data
interface BarCodeData {
  type: string
  data: string
}

export default function ScannerScreen() {
  // This line is now correct because useCameraPermissions is a named import.
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    if (!permission) {
      requestPermission()
    }
  }, [permission])

  const handleBarCodeScanned = ({ type, data }: BarCodeData) => {
    if (scanned) {
      return
    }
    setScanned(true)
    console.log(`Scanned barcode! Type: ${type}, Data: ${data}`)
    Alert.alert('Scan Successful!', `Type: ${type}\nData: ${data}`, [
      {
        text: 'Scan Again',
        onPress: () => setScanned(false),
      },
    ])
  }

  // --- Permission checking UI remains the same ---
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Camera access denied.</Text>
        <Text style={styles.subText}>
          Please grant camera permission in your device settings to use the
          scanner.
        </Text>
        <Button title={'Grant Permission'} onPress={requestPermission} />
      </View>
    )
  }

  // --- The camera rendering part with correct component ---
  return (
    <View style={styles.cameraContainer}>
      {/* ✅ CORRECT: Using CameraView instead of Camera */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'codabar', 'code128'],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Point camera at a barcode</Text>
          <View style={styles.viewfinder} />
          {scanned && (
            <View style={styles.scanAgainButton}>
              <Button
                title="Tap to Scan Again"
                onPress={() => setScanned(false)}
                variant="secondary"
              />
            </View>
          )}
        </View>
      </CameraView>
    </View>
  )
}

// The styles remain exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.light,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  infoText: {
    ...FONTS.h2,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  subText: {
    ...FONTS.body3,
    textAlign: 'center',
    marginBottom: SIZES.padding,
    color: COLORS.secondary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayText: {
    ...FONTS.h3,
    color: COLORS.white,
    position: 'absolute',
    top: '20%',
  },
  viewfinder: {
    width: 250,
    height: 250,
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: SIZES.radius,
    borderStyle: 'dashed',
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 50,
    width: '60%',
  },
})
