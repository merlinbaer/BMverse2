import { ReactNode, useMemo, useEffect, createContext } from "react";
import { AppState } from "react-native";
import {
  SupabaseClient,
  createClient,
  processLock,
} from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SupabaseProviderProps {
  children: ReactNode;
}

export const SupabaseContext = createContext<SupabaseClient | null>(null);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

  const supabase = useMemo(
    () =>
      createClient(supabaseUrl, supabaseKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          lock: processLock,
        },
      }),
    [supabaseUrl, supabaseKey],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
    return () => {
      subscription?.remove();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};
