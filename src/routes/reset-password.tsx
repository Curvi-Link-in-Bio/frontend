import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import usePost from "@/hooks/use-post";
import { useNavigate } from "@tanstack/react-router";
import { TOKEN_KEY } from "@/enums/token";

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
})

function ResetPassword() {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  document.title = 'Curvi - Redefinir Senha'
  const token = query.get("t");
  localStorage.setItem(TOKEN_KEY, token || "");
  
  useEffect(() => {
    const timmer = setTimeout(() => validatePasswords(), 1000);
    return () => clearTimeout(timmer);
  }, [confirmPassword]);

  function validatePasswords() {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
    }
  }

  async function handleSubmit() {
    const { data, error, errorMessage } = await usePost('/auth/reset-password-confirm', {
      newPassword,
      confirmPassword,
    });
    if (error) {
      toast.error(errorMessage || "Erro ao redefinir a senha");
      return;
    }
    toast.success("Senha redefinida com sucesso");
    navigate({ to: "/" });
  }

  return (
    <form method="dialog" onSubmit={handleSubmit}>
      <h1>Redefinir Senha</h1>
      <div>
        <Label htmlFor="new-password">Nova Senha</Label>
        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></Input>
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirme a Senha</Label>
        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Input>
      </div>
      <div>
        <Button type="submit">Redefinir Senha</Button>
      </div>
    </form>
  );
}