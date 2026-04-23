import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SALES_KPI, formatEuro } from "@/lib/mock-data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Phone, FileText, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/crm/kpi")({
  component: KpiPage,
});

function KpiPage() {
  const team = {
    calls: SALES_KPI.reduce((s, k) => s + k.callsPerDay, 0).toFixed(1),
    quotes: SALES_KPI.reduce((s, k) => s + k.quotesPerDay, 0).toFixed(1),
    closeRate: (SALES_KPI.reduce((s, k) => s + k.closeRate, 0) / SALES_KPI.length).toFixed(0),
    pipeline: SALES_KPI.reduce((s, k) => s + k.pipeline, 0),
  };

  return (
    <div>
      <PageHeader
        title="Sales KPI"
        subtitle="Metriche di team e per singolo commerciale."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Chiamate / giorno (team)" value={team.calls} icon={Phone} />
        <Stat label="Offerte / giorno (team)" value={team.quotes} icon={FileText} />
        <Stat label="Closing rate medio" value={`${team.closeRate}%`} icon={Target} />
        <Stat label="Pipeline totale" value={formatEuro(team.pipeline)} icon={TrendingUp} small />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {SALES_KPI.map((k) => (
          <Card key={k.agent}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full [background:var(--gradient-primary)] text-primary-foreground flex items-center justify-center font-semibold">
                  {k.initials}
                </div>
                <div>
                  <CardTitle className="text-base">{k.agent}</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Pipeline {formatEuro(k.pipeline)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Mini label="Chiamate/g" value={k.callsPerDay.toFixed(1)} />
                <Mini label="Offerte/g" value={k.quotesPerDay.toFixed(1)} />
                <Mini label="Closing" value={`${k.closeRate}%`} />
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={k.trend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ReTooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="calls" fill="oklch(0.62 0.13 230)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quotes" fill="oklch(0.55 0.18 45)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-base">Andamento ultimi 6 mesi</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { m: "Nov", chiamate: 180, offerte: 32 },
                { m: "Dic", chiamate: 165, offerte: 28 },
                { m: "Gen", chiamate: 210, offerte: 38 },
                { m: "Feb", chiamate: 235, offerte: 42 },
                { m: "Mar", chiamate: 248, offerte: 48 },
                { m: "Apr", chiamate: 220, offerte: 44 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="m" className="text-xs" />
              <YAxis className="text-xs" />
              <ReTooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="chiamate" stroke="oklch(0.62 0.13 230)" strokeWidth={2} />
              <Line type="monotone" dataKey="offerte" stroke="oklch(0.55 0.18 45)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  small,
}: {
  label: string;
  value: string;
  icon: any;
  small?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {label}
            </div>
            <div className={`mt-1.5 font-semibold ${small ? "text-xl" : "text-3xl"}`}>{value}</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/60 p-2 text-center">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
