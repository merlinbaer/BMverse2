import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { Paths } from 'expo-file-system'
import { Platform } from 'react-native'

import { localStore$ } from '@/services/legend'

/**
 * Checks if the current version is 2.0.0 or higher and handles migration from version 1.
 * Version 1 used AsyncStorage and stored files in the Documents folder.
 * Version 2 uses LegendState with SQLite/IndexedDB and has a different file structure.
 */
export const performVersionMigration = async () => {
  const currentVersion = Constants.expoConfig?.version || '2.0.0'
  const lastVersion = localStore$.lastStartedVersion.get()

  // If the lastVersion is null, it's the first time version 2 is running.
  // According to requirements: "If the app was called the first time, it can assume that it updates an older version."
  if (!lastVersion || isOlderThanVersion2(lastVersion)) {
    console.log(
      `Migration: Upgrading from ${lastVersion || 'v1'} to ${currentVersion}`,
    )

    // 1. Mark as upgrade to show a message in welcome.tsx
    localStore$.isVersion1Upgrade.set(true)

    // 2. Clear AsyncStorage (used by version 1)
    try {
      await AsyncStorage.clear()
      console.log('Migration: AsyncStorage cleared')
    } catch (e) {
      console.error('Migration: Failed to clear AsyncStorage', e)
    }

    // 3. Clear the Documents folder (where version 1 might have stored files)
    if (Platform.OS !== 'web') {
      try {
        const docs = Paths.document
        if (docs.exists) {
          const items = docs.list()
          for (const item of items) {
            try {
              const name = item.name.toLowerCase()
              // Skip SQLite related files and directories to avoid "readonly database" errors
              // as version 2 might have already initialized its database in the same location.
              if (
                name === 'sqlite' ||
                name === 'exponent-sqlite' ||
                name.endsWith('.db') ||
                name.endsWith('.db-journal') ||
                name.endsWith('.db-shm') ||
                name.endsWith('.db-wal')
              ) {
                console.log(`Migration: Skipping protected item: ${item.name}`)
                continue
              }
              item.delete()
              console.log(`Migration: Deleted ${item.name}`)
            } catch (itemError) {
              console.error(`Migration: Failed to delete ${item.name}`, itemError)
            }
          }
          console.log('Migration: Documents folder cleared')
        }
      } catch (e) {
        console.error('Migration: Failed to clear Documents folder', e)
      }
    }

    // 4. Update the lastStartedVersion to prevent repeated migration
    localStore$.lastStartedVersion.set(currentVersion)
  }
}

/**
 * Simple version comparison to check if the version is older than 2.0.0
 */
function isOlderThanVersion2(version: string) {
  const parts = version.split('.')
  const major = parseInt(parts[0], 10)
  return isNaN(major) || major < 2
}
