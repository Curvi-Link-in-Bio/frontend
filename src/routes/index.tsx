import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signInWithGoogle, signUp, resetPassword, useSession } from "@/lib/curvi";
import { Crown, Link2, BarChart3, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curvi — Seu Link na Bio Plus Size, com brilho de ouro" },
      {
        name: "description",
        content:
          "Curvi é a plataforma de link na bio feita para criadoras plus size: página premium, links ilimitados e métricas de cliques.",
      },
      { property: "og:title", content: "Curvi — Link na Bio para criadoras plus size" },
      {
        property: "og:description",
        content: "Crie sua página curvi.link/seunome em minutos, com tema dark premium dourado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [recoverMode, setRecoverMode] = useState(false);

  function handle(fn: () => void) {
    try {
      fn();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-5 py-5">
        <span className="gold-text text-xl font-bold tracking-[0.2em] uppercase">Curvi</span>
        {user ? (
          <Button asChild variant="outline" className="border-silver/50">
            <Link to="/dashboard">Painel</Link>
          </Button>
        ) : null}
      </header>

      <section className="mx-auto max-w-md px-5 pt-6 pb-16">
        <div className="mb-10 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs tracking-widest text-gold uppercase">
            <Sparkles className="size-3" /> Plus size & criadoras
          </p>
          <h1 className="text-3xl leading-tight uppercase">
            Todos os seus links em uma <span className="gold-text">página de ouro</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-sm">
            Monte sua bio premium em minutos: curvi.link/seunome, temas exclusivos e contagem de
            cliques.
          </p>
        </div>

        <div className="card-gold p-5">
          {recoverMode ? (
            <div className="space-y-4">
              <h2 className="text-sm tracking-widest uppercase">Recuperar senha</h2>
              <div className="space-y-2">
                <Label htmlFor="r-email">E-mail</Label>
                <Input id="r-email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r-pass">Nova senha</Label>
                <Input
                  id="r-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="gold-gradient text-primary-foreground glow w-full font-bold"
                onClick={() =>
                  handle(() => {
                    resetPassword(email, password);
                    toast.success("Senha redefinida. Faça login.");
                    setRecoverMode(false);
                  })
                }
              >
                Redefinir senha
              </Button>
              <button
                className="text-muted-foreground w-full text-xs underline"
                onClick={() => setRecoverMode(false)}
              >
                Voltar
              </button>
            </div>
          ) : (
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="l-email">E-mail</Label>
                  <Input
                    id="l-email"
                    placeholder="demo@curvi.link"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-pass">Senha</Label>
                  <Input
                    id="l-pass"
                    type="password"
                    placeholder="curvi123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="gold-gradient text-primary-foreground glow w-full font-bold"
                  onClick={() =>
                    handle(() => {
                      signIn(email, password);
                      navigate({ to: "/dashboard" });
                    })
                  }
                >
                  Entrar
                </Button>
                <button
                  className="text-muted-foreground w-full text-xs underline"
                  onClick={() => setRecoverMode(true)}
                >
                  Esqueci minha senha
                </button>
              </TabsContent>

              <TabsContent value="signup" className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="s-user">Sua URL única</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">curvi.link/</span>
                    <Input
                      id="s-user"
                      value={username}
                      placeholder="seunome"
                      onChange={(e) =>
                        setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-email">E-mail</Label>
                  <Input id="s-email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="s-pass">Senha</Label>
                  <Input
                    id="s-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="gold-gradient text-primary-foreground glow w-full font-bold"
                  onClick={() =>
                    handle(() => {
                      if (!username || !email || !password)
                        throw new Error("Preencha todos os campos.");
                      signUp(email, password, username);
                      navigate({ to: "/dashboard" });
                    })
                  }
                >
                  Criar minha página
                </Button>
              </TabsContent>
            </Tabs>
          )}

          <div className="my-5 flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">ou</span>
            <div className="bg-border h-px flex-1" />
          </div>
          <Button
            variant="outline"
            className="border-silver/60 w-full"
            onClick={() =>
              handle(() => {
                signInWithGoogle();
                navigate({ to: "/dashboard" });
              })
            }
          >
            Continuar com Google
          </Button>
        </div>

        <div className="mt-10 grid gap-3">
          {[
            { icon: Link2, t: "Links ilimitados", d: "Crie, reordene e ative/desative quando quiser." },
            { icon: BarChart3, t: "Métricas de cliques", d: "Veja o total de cliques de cada link." },
            { icon: Crown, t: "Temas premium", d: "Dark dourado, champagne, onyx e rose gold." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="card-gold flex items-start gap-3 p-4">
              <Icon className="text-gold mt-0.5 size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted-foreground text-xs">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-8 text-center text-xs">
          Demo: <span className="text-gold">demo@curvi.link</span> / curvi123 —{" "}
          <Link to="/$username" params={{ username: "curvidemo" }} className="underline">
            ver página pública
          </Link>
        </p>
      </section>
    </main>
  );
}
