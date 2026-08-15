import { Link } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_FEATURES } from "@/lib/curvi";

export function PlanCards({ current }: { current?: "free" | "pro" }) {
  const { free, pro } = PLAN_FEATURES;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card-gold space-y-3 p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm tracking-widest uppercase">{free.name}</p>
          <span className="text-lg font-bold">{free.price}</span>
        </div>
        <p className="text-muted-foreground text-xs">
          Para começar: página pronta em minutos, com o essencial.
        </p>
        <ul className="space-y-2">
          {free.items.map((i) => (
            <li key={i} className="text-muted-foreground flex gap-2 text-xs">
              <Check className="text-silver mt-0.5 size-3.5 shrink-0" />
              {i}
            </li>
          ))}
        </ul>
        {current === "free" ? (
          <p className="text-gold text-[11px] tracking-widest uppercase">Seu plano atual</p>
        ) : null}
      </div>

      <div className="card-gold border-gold/60 glow space-y-3 p-5">
        <div className="flex items-baseline justify-between">
          <p className="gold-text flex items-center gap-2 text-sm tracking-widest uppercase">
            <Crown className="size-4" /> {pro.name}
          </p>
          <span className="gold-text text-lg font-bold">{pro.price}</span>
        </div>
        <p className="text-muted-foreground text-xs">
          Para crescer: sem limite de links e com a sua identidade visual.
        </p>
        <ul className="space-y-2">
          {pro.items.map((i) => (
            <li key={i} className="flex gap-2 text-xs">
              <Check className="text-gold mt-0.5 size-3.5 shrink-0" />
              {i}
            </li>
          ))}
        </ul>
        {current === "pro" ? (
          <p className="text-gold text-[11px] tracking-widest uppercase">Seu plano atual</p>
        ) : (
          <Button asChild className="gold-gradient text-primary-foreground glow w-full font-bold">
            <Link to="/checkout">Assinar PRO — {pro.price}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
