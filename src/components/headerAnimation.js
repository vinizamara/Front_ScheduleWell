import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function Animation({ animationType , message  }) {
    return (
        <Animatable.View animation={animationType} style={styles.containerHeader}>
          <Text style={styles.message}>{message}</Text>
        </Animatable.View>
      );
      
}


const styles = StyleSheet.create({
  containerHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "5%",
    paddingVertical: "10%",
    marginTop: -50,
  },
  message: {
    color: "#255573",
    fontFamily: "SuezOne_400Regular",
    fontSize: 28,
  },
});
