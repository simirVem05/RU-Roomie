import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

export default function App() {
  useEffect(() => {
    axios.get("http://192.168.1.19:3001")
      .then(res => {
        console.log("Backend Response:", res.data);
      })
      .catch(err => {
        console.error("Error connecting to backend:", err.message);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello from Roomie Frontend</Text>
    </View>
  );
}
