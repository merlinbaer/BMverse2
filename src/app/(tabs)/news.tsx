import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { newsStore, loadNewsStore, saveNewsStore } from '../../stores/newsStore';
import { initSync } from '../../services/sync';

export default function NewsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNewsStore();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await initSync();
    setRefreshing(false);
  };

  const data = Object.values(newsStore.rows.get());

  const renderItem = ({ item }: { item: any }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.id}</Text>
      <Text>{item.news_title}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}
