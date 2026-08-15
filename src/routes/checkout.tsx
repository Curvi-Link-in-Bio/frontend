import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanCards } from "@/components/PlanCards";
import { updateUser, useSession } from "@/lib/curvi";

import { Check, Copy, CreditCard, QrCode, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout Curvi PRO — Pix ou cartão" },
      {
        name: "description",
        content:
          "Finalize sua assinatura Curvi PRO por Pix, cartão de crédito ou cartão de débito em poucos segundos.",
      },
      { property: "og:title", content: "Checkout Curvi PRO" },
      { property: "og:description", content: "Pague com Pix, crédito ou débito e libere o PRO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

const PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX0136curvi-pro-assinatura-mensal5204000053039865802BR5909CURVI LTDA6009SAO PAULO62070503***6304A1B2";

const cardSchema = z.object({
  number: z
    .string()
    .transform((v) => v.replace(/\s/g, ""))
    .pipe(z.string().regex(/^\d{13,19}$/, "Número do cartão inválido.")),
  name: z.string().trim().min(3, "Informe o nome impresso no cartão.").max(80),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Validade deve ser MM/AA."),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido."),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF deve ter 11 dígitos.")),
});

function Checkout() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState<"credito" | "debito">("credito");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "", cpf: "" });

  const confirm = (method: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      if (user) updateUser(user.id, { plan: "pro", paymentMethod: method });
      toast.success("Pagamento aprovado! Plano PRO ativado.");
    }, 1400);
  };

  if (paid) {
    return (
      <main className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="gold-gradient glow animate-pop mb-6 flex size-20 items-center justify-center rounded-full">
          <Check className="text-primary-foreground size-10" />
        </div>
        <h1 className="text-2xl uppercase">
          Pagamento <span className="gold-text">aprovado</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm">
          Seu plano Curvi PRO já está ativo. Aproveite temas exclusivos e a página sem selo.
        </p>
        <Button asChild className="gold-gradient text-primary-foreground glow mt-8 font-bold">
          <Link to={user ? "/dashboard" : "/"}>{user ? "Ir para o painel" : "Voltar ao início"}</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <header className="flex items-center justify-between px-5 py-5">
        <Link to="/" className="gold-text text-xl font-bold tracking-[0.2em] uppercase">
          Curvi
        </Link>
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
          Voltar
        </Button>
      </header>

      <section className="mx-auto max-w-lg px-5 pb-20">
        <div className="mb-6">
          <PlanCards current={user?.plan} />
        </div>


        <Tabs defaultValue="pix">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pix">
              <QrCode className="mr-2 size-4" /> Pix
            </TabsTrigger>
            <TabsTrigger value="cartao">
              <CreditCard className="mr-2 size-4" /> Cartão
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pix" className="mt-5">
            <div className="card-gold space-y-4 p-5 text-center">
              <div className="border-gold/40 mx-auto grid size-44 grid-cols-8 gap-0.5 rounded-xl border p-3">
                {Array.from({ length: 64 }).map((_, i) => (
                  <span
                    key={i}
                    className="rounded-[2px]"
                    style={{
                      background: (i * 7 + (i % 5)) % 3 === 0 ? "var(--gold)" : "transparent",
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                Escaneie o QR Code no app do seu banco ou copie o código abaixo.
              </p>
              <div className="bg-secondary text-muted-foreground truncate rounded-md p-3 text-left text-[10px]">
                {PIX_CODE}
              </div>
              <Button
                variant="outline"
                className="border-gold/50 w-full"
                onClick={async () => {
                  await navigator.clipboard.writeText(PIX_CODE);
                  setCopied(true);
                  toast.success("Código Pix copiado!");
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Copiar código
                Pix
              </Button>
              <Button
                className="gold-gradient text-primary-foreground glow w-full font-bold"
                disabled={loading}
                onClick={() => confirm("pix")}
              >
                {loading ? "Confirmando..." : "Já paguei — confirmar"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="cartao" className="mt-5">
            <div className="card-gold space-y-4 p-5">
              <div className="space-y-2">
                <Label>Tipo de cartão</Label>
                <RadioGroup
                  value={cardType}
                  onValueChange={(v) => setCardType(v as "credito" | "debito")}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { v: "credito", label: "Crédito" },
                    { v: "debito", label: "Débito" },
                  ].map((o) => (
                    <Label
                      key={o.v}
                      htmlFor={`ct-${o.v}`}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition ${
                        cardType === o.v ? "border-gold glow" : "border-border"
                      }`}
                    >
                      <RadioGroupItem id={`ct-${o.v}`} value={o.v} />
                      {o.label}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="c-number">Número do cartão</Label>
                <Input
                  id="c-number"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      number: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 19)
                        .replace(/(.{4})/g, "$1 ")
                        .trim(),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-name">Nome impresso no cartão</Label>
                <Input
                  id="c-name"
                  maxLength={80}
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="c-exp">Validade</Label>
                  <Input
                    id="c-exp"
                    placeholder="MM/AA"
                    value={card.expiry}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCard({
                        ...card,
                        expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d,
                      });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-cvv">CVV</Label>
                  <Input
                    id="c-cvv"
                    inputMode="numeric"
                    value={card.cvv}
                    onChange={(e) =>
                      setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-cpf">CPF do titular</Label>
                <Input
                  id="c-cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={card.cpf}
                  onChange={(e) =>
                    setCard({ ...card, cpf: e.target.value.replace(/\D/g, "").slice(0, 11) })
                  }
                />
              </div>

              <Button
                className="gold-gradient text-primary-foreground glow w-full font-bold"
                disabled={loading}
                onClick={() => {
                  const parsed = cardSchema.safeParse(card);
                  if (!parsed.success) {
                    toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
                    return;
                  }
                  confirm(cardType);
                }}
              >
                {loading ? "Processando..." : `Pagar R$ 19,90 no ${cardType}`}
              </Button>
              <p className="text-muted-foreground flex items-center gap-2 text-[10px]">
                <ShieldCheck className="size-3" /> Ambiente de demonstração — nenhum dado de cartão é
                enviado ou armazenado.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
