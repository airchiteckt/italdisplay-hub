import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JOBS as INITIAL_JOBS,
  JOB_STATUS_LABELS,
  type Job,
  type JobStatus,
  formatEuro,
} from "@/lib/mock-data";
import { CalendarDays, Plus, User, GripVertical, Package, Clock, Euro } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/lavorazione/commesse")({
  component: CommessePage,
});

const STATUSES: JobStatus[] = ["da_fare", "in_corso", "pronto", "consegnato"];
const STATUS_COLORS: Record<JobStatus, string> = {
  da_fare: "bg-muted-foreground",
  in_corso: "bg-info",
  pronto: "bg-warning",
  consegnato: "bg-success",
};

function CommessePage() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<JobStatus | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const moveJob = (id: string, newStatus: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== id || j.status === newStatus) return j;
        const progress = newStatus === "consegnato" || newStatus === "pronto" ? 100 : j.progress;
        return { ...j, status: newStatus, progress };
      }),
    );
    const job = jobs.find((j) => j.id === id);
    if (job && job.status !== newStatus) {
      toast.success(`${job.code} spostata in "${JOB_STATUS_LABELS[newStatus]}"`);
      if (selectedJob?.id === id) {
        setSelectedJob({ ...selectedJob, status: newStatus });
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverStatus(null);
  };

  const handleDragOver = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStatus !== status) setDragOverStatus(status);
  };

  const handleDrop = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (id) moveJob(id, status);
    handleDragEnd();
  };

  return (
    <div>
      <PageHeader
        title="Commesse"
        subtitle="Gestione produzione con vista Kanban. Trascina le card per cambiare fase."
        actions={
          <Button>
            <Plus className="h-4 w-4" /> Nuova commessa
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUSES.map((s) => {
          const items = jobs.filter((j) => j.status === s);
          const total = items.reduce((sum, j) => sum + j.value, 0);
          const isOver = dragOverStatus === s;
          return (
            <div
              key={s}
              onDragOver={(e) => handleDragOver(e, s)}
              onDragLeave={() => setDragOverStatus((curr) => (curr === s ? null : curr))}
              onDrop={(e) => handleDrop(e, s)}
              className={`bg-muted/40 rounded-lg p-3 min-h-[400px] transition-colors border-2 ${
                isOver ? "border-primary bg-primary/5" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[s]}`} />
                  <div className="text-sm font-semibold">{JOB_STATUS_LABELS[s]}</div>
                </div>
                <div className="text-xs text-muted-foreground">{items.length}</div>
              </div>
              <div className="text-xs text-muted-foreground px-1 mb-3">{formatEuro(total)}</div>
              <div className="space-y-2">
                {items.map((j) => (
                  <Card
                    key={j.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, j.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedJob(j)}
                    className={`cursor-pointer hover:border-primary/50 hover:shadow-md transition group ${
                      draggingId === j.id ? "opacity-40 rotate-1" : ""
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <GripVertical className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition" />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {j.code}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {formatEuro(j.value)}
                        </Badge>
                      </div>
                      <div className="font-medium text-sm">{j.customer}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {j.description}
                      </div>
                      {j.status === "in_corso" && (
                        <div className="mt-2.5">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                            <span>Avanzamento</span>
                            <span>{j.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full [background:var(--gradient-primary)]"
                              style={{ width: `${j.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> {j.dueDate}
                        </span>
                        <span className="flex items-center gap-1 truncate">
                          <User className="h-3 w-3" /> {j.assignee}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-6 border-2 border-dashed border-muted rounded-md">
                    {isOver ? "Rilascia qui" : "Nessuna commessa"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Sheet open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedJob && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    {selectedJob.code}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[selectedJob.status]} mr-1.5`}
                    />
                    {JOB_STATUS_LABELS[selectedJob.status]}
                  </Badge>
                </div>
                <SheetTitle className="text-xl">{selectedJob.customer}</SheetTitle>
                <SheetDescription>{selectedJob.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Cambia fase
                  </label>
                  <Select
                    value={selectedJob.status}
                    onValueChange={(v) => moveJob(selectedJob.id, v as JobStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[s]}`} />
                            {JOB_STATUS_LABELS[s]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Euro className="h-3 w-3" /> Valore
                    </div>
                    <div className="font-semibold">{formatEuro(selectedJob.value)}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <CalendarDays className="h-3 w-3" /> Scadenza
                    </div>
                    <div className="font-semibold text-sm">{selectedJob.dueDate}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" /> Avanz.
                    </div>
                    <div className="font-semibold">{selectedJob.progress}%</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Avanzamento produzione</span>
                    <span>{selectedJob.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full [background:var(--gradient-primary)] transition-all"
                      style={{ width: `${selectedJob.progress}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" /> Dettagli commessa
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente</span>
                      <span className="font-medium">{selectedJob.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reparto</span>
                      <span className="font-medium">{selectedJob.assignee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Codice</span>
                      <span className="font-mono text-xs">{selectedJob.code}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Note di produzione</h4>
                  <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    {selectedJob.description}. Verificare specifiche tecniche prima dell'avvio
                    lavorazione. Materiali in arrivo da fornitore principale.
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Apri rapporto
                  </Button>
                  <Button className="flex-1">Modifica</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
