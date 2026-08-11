import { useCallback, useEffect, useState } from "react";

export type CurviLink = {
  id: string;
  title: string;
  url: string;
  active: boolean;
  clicks: number;
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
  plan: "free" | "pro";
  links: CurviLink[];
};

export const THEMES: { id: ThemeId; name: string; bg: string; button: string }[] = [
  { id: "gold-noir", name: "Gold Noir", bg: "#18181B", button: "#D4AF37" },
  { id: "champagne", name: "Champagne", bg: "#27272A", button: "#E6C875" },
  { id: "onyx-silver", name: "Onyx Silver", bg: "#121214", button: "#C0C0C0" },
  { id: "rose-gold", name: "Rose Gold", bg: "#1C1719", button: "#E0A08A" },
];

const DB_KEY = "curvi.users";
const SESSION_KEY = "curvi.session";
const EVENT = "curvi:change";

function isBrowser() {
  return typeof window !== "undefined";
}

export function readUsers(): CurviUser[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) ?? "[]") as CurviUser[];
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
    plan: "free",
    links: [
      { id: "l1", title: "Meu Instagram", url: "https://instagram.com", active: true, clicks: 128 },
      { id: "l2", title: "Loja Plus Size", url: "https://example.com/loja", active: true, clicks: 64 },
      { id: "l3", title: "Consultoria de Estilo", url: "https://example.com/consultoria", active: false, clicks: 12 },
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
    plan: "free",
    links: [],
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
