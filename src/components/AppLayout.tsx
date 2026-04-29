import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  ClipboardList,
  FileText,
  Headphones,
  Kanban,
  LayoutDashboard,
  LogOut,
  Phone,
  Receipt,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  {
    label: "Panoramica",
    items: [{ to: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "CRM",
    items: [
      { to: "/crm/affari", label: "Affari", icon: Kanban },
      { to: "/crm/offerte", label: "Offerte", icon: FileText },
      { to: "/crm/clienti", label: "Clienti", icon: Building2 },
      { to: "/crm/chiamate", label: "Riepilogo chiamate", icon: Phone },
      { to: "/crm/kpi", label: "Sales KPI", icon: BarChart3 },
    ],
  },
  {
    label: "Lavorazione",
    items: [
      { to: "/lavorazione/commesse", label: "Commesse", icon: Briefcase },
      { to: "/lavorazione/rapporti", label: "Rapporti intervento", icon: Wrench },
      { to: "/lavorazione/evasi", label: "Lavori evasi", icon: Receipt },
    ],
  },
  {
    label: "Operatori",
    items: [{ to: "/app40", label: "App 4.0", icon: Smartphone }],
  },
  {
    label: "Vendite",
    items: [{ to: "/quotazione", label: "Quotazione ERP", icon: Calculator }],
  },
] as const;

export function AppLayout() {
  const { user, logout, users, switchUser, isHydrated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isHydrated) {
    return null;
  }

  if (!user) {
    if (!location.pathname.startsWith("/login")) {
      navigate({ to: "/login" });
    }
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex w-64 flex-col [background:var(--gradient-sidebar)] text-slate-100">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="h-9 w-9 rounded-lg [background:var(--gradient-primary)] flex items-center justify-center font-bold shadow-lg">
            ID
          </div>
          <div>
            <div className="font-semibold tracking-tight">Italdisplay</div>
            <div className="text-[11px] text-slate-400">ERP · v0.1</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV.map((group) => (
            <div key={group.label}>
              <div className="px-2 mb-1 text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                {group.label}
              </div>
              <ul className="space-y-0.5">
                {group.items.map((it) => {
                  const active =
                    it.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(it.to);
                  const Icon = it.icon;
                  return (
                    <li key={it.to}>
                      <Link
                        to={it.to}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-white/10 text-white shadow-sm"
                            : "text-slate-300 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-2">
          <div className="flex items-center gap-2 px-1.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[11px] text-slate-400 capitalize">{user.role}</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              className="text-slate-400 hover:text-white transition"
              title="Esci"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <select
            value={user.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full rounded-md bg-white/5 border border-white/10 text-xs px-2 py-1.5 text-slate-200"
            title="Cambia utente demo"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-slate-900">
                {u.name} — {u.role}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b bg-background/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <div className="h-8 w-8 rounded [background:var(--gradient-primary)] flex items-center justify-center text-white text-xs font-bold">
              ID
            </div>
            <span className="font-semibold">Italdisplay</span>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground">
            Benvenuto, <span className="text-foreground font-medium">{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Headphones className="h-3 w-3" /> Demo
            </Badge>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              <ClipboardList className="h-3 w-3 mr-1" /> Q2 2025
            </Badge>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
