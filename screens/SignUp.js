import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn({ navigation }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const storeName = async () => {
    try {
      await AsyncStorage.setItem("USER-NAME", userName);
    } catch (error) {
      // ERROR SAVING USER NAME
    }
  };

  // VALIDATION
  function signUpHandler() {
    if (userName.length < 1) {
      setErrorMessage("Enter Your Name");
    } else if (email.length < 5) {
      setErrorMessage("Enter Valid Email Adress");
    } else if (password.length < 8) {
      setErrorMessage("Password Should Be Greater Than 8 Charecters");
    } else if (passwordAgain !== password) {
      setErrorMessage("Password Not Matching");
    } else {
      setErrorMessage(null);
      storeName();
    }
  }

  return (
    <>
      <ScrollView>
        <View style={styles.leftCircle} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-undo-circle-outline"
              color="#8022d9"
              size={40}
              style={{ lineHeight: 50, marginLeft: 20 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rightCircle} />
        <View style={styles.container}>
          <Text style={styles.title}>SIGN UP TO GET STARTED</Text>
          <View style={styles.formContainer}>
            <Button
              title="TEMP"
              onPress={() => navigation.navigate("bottomTab")}
            />
            <View style={styles.userNameInput}>
              <Text style={styles.formLabel}>USER NAME</Text>
              <TextInput
                style={styles.formField}
                onChangeText={(name) => setUserName(name)}
                value={userName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.emailInput}>
              <Text style={styles.formLabel}>EMAIL ADRESS</Text>
              <TextInput
                style={styles.formField}
                onChangeText={(email) => setEmail(email)}
                value={email}
                autoCorrect={false}
                autoCapitalize={false}
              />
            </View>

            <View style={styles.passwordInput}>
              <Text style={styles.formLabel}>PASSWORD</Text>
              <TextInput
                style={styles.formField}
                onChangeText={(password) => setPassword(password)}
                value={password}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize={false}
              />
            </View>

            <View style={styles.passwordAgainInput}>
              <Text style={styles.formLabel}>PASSWORD AGAIN</Text>
              <TextInput
                style={styles.formField}
                onChangeText={(password) => setPasswordAgain(password)}
                value={passwordAgain}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize={false}
              />
            </View>

            <TouchableOpacity style={styles.signInBtn} onPress={signUpHandler}>
              <Text style={styles.signInBtnText}>SIGN UP</Text>
            </TouchableOpacity>

            {/* CHECKING IF ERROR MESSAGE IS THERE */}
            {errorMessage ? (
              <View style={styles.errorArea}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>
            ) : (
              <Text /> // SIMPLY NOTHING
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  leftCircle: {
    backgroundColor: "#23A6D5",
    width: "60%",
    height: "30%",
    borderRadius: 150,
    position: "absolute",
    top: -50,
    left: -50,
  },
  rightCircle: {
    backgroundColor: "#8022d9",
    width: "80%",
    height: "45%",
    borderRadius: 250,
    position: "absolute",
    top: -150,
    right: -50,
    zIndex: 1,
  },
  header: {
    width: "100%",
    marginTop: 50,
    height: 50,
  },
  container: {
    marginTop: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#23A6D5",
    paddingTop: 40,
  },
  formContainer: {
    marginLeft: 64,
    marginTop: 32,
    marginRight: 32,
  },
  formLabel: {
    color: "#8e93a1",
    paddingTop: 20,
  },
  formField: {
    borderBottomWidth: 1,
    borderBottomColor: "#8e93a1",
    marginTop: 10,
    paddingBottom: 5,
    color: "#23A6D5",
    fontWeight: "bold",
  },
  signInBtn: {
    backgroundColor: "#23A6D5",
    padding: 15,
    borderRadius: 5,
    marginTop: 40,
  },
  signInBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  signUpText: {
    color: "#8022d9",
    fontWeight: "bold",
    paddingTop: 15,
    textAlign: "center",
  },
  errorArea: {
    backgroundColor: "#FA2A55",
    paddingTop: 25,
    paddingBottom: 25,
    borderRadius: 3,
    marginTop: 10,
  },
  errorMessage: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },
});
