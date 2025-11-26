import NetInfo from '@react-native-community/netinfo';
import { supabase } from './supabase';
import { songsStore, loadSongsStore, saveSongsStore } from '../stores/songsStore';
import { newsStore, loadNewsStore, saveNewsStore } from '../stores/newsStore';
import { videosStore, loadVideosStore, saveVideosStore } from '../stores/videosStore';
import { authStore } from '../stores/authStore';

const SYNC_INTERVAL_MS = 12 * 60 * 60 * 1000; // 2x pro Tag
let retryTimer: any = null;

// Hilfsfunktion: nur die neuen/aktualisierten Zeilen seit lastSync holen
async function fetchRowsSince(table: string, since: number) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .gt('updated_at', new Date(since).toISOString())
    .order('updated_at', { ascending: true });

  if (error) {
    console.warn('Supabase fetch error', table, error.message);
    return [];
  }
  return data ?? [];
}

// Hilfsfunktion: Änderungen auf Store anwenden
function applyRowsToStore(store: any, rows: any[]) {
  const next = { ...store.rows.get() };
  for (const r of rows) {
    if (r.deleted) delete next[r.id];
    else next[r.id] = r;
  }
  store.rows.set(next);
}

// Komplett-Sync aller Stores
export async function performSyncAll() {
  if (!authStore.user.get()) return;

  const [songs, news, videos] = await Promise.all([
    fetchRowsSince('bm_songs', songsStore.lastSync.get()),
    fetchRowsSince('bm_news', newsStore.lastSync.get()),
    fetchRowsSince('bm_videos', videosStore.lastSync.get()),
  ]);

  applyRowsToStore(songsStore, songs);
  applyRowsToStore(newsStore, news);
  applyRowsToStore(videosStore, videos);

  const now = Date.now();
  songsStore.lastSync.set(now);
  newsStore.lastSync.set(now);
  videosStore.lastSync.set(now);

  // Lokale Speicherung
  await Promise.all([saveSongsStore(), saveNewsStore(), saveVideosStore()]);
}

// Prüfen, ob Sync nötig ist, sonst Retry bei Offline
export async function trySyncWithRetry() {
  const now = Date.now();
  const lastGlobalSync = (global as any).__lastFullSync || 0;
  const shouldSync = !lastGlobalSync || now - lastGlobalSync > SYNC_INTERVAL_MS;
  if (!shouldSync) return;

  const net = await NetInfo.fetch();
  if (!net.isConnected) {
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = setTimeout(trySyncWithRetry, 1000 * 60 * 15); // Retry in 15 Minuten
    return;
  }

  try {
    await performSyncAll();
    (global as any).__lastFullSync = Date.now();
  } catch (e) {
    console.warn('Sync failed', e);
    if (retryTimer) clearTimeout(retryTimer);
    retryTimer = setTimeout(trySyncWithRetry, 1000 * 60 * 15);
  }
}

// Optional: Initialer App-Start Sync
export async function initSync() {
  await Promise.all([loadSongsStore(), loadNewsStore(), loadVideosStore()]);
  trySyncWithRetry();
}
