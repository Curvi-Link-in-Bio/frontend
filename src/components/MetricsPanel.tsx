import { BarChart3, Crown, Eye, Link2, MousePointerClick, TrendingUp } from "lucide-react";
import type { CurviLink } from "@/lib/curvi";

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Eye;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card-gold space-y-1 p-4">
      <Icon className="text-gold size-4" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-muted-foreground text-[11px] tracking-widest uppercase">{label}</p>
      {hint ? <p className="text-muted-foreground text-[11px]">{hint}</p> : null}
    </div>
  );
}

export function MetricsPanel({ links, plan }: { links: CurviLink[]; plan: "free" | "pro" }) {
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const activeLinks = links.filter((l) => l.active).length;
  const ranking = [...links].sort((a, b) => b.clicks - a.clicks);
  const best = ranking[0];
  const max = Math.max(1, ...links.map((l) => l.clicks));
  const avg = links.length ? Math.round(totalClicks / links.length) : 0;

  const byCategory = Object.entries(
    links.reduce<Record<string, number>>((acc, l) => {
      acc[l.category] = (acc[l.category] ?? 0) + l.clicks;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...byCategory.map(([, v]) => v));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={MousePointerClick} label="Cliques totais" value={totalClicks} />
        <Stat icon={Link2} label="Links ativos" value={`${activeLinks}/${links.length}`} />
        <Stat icon={TrendingUp} label="Média por link" value={avg} />
        <Stat
          icon={Eye}
          label="Link campeão"
          value={best ? best.clicks : 0}
          {...(best ? { hint: best.title } : {})}
        />
      </div>

      <div className="card-gold space-y-3 p-5">
        <p className="flex items-center gap-2 text-sm tracking-widest uppercase">
          <BarChart3 className="text-gold size-4" /> Cliques por link
        </p>
        {links.length === 0 ? (
          <p className="text-muted-foreground text-xs">Adicione links para ver suas métricas.</p>
        ) : (
          <div className="space-y-3">
            {ranking.map((l) => (
              <div key={l.id} className="space-y-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-xs">{l.title}</span>
                  <span className="text-gold text-xs font-semibold">{l.clicks}</span>
                </div>
                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="gold-gradient h-full rounded-full transition-all"
                    style={{ width: `${Math.round((l.clicks / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <div className={plan === "free" ? "pointer-events-none opacity-30" : ""}>
          <div className="card-gold space-y-3 p-5">
            <p className="flex items-center gap-2 text-sm tracking-widest uppercase">
              <Crown className="text-gold size-4" /> Desempenho por categoria
            </p>
            {byCategory.length === 0 ? (
              <p className="text-muted-foreground text-xs">Sem dados ainda.</p>
            ) : (
              byCategory.map(([cat, clicks]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs">{cat}</span>
                    <span className="text-gold text-xs font-semibold">{clicks}</span>
                  </div>
                  <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="gold-gradient h-full rounded-full"
                      style={{ width: `${Math.round((clicks / maxCat) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {plan === "free" ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="card-gold border-gold/50 px-4 py-3 text-center text-xs">
              Métricas por categoria são exclusivas do plano <span className="text-gold">PRO</span>.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
