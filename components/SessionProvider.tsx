"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { incrementVisitCount } from "@/lib/anonymous-session"

interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  userEmail: null,
  user: null
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 訪問回数をインクリメント（ページロード時に1回だけ）
    const visitCountedKey = 'visit_counted_this_session';
    if (typeof window !== 'undefined' && !sessionStorage.getItem(visitCountedKey)) {
      incrementVisitCount();
      sessionStorage.setItem(visitCountedKey, 'true');
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    user,
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
