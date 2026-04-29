import * as React from "react";

export type Role = "admin" | "commerciale" | "produzione";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
}

const DEMO_USERS: (AuthUser & { password: string })[] = [
  { id: "u1", name: "Marco Rossi", email: "admin@italdisplay.it", role: "admin", initials: "MR", password: "demo" },
  { id: "u2", name: "Giulia Bianchi", email: "giulia@italdisplay.it", role: "commerciale", initials: "GB", password: "demo" },
  { id: "u3", name: "Luca Verdi", email: "luca@italdisplay.it", role: "commerciale", initials: "LV", password: "demo" },
  { id: "u4", name: "Sara Neri", email: "produzione@italdisplay.it", role: "produzione", initials: "SN", password: "demo" },
];

interface AuthCtx {
  isHydrated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  switchUser: (id: string) => void;
  users: AuthUser[];
}

const AuthContext = React.createContext<AuthCtx | null>(null);

const STORAGE_KEY = "italdisplay_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setUser(raw ? (JSON.parse(raw) as AuthUser) : null);
    } catch {
      setUser(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) throw new Error("Credenziali non valide");
    const { password: _p, ...rest } = found;
    persist(rest);
    return rest;
  };

  const logout = () => persist(null);

  const switchUser = (id: string) => {
    const found = DEMO_USERS.find((u) => u.id === id);
    if (found) {
      const { password: _p, ...rest } = found;
      persist(rest);
    }
  };

  const value = React.useMemo(
    () => ({
      isHydrated,
      user,
      login,
      logout,
      switchUser,
      users: DEMO_USERS.map(({ password: _p, ...rest }) => rest),
    }),
    [isHydrated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
