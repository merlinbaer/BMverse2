import { useContext, useEffect, useState } from "react";
import { SupabaseClient, Session } from "@supabase/supabase-js";
import { SupabaseContext } from "@/components/authProvider";

interface UseSupabaseProps {
  isLoaded: boolean;
  session: Session | null;
  supabase: SupabaseClient;
}

export const useSupabase = (): UseSupabaseProps => {
  const supabase = useContext(SupabaseContext);

  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    // Initial session with refresh-tryouts
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setIsLoaded(true);
    });

    // Auth Updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) {
    throw new Error("useSupabase must be used within AuthProvider");
  }

  return { isLoaded, session, supabase };
};
