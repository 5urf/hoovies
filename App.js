import React, { useState } from "react";
import AppLoading from "expo-app-loading";
import { Text } from "react-native";
export default function App() {
  const [ready, setReady] = useState(false);
  const onFinish = () => setReady(true);
  const startLoading = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return <Text>hi loading done</Text>;
}
