import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";


const Animagine = () => {
  const [inputText, setInputText] = useState(
    "1girl, momoi, blue archive, masterpiece, best quality, very aesthetic, absurdes"
  );
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUri, setModalImageUri] = useState(null);

  useEffect(() => {
    loadImageFromStorage();
  }, []);

  const query = async (data) => {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/cagliostrolab/animagine-xl-3.1",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const saveImageToStorage = async (image) => {
    try {
      await AsyncStorage.setItem("@saved_image", image);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const loadImageFromStorage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("@saved_image");
      if (savedImage) {
        setImageUri(savedImage);
      }
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const blob = await query({ inputs: inputText });
      const base64Image = await blobToBase64(blob);
      setImageUri(base64Image);
      saveImageToStorage(base64Image);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!modalImageUri) return;

    const fileName = `image_${Date.now()}.png`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    try {
      // Convert base64 image to binary and save it temporarily
      await FileSystem.writeAsStringAsync(
        fileUri,
        modalImageUri.split(",")[1],
        { encoding: FileSystem.EncodingType.Base64 }
      );

      // Request permission to access media library
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "You need to grant media library permissions to save the image."
        );
        return;
      }

      // Save the image to the media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Animagine", asset, false);
      Alert.alert("Success!", "Image has been saved to your gallery.");
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Error", "Failed to download image");
    }
  };

  const handleImagePress = async () => {
    if (imageUri) {
      setModalImageUri(imageUri);
      setModalVisible(true);
      StatusBar.setHidden(true); // Menyembunyikan StatusBar
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    StatusBar.setHidden(false); // Menampilkan kembali StatusBar
  };

  const handleReset = async () => {
    setImageUri(null);
    setModalImageUri(null);
    await AsyncStorage.removeItem("@saved_image");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/FB_IMG_1715090825039.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Animagine</Text>
        <Text style={styles.subtitle}>(Text-to-Image AI Generator)</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukan Prompt"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGenerateImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Generate Gambar"
            )}
          </Text>
        </TouchableOpacity>
        {loading && <Text style={styles.loadingText}>Memproses Gambar (KSABAR)...</Text>}
        {imageUri && (
          <>
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Image
                source={{ uri: modalImageUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={handleDownloadImage}
              >
                <Text style={styles.buttonText}>Download Gambar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ccc",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300,
    resizeMode: "contain",
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
  },
  downloadButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  modalImage: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 120,
    resizeMode: "contain",
  },
});

export default Animagine;
