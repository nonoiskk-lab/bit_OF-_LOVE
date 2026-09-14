"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuItem } from "./types";

export interface CartLine {
  item: MenuItem;
  categoryTitle: string;
  quantity: number;
  note?: string;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  addItem: (item: MenuItem, categoryTitle: string, quantity?: number, note?: string) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      addItem: (item, categoryTitle, quantity = 1, note) => {
        const existing = get().lines.find((l) => l.item.id === item.id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.item.id === item.id ? { ...l, quantity: l.quantity + quantity } : l
            ),
          });
        } else {
          set({ lines: [...get().lines, { item, categoryTitle, quantity, note }] });
        }
        set({ isOpen: true });
      },
      removeItem: (itemId) => set({ lines: get().lines.filter((l) => l.item.id !== itemId) }),
      setQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          lines: get().lines.map((l) => (l.item.id === itemId ? { ...l, quantity } : l)),
        });
      },
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
    }),
    { name: "lovbites-cart" }
  )
);

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
