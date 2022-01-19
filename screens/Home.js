import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
// SAFE AREA VIEW
import { SafeAreaView } from "react-native-safe-area-context";

//#region
export default function Home({ navigation }) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Global Gallery</Text>
        <Text style={styles.desc}>
          Welcome To Global Gallery. You Can Post Your Paintings{" "}
        </Text>
        <Text style={styles.desc}>
          Also You Will Be Able To See Other Posts
        </Text>
        <Text style={styles.desc}>
          Change Your Profile Photo In Profile Screen
        </Text>
        <Image
          source={require("../assets/paintingImg.png")}
          style={{
            alignSelf: "center",
            width: "70%",
            height: "50%",
            marginTop: 20,
          }}
        />
        <Text style={styles.desc}>Have A Nice Journy !</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  title: {
    color: "#3471eb",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  desc: {
    color: "#3471eb",
    textAlign: "center",
    paddingTop: 20,
    fontSize: 15,
  },
});
//#endregion
