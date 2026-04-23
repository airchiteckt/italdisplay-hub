import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { REPORTS } from "@/lib/mock-data";
import { Plus, Wrench, Hammer } from "lucide-react";

export const Route = createFileRoute("/_app/lavorazione/rapporti")({
  component: RapportiPage,
});

function RapportiPage() {
  return (
    <div>
      <PageHeader
        title="Rapporti di intervento"
        subtitle="Installazioni e assistenze on-site con ore lavorate e note tecnico."
        actions={
          <Button>
            <Plus className="h-4 w-4" /> Nuovo rapporto
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        <Stat
          label="Installazioni"
          value={REPORTS.filter((r) => r.type === "installazione").length}
          icon={Hammer}
        />
        <Stat
          label="Assistenze"
          value={REPORTS.filter((r) => r.type === "assistenza").length}
          icon={Wrench}
        />
        <Stat
          label="Ore totali"
          value={REPORTS.reduce((s, r) => s + r.hours, 0)}
          icon={Wrench}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Commessa</TableHead>
                <TableHead>Tecnico</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ore</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REPORTS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.number}</TableCell>
                  <TableCell>
                    <Badge variant={r.type === "installazione" ? "default" : "secondary"}>
                      {r.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{r.customer}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {r.jobCode ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">{r.technician}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="text-right font-semibold">{r.hours}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "completato"
                          ? "default"
                          : r.status === "da_fatturare"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {r.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {r.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {label}
            </div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
