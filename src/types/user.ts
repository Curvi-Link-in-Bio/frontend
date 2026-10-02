import { TLink } from "./link";
import { TPlan } from "./plan";

export type TUser = {
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
    plan: TPlan;
    paymentMethod: string;
    categories: string[];
    links: TLink[];
}