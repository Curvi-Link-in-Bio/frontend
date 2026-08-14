import { useState } from "react";
import { Mail, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SUPPORT_EMAIL } from "@/lib/curvi";

export function SiteFooter() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <footer id="suporte" className="border-border/60 border-t">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 md:grid-cols-2">
        <div>
          <span className="gold-text text-xl font-bold tracking-[0.2em] uppercase">Curvi</span>
          <p className="text-muted-foreground mt-3 max-w-sm text-sm">
            A plataforma de link na bio feita para criadoras plus size. Sua página premium,
            dourada e sua.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-gold mt-5 inline-flex items-center gap-2 text-sm underline"
          >
            <Mail className="size-4" /> {SUPPORT_EMAIL}
          </a>
        </div>

        <div className="card-gold space-y-3 p-5">
          <p className="flex items-center gap-2 text-sm tracking-widest uppercase">
            <MessageCircleQuestion className="text-gold size-4" /> Dúvidas e suporte
          </p>
          <div className="space-y-2">
            <Label htmlFor="sup-subject">Assunto</Label>
            <Input
              id="sup-subject"
              maxLength={100}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex.: dúvida sobre o plano PRO"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sup-msg">Sua mensagem</Label>
            <Textarea
              id="sup-msg"
              rows={3}
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Como podemos ajudar?"
            />
          </div>
          <Button
            className="gold-gradient text-primary-foreground glow w-full font-bold"
            onClick={() => {
              const s = subject.trim();
              const m = message.trim();
              if (!s || !m) {
                toast.error("Preencha assunto e mensagem.");
                return;
              }
              window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                s.slice(0, 100),
              )}&body=${encodeURIComponent(m.slice(0, 1000))}`;
            }}
          >
            Enviar por e-mail
          </Button>
          <p className="text-muted-foreground text-[10px]">
            Abre seu app de e-mail com a mensagem pronta para {SUPPORT_EMAIL}.
          </p>
        </div>
      </div>
      <p className="text-muted-foreground border-border/60 border-t py-5 text-center text-xs">
        © {new Date().getFullYear()} Curvi. Todos os direitos reservados.
      </p>
    </footer>
  );
}
