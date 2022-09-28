import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "react-query";
import styled from "styled-components/native";
import { MovieResponse, moviesApi } from "../api";
import HList from "../components/HList";
import HMedia from "../components/HMedia";
import Loader from "../components/Loader";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import { getNextPage } from "../utils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const TrendingScroll = styled.FlatList`
  margin-top: 20px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const VSeperator = styled.View`
  width: 20px;
`;
const HSeparator = styled.View`
  height: 20px;
`;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: nowPlayingLoading, data: nowPlayingData } =
    useQuery<MovieResponse>(["movies", "nowPlaying"], moviesApi.nowPlaying);

  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNextPage,
    fetchNextPage: upcomingFetchNextPage,
    isFetchingNextPage: upcomingIsFetchingNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "upcoming"],
    moviesApi.upcoming,
    {
      getNextPageParam: (currentPage) => getNextPage(currentPage),
    }
  );

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
    isFetchingNextPage: trendingIsFetchingNextPage,
  } = useInfiniteQuery<MovieResponse>(
    ["movies", "trending"],
    moviesApi.trending,
    {
      getNextPageParam: (currentPage) => getNextPage(currentPage),
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };

  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;

  const upcomingLoadMore = () => {
    if (upcomingHasNextPage) upcomingFetchNextPage();
  };

  const trendingLoadMore = () => {
    if (trendingHasNextPage) trendingFetchNextPage();
  };

  return loading ? (
    <Loader />
  ) : upcomingData ? (
    <FlatList
      onEndReached={upcomingLoadMore}
      onEndReachedThreshold={2} // onEndReached를 실행시키려는 목록 하단부터 끝까지 거리
      onRefresh={onRefresh}
      refreshing={refreshing}
      disableVirtualization={false} //비정상적인 스크롤 동작을 방지
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              marginBottom: 40,
              width: "100%",
              height: SCREEN_HEIGHT / 4,
            }}
          >
            {nowPlayingData?.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.original_title}
                // title={movie.title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          {trendingData ? (
            <HList
              title='흥행 중인 영화'
              data={trendingData?.pages
                .slice(0, 500)
                .map((page) => page.results)
                .flat()}
              loadMore={trendingLoadMore}
              isFetchingNextPage={trendingFetchNextPage}
            />
          ) : null}
          <ComingSoonTitle>개봉 예정 영화</ComingSoonTitle>
        </>
      }
      ListFooterComponent={
        <>{upcomingIsFetchingNextPage ? <Loader /> : null}</>
      }
      data={upcomingData?.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    />
  ) : null;
};

export default Movies;
