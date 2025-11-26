import { observable } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'newsStore';

export const newsStore = observable({
  rows: {} as Record<string, any>,
  lastSync: 0,
});

export async function loadNewsStore() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const data = JSON.parse(json);
      newsStore.rows.set(data.rows ?? {});
      newsStore.lastSync.set(data.lastSync ?? 0);
    }
  } catch (e) {
    console.warn('Failed to load newsStore:', e);
  }
}

export async function saveNewsStore() {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rows: newsStore.rows.get(),
        lastSync: newsStore.lastSync.get(),
      })
    );
  } catch (e) {
    console.warn('Failed to save newsStore:', e);
  }
}

newsStore.rows.onChange(saveNewsStore);
newsStore.lastSync.onChange(saveNewsStore);
