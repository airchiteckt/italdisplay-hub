import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPLETED_WORKS, formatEuro } from "@/lib/mock-data";
import { CheckCircle2, Clock4, FileText, MinusCircle } from "lucide-react";

export const Route = createFileRoute("/_app/lavorazione/evasi")({
  component: EvasiPage,
});

function EvasiPage() {
  const totale = COMPLETED_WORKS.reduce((s, w) => s + w.total, 0);
  const incassato =
    COMPLETED_WORKS.reduce(
      (s, w) =>
        s +
        (w.acconto.status === "pagato" ? w.acconto.amount : 0) +
        (w.saldo.status === "pagato" ? w.saldo.amount : 0),
      0,
    );
  const inAttesa = totale - incassato;

  return (
    <div>
      <PageHeader
        title="Lavori evasi"
        subtitle="Commesse chiuse con tracciamento fatture acconto, saldo e accordi di pagamento."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <SumCard
          label="Totale evaso"
          value={formatEuro(totale)}
          icon={FileText}
          color="text-foreground"
        />
        <SumCard
          label="Incassato"
          value={formatEuro(incassato)}
          icon={CheckCircle2}
          color="text-success"
        />
        <SumCard
          label="In attesa di pagamento"
          value={formatEuro(inAttesa)}
          icon={Clock4}
          color="text-warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {COMPLETED_WORKS.map((w) => (
          <Card key={w.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{w.customer}</CardTitle>
                  <div className="text-sm text-muted-foreground">{w.description}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-1">
                    {w.jobCode} · chiuso il {w.closedDate}
                  </div>
                </div>
                <div className="text-right">
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
                <Button size="sm">Sollecita</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PayBlock({
  label,
  item,
}: {
  label: string;
  item: { amount: number; date: string; status: "pagato" | "in_attesa" | "non_emesso" };
}) {
  const variant =
    item.status === "pagato"
      ? "default"
      : item.status === "in_attesa"
        ? "secondary"
        : "outline";
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
        {label}
      </div>
      <div className="text-lg font-semibold mt-0.5">{formatEuro(item.amount)}</div>
      <div className="flex items-center justify-between mt-1.5">
        <Badge variant={variant} className="text-[10px]">
          {item.status.replace("_", " ")}
        </Badge>
        <span className="text-xs text-muted-foreground">{item.date}</span>
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
  icon: any;
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
