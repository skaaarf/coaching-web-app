"use client"

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react"
import { Session } from "next-auth"
import { createContext, useContext } from "react"

interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType>({ userId: null, userEmail: null });

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const userId = session.data?.user?.id || null;
  const userEmail = session.data?.user?.email || null;

  return (
    <AuthContext.Provider value={{ userId, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <NextAuthSessionProvider session={session}>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </NextAuthSessionProvider>
  )
}
