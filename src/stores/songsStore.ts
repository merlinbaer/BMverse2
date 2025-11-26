import { observable } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'songsStore';

export const songsStore = observable({
  rows: {} as Record<string, any>,
  lastSync: 0,
});

// Laden beim App-Start
export async function loadSongsStore() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const data = JSON.parse(json);
      songsStore.rows.set(data.rows ?? {});
      songsStore.lastSync.set(data.lastSync ?? 0);
    }
  } catch (e) {
    console.warn('Failed to load songsStore:', e);
  }
}

// Speichern
export async function saveSongsStore() {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rows: songsStore.rows.get(),
        lastSync: songsStore.lastSync.get(),
      })
    );
  } catch (e) {
    console.warn('Failed to save songsStore:', e);
  }
}

// Auto-Save auf Änderungen
songsStore.rows.onChange(saveSongsStore);
songsStore.lastSync.onChange(saveSongsStore);
