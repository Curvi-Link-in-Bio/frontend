import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addReview, useReviews } from "@/lib/curvi";

function Stars({
  value,
  onChange,
  size = "size-5",
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: string;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} estrelas`}
          className={onChange ? "transition hover:scale-125" : "cursor-default"}
        >
          <Star
            className={`${size} ${n <= value ? "fill-gold text-gold" : "text-muted-foreground"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const reviews = useReviews();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const average = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <section id="avaliacoes" className="mx-auto w-full max-w-5xl px-5 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-2xl uppercase">
          O que dizem sobre o <span className="gold-text">Curvi</span>
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Nota média: <span className="text-gold font-bold">{average}</span> ({reviews.length}{" "}
          avaliações)
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-gold space-y-4 p-5">
          <p className="text-sm tracking-widest uppercase">Deixe sua avaliação</p>
          <div className="space-y-2">
            <Label htmlFor="rv-name">Seu nome</Label>
            <Input
              id="rv-name"
              value={name}
              maxLength={60}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamada"
            />
          </div>
          <div className="space-y-2">
            <Label>Sua nota</Label>
            <Stars value={rating} onChange={setRating} size="size-7" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rv-comment">O que você achou da plataforma?</Label>
            <Textarea
              id="rv-comment"
              value={comment}
              maxLength={500}
              rows={4}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência..."
            />
          </div>
          <Button
            className="gold-gradient text-primary-foreground glow w-full font-bold"
            onClick={() => {
              const n = name.trim();
              const c = comment.trim();
              if (!n || !c) {
                toast.error("Preencha nome e avaliação.");
                return;
              }
              addReview({ name: n.slice(0, 60), rating, comment: c.slice(0, 500) });
              setName("");
              setComment("");
              setRating(5);
              toast.success("Obrigada pela avaliação!");
            }}
          >
            Enviar avaliação
          </Button>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="card-gold text-muted-foreground p-6 text-center text-sm">
              Ainda não há avaliações. Seja a primeira a comentar!
            </div>
          ) : (
            reviews.slice(0, 6).map((r) => (
              <article key={r.id} className="card-gold animate-fade-up space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <Stars value={r.rating} size="size-4" />
                </div>
                <p className="text-muted-foreground text-sm">{r.comment}</p>
                <p className="text-muted-foreground text-[10px] tracking-widest uppercase">
                  {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
