---
apply: always
---

PROJECT: BMverse2 — React Native / Expo (iOS/Android/Web)
STACK: Expo ~55 | React Native 0.83 | TypeScript 5.9 | React 19
NAVIGATION: expo-router (file-based). Route groups: src/app/(onboarding), (main)/(tabs), (main)/(global)
BACKEND: Supabase (@supabase/supabase-js). All DB types generated into src/types/database.types.ts.

STATE MANAGEMENT: @legendapp/state v3 (beta)

- All observables suffixed with $ (e.g. concerts$, localStore$, authUser$)
- Three store categories:
    1. tables/ → Supabase-synced stores via createTableStore() factory in services/legend/factory.ts
    2. local/ → Persisted-only local state via syncObservable() (e.g. localStore$)
    3. memory/ → In-memory reactive state, NOT persisted (e.g. authUser$, isAuthLoaded$)
- Read in components via: useValue(store$.field) or useValue(computed$)
- Write via: store$.field.set(val) or store$.field.assign({})
- Never use useState/useContext/Redux for shared/global state
- Persistence: SQLite (native) / IndexedDB (web) — never AsyncStorage directly

ARCHITECTURE:

- src/app/ → Expo Router pages (file = route)
- src/components/ → Reusable UI prefixed with "App" (AppScreen, AppText, AppButton…
    - Prefixed with "App": Project-independent/Generic UI (AppScreen, AppText, AppButton…)
    - Prefixed with "Profile": Specific to the Profile domain (ProfileStatsSection, ProfileUserSection…)
    - No prefix: Project-specific components that don't fit into a broader generic category
    - **MANDATORY**: For "Profile" components, use `@expo/ui` (SDK 56+) components (Button, TextInput, Row, Column,
      Text, Spacer, FieldGroup, Picker, Collapsible) instead of raw React Native components
- src/services/ → All business logic (legend/, auth.ts, supabase.ts)
- src/constants/ → Constants only (COLORS, LAYOUT, FONT, SYNC, AUTH)
- src/hooks/ → Custom hooks (useAlert, useBetterSafeAreaInsets)
- src/layout/ → Global layout helpers and shared style utilities
- src/types/ → TypeScript types only

CONVENTIONS:

- Observable names: always camelCase + $ suffix
- Component files: PascalCase; hook files: camelCase starting with "use"
- Component Naming:
    - "App..." for generic, project-independent components.
    - "Profile..." for profile-related sub-components.
    - No prefix for other project-specific components.
- Path alias: @/ maps to src/
- Async pattern: async/await; void prefix for fire-and-forget calls
- No React Context API for state — use legendapp/state memory observables instead
- Theming: dark only (COLORS.BACKGROUND = #000, COLORS.PRIMARY = #db1b1a)
- Screen files must be simple and easy to read:
  → Complex layout → extract into a component in src/components/
  → Business logic → extract into src/services/
- Styling:
    - React Native StyleSheet only — no Tailwind, no inline style objects, no third-party style libs
    - **@expo/ui Integration**: When using `@expo/ui`, prefer their built-in props (variant, textStyle, spacing) but use
      the project's `COLORS`, `LAYOUT`, and `FONT` constants for consistency.
    - Global/shared styles go into src/constants/ (COLORS, LAYOUT, FONT) or src/layout/
    - Screen-local styles go in a StyleSheet at the bottom of the file

CRITICAL RULES — AI MUST NOT VIOLATE:
✗ Do NOT use React Context, Redux, Zustand, or useState for global/shared state
✗ Do NOT use raw `Alert.alert` from React Native — ALWAYS use `useAlert` hook (`showAlert`) for cross-platform (Web)
compatibility
✗ Do NOT use raw React Native components for Profile domain / Profile components — ALWAYS use `@expo/ui` (Button,
TextInput, Row, Picker, etc.)
✗ Do NOT add new tables without createTableStore() factory
x Do NOT suggest older LegendState Code that defined in the STATE Management
✗ Do NOT use raw AsyncStorage — use persistLargeStore plugin
✗ Do NOT create new navigation providers — use expo-router only
✗ Do NOT modify database.types.ts manually — it is auto-generated
✗ Do NOT use Tailwind, NativeWind, or any third-party styling framework
✗ Do NOT put complex layout or business logic directly in screen files