import React, { useState, useEffect, createRef, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// AVATOR -- GET'S THE FIRST 2 LETTERS
import UserAvatar from "react-native-user-avatar";
// PICKING AND TAKING IMAGE FROM EXPO-IMAGE-PICKER
import * as ImagePicker from "expo-image-picker";
// LOCAL STORAGE
import AsyncStorage from "@react-native-async-storage/async-storage";
// BOTTOM SHEET FOR SELECTING IF THE USER WANT TO SELECT IMAGE OR TAKE IMAGE
import RBSheet from "react-native-raw-bottom-sheet";
// FIREBASE CONFIG
import firebaseConfig from "../config/firebaseConfig";
// FIREBASE REQUIREMENTS
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// INITALIZING FIREBASE CONFIG
initializeApp(firebaseConfig);

export default function Profile() {
  // SETTING AVATOR IMAGE
  const [avator, setAvator] = useState("");
  // SAVES THE USER NAME FROM ASYNC STORAGE
  const [userName, setUserName] = useState("");
  // BOTTOM SHEET REFERENCE
  const refRBSheet = useRef();
  // DISPLAY BUTTON
  const [displayEditBtn, setDisplayEditBtn] = useState("block");
  const [displaySaveBtn, setDisplaySaveBtn] = useState("none");
  // FIREBASE
  const storage = getStorage();
  const profilePathRef = ref(storage, "userProfiles/image.jpg");

  // GET'S THE NAME ALL TIME FROM ASYNC STORAGE
  useEffect(() => {
    getName();
  });

  // GET'S THE PROFILE PIC FROM FIREBASE STORAGE
  useEffect(() => {
    getProfile();
  }, [""]);

  const getName = async () => {
    try {
      const value = await AsyncStorage.getItem("USER-NAME");
      if (value !== null) {
        setUserName(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    setAvator(pickerResult.uri);
    refRBSheet.current.close();

    if (pickerResult.uri == null) {
    } else {
      setDisplaySaveBtn("block");
      setDisplayEditBtn("none");
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    setAvator(result.uri);
    // Explore the result

    if (!result.cancelled) {
      setAvator(result.uri);
      refRBSheet.current.close();
    }
  };
  const BottomSheetInner = () => {
    return (
      <>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.sheetTitle}>Upload Photo</Text>
          <Text style={styles.sheetSubtitle}>Choose Your Profile Picture</Text>
        </View>
        <TouchableOpacity style={styles.sheetButton} onPress={openCamera}>
          <Text style={styles.sheetButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sheetButton} onPress={pickImage}>
          <Text style={styles.sheetButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sheetButton}
          onPress={() => refRBSheet.current.close()}
        >
          <Text style={styles.sheetButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </>
    );
  };
  const saveProfile = async () => {
    const img = await fetch(avator);
    const bytes = await img.blob();

    await uploadBytes(profilePathRef, bytes).then(() => {
      alert("Updated Your Profile Sucessfuly");
    });
  };
  const getProfile = () => {
    // Get the download URL
    getDownloadURL(profilePathRef)
      .then((url) => {
        setAvator(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            break;
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      });
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Your Profile</Text>
        <View style={styles.avator}>
          <UserAvatar size={92} name={userName} src={avator} />
          <TouchableOpacity
            style={{ ...styles.btn, display: displayEditBtn }}
            onPress={() => refRBSheet.current.open()}
          >
            <Text style={styles.btnText}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.btn, display: displaySaveBtn }}
            onPress={saveProfile}
          >
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomSheet}>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          closeOnPressMask={() => refRBSheet.current.close()}
          height={320}
          customStyles={{
            draggableIcon: {
              opacity: 0.5,
              backgroundColor: "#000",
            },
          }}
        >
          <BottomSheetInner />
        </RBSheet>
      </View>
    </SafeAreaView>
  );
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
  avator: {
    alignSelf: "center",
    marginTop: 20,
  },
  btn: {
    backgroundColor: "#e60557",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  sheetHandle: {
    width: 40,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 27,
    height: 35,
    color: "#e60557",
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#e60557",
    height: 30,
    marginBottom: 10,
  },
  sheetButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#e60557",
    alignItems: "center",
    marginVertical: 7,
    alignSelf: "center",
    width: "90%",
  },
  sheetButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});
