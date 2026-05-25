import type { ItemSummary, ItemTier, PlayersLootMap } from '../types';

const VALID_TIERS = [4, 5, 6, 7, 8] as const;

const isItemTier = (n: number): n is ItemTier =>
  (VALID_TIERS as readonly number[]).includes(n);

/** Excepciones exactas por itemId. */
const ITEM_TIER_OVERRIDES: Record<string, ItemTier> = {
  QUESTITEM_TOKEN_AVALON: 6,
};

const TREASURE_RARITY_TO_TIER: Record<string, ItemTier> = {
  RARITY1: 4,
  RARITY2: 5,
  RARITY3: 6,
};

/**
 * Infiere el tier (4–8) a partir del itemId de Albion.
 * Devuelve null si no hay regla conocida (para detectar casos nuevos).
 */
export const resolveItemTier = (itemId: string): ItemTier | null => {
  const override = ITEM_TIER_OVERRIDES[itemId];
  if (override !== undefined) return override;

  if (itemId.startsWith('QUESTITEM_EXP_TOKEN')) {
    return 4;
  }

  const treasureMatch = itemId.match(/^TREASURE_.+_(RARITY[123])$/);
  if (treasureMatch) {
    return TREASURE_RARITY_TO_TIER[treasureMatch[1]] ?? null;
  }

  const prefixMatch = itemId.match(/^T([4-8])_/);
  if (prefixMatch) {
    const tier = Number(prefixMatch[1]);
    return isItemTier(tier) ? tier : null;
  }

  return null;
};

/** Etiqueta para UI: T4…T8 o N/A si no se pudo inferir. */
export const formatItemTier = (tier: ItemTier | null): string =>
  tier === null ? 'N/A' : `T${tier}`;

/** Orden de secciones en la vista de botín (T4 → T8, sin tier al final). */
export const LOOT_TIER_DISPLAY_ORDER: readonly (ItemTier | null)[] = [4, 5, 6, 7, 8, null];

const tierSortKey = (tier: ItemTier | null): number => tier ?? 99;

/** T4→T8 (N/A al final); dentro del mismo tier, mayor cantidad primero. */
export const compareItemsByTierThenQuantity = (
  a: ItemSummary,
  b: ItemSummary
): number => {
  const tierDiff = tierSortKey(a.tier) - tierSortKey(b.tier);
  if (tierDiff !== 0) return tierDiff;
  return b.totalQuantity - a.totalQuantity;
};

export const sortItemsByTierThenQuantity = (items: ItemSummary[]): ItemSummary[] =>
  [...items].sort(compareItemsByTierThenQuantity);

export interface LootTierGroup {
  tier: ItemTier | null;
  items: ItemSummary[];
}

/** Agrupa ítems por tier y ordena cada grupo por cantidad (mayor primero). */
export const groupItemsByTier = (items: ItemSummary[]): LootTierGroup[] => {
  const buckets = new Map<ItemTier | null, ItemSummary[]>(
    LOOT_TIER_DISPLAY_ORDER.map((tier) => [tier, []])
  );

  for (const item of items) {
    const list = buckets.get(item.tier) ?? [];
    list.push(item);
    if (!buckets.has(item.tier)) buckets.set(item.tier, list);
  }

  return LOOT_TIER_DISPLAY_ORDER.map((tier) => ({
    tier,
    items: [...(buckets.get(tier) ?? [])].sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    ),
  })).filter((group) => group.items.length > 0);
};

/** Asigna tier a cada ítem del mapa (una sola pasada, post-parseo). */
export const enrichPlayersLootWithTiers = (
  lootMap: PlayersLootMap
): PlayersLootMap => {
  for (const playerItems of Object.values(lootMap)) {
    for (const item of Object.values(playerItems)) {
      item.tier = resolveItemTier(item.itemId);
    }
  }
  return lootMap;
};