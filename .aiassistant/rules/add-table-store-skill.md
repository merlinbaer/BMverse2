---
apply: always
---

# Skill: Adding a New Database Table to LegendState

This rule defines the procedure for integrating a new Supabase table into the application's local-first state management
system.

## Workflow

1. **Generate Types**: Run `./scripts/update_db_types.sh` to fetch the new schema from Supabase.
2. **Prettify**: Run `yarn prettier --write src/types/database.types.ts` immediately after type generation.
3. **Type Definition**: Update `src/types/tables.ts` to export the new Row type from `database.types.ts`.
4. **Create Store File**: Create `src/services/legend/tables/[table_name].ts`.
    - Use `createTableStore<T>` factory.
    - Define and export `store$`, `item$`, `sync`, and `clearCache` (prefixed with table name).
    - **MANDATORY**: The Agent MUST ask the user: *"What are the intended use cases for this table? Which
      Domain-specific functions (e.g., computed list helpers, formatters, or data mapping) are needed?"*
5. **Export**: Add the new file to `src/services/legend/index.ts`.
6. **Wiring**: Update `src/services/legend/lib.ts`:
    - Add `store$.peek()` to `initializeStores()`.
    - Add `sync()` to `syncAll()`.

## Template for Store File

```typescript
import {createTableStore} from '../factory'
import {NewTableType} from '@/types/tables'

const {store$, item$, sync, clearCache} = createTableStore<NewTableType>({
    collection: 'table_name',
    actions: ['read'], // or ['read', 'create', 'update', 'delete']
    sort: (a, b) => /* default sort logic */,
})

export const table$ = store$
export const tableItem$ = item$
export const tableSync = sync
export const tableClearCache = clearCache
```