import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AI_SUGGESTIONS,
  CALLS,
  DEALS,
  Deal,
  DealStage,
  QUOTES,
  STAGE_LABELS,
  formatEuro,
} from "@/lib/mock-data";
import {
  Mic,
  Phone,
  Plus,
  Search,
  Sparkles,
  Mail,
  MapPin,
  User2,
  Clock,
  PlayCircle,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";

const QUOTE_STATUS_VARIANT: Record<
  "bozza" | "inviato" | "accettato" | "rifiutato",
  "secondary" | "outline" | "default" | "destructive"
> = {
  bozza: "secondary",
  inviato: "outline",
  accettato: "default",
  rifiutato: "destructive",
};

export const Route = createFileRoute("/_app/crm/affari")({
  component: AffariPage,
});

const STAGES: DealStage[] = ["nuovo", "qualificato", "trattativa", "chiuso_vinto", "chiuso_perso"];

function AffariPage() {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState<Deal | null>(null);

  const filtered = DEALS.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = STAGES.map((s) => ({
    stage: s,
    items: filtered.filter((d) => d.stage === s),
  }));

  return (
    <div>
      <PageHeader
        title="Affari"
        subtitle="Pipeline lead suddivisa per fase. Trascina mentalmente — il drag arriverà presto."
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca affare o cliente…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4" /> Nuovo affare
            </Button>
          </>
        }
      />

      <Card className="mb-5 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="font-semibold text-sm">Assistente AI · clienti da gestire per primi</div>
          </div>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            {AI_SUGGESTIONS.map((s) => {
              const deal = DEALS.find((d) => d.id === s.dealId);
              return (
                <button
                  key={s.dealId}
                  onClick={() => deal && setActive(deal)}
                  className="text-left rounded-md border bg-card p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{s.dealId}</span>
                    <Badge
                      variant={s.priority === "alta" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {s.priority}
                    </Badge>
                  </div>
                  <div className="font-medium text-sm">{s.customer}</div>
                  <div className="text-xs text-primary font-medium mt-0.5">{s.action}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.reason}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {grouped.map((col) => {
          const total = col.items.reduce((s, d) => s + d.value, 0);
          return (
            <div key={col.stage} className="bg-muted/40 rounded-lg p-3 min-h-[300px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <div className="text-sm font-semibold">{STAGE_LABELS[col.stage]}</div>
                  <div className="text-xs text-muted-foreground">
                    {col.items.length} · {formatEuro(total)}
                  </div>
                </div>
                <span
                  className={`h-2 w-2 rounded-full ${
                    col.stage === "chiuso_vinto"
                      ? "bg-success"
                      : col.stage === "chiuso_perso"
                        ? "bg-destructive"
                        : col.stage === "trattativa"
                          ? "bg-warning"
                          : col.stage === "qualificato"
                            ? "bg-info"
                            : "bg-muted-foreground"
                  }`}
                />
              </div>
              <div className="space-y-2">
                {col.items.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setActive(d)}
                    className="w-full text-left rounded-md bg-card border p-3 hover:border-primary/50 hover:shadow-sm transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm leading-tight">{d.title}</div>
                      {d.aiPriority === "alta" && (
                        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{d.customer}</div>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-sm font-semibold">{formatEuro(d.value)}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
                          {d.ownerInitials}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {col.items.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-6">Nessun affare</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealSheet deal={active} onClose={() => setActive(null)} />
    </div>
  );
}

function DealSheet({ deal, onClose }: { deal: Deal | null; onClose: () => void }) {
  const calls = deal ? CALLS.filter((c) => c.dealId === deal.id) : [];
  const liveCall = calls[0];

  return (
    <Sheet open={!!deal} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        {deal && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <span className="font-mono">{deal.id}</span>
                <Badge variant="outline">{STAGE_LABELS[deal.stage]}</Badge>
              </div>
              <SheetTitle className="text-xl">{deal.title}</SheetTitle>
              <SheetDescription>
                {deal.customer} — gestito da {deal.owner}
              </SheetDescription>
            </SheetHeader>

            <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b">
              <KV label="Valore" value={formatEuro(deal.value)} />
              <KV label="Probabilità" value={`${deal.probability}%`} />
              <KV label="Giorni in fase" value={String(deal.daysInStage)} />
              <KV label="Ultima attività" value={deal.lastActivity} />
            </div>

            <div className="px-6 py-4 border-b bg-primary/5">
              <div className="flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Suggerimento AI</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{deal.aiReason}</div>
                  <div className="text-sm text-primary font-medium mt-1.5">
                    Prossima azione: {deal.nextAction}
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="chiamate" className="px-6 py-4">
              <TabsList>
                <TabsTrigger value="chiamate">Chiamate</TabsTrigger>
                <TabsTrigger value="info">Contatto</TabsTrigger>
                <TabsTrigger value="storico">Storico</TabsTrigger>
              </TabsList>

              <TabsContent value="chiamate" className="space-y-4 mt-4">
                <Card className="border-destructive/40 bg-destructive/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
                        </span>
                        <div className="font-semibold text-sm">Live · trascrizione in corso</div>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Mic className="h-3 w-3" /> 02:14
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                      {liveCall?.transcript.slice(0, 5).map((t, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground w-10 shrink-0 mt-0.5">
                            {t.t}
                          </span>
                          <span
                            className={`font-semibold w-16 shrink-0 ${
                              t.speaker === "Agente" ? "text-primary" : "text-info"
                            }`}
                          >
                            {t.speaker}:
                          </span>
                          <span className="text-foreground/90">{t.text}</span>
                        </div>
                      )) || (
                        <div className="text-muted-foreground italic text-center py-3">
                          Nessuna chiamata attiva
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <PlayCircle className="h-3.5 w-3.5" /> Ascolta
                      </Button>
                      <Button size="sm" variant="outline">
                        <Sparkles className="h-3.5 w-3.5" /> Genera riassunto
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Chiamate precedenti
                </div>
                {calls.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="font-medium text-sm">
                            {c.date} · {c.duration} · {c.agent}
                          </div>
                          <Badge
                            variant={
                              c.outcome === "positiva"
                                ? "default"
                                : c.outcome === "negativa"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[10px] mt-1"
                          >
                            {c.outcome}
                          </Badge>
                        </div>
                        <Button size="sm" variant="ghost">
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="rounded-md bg-muted/60 p-3 text-sm">
                        <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-primary">
                          <Sparkles className="h-3 w-3" /> Riassunto AI
                        </div>
                        <p className="text-foreground/90 leading-relaxed">{c.summary}</p>
                        {c.nextSteps.length > 0 && (
                          <div className="mt-3 space-y-1">
                            {c.nextSteps.map((s, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-xs">
                                <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="info" className="space-y-2 mt-4">
                <InfoRow icon={User2} label="Referente" value={deal.contact} />
                <InfoRow icon={Phone} label="Telefono" value={deal.phone} />
                <InfoRow icon={Mail} label="Email" value={deal.email} />
                <InfoRow icon={MapPin} label="Città" value={deal.city} />
              </TabsContent>

              <TabsContent value="storico" className="mt-4 space-y-3">
                {[
                  { d: "Oggi 11:24", t: "Chiamata di follow-up", who: deal.owner },
                  { d: "Ieri 09:15", t: "Email con specifiche tecniche", who: deal.owner },
                  { d: "3 giorni fa", t: "Cambio fase: qualificato → trattativa", who: "Sistema" },
                  { d: "1 settimana fa", t: "Lead creato da form sito", who: "Sistema" },
                ].map((e, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{e.t}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.d} · {e.who}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b last:border-0">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="text-xs text-muted-foreground w-24">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
