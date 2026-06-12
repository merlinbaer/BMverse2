import LZString from 'lz-string'

import { playerStats$ } from '@/services/legend/memory/variables'
import { ProfileType, UserRegion } from '@/types/tables'

import { createTableStore } from '../factory'

// Define supabase observable
const { store$, item$, sync, clearCache } = createTableStore<ProfileType>({
  collection: 'gl_profiles',
  actions: ['read', 'update'],
})

// Add Factory functions
export const profile$ = store$
export const profileItem$ = item$
export const profileSync = sync
export const profileClearCache = clearCache

// Domain-specific functions
export const profileRegionUpdate = (id: string, region: UserRegion) => {
  profile$[id].user_region.set(region)
}

export const profileUsernameUpdate = (id: string, name: string) => {
  profile$[id].user_name.set(name)
}

export const profileUserStoreUpdate = (id: string) => {
  const stats = playerStats$.peek()
  if (!stats) return

  try {
    const rawData = JSON.stringify(stats)
    const compressed = LZString.compressToBase64(rawData)

    // 1. Generate a random shift key (1-25)
    const shift = Math.floor(Math.random() * 25) + 1

    // 2. Shift every character in the compressed string
    const shifted = compressed
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0) + shift))
      .join('')

    // 3. Generate a random noise prefix to hide the start
    const saltLength = Math.floor(Math.random() * 5) + 3
    const salt = Math.random()
      .toString(36)
      .substring(2, 2 + saltLength)

    // 4. Final string: [noise][shifted_data][key_char][salt_length_digit]
    // key_char stores the shift value as a single character
    const final =
      salt + shifted + String.fromCharCode(65 + shift) + saltLength.toString()

    profile$[id].user_store.set(final)
  } catch (e) {
    console.error('profileUserStoreUpdate error:', e)
  }
}

export const profileUserStoreLoad = (id: string) => {
  const storedData = profile$[id].user_store.peek()
  if (!storedData || storedData.length < 10) return

  try {
    // 1. Extract metadata from the end
    const saltLength = parseInt(storedData.slice(-1), 10)
    const shiftKeyChar = storedData.slice(-2, -1)
    const shift = shiftKeyChar.charCodeAt(0) - 65

    // 2. Extract the shifted payload
    const shiftedPayload = storedData.slice(saltLength, -2)

    // 3. Reverse the shift
    const compressed = shiftedPayload
      .split('')
      .map(char => String.fromCharCode(char.charCodeAt(0) - shift))
      .join('')

    const decompressed = LZString.decompressFromBase64(compressed)
    if (decompressed) {
      playerStats$.set(JSON.parse(decompressed))
    }
  } catch (e) {
    console.error('profileUserStoreLoad error:', e)
  }
}
