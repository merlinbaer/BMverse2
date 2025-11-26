import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { authStore } from '@/stores/authStore';
import { onboardingStore } from '@/stores/onboardingStore';

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    if (!authStore.user.get() || !onboardingStore.completed.get()) {
      router.replace('/'); // Root Layout leitet korrekt
    }
  }, [authStore.user.get(), onboardingStore.completed.get()]);
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
      }}
    >
      {/* Songs Tab */}
      <Tabs.Screen
        name="songs"
        options={{
          title: 'Songs',
          tabBarLabel: 'Songs',
        }}
      />

      {/* News Tab */}
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarLabel: 'News',
        }}
      />

      {/* Videos Tab */}
      <Tabs.Screen
        name="videos"
        options={{
          title: 'Videos',
          tabBarLabel: 'Videos',
        }}
      />
    </Tabs>
  );
}
