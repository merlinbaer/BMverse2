// global functions
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// delay in ms
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Connect to Supabase
export function connectAnonDB(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  // const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabaseConnectOption = {
    global: { headers: { Authorization: `Bearer ${supabaseKey}` } },
  }
  try {
    return createClient(
        supabaseUrl!,
        supabaseKey!,
        supabaseConnectOption,
    )
  } catch (err) {
    console.log(
      'Fatal Error: DB connection refused: ' + JSON.stringify(err, null, 2),
    )
    throw err
  }
}

// Insert data into a table. Array of objects has to fit the table structure (keys = column names)!
export async function insertUntypedData(
  // deno-lint-ignore no-explicit-any
  inputData: any[],
  tableName: string,
  connect: SupabaseClient,
) {
  try {
    const { data, error } = await connect
      .from(tableName)
      .insert(inputData)
      .select('*')
    if (error) throw error
    return data.length
  } catch (err) {
    console.log(
      'Fatal Error: Inserting in table: ' +
        tableName +
        ': ' +
        JSON.stringify(err, null, 2),
    )
    throw err
  }
}

// Deletes all rows of a table with a primary key column with name id and type uuid
export async function deleteAllRows(
  tableName: string,
  connect: SupabaseClient,
) {
  try {
    const { data, error } = await connect
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('*')
    if (error) throw error
    return data.length
  } catch (err) {
    console.log(
      'Fatal Error: Deleting all rows in table: ' +
        tableName +
        ': ' +
        JSON.stringify(err, null, 2),
    )
    throw err
  }
}

// Simple select all rows of a table, column can be picked or use string '*' for all columns.
// Realtime legend-state default columns are removed when the existing
// Max rows limit is set to 8000 rows (10.000 is max). Has to be configured in supabase too.
export async function selectAllRows(
  tableName: string,
  columns: string,
  connect: SupabaseClient,
// deno-lint-ignore no-explicit-any
): Promise<any[]> {
  try {
    const { data, error } = await connect
      .from(tableName)
      .select(columns)
      .eq('deleted', false)
    if (error) {
      throw error
    } else {
      if (columns === '*') {
        let reduceData = filterArray(data, 'id')
        reduceData = filterArray(reduceData, 'created_at')
        reduceData = filterArray(reduceData, 'updated_at')
        return reduceData
      } else {
        return data
      }
    }
  } catch (err) {
    console.log(
      'Fatal Error: Select all rows of table: ' +
        tableName +
        ': ' +
        JSON.stringify(err, null, 2),
    )
    throw err
  }
}

// Simple select rows of a table, column can be picked or use string '*' for all columns.
// One eq filter has to be set.
// Realtime legend-state default columns are removed when the existing
// Max rows limit is set to 8000 rows (10.000 is max). Has to be configured in supabase too.
export async function selectRows(
  tableName: string,
  columns: string,
  eqKey: string,
  // deno-lint-ignore no-explicit-any
  eqValue: any,
  connect: SupabaseClient,
// deno-lint-ignore no-explicit-any
): Promise<any[]> {
  try {
    const { data, error } = await connect
      .from(tableName)
      .select(columns)
      .eq('deleted', false)
      .eq(eqKey, eqValue)
    if (error) {
      throw error
    } else {
      if (columns === '*') {
        let reduceData = filterArray(data, 'id')
        reduceData = filterArray(reduceData, 'created_at')
        reduceData = filterArray(reduceData, 'updated_at')
        return reduceData
      } else {
        return data
      }
    }
  } catch (err) {
    console.log(
      'Fatal Error: Select all rows of table: ' +
        tableName +
        ': ' +
        JSON.stringify(err, null, 2),
    )
    throw err
  }
}

// Update row(s) of a table, column and values has to be passed as object with key/value pairs
// The function updates all rows where the value of the column is equal to a key/value a pair of certain columns
export async function updateUntypedData(
  tableName: string,
  // deno-lint-ignore no-explicit-any
  row: Record<string, any>,
  column: string,
  connect: SupabaseClient,
): Promise<number> {
  try {
    const { data, error } = await connect
      .from(tableName)
      .update(row)
      .eq(column, row[column])
      .eq('deleted', false)
      .select('*')

    if (error) throw error
    return data.length
  } catch (err) {
    console.log(
      'Fatal Error: Update row of table: ' +
        tableName +
        ': ' +
        JSON.stringify(err, null, 2),
    )
    throw err
  }
}

// Remove all key/value pairs of a certain key in a nested JSON Structure
export function filterObject(obj: object, keyToExclude: string) {
  // deno-lint-ignore no-explicit-any
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key === keyToExclude) {
      continue
    }
    if (typeof value === 'object' && value !== null) {
      result[key] = filterObject(value, keyToExclude)
    } else {
      result[key] = value
    }
  }
  return result
}

// Flatten a "JSON Structure"
export function flattenObj(obj: object, prefix: string) {
  // deno-lint-ignore no-explicit-any
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key.toLowerCase()}` : key // Create the new key with the prefix

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObj(value, newKey))
    } else {
      result[newKey] = value
    }
  }
  return result
}

// Remove a key/value pair from an array of objects
// deno-lint-ignore no-explicit-any
export function filterArray(arrayOfObjects: any[], keyToRemove: string) {
  return arrayOfObjects.map(obj => {
    const newObj = { ...obj } // Create a shallow copy of the object
    delete newObj[keyToRemove] // Remove the specified key
    return newObj // Return the modified object
  })
}
