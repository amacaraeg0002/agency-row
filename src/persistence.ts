import type { StateStorage } from "zustand/middleware";
import { initialGame } from "./economy";
import type { GameSave } from "./types";
export function getStorageIssue(): string { return ""; }
export function recordStorageIssue(message: string): void {}
export function restoreSave(persisted: unknown): GameSave {
  if (typeof persisted === "object" && persisted !== null && "cash" in (persisted as any)) return persisted as GameSave;
  return initialGame();
}
export const safeStorage: StateStorage = {
  getItem(name) { try { return localStorage.getItem(name); } catch { return null; } },
  setItem(name, value) { try { localStorage.setItem(name, value); } catch {} },
  removeItem(name) { try { localStorage.removeItem(name); } catch {} },
};
