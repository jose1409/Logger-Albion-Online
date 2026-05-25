import type { ItemTier, ItemSummary, PlayersLootMap } from '../types';

export const LOOT_TIERS: ItemTier[] = [4, 5, 6, 7, 8];

export type TierFilterButtonState = 'all' | 'none' | 'partial';

export interface LootVisibilityState {
  excludedTiers: Set<ItemTier>;
  manualHides: Set<string>;
  manualShows: Set<string>;
}

export const createDefaultVisibility = (): LootVisibilityState => ({
  excludedTiers: new Set(),
  manualHides: new Set(),
  manualShows: new Set(),
});

export const makeLootItemKey = (playerName: string, itemId: string): string =>
  `${playerName}\0${itemId}`;

const clearOverridesForTier = (
  overrides: Set<string>,
  tier: ItemTier,
  lootData: PlayersLootMap
): Set<string> => {
  const next = new Set(overrides);
  for (const [playerName, items] of Object.entries(lootData)) {
    for (const item of Object.values(items)) {
      if (item.tier === tier) {
        next.delete(makeLootItemKey(playerName, item.itemId));
      }
    }
  }
  return next;
};

const tierHasKeyInSet = (
  overrides: Set<string>,
  tier: ItemTier,
  lootData: PlayersLootMap
): boolean => {
  for (const [playerName, items] of Object.entries(lootData)) {
    for (const item of Object.values(items)) {
      if (item.tier === tier && overrides.has(makeLootItemKey(playerName, item.itemId))) {
        return true;
      }
    }
  }
  return false;
};

/** Visible en grid y contando en plata. */
export const isItemIncludedInEstimate = (
  item: ItemSummary,
  playerName: string,
  { excludedTiers, manualHides, manualShows }: LootVisibilityState
): boolean => {
  const key = makeLootItemKey(playerName, item.itemId);

  if (item.tier === null) {
    return !manualHides.has(key);
  }

  if (excludedTiers.has(item.tier)) {
    return manualShows.has(key);
  }

  return !manualHides.has(key);
};

export const getTierButtonState = (
  tier: ItemTier,
  visibility: LootVisibilityState,
  lootData: PlayersLootMap | null
): TierFilterButtonState => {
  if (!lootData || !visibility.excludedTiers.has(tier)) {
    return 'all';
  }

  return tierHasKeyInSet(visibility.manualShows, tier, lootData) ? 'partial' : 'none';
};

export const areAllTiersFullyVisible = (
  visibility: LootVisibilityState,
  lootData: PlayersLootMap | null
): boolean =>
  LOOT_TIERS.every((tier) => getTierButtonState(tier, visibility, lootData) === 'all');

export const toggleTierFilter = (
  tier: ItemTier,
  visibility: LootVisibilityState,
  lootData: PlayersLootMap
): LootVisibilityState => {
  const { excludedTiers, manualHides, manualShows } = visibility;

  if (excludedTiers.has(tier)) {
    const nextExcluded = new Set(excludedTiers);
    nextExcluded.delete(tier);
    return {
      excludedTiers: nextExcluded,
      manualHides: clearOverridesForTier(manualHides, tier, lootData),
      manualShows: clearOverridesForTier(manualShows, tier, lootData),
    };
  }

  const nextExcluded = new Set(excludedTiers);
  nextExcluded.add(tier);
  return {
    excludedTiers: nextExcluded,
    manualHides: clearOverridesForTier(manualHides, tier, lootData),
    manualShows: clearOverridesForTier(manualShows, tier, lootData),
  };
};

export const toggleItemVisibility = (
  item: ItemSummary,
  playerName: string,
  visibility: LootVisibilityState
): Pick<LootVisibilityState, 'manualHides' | 'manualShows'> => {
  const key = makeLootItemKey(playerName, item.itemId);
  const visible = isItemIncludedInEstimate(item, playerName, visibility);
  const manualHides = new Set(visibility.manualHides);
  const manualShows = new Set(visibility.manualShows);

  if (item.tier === null) {
    if (visible) manualHides.add(key);
    else manualHides.delete(key);
    return { manualHides, manualShows };
  }

  if (visibility.excludedTiers.has(item.tier)) {
    if (visible) manualShows.delete(key);
    else manualShows.add(key);
  } else if (visible) {
    manualHides.add(key);
  } else {
    manualHides.delete(key);
  }

  return { manualHides, manualShows };
};
