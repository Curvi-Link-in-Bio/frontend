import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, signInWithGoogle, signUp, resetPassword } from "@/lib/curvi";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Curvi" },
      {
        name: "description",
        content:
          "Acesse seu painel Curvi ou crie sua página de links premium curvi.link/seunome em minutos.",
      },
      { property: "og:title", content: "Entrar no Curvi" },
      { property: "og:description", content: "Login e cadastro da sua página de links Curvi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
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
    <main className="bg-background min-h-screen">
      <header className="flex items-center justify-between px-5 py-5">
        <Link to="/" className="gold-text text-xl font-bold tracking-[0.2em] uppercase">
          Curvi
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">Voltar</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-md px-5 pb-20">
        <h1 className="mb-6 text-center text-2xl uppercase">
          Sua <span className="gold-text">página de ouro</span>
        </h1>

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
