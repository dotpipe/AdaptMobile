// mobile/AdaptMobile/AdaptMobile/src/screens/ChatbotScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const ChatbotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;

    const userMessage = { id: Date.now(), text: input, user: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Simple bot response logic
    let botResponse = "I'm sorry, I don't understand that question.";
    if (input.toLowerCase().includes('ad')) {
      botResponse = "You can view ad details by tapping on any ad in the home screen.";
    } else if (input.toLowerCase().includes('cart')) {
      botResponse = "To add items to your cart, go to an ad's detail page and tap 'Add to Cart'.";
    } else if (input.toLowerCase().includes('offline')) {
      botResponse = "Yes, you can use basic features of the app offline. Your data will sync when you're back online.";
    }

    const botMessage = { id: Date.now() + 1, text: botResponse, user: false };
    setMessages(prevMessages => [...prevMessages, botMessage]);

    setInput('');
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageBubble, item.user ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message here..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatbotScreen;