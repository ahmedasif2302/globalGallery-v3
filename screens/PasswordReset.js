import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// SAFE AREA VIEW
import { SafeAreaView } from "react-native-safe-area-context";
// ICONS
import { Ionicons } from "@expo/vector-icons";
// FIREBASE
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import firebaseConfig from "../config/firebaseConfig";
import { initializeApp } from "firebase/app";

// INITALIZING APP
initializeApp(firebaseConfig);

// CURRENT USER
const auth = getAuth();

//#region
export default class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  resetPassword = () => {
    sendPasswordResetEmail(auth, this.state.email)
      .then(() => {
        // Password reset email sent!
        alert("sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorCode);
      });
  };
  render() {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons
              name="arrow-undo-circle-outline"
              color="#e60557"
              size={40}
              style={{ lineHeight: 50, marginLeft: 20 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Password</Text>
        </View>
        <View style={[styles.card, styles.shadowProp]}>
          <View>
            <Text style={styles.heading}>
              You Will Recieve An Email To Reset Password ( the email which are
              giving )
            </Text>
          </View>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              color: "#e60557",
              borderRadius: 5,
            }}
            keyboardType="email-address"
            placeholder="example@gmail.com"
            textContentType="emailAddress"
            value={this.state.email}
            onChangeText={(email) =>
              this.setState({
                email: email,
              })
            }
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#e60557",
              padding: 10,
              borderRadius: 5,
              width: "100%",
              alignSelf: "center",
              marginTop: 10,
            }}
            onPress={this.resetPassword}
          >
            <Text style={{ color: "white", textAlign: "center" }}>SEND</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  title: {
    color: "#e60557",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 13,
    color: "#e60557",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: "90%",
    marginVertical: 10,
    alignSelf: "center",
    marginTop: 40,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

//#endregion
