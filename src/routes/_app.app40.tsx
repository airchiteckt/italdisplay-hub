import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Factory,
  Filter,
  PackageCheck,
  PauseCircle,
  PlayCircle,
  QrCode,
  Search,
  Truck,
  User,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  JOBS as INITIAL_JOBS,
  JOB_STATUS_LABELS,
  type Job,
  type JobStatus,
  formatEuro,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/app40")({
  component: App40Page,
});

const FILTERS: { key: "tutti" | JobStatus; label: string }[] = [
  { key: "tutti", label: "Tutte" },
  { key: "da_fare", label: "Da fare" },
  { key: "in_corso", label: "In corso" },
  { key: "pronto", label: "Pronte" },
  { key: "consegnato", label: "Consegnate" },
];

const STATUS_COLOR: Record<JobStatus, string> = {
  da_fare: "bg-muted text-foreground",
  in_corso: "bg-info/15 text-info border-info/30",
  pronto: "bg-warning/15 text-warning border-warning/30",
  consegnato: "bg-success/15 text-success border-success/30",
};

function App40Page() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [filter, setFilter] = useState<"tutti" | JobStatus>("tutti");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);
  const [note, setNote] = useState("");

  const operator = { name: "Marco R.", role: "Operatore produzione", initials: "MR" };

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchFilter = filter === "tutti" ? true : j.status === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        j.code.toLowerCase().includes(q) ||
        j.customer.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [jobs, filter, query]);

  const stats = useMemo(() => {
    return {
      attive: jobs.filter((j) => j.status === "in_corso").length,
      daFare: jobs.filter((j) => j.status === "da_fare").length,
      pronte: jobs.filter((j) => j.status === "pronto").length,
    };
  }, [jobs]);

  const updateStatus = (id: string, status: JobStatus, msg: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const progress =
          status === "consegnato" || status === "pronto"
            ? 100
            : status === "in_corso" && j.progress === 0
              ? 10
              : j.progress;
        return { ...j, status, progress };
      }),
    );
    if (selected?.id === id) {
      setSelected((s) => (s ? { ...s, status } : s));
    }
    toast.success(msg);
  };

  const updateProgress = (id: string, delta: number) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        const next = Math.max(0, Math.min(100, j.progress + delta));
        return { ...j, progress: next };
      }),
    );
    if (selected?.id === id) {
      setSelected((s) =>
        s ? { ...s, progress: Math.max(0, Math.min(100, s.progress + delta)) } : s,
      );
    }
  };

  return (
    <div className="-m-4 md:-m-6 min-h-[calc(100vh-3.5rem)] bg-muted/30">
      {/* Sticky operator header */}
      <div className="sticky top-14 z-10 [background:var(--gradient-sidebar)] text-slate-100 px-4 pt-4 pb-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-semibold">
              {operator.initials}
            </div>
            <div>
              <div className="text-xs text-slate-400">Buongiorno</div>
              <div className="font-semibold leading-tight">{operator.name}</div>
              <div className="text-[11px] text-slate-400">{operator.role}</div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="text-slate-100 hover:bg-white/10 h-10 w-10"
            onClick={() => toast("Scansione QR code commessa…", { icon: "📷" })}
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Attive" value={stats.attive} icon={PlayCircle} tone="info" />
          <StatPill label="Da fare" value={stats.daFare} icon={Clock} tone="muted" />
          <StatPill label="Pronte" value={stats.pronte} icon={PackageCheck} tone="warning" />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca commessa, cliente, codice…"
            className="pl-9 h-11 bg-background"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 pb-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition",
                filter === f.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Job list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground">
              Nessuna commessa trovata
            </div>
          )}
          {filtered.map((j) => (
            <Card
              key={j.id}
              onClick={() => setSelected(j)}
              className="active:scale-[0.99] transition cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {j.code}
                      </span>
                      <Badge variant="outline" className={cn("text-[10px]", STATUS_COLOR[j.status])}>
                        {JOB_STATUS_LABELS[j.status]}
                      </Badge>
                    </div>
                    <div className="font-semibold leading-tight">{j.customer}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {j.description}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                </div>

                {j.status === "in_corso" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                      <span>Avanzamento</span>
                      <span className="font-medium text-foreground">{j.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full [background:var(--gradient-primary)]"
                        style={{ width: `${j.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {j.dueDate}
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[55%]">
                    <Factory className="h-3 w-3" /> {j.assignee}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent
          side="bottom"
          className="h-[92vh] sm:h-[88vh] rounded-t-2xl overflow-y-auto"
        >
          {selected && (
            <>
              <SheetHeader className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{selected.code}</span>
                  <Badge variant="outline" className={cn("text-[10px]", STATUS_COLOR[selected.status])}>
                    {JOB_STATUS_LABELS[selected.status]}
                  </Badge>
                </div>
                <SheetTitle className="text-xl">{selected.customer}</SheetTitle>
                <SheetDescription>{selected.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-5 space-y-5">
                {/* Quick info grid */}
                <div className="grid grid-cols-2 gap-2">
                  <InfoTile icon={Clock} label="Scadenza" value={selected.dueDate} />
                  <InfoTile icon={Factory} label="Reparto" value={selected.assignee} />
                  <InfoTile
                    icon={ClipboardCheck}
                    label="Avanzamento"
                    value={`${selected.progress}%`}
                  />
                  <InfoTile icon={User} label="Valore" value={formatEuro(selected.value)} />
                </div>

                {/* Progress controls */}
                <div className="rounded-lg border p-4 bg-background">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Avanzamento lavorazione</span>
                    <span className="font-mono">{selected.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden mb-3">
                    <div
                      className="h-full [background:var(--gradient-primary)] transition-all"
                      style={{ width: `${selected.progress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((v) => (
                      <Button
                        key={v}
                        variant="outline"
                        size="sm"
                        onClick={() => updateProgress(selected.id, v - selected.progress)}
                      >
                        {v}%
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant="secondary"
                      onClick={() => updateProgress(selected.id, -10)}
                      disabled={selected.progress <= 0}
                    >
                      -10%
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => updateProgress(selected.id, +10)}
                      disabled={selected.progress >= 100}
                    >
                      +10%
                    </Button>
                  </div>
                </div>

                {/* Status actions */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cambia stato
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selected.status === "in_corso" ? "default" : "outline"}
                      onClick={() =>
                        updateStatus(selected.id, "in_corso", `${selected.code} avviata`)
                      }
                      className="h-12"
                    >
                      <PlayCircle className="h-4 w-4" /> Avvia
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast(`${selected.code} in pausa`)}
                      className="h-12"
                    >
                      <PauseCircle className="h-4 w-4" /> Pausa
                    </Button>
                    <Button
                      variant={selected.status === "pronto" ? "default" : "outline"}
                      onClick={() =>
                        updateStatus(selected.id, "pronto", `${selected.code} pronta per consegna`)
                      }
                      className="h-12"
                    >
                      <PackageCheck className="h-4 w-4" /> Pronta
                    </Button>
                    <Button
                      variant={selected.status === "consegnato" ? "default" : "outline"}
                      onClick={() =>
                        updateStatus(selected.id, "consegnato", `${selected.code} consegnata`)
                      }
                      className="h-12"
                    >
                      <Truck className="h-4 w-4" /> Consegnata
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Note + foto */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Aggiungi nota
                  </div>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Es: materiale in arrivo, problema riscontrato…"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => toast("Foto allegata alla commessa")}
                    >
                      <Camera className="h-4 w-4" /> Foto
                    </Button>
                    <Button
                      onClick={() => {
                        if (note.trim()) {
                          toast.success("Nota salvata");
                          setNote("");
                        }
                      }}
                      disabled={!note.trim()}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Salva nota
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Quick actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Wrench className="h-4 w-4" /> Apri rapporto intervento
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <ClipboardCheck className="h-4 w-4" /> Vedi specifiche tecniche
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatPill({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "info" | "muted" | "warning";
}) {
  const tones = {
    info: "bg-info/20 text-info-foreground",
    muted: "bg-white/10 text-slate-100",
    warning: "bg-warning/20 text-warning-foreground",
  } as const;
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 mb-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={cn("text-2xl font-bold leading-none", tones[tone])}>{value}</div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="font-semibold text-sm truncate">{value}</div>
    </div>
  );
}
