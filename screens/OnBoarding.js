import { View, Text, StyleSheet, TouchableOpacityBase } from "react-native";
import React from "react";

// SAFE AREA VIEW
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnBoarding() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity style={{ backgroundColor: "red" }}>
          <Text>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {},
});
