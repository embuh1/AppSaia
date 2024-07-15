// components/Chatbot.js
import React, { useState } from "react";
import { View, StyleSheet, ImageBackground, Text, SafeAreaView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "@env";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Chatbot = () => {
  const [messages, setMessages] = useState([
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require("../assets/images/ibuki.png")}
        style={styles.background}
        resizeMode={"cover"}
        blurRadius={2}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={user}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "#0078fe",
                  borderRadius: 15,
                  padding: 5,
                  margin: 5,
                },
                left: {
                  backgroundColor: "#ececec",
                  borderRadius: 15,
                  padding: 5,
                  margin: 5,
                },
              }}
              textStyle={{
                right: {
                  color: "#fff",
                },
                left: {
                  color: "#000",
                },
              }}
            />
          )}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Efek overlay dengan opacity 0.5
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chatbot;