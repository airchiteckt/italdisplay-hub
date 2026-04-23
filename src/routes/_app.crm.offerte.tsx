import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PRODUCTS, QUOTES, CUSTOMERS, formatEuro, type Product } from "@/lib/mock-data";
import { FileDown, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/crm/offerte")({
  component: OffertePage,
});

interface QuoteLine {
  productId: string;
  qty: number;
  discount: number;
}

function OffertePage() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <PageHeader
        title="Offerte"
        subtitle="Preventivi inviati ai clienti. Crea nuove offerte usando il configuratore."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Nuovo preventivo
              </Button>
            </DialogTrigger>
            <QuoteBuilder onClose={() => setOpen(false)} />
          </Dialog>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4 mb-5">
        <StatCard label="Bozze" value={QUOTES.filter((q) => q.status === "bozza").length} />
        <StatCard label="Inviati" value={QUOTES.filter((q) => q.status === "inviato").length} />
        <StatCard label="Accettati" value={QUOTES.filter((q) => q.status === "accettato").length} />
        <StatCard
          label="Valore totale"
          value={formatEuro(QUOTES.reduce((s, q) => s + q.total, 0))}
          isMoney
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Validità</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Importo</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUOTES.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-mono text-xs">{q.number}</TableCell>
                  <TableCell className="font-medium">{q.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{q.date}</TableCell>
                  <TableCell className="text-muted-foreground">{q.validUntil}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        q.status === "accettato"
                          ? "default"
                          : q.status === "rifiutato"
                            ? "destructive"
                            : q.status === "inviato"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{q.owner}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatEuro(q.total)}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => toast.success("PDF generato")}>
                      <FileDown className="h-4 w-4" />
                    </Button>
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

function StatCard({ label, value, isMoney }: { label: string; value: number | string; isMoney?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
        <div className={`mt-1 font-semibold ${isMoney ? "text-2xl" : "text-3xl"}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function QuoteBuilder({ onClose }: { onClose: () => void }) {
  const [customer, setCustomer] = React.useState(CUSTOMERS[0]?.name ?? "");
  const [lines, setLines] = React.useState<QuoteLine[]>([
    { productId: PRODUCTS[0].id, qty: 1, discount: 0 },
  ]);

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) as Product;

  const addLine = () =>
    setLines((p) => [...p, { productId: PRODUCTS[0].id, qty: 1, discount: 0 }]);

  const updateLine = (i: number, patch: Partial<QuoteLine>) =>
    setLines((p) => p.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const removeLine = (i: number) => setLines((p) => p.filter((_, idx) => idx !== i));

  const subtotal = lines.reduce((s, l) => {
    const p = getProduct(l.productId);
    return s + p.unitPrice * l.qty * (1 - l.discount / 100);
  }, 0);
  const vat = subtotal * 0.22;
  const total = subtotal + vat;

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Nuovo preventivo
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Cliente</Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMERS.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Validità</Label>
            <Input type="date" />
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs">
              <tr>
                <th className="text-left p-2 font-medium">Prodotto</th>
                <th className="text-right p-2 font-medium w-20">Qta</th>
                <th className="text-right p-2 font-medium w-24">Prezzo</th>
                <th className="text-right p-2 font-medium w-20">Sconto %</th>
                <th className="text-right p-2 font-medium w-28">Totale</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const p = getProduct(l.productId);
                const lineTotal = p.unitPrice * l.qty * (1 - l.discount / 100);
                return (
                  <tr key={i} className="border-t">
                    <td className="p-2">
                      <Select
                        value={l.productId}
                        onValueChange={(v) => updateLine(i, { productId: v })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCTS.map((pr) => (
                            <SelectItem key={pr.id} value={pr.id}>
                              <span className="font-mono text-[10px] mr-1">{pr.code}</span>{" "}
                              {pr.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        min={1}
                        value={l.qty}
                        onChange={(e) => updateLine(i, { qty: Number(e.target.value) || 1 })}
                        className="h-8 text-right"
                      />
                    </td>
                    <td className="p-2 text-right text-muted-foreground">
                      {formatEuro(p.unitPrice)}
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={l.discount}
                        onChange={(e) =>
                          updateLine(i, { discount: Number(e.target.value) || 0 })
                        }
                        className="h-8 text-right"
                      />
                    </td>
                    <td className="p-2 text-right font-semibold">{formatEuro(lineTotal)}</td>
                    <td className="p-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => removeLine(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-2 border-t bg-muted/30">
            <Button size="sm" variant="outline" onClick={addLine}>
              <Plus className="h-3.5 w-3.5" /> Aggiungi riga
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-72 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Imponibile</span>
              <span className="font-medium">{formatEuro(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA 22%</span>
              <span className="font-medium">{formatEuro(vat)}</span>
            </div>
            <div className="flex justify-between border-t pt-1.5 text-base">
              <span className="font-semibold">Totale</span>
              <span className="font-semibold text-primary">{formatEuro(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annulla
        </Button>
        <Button
          onClick={() => {
            toast.success("Preventivo creato e PDF generato");
            onClose();
          }}
        >
          <FileDown className="h-4 w-4" /> Crea ed esporta PDF
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
