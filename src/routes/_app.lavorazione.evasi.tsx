import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  COMPLETED_WORKS,
  formatEuro,
  getBillingStatus,
  type BillingStatus,
  type InvoiceLine,
} from "@/lib/mock-data";
import { CheckCircle2, Clock4, FileText, Receipt, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_app/lavorazione/evasi")({
  component: EvasiPage,
});

const BILLING_LABELS: Record<BillingStatus, string> = {
  fatturato: "Fatturato",
  parziale: "Fatturato parz.",
  da_fatturare: "Da fatturare",
};

const BILLING_CLASSES: Record<BillingStatus, string> = {
  fatturato: "bg-success/10 text-success border-success/30",
  parziale: "bg-info/10 text-info border-info/30",
  da_fatturare: "bg-warning/10 text-warning border-warning/30",
};

function EvasiPage() {
  const totale = COMPLETED_WORKS.reduce((s, w) => s + w.total, 0);
  const incassato = COMPLETED_WORKS.reduce(
    (s, w) =>
      s +
      (w.acconto.paymentStatus === "pagato" ? w.acconto.amount : 0) +
      (w.saldo.paymentStatus === "pagato" ? w.saldo.amount : 0),
    0,
  );
  const fatturato = COMPLETED_WORKS.reduce(
    (s, w) =>
      s +
      (w.acconto.invoiceStatus === "emessa" ? w.acconto.amount : 0) +
      (w.saldo.invoiceStatus === "emessa" ? w.saldo.amount : 0),
    0,
  );
  const daFatturare = totale - fatturato;

  return (
    <div>
      <PageHeader
        title="Lavori evasi"
        subtitle="Commesse chiuse con tracciamento fatture acconto, saldo e accordi di pagamento."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SumCard
          label="Totale evaso"
          value={formatEuro(totale)}
          icon={FileText}
          color="text-foreground"
        />
        <SumCard
          label="Fatturato"
          value={formatEuro(fatturato)}
          icon={Receipt}
          color="text-info"
        />
        <SumCard
          label="Da fatturare"
          value={formatEuro(daFatturare)}
          icon={AlertCircle}
          color="text-warning"
        />
        <SumCard
          label="Incassato"
          value={formatEuro(incassato)}
          icon={CheckCircle2}
          color="text-success"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {COMPLETED_WORKS.map((w) => {
          const billing = getBillingStatus(w);
          return (
            <Card key={w.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <CardTitle className="text-base">{w.customer}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${BILLING_CLASSES[billing]}`}
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        {BILLING_LABELS[billing]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{w.description}</div>
                    <div className="text-xs font-mono text-muted-foreground mt-1">
                      {w.jobCode} · chiuso il {w.closedDate}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-semibold">{formatEuro(w.total)}</div>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {w.paymentTerms}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <PayBlock label="Acconto" item={w.acconto} />
                  <PayBlock label="Saldo" item={w.saldo} />
                </div>
                <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Dettaglio
                  </Button>
                  {billing !== "fatturato" && (
                    <Button variant="outline" size="sm">
                      <Receipt className="h-4 w-4" /> Emetti fattura
                    </Button>
                  )}
                  <Button size="sm">Sollecita</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PayBlock({ label, item }: { label: string; item: InvoiceLine }) {
  const payVariant =
    item.paymentStatus === "pagato"
      ? "default"
      : item.paymentStatus === "in_attesa"
        ? "secondary"
        : "outline";

  const invoiceClass =
    item.invoiceStatus === "emessa"
      ? "bg-info/10 text-info border-info/30"
      : "bg-warning/10 text-warning border-warning/30";

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
          {label}
        </div>
        <Badge variant="outline" className={`text-[9px] ${invoiceClass}`}>
          <Receipt className="h-2.5 w-2.5 mr-1" />
          {item.invoiceStatus === "emessa" ? "Fatturato" : "Da fatturare"}
        </Badge>
      </div>
      <div className="text-lg font-semibold mt-0.5">{formatEuro(item.amount)}</div>

      {item.invoiceNumber && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 font-mono">
          <FileText className="h-2.5 w-2.5" />
          {item.invoiceNumber}
          {item.invoiceDate && <span>· {item.invoiceDate}</span>}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t">
        <Badge variant={payVariant} className="text-[10px]">
          {item.paymentStatus.replace("_", " ")}
        </Badge>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock4 className="h-3 w-3" />
          {item.date}
        </span>
      </div>
    </div>
  );
}

function SumCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              {label}
            </div>
            <div className={`text-2xl font-semibold mt-1 ${color}`}>{value}</div>
          </div>
          <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
