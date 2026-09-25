import { Link } from "./link";

export type User = {
    id:string;
    email: string;
    username: string;
    displayName: string;
    bio: string | null;
    avatarUrl: string | null;
    theme: string;
    buttonColor: string;
    backgroundColor: string;
    backgroundImageUrl: string | null;
    plan: 'free' | 'pro';
    paymentMethod: string;
    categories: string[];
    links: Link[];
}