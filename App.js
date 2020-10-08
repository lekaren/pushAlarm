import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

const PUSH_REGISTRATION_ENDPOINT = 'http://4a5c987bcc3c.ngrok.io/token';
const MESSAGE_ENPOINT = 'http://4a5c987bcc3c.ngrok.io/message';

export default function App() {

  const [state, setState] = useState({
    notification: null,
    messageText: ''
  });

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();

    return axios.post(PUSH_REGISTRATION_ENDPOINT, {
      token: {
        value: token
      },
      user: {
        username: 'karen',
        name: 'mypushapp'
      }
    });
    const notificationSubscription = Notifications.addListener(handleNotification);
  };

  const handleNotification = (notification) => {
    setState({ notification });
  };

  const handleChangeText = (text) => {
    setState({ messageText: text });
  };

  const sendMessage = async () => {
    axios.post(MESSAGE_ENPOINT, {
      message: state.messageText
    });

    setState({ messageText: '' });
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput 
        value={state.messageText}
        onChangeText={handleChangeText}
        style={styles.textInput}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={sendMessage}>
        <Text style={styles.buttonText}>SEND</Text>
      </TouchableOpacity>
      { state.notification ? renderNotification() : null }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: 300,
    height: 50,
    backgroundColor: 'silver'
  },
  button: {
    fontSize: 15,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  buttonText: {
    color: 'white'
  }
});
