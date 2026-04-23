import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import * as React from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import loginBg from "@/assets/login-bg.jpg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("admin@italdisplay.it");
  const [password, setPassword] = React.useState("demo");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Accesso effettuato");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Errore di accesso");
    } finally {
      setLoading(false);
    }
  };

  const quick = (em: string) => {
    setEmail(em);
    setPassword("demo");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={loginBg}
          alt="Display industriale"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-slate-900/40" />
        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg [background:var(--gradient-primary)] flex items-center justify-center font-bold shadow-lg">
              ID
            </div>
            <div>
              <div className="font-semibold">Italdisplay</div>
              <div className="text-xs text-slate-300">Enterprise Resource Planning</div>
            </div>
          </div>
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl font-semibold leading-tight">
              Tutta l'azienda in un'unica piattaforma.
            </h1>
            <p className="text-slate-300">
              Gestisci lead, offerte, commesse e installazioni. Con un assistente AI che ti dice
              chi chiamare per primo.
            </p>
          </div>
          <div className="text-xs text-slate-400">© 2025 Italdisplay S.r.l.</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md shadow-[var(--shadow-elegant)]">
          <CardContent className="p-8">
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg [background:var(--gradient-primary)] flex items-center justify-center text-white font-bold">
                ID
              </div>
              <div className="font-semibold">Italdisplay ERP</div>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Accedi</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Demo — usa una delle utenze qui sotto.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Accesso…" : "Entra"}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Demo rapida
              </div>
              <div className="grid gap-1.5">
                {[
                  { e: "admin@italdisplay.it", l: "Marco — Admin" },
                  { e: "giulia@italdisplay.it", l: "Giulia — Commerciale" },
                  { e: "produzione@italdisplay.it", l: "Sara — Produzione" },
                ].map((x) => (
                  <button
                    key={x.e}
                    type="button"
                    onClick={() => quick(x.e)}
                    className="text-left text-sm rounded-md border px-3 py-2 hover:bg-accent transition"
                  >
                    <div className="font-medium">{x.l}</div>
                    <div className="text-xs text-muted-foreground">{x.e} · password: demo</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
