import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import VMedia from "./VMedia";

interface HListProps {
  title: string;
  data: any[];
}

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
  margin-bottom: 20px;
`;
export const HListSeparator = styled.View`
  width: 20px;
`;

const HList: React.FC<HListProps> = ({ title, data }) => (
  <ListContainer>
    <ListTitle>{title}</ListTitle>
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 30 }}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HListSeparator}
      renderItem={({ item }) => (
        <VMedia
          posterPath={item.poster_path}
          originalTitle={item.title ?? item.name}
          voteAverage={item.vote_average}
          fullData={item}
        />
      )}
    />
  </ListContainer>
);

export default HList;
