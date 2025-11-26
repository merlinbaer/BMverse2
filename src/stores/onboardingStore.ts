import { observable } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'onboardingStore';

export const onboardingStore = observable({
  completed: false,
});

export async function loadOnboardingStore() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      onboardingStore.completed.set(JSON.parse(json).completed ?? false);
    }
  } catch (e) {
    console.warn('Failed to load onboardingStore:', e);
  }
}

export async function saveOnboardingStore() {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ completed: onboardingStore.completed.get() })
    );
  } catch (e) {
    console.warn('Failed to save onboardingStore:', e);
  }
}

// Auto-Save
onboardingStore.completed.onChange(saveOnboardingStore);
