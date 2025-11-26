import { observable } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'videosStore';

export const videosStore = observable({
  rows: {} as Record<string, any>,
  lastSync: 0,
});

export async function loadVideosStore() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const data = JSON.parse(json);
      videosStore.rows.set(data.rows ?? {});
      videosStore.lastSync.set(data.lastSync ?? 0);
    }
  } catch (e) {
    console.warn('Failed to load videosStore:', e);
  }
}

export async function saveVideosStore() {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rows: videosStore.rows.get(),
        lastSync: videosStore.lastSync.get(),
      })
    );
  } catch (e) {
    console.warn('Failed to save videosStore:', e);
  }
}

videosStore.rows.onChange(saveVideosStore);
videosStore.lastSync.onChange(saveVideosStore);
