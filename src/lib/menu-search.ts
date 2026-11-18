import { MENU } from "./menu-data";
import { MenuCategory, MenuItem } from "./types";

export interface SearchHit {
  item: MenuItem;
  category: MenuCategory;
}

/** Lower-case and strip accents so "sauteed" finds "Sautéed" and "jalapeno" finds "Jalapeño". */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

const INDEX = MENU.flatMap((category) =>
  category.items.map((item) => ({
    item,
    category,
    haystack: normalizeSearch(
      [item.name, item.description ?? "", category.title, category.section ?? "", item.diet === "veg" ? "vegetarian" : item.diet === "egg" ? "egg" : "nonveg"].join(" ")
    ),
  }))
);

/** Every word typed must appear in the dish name, description, category or section. */
export function searchMenu(query: string): SearchHit[] {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return INDEX.filter((entry) => words.every((w) => entry.haystack.includes(w))).map(({ item, category }) => ({
    item,
    category,
  }));
}
