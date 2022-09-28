import React, { useState } from "react";
import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { tvApi } from "../api";
import HList, { HListSeparator } from "../components/HList";
import Loader from "../components/Loader";
import VMedia from "../components/VMedia";
import { getNextPage } from "../utils";
const Tv = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNextPage,
    fetchNextPage: trendingFetchNextPage,
    isFetchingNextPage: trendingIsFetchingNextPage,
  } = useInfiniteQuery(["tv", "trending"], tvApi.trending, {
    getNextPageParam: (currentPage) => getNextPage(currentPage),
  });

  const { isLoading: todayLoading, data: todayData } = useQuery(
    ["tv", "today"],
    tvApi.airingToday
  );

  const {
    isLoading: topLoading,
    data: topData,
    hasNextPage: topHasNextPage,
    fetchNextPage: topFetchNextPage,
    isFetchingNextPage: topIsFetchingNextPage,
  } = useInfiniteQuery(["tv", "top"], tvApi.topRated, {
    getNextPageParam: (currentPage) => getNextPage(currentPage),
  });

  const loading = todayLoading || topLoading || trendingLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["tv"]);
    setRefreshing(false);
  };

  const trendingLoadMore = () => {
    if (trendingHasNextPage) trendingFetchNextPage();
  };

  const topLoadMore = () => {
    if (topHasNextPage) topFetchNextPage();
  };

  if (loading) <Loader />;

  return trendingData && topData ? (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
      <HList
        title='인기있는 드라마'
        data={trendingData.pages.map((page) => page.results).flat()}
        loadMore={trendingLoadMore}
        isFetchingNextPage={trendingIsFetchingNextPage}
      />
      <HList title='오늘 방영하는 드라마' data={todayData?.results} />
      <HList
        title='평점 높은 드라마'
        data={topData.pages.map((page) => page.results).flat()}
        loadMore={topLoadMore}
        isFetchingNextPage={topIsFetchingNextPage}
      />
    </ScrollView>
  ) : null;
};

export default Tv;
