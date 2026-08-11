import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ensureSeed, getUserByUsername, registerClick, type CurviUser } from "@/lib/curvi";

export const Route = createFileRoute("/$username")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Página pública — Curvi" },
      { name: "description", content: "Todos os links desta criadora em um só lugar, no Curvi." },
      { property: "og:title", content: "Curvi — Link na Bio" },
      { property: "og:description", content: "Todos os links desta criadora em um só lugar." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublicPage,
});

function PublicPage() {
  const { username } = Route.useParams();
  const [user, setUser] = useState<CurviUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ensureSeed();
    setUser(getUserByUsername(username));
    setReady(true);
  }, [username]);

  if (!ready) return null;

  if (!user) {
    return (
      <main className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="gold-text text-2xl uppercase">Página não encontrada</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Nenhuma criadora com o link /{username}.
        </p>
        <Link to="/" className="text-gold mt-6 text-sm underline">
          Criar minha página Curvi
        </Link>
      </main>
    );
  }

  const initials = (user.displayName || user.username).slice(0, 2).toUpperCase();

  return (
    <main
      className="flex min-h-screen flex-col items-center px-6 py-14"
      style={{ backgroundColor: user.backgroundColor }}
    >
      <div className="w-full max-w-md text-center">
        <div
          className="mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full border-2 text-xl font-bold text-white"
          style={{ borderColor: user.buttonColor }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`Foto de ${user.displayName}`}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <h1 className="mt-4 text-xl text-white uppercase">{user.displayName}</h1>
        {user.bio ? <p className="mt-2 text-sm text-white/70">{user.bio}</p> : null}

        <div className="mt-8 space-y-3">
          {user.links
            .filter((l) => l.active)
            .map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registerClick(user.username, l.id)}
                className="block rounded-xl px-5 py-4 text-sm font-bold tracking-wide uppercase transition hover:scale-[1.02]"
                style={{
                  background: user.buttonColor,
                  color: "#121214",
                  boxShadow: "0 0 15px rgba(212, 175, 55, 0.25)",
                }}
              >
                {l.title}
              </a>
            ))}
          {user.links.filter((l) => l.active).length === 0 ? (
            <p className="text-sm text-white/50">Nenhum link ativo ainda.</p>
          ) : null}
        </div>

        {user.plan === "free" ? (
          <footer className="mt-14">
            <Link
              to="/"
              className="text-xs tracking-[0.2em] text-white/50 uppercase hover:text-white"
            >
              Powered by <span style={{ color: user.buttonColor }}>Curvi</span>
            </Link>
          </footer>
        ) : null}
      </div>
    </main>
  );
}
