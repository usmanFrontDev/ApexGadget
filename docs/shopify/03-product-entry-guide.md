# 03 — Product entry guide (client training)

Simple rules. If a dropdown exists, pick from it — never type a value by hand. Values you are unsure about: leave empty and ask.

## A. Add an iPhone listing

1. **Products → Add product.**
2. **Title** — model only, e.g. `iPhone 16 Pro`. Do **not** put storage, colour or condition in the title.
3. **Handle (URL)** — `iphone-16-pro-256gb-natural-titanium-excellent-001` (title-storage-colour-grade-number). Never change it after publishing.
4. **Description** — line 1: one sentence. Then bullets: what was tested, cosmetic notes, box contents.
5. **Media** — 4–8 photos (sizes in 04). First photo = clean front/back on a plain background. Add alt text.
6. **Product type** — `iPhones`. **Vendor** — `Apple`.
7. **Price** in PKR (whole rupees). *Compare-at price* only for a real discount.
8. **Inventory** — SKU `IP16P-256-NTI-A-001`, track quantity, quantity = number of identical units (usually 1), *continue selling when out of stock* **OFF**.
9. **Variants** — none for phones.
10. **Metafields** (all dropdowns):
    `device_model`, `storage`, `color`, `battery_health` (number), `battery_bucket`, `condition_grade`, `pta_status` (PTA / Non-PTA / JV), `warranty_months`.
    Optional: `warranty_note`, `box_contents`, `specs`, `card_subtitle`.
    **`battery_bucket` must match `battery_health`**: 90–100 → `90-100`; 80–89 → `80-89`; 70–79 → `70-79`; below 70 → `below-70`.
11. **Tags** — only `bestseller`, `new-arrival`, `featured`, `deal` when applicable.
12. **Sales channels** — tick **Headless**.
13. **Search engine listing** — title ≤ 60 characters, description 140–155 characters (include battery % and warranty).
14. **Status: Active.** Done — it appears in the right category and filters automatically (no collection editing needed).

### Worked example

| Field | Value |
|---|---|
| Title | iPhone 16 Pro |
| Handle | `iphone-16-pro-256gb-natural-titanium-excellent-001` |
| Description | "PTA-approved iPhone 16 Pro in excellent condition, battery tested at 92%." + bullets |
| Product type / vendor | `iPhones` / `Apple` |
| Price / compare-at | PKR 450,000 / PKR 480,000 |
| SKU / quantity | `IP16P-256-NTI-A-001` / 1 |
| `device_model` | `iphone-16` |
| `storage` | `256gb` |
| `color` | `natural-titanium` |
| `battery_health` / `battery_bucket` | `92` / `90-100` |
| `condition_grade` | `excellent` |
| `pta_status` | `pta` (a JV unit would be `jv`) |
| `warranty_months` | PLACEHOLDER until the client sets the policy |
| `card_subtitle` | `256GB · Natural Titanium` |
| Tags | `bestseller` |
| Channels / status | Headless ✔ / Active |

On the site: category **iPhones**; filters Model *iPhone 16*, Storage *256 GB*, PTA *PTA Approved*, Battery *90% – 100%*, Color *Natural Titanium*, Condition *Excellent*.

## B. Accessory listing
Title `AirPods Pro (2nd Gen)`, product type one of `Audio`, `Wearables`, `Chargers`, `Cases` (anything else: `Accessories`). Fill `condition_grade`, `battery_health` + `battery_bucket` (if the item has a battery), `warranty_months`, `card_subtitle` (`USB-C`). Use variants (Color / Compatible model) only if each has its own price or stock.

## C. Mark a listing as sold (do NOT delete or archive)
1. Open the product → set **Inventory quantity to 0** (an order does this automatically).
2. Leave the status **Active** and published to **Headless**.
3. The page stays online with a **Sold** label and "similar items"; it disappears from the default shop list (shoppers can still show sold items with the Availability filter).
4. Optional: after 60 days you may archive it, but then its link stops working — only do this for items nobody links to. Never delete.

If a sold unit comes back: set quantity to 1.

## D. Don't
- Don't type new values in dropdown metafields; ask the developer to add the choice first.
- Don't use tags for model/storage/colour (old method).
- Don't upload images above 3000 px or 1 MB.
- Don't change a handle after publishing.
