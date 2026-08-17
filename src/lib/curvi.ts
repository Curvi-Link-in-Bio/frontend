import { useCallback, useEffect, useState } from "react";

export type CurviLink = {
  id: string;
  title: string;
  url: string;
  active: boolean;
  clicks: number;
  category: string;
};

export const DEFAULT_CATEGORIES = ["Redes Sociais", "Produtos", "Conteúdo", "Contato"];

export const SUPPORT_EMAIL = "suporte@curvi.link";

export type CurviReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: number;
};

export type ThemeId = "gold-noir" | "champagne" | "onyx-silver" | "rose-gold";

export type CurviUser = {
  id: string;
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: ThemeId;
  buttonColor: string;
  backgroundColor: string;
  /** CSS background-image value: url("data:...") or a gradient */
  backgroundImage: string;
  plan: "free" | "pro";
  paymentMethod?: string;
  links: CurviLink[];
  categories: string[];
};

export const THEMES: { id: ThemeId; name: string; bg: string; button: string }[] = [
  { id: "gold-noir", name: "Gold Noir", bg: "#18181B", button: "#D4AF37" },
  { id: "champagne", name: "Champagne", bg: "#27272A", button: "#E6C875" },
  { id: "onyx-silver", name: "Onyx Silver", bg: "#121214", button: "#C0C0C0" },
  { id: "rose-gold", name: "Rose Gold", bg: "#1C1719", button: "#E0A08A" },
];

export const BACKGROUND_PRESETS: { id: string; name: string; value: string }[] = [
  { id: "none", name: "Sem fundo", value: "" },
  {
    id: "gold-glow",
    name: "Brilho Dourado",
    value:
      "radial-gradient(circle at 20% 0%, rgba(212,175,55,0.35), transparent 55%), radial-gradient(circle at 80% 100%, rgba(230,200,117,0.25), transparent 55%), linear-gradient(160deg, #18181B, #101012)",
  },
  {
    id: "champagne-silk",
    name: "Seda Champagne",
    value: "linear-gradient(135deg, #2A2520 0%, #3A3128 45%, #1B1815 100%)",
  },
  {
    id: "rose-velvet",
    name: "Veludo Rosé",
    value:
      "radial-gradient(circle at 50% 0%, rgba(224,160,138,0.35), transparent 60%), linear-gradient(180deg, #221A1C, #121012)",
  },
  {
    id: "onyx-waves",
    name: "Ondas Onyx",
    value:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 12px, transparent 12px 24px), linear-gradient(160deg, #121214, #232326)",
  },
];


const DB_KEY = "curvi.users";
const REVIEWS_KEY = "curvi.reviews";
const SESSION_KEY = "curvi.session";
const EVENT = "curvi:change";

const PENDING_KEY = "curvi.pendingCheckout";

export type PendingCheckout = {
  userId: string;
  plan: "pro" | "free";
  createdAt: number;
};

export function setPendingCheckout(userId: string, plan: "pro" | "free") {
  if (!isBrowser()) return null;
  const payload: PendingCheckout = { userId, plan, createdAt: Date.now() };
  localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(EVENT));
  return payload;
}

export function getPendingCheckout(): PendingCheckout | null {
  if (!isBrowser()) return null;
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) ?? "null") as PendingCheckout | null;
  } catch {
    return null;
  }
}

export function clearPendingCheckout() {
  if (!isBrowser()) return;
  localStorage.removeItem(PENDING_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function finalizePendingCheckout(userId: string, paymentMethod = "pagbank") {
  const pending = getPendingCheckout();
  if (!pending || pending.userId !== userId) return false;
  updateUser(userId, { plan: pending.plan, paymentMethod });
  clearPendingCheckout();
  window.dispatchEvent(new Event(EVENT));
  return true;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function readUsers(): CurviUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(DB_KEY) ?? "[]") as CurviUser[];
    return raw.map((u) => ({
      ...u,
      categories: u.categories?.length ? u.categories : [...DEFAULT_CATEGORIES],
      links: (u.links ?? []).map((l) => ({ ...l, category: l.category || "Geral" })),
    }));
  } catch {
    return [];
  }
}

function writeUsers(users: CurviUser[]) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event(EVENT));
}

function seedIfEmpty() {
  if (!isBrowser()) return;
  if (localStorage.getItem(DB_KEY)) return;
  const demo: CurviUser = {
    id: "demo",
    email: "demo@curvi.link",
    password: "curvi123",
    username: "curvidemo",
    displayName: "Bianca Curvy",
    bio: "Criadora de conteúdo plus size ✨ Moda, autoestima e parcerias.",
    avatar: "",
    theme: "gold-noir",
    buttonColor: "#D4AF37",
    backgroundColor: "#18181B",
    backgroundImage: "",
    plan: "free",
    categories: [...DEFAULT_CATEGORIES],
    links: [
      { id: "l1", title: "Meu Instagram", url: "https://instagram.com", active: true, clicks: 128, category: "Redes Sociais" },
      { id: "l2", title: "Loja Plus Size", url: "https://example.com/loja", active: true, clicks: 64, category: "Produtos" },
      { id: "l3", title: "Consultoria de Estilo", url: "https://example.com/consultoria", active: false, clicks: 12, category: "Conteúdo" },
    ],
  };
  localStorage.setItem(DB_KEY, JSON.stringify([demo]));
}

export function getUserByUsername(username: string) {
  return readUsers().find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

export function signUp(email: string, password: string, username: string) {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error("E-mail já cadastrado.");
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase()))
    throw new Error("Este username já está em uso.");
  const user: CurviUser = {
    id: crypto.randomUUID(),
    email,
    password,
    username,
    displayName: username,
    bio: "",
    avatar: "",
    theme: "gold-noir",
    buttonColor: "#D4AF37",
    backgroundColor: "#18181B",
    backgroundImage: "",
    plan: "free",
    links: [],
    categories: [...DEFAULT_CATEGORIES],
  };
  writeUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  window.dispatchEvent(new Event(EVENT));
  return user;
}

export function signIn(email: string, password: string) {
  const user = readUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) throw new Error("E-mail ou senha inválidos.");
  localStorage.setItem(SESSION_KEY, user.id);
  window.dispatchEvent(new Event(EVENT));
  return user;
}

export function signInWithGoogle() {
  const users = readUsers();
  const existing = users.find((u) => u.email === "google.user@curvi.link");
  if (existing) {
    localStorage.setItem(SESSION_KEY, existing.id);
    window.dispatchEvent(new Event(EVENT));
    return existing;
  }
  return signUp("google.user@curvi.link", crypto.randomUUID(), `criadora${users.length + 1}`);
}

export function resetPassword(email: string, newPassword: string) {
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("E-mail não encontrado.");
  user.password = newPassword;
  writeUsers(users);
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function updateUser(id: string, patch: Partial<CurviUser>) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return;
  if (patch.username) {
    const taken = users.some(
      (u) => u.id !== id && u.username.toLowerCase() === patch.username!.toLowerCase(),
    );
    if (taken) throw new Error("Este username já está em uso.");
  }
  users[idx] = { ...(users[idx] as CurviUser), ...patch };
  writeUsers(users);
}

export function registerClick(username: string, linkId: string) {
  const users = readUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return;
  const link = user.links.find((l) => l.id === linkId);
  if (!link) return;
  link.clicks += 1;
  writeUsers(users);
}

export function useSession() {
  const [user, setUser] = useState<CurviUser | null>(null);
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    seedIfEmpty();
    const id = localStorage.getItem(SESSION_KEY);
    setUser(id ? (readUsers().find((u) => u.id === id) ?? null) : null);
    setReady(true);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  return { user, ready };
}

export function ensureSeed() {
  seedIfEmpty();
}

export function readReviews(): CurviReview[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? "[]") as CurviReview[];
  } catch {
    return [];
  }
}

export function addReview(review: Omit<CurviReview, "id" | "createdAt">) {
  const list = readReviews();
  const next: CurviReview = { ...review, id: crypto.randomUUID(), createdAt: Date.now() };
  localStorage.setItem(REVIEWS_KEY, JSON.stringify([next, ...list]));
  window.dispatchEvent(new Event(EVENT));
  return next;
}

export function useReviews() {
  const [reviews, setReviews] = useState<CurviReview[]>([]);

  useEffect(() => {
    const sync = () => setReviews(readReviews());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return reviews;
}

export const FREE_LINK_LIMIT = 3;

export const PLAN_FEATURES: {
  free: { name: string; price: string; items: string[] };
  pro: { name: string; price: string; items: string[] };
} = {
  free: {
    name: "Curvi Free",
    price: "R$ 0",
    items: [
      "Até 3 links ativos na sua página",
      "Tema fixo Gold Noir (sem troca de tema)",
      "Sem personalização de cores e fundo",
      "Contagem de cliques dos links",
      "Selo “Powered by Curvi” no rodapé",
    ],
  },
  pro: {
    name: "Curvi PRO",
    price: "R$ 19,90/mês",
    items: [
      "Links ilimitados e organizados por categoria",
      "Todos os temas: Gold Noir, Champagne, Onyx Silver e Rose Gold",
      "Cores personalizadas e imagem de fundo própria",
      "Fundos premium exclusivos",
      "Página sem o selo Curvi",
      "Suporte prioritário por e-mail",
    ],
  },
};
