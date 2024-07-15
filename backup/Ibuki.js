import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
} from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "@env";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const background = require("../assets/images/ibuki.png");

const Ibuki = () => {
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem("chatMessages");
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          setMessages([
            {
              _id: 1,
              text: "Halo mas irfan ada yang bisa Ibuki bantu?",
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "Ibuki",
                avatar: require("../assets/images/ibuki-avatar.png"),
              },
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("chatMessages", JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save messages:", error);
      }
    };

    saveMessages();
  }, [messages]);

  const resetChat = async () => {
    try {
      await AsyncStorage.removeItem("chatMessages");
      setMessages([
        {
          _id: 1,
          text: "Halo mas irfan ada yang bisa Ibuki bantu?",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "Ibuki",
            avatar: require("../assets/images/ibuki-avatar.png"),
          },
        },
      ]);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to reset chat:", error);
    }
  };

  const user = {
    _id: 1,
    name: "Irfan",
    avatar: require("../assets/images/ibuki-avatar.png"),
  };

  const onSend = async (newMessages = []) => {
    setMessages(GiftedChat.append(messages, newMessages));

    const userMessage = newMessages[0].text;

    try {
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `${user.name}: ${userMessage}` }],
          },
          {
            role: "model",
            parts: [{ text: "Halo mas irfan ada yang bisa Ibuki bantu?" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: response.text(),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Ibuki",
          avatar: require("../assets/images/ibuki-avatar.png"),
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, botMessage)
      );
    } catch (error) {
      console.error("Error generating chatbot response:", error);
    }
  };

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <Icon name="send" size={28} color="#0078fe" />
      </View>
    </Send>
  );

  const renderAvatar = (props) => (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      <ImageBackground
        source={props.currentMessage.user.avatar}
        style={styles.avatar}
        imageStyle={{ borderRadius: 20 }}
      />
    </TouchableOpacity>
  );

  const { width, height } = Dimensions.get("window");

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
    },
    safeArea: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 10,
    },
    sendingContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
      marginBottom: 5,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
      width: width * 0.8,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 18,
      color: "#333",
    },
    button: {
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#0078fe",
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 16,
    },
  });

  return (
    <ImageBackground
      source={background}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <SafeAreaView style={styles.safeArea}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={user}
          renderSend={renderSend}
          renderAvatar={renderAvatar}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#0078fe",
                  borderRadius: 20,
                  padding: 10,
                  margin: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                },
                left: {
                  backgroundColor: "#ececec",
                  borderRadius: 20,
                  padding: 10,
                  margin: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                },
              }}
              textStyle={{
                right: {
                  color: "#fff",
                  fontSize: 16,
                },
                left: {
                  color: "#000",
                  fontSize: 16,
                },
              }}
            />
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Apakah Anda yakin ingin mereset chat?
              </Text>
              <TouchableOpacity style={styles.button} onPress={resetChat}>
                <Text style={styles.buttonText}>Reset Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Ibuki;
