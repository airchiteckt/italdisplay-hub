import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CUSTOMERS, formatEuro } from "@/lib/mock-data";
import { Building2, Mail, Phone, Plus, Search } from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/_app/crm/clienti")({
  component: ClientiPage,
});

function ClientiPage() {
  const [search, setSearch] = React.useState("");
  const filtered = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Clienti"
        subtitle="Anagrafica clienti, prospect e dormienti."
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca cliente o città…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4" /> Nuovo cliente
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Referente</TableHead>
                <TableHead>Contatti</TableHead>
                <TableHead>Città</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Affari aperti</TableHead>
                <TableHead className="text-right">Fatturato totale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.contact}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3 w-3" /> {c.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{c.city}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        c.status === "attivo"
                          ? "default"
                          : c.status === "prospect"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{c.openDeals}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatEuro(c.totalRevenue)}
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
