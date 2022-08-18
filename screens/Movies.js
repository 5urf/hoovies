import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

const Btn = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  color: ${(props) => (props.selected ? "blue" : "red")};
`;

const Movies = ({ navigation: { navigate } }) => (
  <Btn onPress={() => navigate("Stack", { screen: "Three" })}>
    <Title selected={false}>Movies</Title>
    <Title selected={true}>Movies</Title>
  </Btn>
);

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "blue",
  },
});
export default Movies;
