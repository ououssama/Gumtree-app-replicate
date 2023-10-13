import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export default function LoadingScreen() {
    return (
        <View style={[styles.container, styles.vertial]}>
            <View>
                <ActivityIndicator size={'large'} />
                <Text style={styles.text}>Waiting for account to setup</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    vertial: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      padding: 10,
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    }
  });