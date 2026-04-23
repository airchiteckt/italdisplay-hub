import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Brain,
  Briefcase,
  Building2,
  CalendarClock,
  Check,
  Cloud,
  CreditCard,
  FileText,
  Headphones,
  Kanban,
  Phone,
  PhoneCall,
  Plus,
  Receipt,
  Repeat,
  Smartphone,
  Sparkles,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatEuro } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/quotazione")({
  component: QuotazionePage,
});

interface ModulePage {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface ErpModule {
  id: string;
  title: string;
  tagline: string;
  price: number;
  color: string;
  highlight?: boolean;
  pages: ModulePage[];
  features: string[];
}

const MODULES: ErpModule[] = [
  {
    id: "crm",
    title: "CRM",
    tagline: "Gestione commerciale completa",
    price: 5500,
    color: "from-primary to-primary/70",
    highlight: true,
    pages: [
      { name: "Affari", icon: Kanban, description: "Pipeline lead con fasi nuovo → vinto" },
      { name: "Offerte", icon: FileText, description: "Preventivatore con catalogo e PDF" },
      { name: "Clienti", icon: Building2, description: "Anagrafica e storico cliente" },
      { name: "Riepilogo chiamate", icon: Phone, description: "Trascrizioni live e summary AI" },
      { name: "Sales KPI", icon: BarChart3, description: "Performance commerciale per agente" },
    ],
    features: [
      "Gestione utenti con ruoli (commerciale, admin)",
      "Integrazione centralino / VoIP",
      "Assistente AI per suggerimenti clienti prioritari",
      "Trascrizione live chiamate + summary automatico",
      "Pipeline kanban drag & drop",
      "Preventivatore PDF con catalogo prodotti",
    ],
  },
  {
    id: "lavorazione",
    title: "Lavorazione",
    tagline: "Produzione, interventi e fatturazione",
    price: 2500,
    color: "from-info to-info/70",
    pages: [
      { name: "Commesse", icon: Briefcase, description: "Kanban produzione con avanzamenti" },
      { name: "Rapporti intervento", icon: Wrench, description: "Installazione e assistenza" },
      { name: "Lavori evasi", icon: Receipt, description: "Fatturazione acconto/saldo e pagamenti" },
    ],
    features: [
      "Tracciamento commesse multi-fase",
      "Rapporti intervento con firma cliente",
      "Stato fatturazione (emessa / da emettere)",
      "Tracciamento incassi acconto e saldo",
      "Collegamento commessa ↔ offerta ↔ fattura",
    ],
  },
  {
    id: "app40",
    title: "App 4.0",
    tagline: "App mobile per operatori di reparto",
    price: 2000,
    color: "from-warning to-warning/70",
    pages: [
      { name: "Dashboard operatore", icon: Smartphone, description: "Vista mobile-first delle commesse" },
    ],
    features: [
      "Interfaccia mobile-first per operai",
      "Scansione QR code commesse",
      "Avanzamento lavorazione a tap",
      "Note e foto allegate alla commessa",
      "Cambio stato rapido (avvia / pausa / pronta / consegnata)",
    ],
  },
];

const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  crm: Users,
  lavorazione: Briefcase,
  app40: Smartphone,
};

interface RecurringCost {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
}

const RECURRING_COSTS: RecurringCost[] = [
  {
    id: "cloud",
    title: "Server Cloud",
    description: "Infrastruttura hosting, backup giornalieri e monitoraggio 24/7",
    price: 55,
    icon: Cloud,
  },
  {
    id: "centralino",
    title: "Centralino VoIP",
    description: "Numero fisso cloud dedicato ai commerciali, chiamate illimitate",
    price: 45,
    icon: PhoneCall,
  },
];

function QuotazionePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["crm"]));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast(`Modulo "${MODULES.find((m) => m.id === id)?.title}" rimosso`);
      } else {
        next.add(id);
        toast.success(`Modulo "${MODULES.find((m) => m.id === id)?.title}" aggiunto`);
      }
      return next;
    });
  };

  const total = useMemo(
    () => MODULES.filter((m) => selected.has(m.id)).reduce((s, m) => s + m.price, 0),
    [selected],
  );

  const totalPages = useMemo(
    () =>
      MODULES.filter((m) => selected.has(m.id)).reduce((s, m) => s + m.pages.length, 0),
    [selected],
  );

  const monthlyTotal = useMemo(
    () => RECURRING_COSTS.reduce((s, c) => s + c.price, 0),
    [],
  );

  const acconto = total * 0.5;
  const saldo = total * 0.5;

  return (
    <div>
      <PageHeader
        title="Quotazione ERP"
        subtitle="Componi il tuo ERP modulo per modulo. Il prezzo si aggiorna in tempo reale."
        actions={
          <Button onClick={() => toast.success("Preventivo PDF generato")}>
            <FileText className="h-4 w-4" /> Esporta preventivo
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Modules list */}
        <div className="space-y-4">
          {MODULES.map((m) => {
            const isSelected = selected.has(m.id);
            const Icon = MODULE_ICONS[m.id];
            return (
              <Card
                key={m.id}
                className={cn(
                  "overflow-hidden transition-all",
                  isSelected ? "border-primary shadow-md" : "hover:border-muted-foreground/30",
                )}
              >
                <div className={cn("h-1 bg-gradient-to-r", m.color)} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-11 w-11 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0",
                          m.color,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg leading-tight">{m.title}</h3>
                          {m.highlight && (
                            <Badge className="bg-primary/15 text-primary border-primary/20 hover:bg-primary/15">
                              <Sparkles className="h-3 w-3" /> Base consigliata
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{m.tagline}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold tabular-nums">{formatEuro(m.price)}</div>
                      <div className="text-[11px] text-muted-foreground">una tantum</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {m.pages.map((p) => {
                      const PIcon = p.icon;
                      return (
                        <div
                          key={p.name}
                          className="flex items-start gap-2 rounded-md border bg-muted/30 px-3 py-2"
                        >
                          <PIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium leading-tight">{p.name}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-1">
                              {p.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {m.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => toggle(m.id)}
                    variant={isSelected ? "outline" : "default"}
                    className="w-full"
                  >
                    {isSelected ? (
                      <>
                        <Trash2 className="h-4 w-4" /> Rimuovi modulo
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> Aggiungi modulo
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sticky summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="overflow-hidden">
            <div className="[background:var(--gradient-primary)] p-5 text-primary-foreground">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80 mb-1">
                <Brain className="h-3.5 w-3.5" /> Riepilogo quotazione
              </div>
              <div className="text-4xl font-bold tabular-nums">{formatEuro(total)}</div>
              <div className="text-xs opacity-80 mt-1">
                {selected.size} {selected.size === 1 ? "modulo" : "moduli"} · {totalPages} pagine · una tantum
              </div>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                {MODULES.map((m) => {
                  const isSelected = selected.has(m.id);
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex items-center justify-between text-sm py-1.5",
                        !isSelected && "opacity-40",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <span className="h-4 w-4 rounded border border-dashed border-muted-foreground/40" />
                        )}
                        {m.title}
                      </span>
                      <span className="font-medium tabular-nums">{formatEuro(m.price)}</span>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Totale sviluppo</span>
                <span className="text-xl tabular-nums">{formatEuro(total)}</span>
              </div>

              {/* Payment terms */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wider">
                  <CreditCard className="h-3.5 w-3.5 text-primary" /> Condizioni di pagamento
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">50% acconto all'ordine</span>
                    <span className="font-semibold tabular-nums">{formatEuro(acconto)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">50% alla consegna</span>
                    <span className="font-semibold tabular-nums">{formatEuro(saldo)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-primary/15 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5 text-primary" />
                  <span>Consegna entro <strong className="text-foreground">30 giorni</strong> dall'ordine</span>
                </div>
              </div>

              {/* Recurring monthly costs */}
              <div className="rounded-lg border bg-card p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                    <Repeat className="h-3.5 w-3.5 text-info" /> Costi ricorrenti
                  </div>
                  <Badge variant="secondary" className="text-[10px]">mensili</Badge>
                </div>
                <div className="space-y-2">
                  {RECURRING_COSTS.map((c) => {
                    const CIcon = c.icon;
                    return (
                      <div key={c.id} className="flex items-start justify-between gap-2 text-sm">
                        <div className="flex items-start gap-2 min-w-0">
                          <CIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium leading-tight">{c.title}</div>
                            <div className="text-[11px] text-muted-foreground line-clamp-2">{c.description}</div>
                          </div>
                        </div>
                        <span className="font-medium tabular-nums shrink-0 whitespace-nowrap">
                          {formatEuro(c.price)}<span className="text-[11px] text-muted-foreground">/mese</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Totale mensile</span>
                  <span className="tabular-nums whitespace-nowrap">
                    {formatEuro(monthlyTotal)}<span className="text-[11px] font-normal text-muted-foreground">/mese</span>
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Headphones className="h-3.5 w-3.5" /> Cosa include
                </div>
                <p>Sviluppo, deploy, formazione team e 30gg di supporto post go-live.</p>
              </div>

              <p className="text-[11px] text-muted-foreground text-center italic">
                Tutti i prezzi indicati sono IVA esclusa
              </p>

              <Button
                className="w-full"
                disabled={selected.size === 0}
                onClick={() => toast.success("Richiesta inviata al team commerciale")}
              >
                Richiedi proposta dettagliata
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
