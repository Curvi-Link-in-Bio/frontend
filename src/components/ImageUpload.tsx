import { useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ImageUp, Trash2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (dataUrl: string) => void;
  maxSizeMB: number;
  previewClassName?: string;
  round?: boolean;
  label?: string;
};

export function ImageUpload({
  value,
  onChange,
  maxSizeMB,
  previewClassName = "h-36 w-full",
  round = false,
  label = "Escolher imagem",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxBytes = maxSizeMB * 1024 * 1024;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > maxBytes) {
      toast.error(
        `Imagem muito grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo: ${maxSizeMB} MB.`,
      );
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(String(reader.result));
      toast.success("Imagem carregada!");
    };
    reader.onerror = () => toast.error("Não foi possível ler o arquivo.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div
        className={`bg-secondary border-border flex items-center justify-center overflow-hidden border ${
          round ? "rounded-full" : "rounded-xl"
        } ${previewClassName}`}
      >
        {value ? (
          <img src={value} alt="Pré-visualização" className="size-full object-cover" />
        ) : (
          <span className="text-muted-foreground px-2 text-center text-xs">Sem imagem</span>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-silver/50"
          onClick={() => inputRef.current?.click()}
        >
          <ImageUp className="size-4" /> {label}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            <Trash2 className="text-destructive size-4" />
          </Button>
        ) : null}
      </div>
      <p className="text-muted-foreground text-xs">Tamanho máximo: {maxSizeMB} MB.</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
