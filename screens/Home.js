import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const image = require("../assets/images/FB_IMG_1715279298276.jpg");

const Home = ({ navigation }) => {
  const handleStartPress = () => {
    navigation.navigate("Animagine"); // Ganti "Animagine" dengan nama screen yang sesuai
  };

  return (
    <ImageBackground
      source={image}
      style={styles.image}
      resizeMode={"cover"}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Selamat Datang di Aplikasi Animagine!</Text>
        <TouchableOpacity style={styles.button} onPress={handleStartPress}>
          <Text style={styles.buttonText}>Mulai</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Efek overlay dengan opacity 0.5
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff", // Warna teks putih untuk kontras dengan overlay
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007bff", // Warna latar belakang tombol
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25, // Border radius untuk tombol yang lebih bulat
    elevation: 3, // Efek shadow untuk menonjolkan tombol
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Home;
