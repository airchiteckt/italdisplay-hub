import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CALLS } from "@/lib/mock-data";
import { CheckCircle2, PlayCircle, Sparkles, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/crm/chiamate")({
  component: ChiamatePage,
});

function ChiamatePage() {
  const [active, setActive] = React.useState(CALLS[0].id);
  const call = CALLS.find((c) => c.id === active)!;

  return (
    <div>
      <PageHeader
        title="Riepilogo chiamate"
        subtitle="Trascrizioni live e riassunti AI di tutte le conversazioni con i clienti."
      />

      <div className="grid lg:grid-cols-[340px_1fr] gap-4">
        <Card className="lg:max-h-[calc(100vh-200px)] overflow-y-auto">
          <CardContent className="p-2 space-y-1">
            {CALLS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full text-left rounded-md p-3 transition ${
                  active === c.id ? "bg-primary/10 border border-primary/30" : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{c.customer}</div>
                  <Badge
                    variant={
                      c.outcome === "positiva"
                        ? "default"
                        : c.outcome === "negativa"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {c.outcome}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {c.date} · {c.duration}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.agent}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-lg">{call.customer}</div>
                  <div className="text-sm text-muted-foreground">
                    Affare {call.dealId} · {call.agent} · {call.date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <PlayCircle className="h-4 w-4" /> Ascolta registrazione
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" /> Richiama
                  </Button>
                </div>
              </div>
              <div className="rounded-md bg-primary/5 border border-primary/20 p-4">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" /> Riassunto AI
                </div>
                <p className="text-sm leading-relaxed">{call.summary}</p>
                {call.nextSteps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      Prossimi passi
                    </div>
                    <ul className="space-y-1">
                      {call.nextSteps.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Trascrizione</div>
                <Badge variant="outline">{call.transcript.length} interventi</Badge>
              </div>
              {call.transcript.length === 0 ? (
                <div className="text-sm text-muted-foreground italic text-center py-6">
                  Trascrizione non disponibile per questa chiamata.
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  {call.transcript.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-12 shrink-0 mt-0.5">
                        {t.t}
                      </span>
                      <div className="flex-1">
                        <div
                          className={`text-xs font-semibold mb-0.5 ${
                            t.speaker === "Agente" ? "text-primary" : "text-info"
                          }`}
                        >
                          {t.speaker}
                        </div>
                        <div className="text-foreground/90 leading-relaxed">{t.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
