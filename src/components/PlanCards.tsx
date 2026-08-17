import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PLAN_FEATURES } from "@/lib/curvi";
import { toast } from "sonner";

type Plan = "free" | "pro";

export function PlanCards({
  current,
  selectable,
  selected,
  onSelect,
  selectionType = "button",
  onSubscribe,
  onCancel,
}: {
  current?: Plan | undefined;
  selectable?: boolean;
  selected?: Plan | undefined;
  onSelect?: (plan: Plan) => void;
  selectionType?: "button" | "radio";
  onSubscribe?: () => void;
  onCancel?: () => void;
}) {
  const { free, pro } = PLAN_FEATURES;
  const freeSelected = selected === "free";
  const proSelected = selected === "pro";

  if (selectionType === "radio" && selectable) {
    return (
      <RadioGroup value={selected} onValueChange={(v) => onSelect?.(v as Plan)} className="grid gap-4 md:grid-cols-2">
        <div
          className={`card-gold space-y-3 p-5 flex flex-col cursor-pointer ${
            freeSelected ? "border-gold/60 glow" : "border-border"
          }`}
          onClick={() => onSelect?.("free")}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect?.("free");
            }
          }}
        >
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-3">
              <RadioGroupItem id="radio-free" value="free" />
              <p className="text-sm tracking-widest uppercase">{free.name}</p>
            </div>
            <span className="text-lg font-bold">{free.price}</span>
          </div>
          <p className="text-muted-foreground text-xs">Para começar: página pronta em minutos, com o essencial.</p>
          <ul className="space-y-2">
            {free.items.map((i) => (
              <li key={i} className="text-muted-foreground flex gap-2 text-xs">
                <Check className="text-silver mt-0.5 size-3.5 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`card-gold space-y-3 p-5 flex flex-col cursor-pointer ${
            proSelected ? "border-gold/60 glow" : "border-border"
          }`}
          onClick={() => onSelect?.("pro")}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect?.("pro");
            }
          }}
        >
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-3">
              <RadioGroupItem id="radio-pro" value="pro" />
              <p className="gold-text flex items-center gap-2 text-sm tracking-widest uppercase">
                <Crown className="size-4" /> {pro.name}
              </p>
            </div>
            <span className="gold-text text-lg font-bold">{pro.price}</span>
          </div>
          <p className="text-muted-foreground text-xs">Para crescer: sem limite de links e com a sua identidade visual.</p>
          <ul className="space-y-2">
            {pro.items.map((i) => (
              <li key={i} className="flex gap-2 text-xs">
                <Check className="text-gold mt-0.5 size-3.5 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </RadioGroup>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={`card-gold space-y-3 p-5 ${freeSelected ? "border-gold/60 glow" : ""}`}>
        <div className="flex items-baseline justify-between">
          <p className="text-sm tracking-widest uppercase">{free.name}</p>
          <span className="text-lg font-bold">{free.price}</span>
        </div>
        <p className="text-muted-foreground text-xs">Para começar: página pronta em minutos, com o essencial.</p>
        <ul className="space-y-2">
          {free.items.map((i) => (
            <li key={i} className="text-muted-foreground flex gap-2 text-xs">
              <Check className="text-silver mt-0.5 size-3.5 shrink-0" />
              {i}
            </li>
          ))}
        </ul>
        {selectable ? (
          selected === "free" ? (
            <p className="text-gold text-[11px] tracking-widest uppercase">Selecionado</p>
          ) : (
            <Button
              className="gold-gradient text-primary-foreground glow w-full font-bold"
              onClick={() => onSelect?.("free")}
            >
              Selecionar Gratuito
            </Button>
          )
        ) : current === "free" ? (
          <p className="text-gold text-[11px] tracking-widest uppercase">Seu plano atual</p>
        ) : null}
      </div>

      <div className={`card-gold space-y-3 p-5 ${proSelected ? "border-gold/60 glow" : ""}`}>
        <div className="flex items-baseline justify-between">
          <p className="gold-text flex items-center gap-2 text-sm tracking-widest uppercase">
            <Crown className="size-4" /> {pro.name}
          </p>
          <span className="gold-text text-lg font-bold">{pro.price}</span>
        </div>
        <p className="text-muted-foreground text-xs">Para crescer: sem limite de links e com a sua identidade visual.</p>
        <ul className="space-y-2">
          {pro.items.map((i) => (
            <li key={i} className="flex gap-2 text-xs">
              <Check className="text-gold mt-0.5 size-3.5 shrink-0" />
              {i}
            </li>
          ))}
        </ul>
        {selectable ? (
          selected === "pro" ? (
            <p className="text-gold text-[11px] tracking-widest uppercase">Selecionado</p>
          ) : (
            <Button
              className="gold-gradient text-primary-foreground glow w-full font-bold"
              onClick={() => onSelect?.("pro")}
            >
              Selecionar PRO — {pro.price}
            </Button>
          )
        ) : current === "pro" ? (
          <p className="text-gold text-[11px] tracking-widest uppercase">Seu plano atual</p>
        ) : (
          <Button
            className="gold-gradient text-primary-foreground glow w-full font-bold"
            onClick={() => toast("Checkout externo: você será redirecionado ao PagBank.")}
          >
            Assinar PRO — {pro.price}
          </Button>
        )}
      </div>
    </div>
  );
}
