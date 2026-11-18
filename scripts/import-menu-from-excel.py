"""Regenerate src/lib/menu-data.ts from the client's menu workbook.

Usage (from the repo root):
    pip install openpyxl
    python3 scripts/import-menu-from-excel.py path/to/LOV-BITES-REVISED.xlsx

The workbook is the single source of truth: one sheet with the columns
Category | Availability | Item Name | Price (₹) | Description, and section header
rows (rows with no price) between groups. Names/prices/descriptions are copied as-is
(title-cased for display, obvious typos fixed in NAME_FIXES). Items without a numeric
price ("?", "AS PER MRP") are kept as askPrice items — prices are never invented.
Two-price cells (Half/Full, Small/Large, 4/8 Pcs) become one item per price.

`hero` / `popular` / `protein` badges are carried over from the current
menu-data.ts by dish name, so re-importing never loses the editorial picks.
Everything below `export const ALL_ITEMS` in menu-data.ts is preserved.

After running: `npm run lint && npm run build`, then review the diff.
"""
import json
import re
import sys

import openpyxl

import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "lib", "menu-data.ts")
if len(sys.argv) != 2:
    raise SystemExit(__doc__)
XLSX = sys.argv[1]
current = open(OUT, encoding="utf-8").read()
old_flags = {}
for m in re.finditer(r'\{ id: "[^"]*", name: "([^"]*)"[^}]*\}', current):
    flags = [k for k in ("hero", "popular", "protein") if f"{k}: true" in m.group(0)]
    if flags:
        name = m.group(1)
        old_flags.setdefault(name, flags)
        # "Butter Chicken (Half)" → also remember "Butter Chicken" so variants keep their badge
        base = re.sub(r" \((Half|Full|Small|Medium|Large|\d+ Pcs?)\)$", "", name)
        old_flags.setdefault(base, flags)
TAIL = current[current.index("\nexport const ALL_ITEMS"):]

# Excel category (or special key) -> category config
CATS = {
    "DESI FAVOURITES": ("desi-favourites", "Desi Favourites", "breakfast", "bright", "morning", "Comfort food, made modern."),
    "EGG CORNER": ("egg-corner", "Egg Corner", "protein", "bright", "all-day", "Simple. Classic. Done right."),
    "BEVERAGES/COLD": ("beverages", "Refreshing Liquids", "coffee", "warm-dark", "all-day", "Light, cold, refreshing."),
    "VEG SOUPS": ("soup-veg", "Veg Soups", "fine-dine", "elegant", "evening", "The night begins, warm."),
    "NON-VEG SOUPS": ("soup-non-veg", "Non-Veg Soups", "fine-dine", "elegant", "evening", "A little heat to start."),
    "VEG STARTERS": ("veg-starters", "Veg Starters", "fine-dine", "elegant", "evening", "Bold flavour, no meat required."),
    "NON-VEG STARTERS": ("non-veg-starters", "Non-Veg Starters", "chicken", "bold", "evening", "Sizzle before the main event."),
    "FISH & SEAFOOD": ("fish-seafood", "Fish & Seafood", "fine-dine", "elegant", "evening", "Tender fish, bold spice."),
    "CRISPY CHICKEN": ("chicken-basket", "Crispy Chicken", "chicken", "bold", "evening", "Crispy. Grilled. Unapologetic."),
    "INDO-CHINESE": ("indo-chinese", "Indo-Chinese", "fine-dine", "elegant", "evening", "Wok-tossed, always craveable."),
    "KEBAB & TANDOOR/NONVEG": ("kebab-tandoor", "Kebab & Tandoor (Non-Veg)", "fine-dine", "elegant", "evening", "Smoke. Char. Signature spice."),
    "KEBAB & TANDOOR/VEG": ("kebab-tandoor-veg", "Kebab & Tandoor (Veg)", "fine-dine", "elegant", "evening", "Tandoor-kissed, meat-free."),
    "VEG MAIN COURSE": ("veg-main-course", "Veg Main Course", "fine-dine", "elegant", "evening", "Slow-cooked, deeply comforting."),
    "NON-VEG MAIN COURSE": ("non-veg-main-course", "Non-Veg Main Course", "fine-dine", "elegant", "evening", "The dishes LOVBITES is known for."),
    "BREADS": ("breads", "Breads", "fine-dine", "elegant", "evening", "Fresh from the tandoor."),
    "RICE & BIRYANI": ("rice-biryani", "Rice & Biryani", "biryani", "elegant", "evening", "Biryani time."),
    "SALAD & PAPAD": ("salad-papad", "Salad & Papad", "fine-dine", "elegant", "evening", "The simple side of the table."),
    "ICE CREAM": ("ice-cream", "Ice Cream", "cafe", "playful", "all-day", "One scoop, your flavour."),
    "ADD-ONS": ("add-on", "Add-On", "protein", "clean", "all-day", "Make it more you."),
    "BEVERAGES/HOT": ("hot-drinks", "Hot Drinks", "coffee", "warm-dark", "all-day", "Need a little boost?"),
    "MOCKTAILS": ("mocktails", "Mocktails", "coffee", "playful", "all-day", "Zero proof. Full flavour."),
    "SHAKES": ("shakes", "Shakes", "coffee", "playful", "all-day", "Thick, cold, indulgent."),
    "COLD COFFEE SIGNATURE": ("cold-coffee", "Cold Coffee", "coffee", "warm-dark", "all-day", "Smooth, creamy, cold."),
    "SALADS": ("cafe-salads", "Café Salads", "cafe", "clean", "all-day", "Fresh, crunchy, light."),
    "DESSERTS": ("desserts", "Desserts", "cafe", "romantic", "all-day", "Save room for this."),
    "PASTA": ("pasta", "Pasta", "cafe", "bold", "all-day", "Saucy, cheesy, comforting."),
    "SPAGHETTI IN PESTO SAUCE": ("spaghetti-pesto", "Spaghetti in Pesto Sauce", "cafe", "bold", "all-day", "Fresh basil, slow-tossed."),
    "AUTHENTIC - CONTINENTAL": ("continental", "Continental Mains", "cafe", "elegant", "all-day", "Grilled, sauced, plated properly."),
    "SOUP": ("cafe-soups", "Café Soups", "cafe", "clean", "all-day", "Warm, creamy, comforting."),
    "STARTERS - VEG": ("cafe-starters-veg", "Café Starters (Veg)", "cafe", "playful", "all-day", "Cheesy, crispy, made to share."),
    "STARTERS - NON-VEG": ("cafe-starters-non-veg", "Café Starters (Non-Veg)", "cafe", "bold", "all-day", "Crunch first, questions later."),
    "PIZZA - NON-VEG": ("pizza-non-veg", "Pizza (Non-Veg)", "cafe", "bold", "all-day", "Loaded, stretchy, unapologetic."),
    "PIZZA - VEG": ("pizza-veg", "Pizza (Veg)", "cafe", "playful", "all-day", "Classic crusts, fresh toppings."),
    "PIZZA-DOUGH": ("build-your-pizza", "Customize Your Pizza", "cafe", "playful", "all-day", "Pick a base. Pile it on."),
    "THINCRUST DOUGH": ("build-your-pizza", None, None, None, None, None),
    "PIZZA - CUSTOM TOPPINGS": ("build-your-pizza", None, None, None, None, None),
    "BURGERS": ("burgers", "Burgers", "cafe", "bold", "all-day", "Stacked and satisfying."),
    "SANDWICHES": ("sandwiches", "Sandwiches", "cafe", "bright", "all-day", "Quick bites, done right."),
    "BAKERY": ("bakery", "Bakery", "cafe", "romantic", "all-day", "Baked fresh, every day."),
}
SECTION_NAMES = {
    "STARTERS-IN-VEG": "Starters in Veg",
    "STARTERS-IN-NON-VEG": "Starters in Non-Veg",
    "NON-VEG-KEBABS": "Non-Veg Kebabs",
    "KEBABS IN VEG": "Kebabs in Veg",
    "CURRIES IN VEG": "Curries in Veg",
    "CURRIES IN-NON VEG": "Curries in Non-Veg",
    "BREADS-SELECTION": "Breads Selection",
    "PECULIARS BEGINNINGS - HERBIVORE": "Peculiars Beginnings · Herbivore",
    "PECULIARS BEGINNINGS - CARNIVORE": "Peculiars Beginnings · Carnivore",
}


def section_name(header, sub, cafe):
    h = re.sub(r"\s+", " ", header.strip())
    name = SECTION_NAMES.get(h) or title(h)
    if sub and h not in ("PECULIARS BEGINNINGS - HERBIVORE", "PECULIARS BEGINNINGS - CARNIVORE") and title(sub).upper() != h:
        name += " · " + title(sub)
    return ("Café Menu · " + name) if cafe else name


def availability(v):
    if not v:
        return None
    v = re.sub(r"\s+", " ", str(v).strip())
    return {"ALL DAY": "All Day"}.get(v.upper(), v.replace("CLOSING", "Closing"))


NONVEG_CATS = {"NON-VEG SOUPS", "NON-VEG STARTERS", "FISH & SEAFOOD", "CRISPY CHICKEN", "NON-VEG MAIN COURSE",
               "STARTERS - NON-VEG", "PIZZA - NON-VEG"}

NAME_FIXES = {
    "CHIKEN TIKKA": "CHICKEN TIKKA",
    "THINCRUST DOUGH 1O INCHES": "THIN CRUST DOUGH (10 INCH)",
    "CHIC-N- CHEEZ POPPERS": "CHIC-N-CHEEZ POPPERS",
    "NON-VEG SPAGHETTI ALFREDO/ ARRABIATA": "NON-VEG SPAGHETTI ALFREDO / ARRABBIATA",
    "VEG SATEY SANDWICH": "VEG SATAY SANDWICH",
}
SMALL = {"OF", "IN", "WITH", "AND", "A", "N"}
UPPER = {"BBQ"}


def title(s: str) -> str:
    s = re.sub(r"\s+", " ", s.strip())
    s = NAME_FIXES.get(s, s)

    def word(w, first):
        core = w.strip("()'")
        if core in UPPER:
            return w
        if core == "LOVBITES":
            return w.replace("LOVBITES", "LovBites")
        if core in SMALL and not first:
            return w.lower()
        return "-".join(p[:1].upper() + p[1:].lower() if p[:1] != "(" else "(" + p[1:2].upper() + p[2:].lower() for p in w.split("-"))

    words = s.split(" ")
    out = " ".join(word(w, i == 0) for i, w in enumerate(words))
    out = out.replace("Chic-N-Cheez", "Chic-n-Cheez").replace("'n'", "'n'")
    return out


def clean_desc(d):
    if not d:
        return None
    d = re.sub(r"\s*\[[\d, ]+\]", "", str(d)).strip()
    # drop internal notes meant for the owner, not customers
    d = re.sub(r";?\s*please confirm[^.]*\.?", ".", d, flags=re.I).strip()
    d = re.sub(r"\.\.$", ".", d)
    d = d[0].upper() + d[1:]
    if not d.endswith((".", "!", "?")):
        d += "."
    return d


def diet_of(cat, name):
    n = name.upper()
    if re.search(r"CHICKEN|CHIKEN|MUTTON|FISH|PRAWN|MAHI|MURGH|TANGRI|NON[- ]VEG|CHIC-N|SAUSAGE", n):
        return "nonveg"
    if "EGG" in n:
        return "egg"
    if cat in NONVEG_CATS:
        return "nonveg"
    return "veg"


def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def parse_price(raw, name, cat):
    """Return list of (variant_label|None, price) or None if not a real number."""
    if isinstance(raw, (int, float)):
        return [(None, int(raw))]
    s = str(raw).strip()
    if re.fullmatch(r"\d+", s):
        return [(None, int(s))]
    nums = re.findall(r"\d+", s.split("(")[0])
    if len(nums) == 2:
        m = re.search(r"\(([^)]*/[^)]*)\)", name)
        if m:
            labels = [x.strip() for x in m.group(1).split("/")]
        elif "HALF" in s.upper():
            labels = ["HALF", "FULL"]
        elif "SMALL/MEDIUM" in name.upper():
            labels = ["SMALL", "MEDIUM"]
        elif "PIZZA" in cat.upper():
            labels = ["SMALL", "LARGE"]
        else:
            raise SystemExit(f"Unknown variant labels for {name!r}: {s!r}")
        return list(zip(labels, map(int, nums)))
    return None


wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb.worksheets[0]
cats = {}  # id -> dict
order = []
skipped = []
section = ""
section_label = ""
cafe = False
seen_ids = set()
for row in list(ws.iter_rows(values_only=True))[1:]:
    cat, avail, name, price, desc = (row + (None,) * 6)[:5]
    if not any(row):
        continue
    if price is None:  # section header row
        section = str(cat or "").upper()
        if section.startswith("CAF") and "MENU" in section:
            cafe = True
            continue
        section_label = section_name(str(cat), name, cafe)
        continue
    cat = str(cat).strip().upper()
    key = cat
    if cat == "BEVERAGES":
        key = "BEVERAGES/HOT" if "HOT" in section or "CAF" in section else "BEVERAGES/COLD"
    if cat == "KEBAB & TANDOOR":
        key = "KEBAB & TANDOOR/VEG" if "VEG" in section and "NON" not in section else "KEBAB & TANDOOR/NONVEG"
    if key not in CATS:
        raise SystemExit(f"Unmapped category {cat!r}")
    variants = parse_price(price, name, cat)
    ask = variants is None
    if ask:
        skipped.append((title(name), str(price).strip(), cat))
        variants = [(None, 0)]
    cid = CATS[key][0]
    if cid not in cats:
        conf = CATS[key]
        cats[cid] = dict(id=cid, title=conf[1], navGroup=conf[2], mood=conf[3], timeContext=conf[4], line=conf[5],
                         section=section_label, availability=availability(avail), items=[])
        order.append(cid)
    base = re.sub(r"\s*\([^)]*/[^)]*\)", "", str(name)).strip()
    base = re.sub(r"\s*SMALL/MEDIUM$", "", base, flags=re.I)
    base = base.replace("PIZZA-DOUGH", "PIZZA DOUGH")
    base_title = title(base)
    if cat == "COLD COFFEE SIGNATURE":
        base_title = "Cold Coffee (Best In-House)"
    if cat == "PIZZA - CUSTOM TOPPINGS":
        base_title += " Topping"
    d = clean_desc(desc)
    diet = diet_of(cat, str(name))
    flags = set(old_flags.get(base_title, [])) | set(
        f for n, fl in old_flags.items() if norm(n) == norm(base_title) for f in fl)
    if re.search(r"SIGNATURE|LOVBITES SPECIAL", str(name).upper()) or (d and "Signature Dish" in d):
        flags.add("hero")
    if cid in ("egg-corner", "add-on"):
        flags.add("protein")
    for i, (label, p) in enumerate(variants):
        nm = base_title if label is None else f"{base_title} ({title(label)})"
        iid = slug(nm)
        while iid in seen_ids:
            iid += "-2"
        seen_ids.add(iid)
        item = dict(id=iid, name=nm, price=p, diet=diet, ask=ask)
        if d:
            item["description"] = d
        # badge only the first variant so a dish isn't listed twice in Signatures
        for f in ("hero", "popular", "protein"):
            if f in flags and (i == 0 or f == "protein"):
                item[f] = True
        cats[cid]["items"].append(item)


def js(s):
    return json.dumps(s, ensure_ascii=False)


lines = []
for n, cid in enumerate(order, 1):
    c = cats[cid]
    lines.append("  {")
    lines.append(f"    id: {js(c['id'])},")
    lines.append(f"    number: {js(f'{n:02d}')},")
    lines.append(f"    title: {js(c['title'])},")
    lines.append(f"    navGroup: {js(c['navGroup'])},")
    lines.append(f"    section: {js(c['section'])},")
    if c["availability"]:
        lines.append(f"    availability: {js(c['availability'])},")
    lines.append(f"    emotionalLine: {js(c['line'])},")
    lines.append(f"    mood: {js(c['mood'])},")
    lines.append(f"    timeContext: {js(c['timeContext'])},")
    lines.append("    items: [")
    for it in c["items"]:
        parts = [f"id: {js(it['id'])}", f"name: {js(it['name'])}", f"price: {it['price']}", f"diet: {js(it['diet'])}"]
        if it.get("ask"):
            parts.append("askPrice: true")
        if "description" in it:
            parts.append(f"description: {js(it['description'])}")
        for f in ("hero", "popular", "protein"):
            if it.get(f):
                parts.append(f"{f}: true")
        lines.append("      { " + ", ".join(parts) + " },")
    lines.append("    ],")
    lines.append("  },")

total = sum(len(cats[c]["items"]) for c in order)
skipped_doc = "\n".join(f" *   - {n} ({c.title()}): price \"{p}\"" for n, p, c in skipped)
header = f'''import {{ MenuCategory }} from "./types";

/**
 * AUTO-GENERATED from the client's menu workbook (LOV-BITES-REVISED.xlsx) by
 * scripts/import-menu-from-excel.py — re-run that script instead of editing items by hand.
 * Names, prices and descriptions are transcribed
 * from the sheet; only obvious typos are fixed and internal "please confirm" notes
 * are removed from customer-facing descriptions.
 *
 * Hierarchy mirrors the sheet: `section` = the sheet's section header row (e.g.
 * "Fine-Dine Soups", "Café Menu · Pasta"), category = the sheet's Category column,
 * `availability` = the sheet's Availability column (same for every item in a category).
 * `navGroup` only groups categories into the menu page's top-level tabs.
 *
 * Items with two prices (Half/Full, 4/8 Pcs, Small/Large) are listed as two items,
 * so each one has one exact, orderable price.
 *
 * `hero: true` = items the sheet names "Signature" / "LovBites Special", plus
 * signatures carried over from the previous menu. `popular: true` = editorial
 * "🔥 Popular" picks carried over from the previous menu where the dish still exists.
 *
 * `askPrice: true` = the sheet has no real price ("?" / "As per MRP"). These are shown
 * with "Ask for price" (price stays 0 and is never displayed), cannot be added to the
 * cart, and the order API rejects them. Prices are never invented. Once a ₹ value is
 * confirmed, set `price` and remove `askPrice`:
{skipped_doc}
 *
 * Total: {total} items in {len(order)} categories.
 */
export const MENU: MenuCategory[] = [
'''
open(OUT, "w", encoding="utf-8").write(header + "\n".join(lines) + "\n];\n" + TAIL)
print(f"items={total} categories={len(order)} ask_for_price={len(skipped)}")
for s in skipped:
    print("  ask for price:", s)
