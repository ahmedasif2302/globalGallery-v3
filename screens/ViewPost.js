import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// CARD PACKAGE
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from "react-native-cards";
// FIREBASE
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import { getFirestore } from "firebase/firestore/lite";
import firebaseConfig from "../config/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

export default function ViewPost({ navigation }) {
  // FIREBASE
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    getPosts();
  }, [""]);
  // GETTING DATA FROM FIREBASE FIRESTORE
  const getPosts = async () => {
    const taskCol = collection(db, "posts");
    const taskSnapshot = await getDocs(taskCol);
    const taskList = taskSnapshot.docs.map((doc) => doc.data());
    setPosts(taskList);
    console.log(taskList);
  };

  const [posts, setPosts] = useState([]);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Other's Post</Text>
        <View style={styles.card}>
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <ScrollView>
                <Card style={{ marginTop: 30 }}>
                  <CardImage source={{ uri: item.image }} />
                  <CardTitle subtitle={item.title} />
                  <CardContent text={item.desc} />
                  <CardContent text={item.artist} />
                  <CardContent text={item.postDate} />
                  <CardAction separator={true} inColumn={false}>
                    <CardButton
                      onPress={() => {}}
                      title="Share"
                      color="#FEB557"
                    />
                  </CardAction>
                </Card>
                {/* <Image
                  source={{
                    uri: item.image,
                  }}
                  style={{ width: 100, height: 100 }}
                /> */}
              </ScrollView>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  title: {
    color: "#30a145",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
});
