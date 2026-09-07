---
sessionId: session-260907-172201-gyg6
---

# Requirements

### Overview & Goals
When launching a web session (`expo start`), Metro bundling fails with the following assertion error:
`AssertionError [ERR_ASSERTION]: Worker chunk not found for: .../node_modules/expo-sqlite/web/worker.ts`

This plan details the cause of the problem and the steps to fix the web bundling issue by properly decoupling `expo-sqlite` from web bundles.

### Scope
- **In Scope**: Refactoring `src/services/legend/config.ts` to dynamically require `@legendapp/state/persist-plugins/expo-sqlite` only on native platforms (iOS/Android) and prevent static imports of `expo-sqlite` on Web.
- **Out of Scope**: Changing the underlying storage mechanisms (IndexedDB for Web, SQLite for native stay unchanged).

### User Stories
- As a developer, I want `expo start` to bundle web assets cleanly without encountering Metro worker chunk errors so that I can develop and test the web application locally.

### Functional Requirements
- Web bundle (`Platform.OS === 'web'`) must not include `expo-sqlite` or its web worker dependencies in its module graph.
- Native builds (`ios`, `android`) must continue to use LegendState's SQLite persistence plugin (`expo-sqlite/kv-store`).
- Web builds must continue using IndexedDB persistence (`idb-keyval` and `observablePersistAsyncStorage`).

# Technical Design

### Current Implementation
In `src/services/legend/config.ts`, LegendState persistence is configured as follows:
```ts
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage'
import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite' // Top-level import!

export const persistLargeStore =
  Platform.OS === 'web'
    ? observablePersistAsyncStorage({
        AsyncStorage: indexedDBStorage as AsyncStorageStatic,
      })
    : observablePersistSqlite(require('expo-sqlite/kv-store').default)
```

Although `expo-sqlite/kv-store` was dynamically `require`d on non-web platforms, line 2 statically `import`ed `observablePersistSqlite` from `@legendapp/state/persist-plugins/expo-sqlite`.
Because ES `import` statements are statically evaluated at build time by Metro, `@legendapp/state/persist-plugins/expo-sqlite` and `expo-sqlite` were included in the Web module graph.

Following recent Expo SDK updates (SDK 52+ / SDK 57), Metro's web serializer (`serializeChunks.js`) attempts to extract web worker chunks when it detects `expo-sqlite` in the web graph (`new Worker('./worker')`). Metro fails to serialize `expo-sqlite`'s internal TypeScript worker chunk (`web/worker.ts`), raising `AssertionError: Worker chunk not found for: .../node_modules/expo-sqlite/web/worker.ts`.

### Key Decisions
1. **Dynamic require for `observablePersistSqlite` on Native**: Remove the top-level ES `import` of `observablePersistSqlite`. Dynamically require both `observablePersistSqlite` and `expo-sqlite/kv-store` inside the non-web branch of `persistLargeStore`.
2. **Platform Isolation**: Prevent `expo-sqlite` from entering the Metro web dependency graph entirely.

### Proposed Changes
In `src/services/legend/config.ts`:
- Remove: `import { observablePersistSqlite } from '@legendapp/state/persist-plugins/expo-sqlite'`
- Update `persistLargeStore` definition to:
```ts
export const persistLargeStore =
  Platform.OS === 'web'
    ? observablePersistAsyncStorage({
        AsyncStorage: indexedDBStorage as AsyncStorageStatic,
      })
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('@legendapp/state/persist-plugins/expo-sqlite').observablePersistSqlite(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('expo-sqlite/kv-store').default,
      )
```

### File Structure
- `src/services/legend/config.ts` (Modified: dynamic require of SQLite plugin)

# Testing

### Validation Approach
- Verify syntax and static analysis using ESLint (`yarn lint`).
- Validate TypeScript compilation (`tsc`) to ensure no missing exports or broken typings.
- Verify that `src/services/legend/config.ts` contains no static top-level imports of `expo-sqlite` or `@legendapp/state/persist-plugins/expo-sqlite`.

# Delivery Steps

### ✓ Step 1: Create platform-specific persistence modules (.web.ts and .native.ts)
Split LegendState persistence configuration into `persistence.web.ts` and `persistence.native.ts` so `expo-sqlite` is completely isolated from web builds.

- Create `src/services/legend/persistence.web.ts` using `idb-keyval` and `observablePersistAsyncStorage`.
- Create `src/services/legend/persistence.native.ts` using `expo-sqlite/kv-store` and `observablePersistSqlite`.
- Create `src/services/legend/persistence.ts` as the primary fallback/re-export for TypeScript resolution.
- Update `src/services/legend/config.ts` to import and re-export `persistLargeStore` from `./persistence`.

### ✓ Step 2: Validate web bundle configuration and run code quality checks
The project codebase passes linting and type checks with clean platform isolation for persistence adapters.

- Run `yarn lint` to verify code quality and ESLint rule compliance.
- Validate TypeScript compilation to confirm type safety of `persistLargeStore` across web and native targets.
- Confirm `src/services/legend/config.ts` and `metro.config.js` maintain proper web compatibility.