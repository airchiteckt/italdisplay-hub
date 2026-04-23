import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEALS, JOBS, AI_SUGGESTIONS, SALES_KPI, formatEuro } from "@/lib/mock-data";
import {
  ArrowUpRight,
  Briefcase,
  Euro,
  Phone,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const openPipeline = DEALS.filter(
    (d) => d.stage !== "chiuso_vinto" && d.stage !== "chiuso_perso",
  ).reduce((s, d) => s + d.value, 0);
  const wonMonth = DEALS.filter((d) => d.stage === "chiuso_vinto").reduce((s, d) => s + d.value, 0);
  const activeJobs = JOBS.filter((j) => j.status !== "consegnato").length;

  const stats = [
    { label: "Pipeline aperta", value: formatEuro(openPipeline), icon: Target, hint: "+12% vs mese scorso", color: "text-info" },
    { label: "Vinto questo mese", value: formatEuro(wonMonth), icon: Euro, hint: "1 affare chiuso", color: "text-success" },
    { label: "Commesse attive", value: String(activeJobs), icon: Briefcase, hint: "5 in corso, 2 pronte", color: "text-primary" },
    { label: "Chiamate oggi", value: "22", icon: Phone, hint: "media giornaliera 18", color: "text-warning" },
  ];

  const trendData = [
    { m: "Gen", offerte: 18, vinto: 7 },
    { m: "Feb", offerte: 22, vinto: 9 },
    { m: "Mar", offerte: 26, vinto: 11 },
    { m: "Apr", offerte: 24, vinto: 12 },
  ];

  return (
    <div>
      <PageHeader
        title={`Ciao ${user?.name.split(" ")[0]} 👋`}
        subtitle="Ecco il tuo riepilogo di oggi."
        actions={
          <Button asChild>
            <Link to="/crm/affari">
              Vai agli affari <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {s.label}
                    </div>
                    <div className="text-2xl font-semibold mt-1.5">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.hint}</div>
                  </div>
                  <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Andamento offerte e vinto
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="m" stroke="currentColor" className="text-xs text-muted-foreground" />
                <YAxis stroke="currentColor" className="text-xs text-muted-foreground" />
                <ReTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="offerte" fill="oklch(0.62 0.13 230)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vinto" fill="oklch(0.55 0.18 45)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Assistente AI · da sentire oggi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AI_SUGGESTIONS.slice(0, 4).map((s) => (
              <div key={s.dealId} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-sm">{s.customer}</div>
                  <Badge
                    variant={s.priority === "alta" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {s.priority}
                  </Badge>
                </div>
                <div className="text-xs text-primary font-medium mt-1">{s.action}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.reason}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance commerciali</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {SALES_KPI.map((k) => (
              <div key={k.agent} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  {k.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{k.agent}</div>
                  <div className="text-xs text-muted-foreground">
                    {k.callsPerDay} chiamate/g · {k.quotesPerDay} offerte/g · {k.closeRate}% closing
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatEuro(k.pipeline)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Commesse in corso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {JOBS.filter((j) => j.status === "in_corso")
              .slice(0, 4)
              .map((j) => (
                <div key={j.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {j.code} · {j.customer}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{j.description}</div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full [background:var(--gradient-primary)]"
                        style={{ width: `${j.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    scadenza {j.dueDate}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
