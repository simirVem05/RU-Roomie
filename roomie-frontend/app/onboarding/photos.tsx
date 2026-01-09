import React, { useEffect } from "react";
import { View, Text } from "react-native";

export default function Photos() {
  useEffect(() => {
    console.log("✅ Interests screen is rendering");
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "yellow", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 32, color: "black" }}>photos</Text>
    </View>
  );
}
