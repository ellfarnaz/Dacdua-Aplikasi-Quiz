// roleUtils.ts
import { User } from "@/types";

export const isAdmin = (user: User | null) => user?.role === "admin";
export const isDosen = (user: User | null) => user?.role === "dosen";
export const isStudent = (user: User | null) => user?.role === "student";
