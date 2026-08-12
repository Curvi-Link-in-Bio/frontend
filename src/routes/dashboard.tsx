import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";
import {
  BACKGROUND_PRESETS,
  THEMES,
  signOut,
  updateUser,
  useSession,
  type CurviLink,
  type ThemeId,
} from "@/lib/curvi";
import { ArrowDown, ArrowUp, ExternalLink, LogOut, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel Curvi — gerencie seus links e métricas" },
      {
        name: "description",
        content: "Edite perfil, temas, links e acompanhe os cliques da sua página Curvi.",
      },
      { property: "og:title", content: "Painel Curvi" },
      { property: "og:description", content: "Gerencie sua página de links Curvi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, ready } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/" });
  }, [ready, user, navigate]);

  if (!user) return null;

  const save = (patch: Parameters<typeof updateUser>[1]) => {
    try {
      updateUser(user.id, patch);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const setLinks = (links: CurviLink[]) => save({ links });

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-16">
      <header className="flex items-center justify-between py-5">
        <div>
          <span className="gold-text text-lg font-bold tracking-[0.2em] uppercase">Curvi</span>
          <p className="text-muted-foreground text-xs">curvi.link/{user.username}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="border-silver/50">
            <Link to="/$username" params={{ username: user.username }}>
              <ExternalLink className="size-4" /> Ver
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="size-4" />
          </Button>
        </div>
      </header>

      <Tabs defaultValue="links">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="tema">Tema</TabsTrigger>
          <TabsTrigger value="plano">Plano</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-5">
          <LinksPanel links={user.links} onChange={setLinks} />
        </TabsContent>

        <TabsContent value="perfil" className="mt-5 space-y-4">
          <div className="card-gold space-y-4 p-5">
            <div className="space-y-2">
              <Label>Username (URL única)</Label>
              <Input
                defaultValue={user.username}
                onBlur={(e) => {
                  const v = e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "");
                  if (v && v !== user.username) save({ username: v });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Nome de exibição</Label>
              <Input
                defaultValue={user.displayName}
                onBlur={(e) => save({ displayName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Biografia</Label>
              <Textarea defaultValue={user.bio} onBlur={(e) => save({ bio: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Foto de perfil</Label>
              <ImageUpload
                value={user.avatar}
                onChange={(v) => save({ avatar: v })}
                maxSizeMB={1}
                round
                previewClassName="size-28"
                label="Enviar foto"
              />
            </div>

            <p className="text-muted-foreground text-xs">As alterações salvam ao sair do campo.</p>
          </div>
        </TabsContent>

        <TabsContent value="tema" className="mt-5 space-y-4">
          <div className="card-gold p-5">
            <p className="mb-3 text-sm tracking-widest uppercase">Temas</p>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    save({ theme: t.id as ThemeId, backgroundColor: t.bg, buttonColor: t.button })
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    user.theme === t.id ? "border-gold glow" : "border-border"
                  }`}
                  style={{ backgroundColor: t.bg }}
                >
                  <span className="mb-2 block h-6 rounded-md" style={{ background: t.button }} />
                  <span className="text-xs text-white">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="card-gold space-y-4 p-5">
            <p className="text-sm tracking-widest uppercase">Personalização</p>
            <div className="flex items-center justify-between">
              <Label>Cor dos botões</Label>
              <input
                type="color"
                value={user.buttonColor}
                onChange={(e) => save({ buttonColor: e.target.value })}
                className="border-border h-9 w-16 rounded-md border bg-transparent"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Cor de fundo</Label>
              <input
                type="color"
                value={user.backgroundColor}
                onChange={(e) => save({ backgroundColor: e.target.value })}
                className="border-border h-9 w-16 rounded-md border bg-transparent"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plano" className="mt-5">
          <div className="card-gold space-y-4 p-5">
            <p className="text-sm tracking-widest uppercase">
              Plano atual: <span className="text-gold">{user.plan === "pro" ? "PRO" : "FREE"}</span>
            </p>
            <p className="text-muted-foreground text-sm">
              O Curvi PRO remove o selo do rodapé e libera temas exclusivos. O checkout acontece em
              gateway externo (Stripe / Mercado Pago) e a liberação chega por webhook.
            </p>
            {user.plan === "free" ? (
              <Button
                className="gold-gradient text-primary-foreground glow w-full font-bold"
                onClick={() => {
                  toast.info("Redirecionando para o checkout externo...");
                  setTimeout(() => {
                    save({ plan: "pro" });
                    toast.success("Webhook recebido: plano PRO ativado!");
                  }, 1200);
                }}
              >
                Assinar PRO — R$ 19,90/mês
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-silver/60 w-full"
                onClick={() => save({ plan: "free" })}
              >
                Cancelar assinatura
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function LinksPanel({
  links,
  onChange,
}: {
  links: CurviLink[];
  onChange: (links: CurviLink[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const move = (i: number, dir: -1 | 1) => {
    const next = [...links];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="card-gold space-y-3 p-5">
        <p className="text-sm tracking-widest uppercase">Novo link</p>
        <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input
          placeholder="https://destino.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          className="gold-gradient text-primary-foreground glow w-full font-bold"
          onClick={() => {
            if (!title.trim() || !url.trim()) {
              toast.error("Informe título e URL.");
              return;
            }
            onChange([
              ...links,
              {
                id: crypto.randomUUID(),
                title: title.trim(),
                url: url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`,
                active: true,
                clicks: 0,
              },
            ]);
            setTitle("");
            setUrl("");
            toast.success("Link adicionado!");
          }}
        >
          <Plus className="size-4" /> Adicionar
        </Button>
      </div>

      {links.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">
          Nenhum link ainda. Adicione o primeiro acima.
        </p>
      ) : (
        links.map((l, i) => (
          <div key={l.id} className="card-gold space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Input
                  defaultValue={l.title}
                  onBlur={(e) =>
                    onChange(
                      links.map((x) => (x.id === l.id ? { ...x, title: e.target.value } : x)),
                    )
                  }
                  className="mb-2"
                />
                <Input
                  defaultValue={l.url}
                  onBlur={(e) =>
                    onChange(links.map((x) => (x.id === l.id ? { ...x, url: e.target.value } : x)))
                  }
                />
              </div>
              <Switch
                checked={l.active}
                onCheckedChange={(v) =>
                  onChange(links.map((x) => (x.id === l.id ? { ...x, active: v } : x)))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gold text-xs tracking-wider uppercase">{l.clicks} cliques</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => move(i, -1)}>
                  <ArrowUp className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => move(i, 1)}>
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onChange(links.filter((x) => x.id !== l.id))}
                >
                  <Trash2 className="text-destructive size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
