import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
// SAFE AREA VIEW
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// PICKING AND TAKING IMAGE FROM EXPO-IMAGE-PICKER
import * as ImagePicker from "expo-image-picker";
// BOTTOM SHEET FOR SELECTING IF THE USER WANT TO SELECT IMAGE OR TAKE IMAGE
import RBSheet from "react-native-raw-bottom-sheet";
// REACT NATIVE BOTTOM SHEET
import { BottomSheet } from "react-native-btr";
// FIREBASE
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import firebaseConfig from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

// INITIALIZING APP
initializeApp(firebaseConfig);

//#region
export default function Post({ navigation }) {
  useEffect(() => {
    showDate();
    showTime();
    getName();
  });
  // RANDOM KEY
  const randomKey = generateKey(8);
  // FORM REQUIREMENTS
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [artist, setArtist] = useState("");
  // FIREBASE
  const db = getFirestore();
  const storage = getStorage();
  const postImgPathReference = ref(storage, `posts/${randomKey}`);
  const [imageUrl, setImageUrl] = useState("");
  //
  const [fullTime, setFullTime] = useState(null);
  const [fullDate, setFullDate] = useState(null);

  // BOTTOM SHEET REFERENCE
  const selectRBSheet = useRef();
  // SUCESS MODAL OPEN
  const [sucessBottomSheetVisible, setSucessBottomSheetVisble] =
    useState(false);

  // FUNCTIONS
  const showTime = () => {
    let date = new Date();
    let hour = date.getHours(); // 0 - 23
    let minutes = date.getMinutes(); // 0 -59
    let seconds = date.getSeconds(); // 0 -59
    let session = "AM";

    if (hour === 0) {
      hour = 12;
    }
    if (hour > 12) {
      hour = hour - 12;
      session = "PM";
    }
    hour = hour < 10 ? "0" + hour : hour;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    let time = hour + ":" + minutes + ":" + seconds + " " + session;

    setFullTime(time);

    setTimeout(showTime, 1000);
  };
  const showDate = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let dateFinal = `${date}/${month}/${year}`;

    setFullDate(dateFinal);
    setTimeout(showDate, 1000);
  };
  const getName = async () => {
    try {
      const value = await AsyncStorage.getItem("USER-NAME");
      if (value !== null) {
        setArtist(value);
      }
    } catch (error) {}
  };
  function generateKey(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
  const resetForm = () => {
    setTitle("");
    setDesc("");
    setImage(null);
  };
  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    setImage(pickerResult.uri);
    selectRBSheet.current.close();

    if (pickerResult.uri == null) {
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

    setImage(result.uri);
    // Explore the result

    if (!result.cancelled) {
      setImage(result.uri);
      selectRBSheet.current.close();
    }
  };
  const uploadForm = async () => {
    getImage().then(() => {
      setDoc(doc(db, "posts", randomKey), {
        title: title,
        desc: desc,
        image: imageUrl,
        key: randomKey,
        postDate: fullDate,
        postTime: fullTime,
        artist: artist,
      }).then(() => {
        resetForm();
        setSucessBottomSheetVisble(true);
      });
    });
  };
  const uploadImage = async () => {
    const img = await fetch(image);
    const bytes = await img.blob();
    await uploadBytes(postImgPathReference, bytes);
  };
  const uploadPost = async () => {
    // await uploadImage().then(() => {
    //   uploadForm();
    // });
    const img = await fetch(image);
    const bytes = await img.blob();
    await uploadBytes(postImgPathReference, bytes)
      .then(() => {
        getDownloadURL(postImgPathReference).then((url) => {
          setImageUrl(url);
        });
      })
      .then(() => {
        setDoc(doc(db, "posts", randomKey), {
          title: title,
          desc: desc,
          image: imageUrl,
          key: randomKey,
          postDate: fullDate,
          postTime: fullTime,
          artist: artist,
        });
      })
      .then(() => {
        resetForm();
        setSucessBottomSheetVisble(true);
      });
  };
  const getImage = async () => {
    // Get the download URL
    getDownloadURL(postImgPathReference)
      .then((url) => {
        setImageUrl(url);
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
    await setDoc(doc(db, "posts", randomKey), {
      image: imageUrl,
    }).then(() => {
      alert("Check");
    });
  };
  // JSK FUNCTIONS
  const SelectSheetInner = () => {
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
          onPress={() => selectRBSheet.current.close()}
        >
          <Text style={styles.sheetButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </>
    );
  };

  // #MAIN
  return (
    <SafeAreaView>
      <ScrollView>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Text style={styles.title}>Add Post</Text>

            <View style={styles.form}>
              <TouchableOpacity onPress={() => selectRBSheet.current.open()}>
                <Ionicons
                  name="camera-outline"
                  color="#eb4c34"
                  size={34}
                  style={{ alignSelf: "center", paddingTop: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                {image && (
                  <Image source={{ uri: image }} style={styles.displayImage} />
                )}
              </TouchableOpacity>

              <View style={styles.formContainer}>
                <View style={styles.titleInput}>
                  <Text style={styles.formLabel}>PAINTING TITLE</Text>
                  <TextInput
                    style={styles.formField}
                    onChangeText={(title) => setTitle(title)}
                    value={title}
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.descInput}>
                  <Text style={styles.formLabel}>PAINTING DESCRIPTION</Text>
                  <TextInput
                    style={styles.formField}
                    onChangeText={(desc) => setDesc(desc)}
                    value={desc}
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.submitButton}>
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={uploadPost}
                  >
                    <Text style={styles.submitBtnText}>SUBMIT POST</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.bottomSheet}>
              <RBSheet
                ref={selectRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                closeOnPressMask={() => selectRBSheet.current.close()}
                height={320}
                customStyles={{
                  draggableIcon: {
                    opacity: 0.5,
                    backgroundColor: "#000",
                  },
                }}
              >
                <SelectSheetInner />
              </RBSheet>
            </View>
            <View style={styles.sucessModal}>
              <BottomSheet
                visible={sucessBottomSheetVisible}
                onBackdropPress={() => setSucessBottomSheetVisble(false)}
              >
                <View style={styles.thankYouView}>
                  <View style={{ alignItems: "center" }}>
                    <Text style={styles.thankYouSheetTitle}>
                      CONGRATULATIONS!
                    </Text>
                    <Text style={styles.thankYouSheetSubtitle}>
                      Uploaded Your Post Sucessfully
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.thankYouSheetButton}
                    onPress={() => setSucessBottomSheetVisble(false)}
                  >
                    <Text style={styles.thankYouSheetButtonTitle}>Done 👍</Text>
                  </TouchableOpacity>
                </View>
              </BottomSheet>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  title: {
    color: "#eb4c34",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  formContainer: {
    marginLeft: 64,
    marginTop: 32,
    marginRight: 32,
  },
  displayImage: {
    justifyContent: "center",
    alignSelf: "center",
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 5,
    marginBottom: -10,
  },
  formLabel: {
    color: "#eb4c34",
    paddingTop: 20,
  },
  formField: {
    borderBottomWidth: 1,
    borderBottomColor: "#8e93a1",
    marginTop: 10,
    paddingBottom: 5,
    color: "#eb4c34",
    fontWeight: "bold",
  },
  submitBtn: {
    marginTop: 30,
    backgroundColor: "#eb4c34",
    padding: 10,
    borderColor: "#eb4c34",
    borderRadius: 5,
  },
  submitBtnText: {
    color: "#fff",
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
    color: "#eb4c34",
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#eb4c34",
    // height: 30,
    marginBottom: 10,
    paddingTop: 20,
  },
  sheetButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#eb4c34",
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
  thankYouView: {
    backgroundColor: "#fff",
    height: 170,
  },
  thankYouSheetTitle: {
    fontSize: 27,
    height: 35,
    color: "#0aa114",
    marginTop: 10,
  },
  thankYouSheetSubtitle: {
    fontSize: 14,
    color: "#0aa114",
    height: 30,
    marginTop: 10,
  },
  thankYouSheetButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "#0aa114",
    alignItems: "center",
    marginVertical: 7,
    alignSelf: "center",
    width: "90%",
  },
  thankYouSheetButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});

//#endregion
