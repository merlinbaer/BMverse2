import { localStore$, news$, sync$, version$ } from '@/services/legend'

export const initializeStores = () => {
  // Wake up local-only persisted stores
  try {
    localStore$.peek()
    console.log('LegendState: Local states initialized.')
  } catch (error) {
    console.log('LegendState: Failed to initialize local states:', error)
  }
  // Wake up table stores
  try {
    sync$.peek()
    version$.peek()
    news$.peek()
    console.log('LegendState: Table stores initialized.')
  } catch (error) {
    console.log('LegendState: Failed to initialize table stores:', error)
  }
}
