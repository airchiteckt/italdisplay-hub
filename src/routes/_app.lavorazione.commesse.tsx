import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JOBS, JOB_STATUS_LABELS, type JobStatus, formatEuro } from "@/lib/mock-data";
import { CalendarDays, Plus, User } from "lucide-react";

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
  return (
    <div>
      <PageHeader
        title="Commesse"
        subtitle="Gestione produzione con vista Kanban."
        actions={
          <Button>
            <Plus className="h-4 w-4" /> Nuova commessa
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATUSES.map((s) => {
          const items = JOBS.filter((j) => j.status === s);
          const total = items.reduce((sum, j) => sum + j.value, 0);
          return (
            <div key={s} className="bg-muted/40 rounded-lg p-3 min-h-[400px]">
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
                  <Card key={j.id} className="cursor-pointer hover:border-primary/50 transition">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {j.code}
                        </span>
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
                  <div className="text-xs text-muted-foreground text-center py-6">
                    Nessuna commessa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
