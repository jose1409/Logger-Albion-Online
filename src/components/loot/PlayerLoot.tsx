import { useState } from 'react';
import type { ItemSummary } from '../../types';
import {
  formatItemTier,
  groupItemsByTier,
  sortItemsByTierThenQuantity,
} from '../../lib/itemTier';
import { isItemIncludedInEstimate, type LootVisibilityState } from '../../lib/tierFilters';
import { ItemDetailModal } from './ItemDetailModal';

interface PlayerLootProps {
  playerName: string;
  items: Record<string, ItemSummary>;
  visibility: LootVisibilityState;
  groupByTier: boolean;
  onToggleItem: (playerName: string, itemId: string) => void;
}

const hasNoPriceData = (item: ItemSummary): boolean =>
  item.price === 0 && item.totalprice === 0;

interface ItemSlotProps {
  item: ItemSummary;
  playerName: string;
  visibility: LootVisibilityState;
  onToggle: () => void;
  onOpenDetail: () => void;
}

const ItemSlot = ({
  item,
  playerName,
  visibility,
  onToggle,
  onOpenDetail,
}: ItemSlotProps) => {
  const included = isItemIncludedInEstimate(item, playerName, visibility);
  const noPrice = hasNoPriceData(item);
  const actionHint = included
    ? 'Clic para ocultar del estimado'
    : 'Clic para volver a incluir';

  return (
    <div className="item-slot-wrap">
      <button
        type="button"
        className={[
          'item-slot',
          !included && 'item-slot--excluded',
          noPrice && 'item-slot--no-price',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={onToggle}
        title={noPrice ? `Sin precio de mercado · ${actionHint}` : actionHint}
        aria-pressed={!included}
      >
        <img src={item.imageUrl} alt={item.itemName} className="item-icon" />
        <span className="item-quantity">{item.totalQuantity}</span>
        <span className="item-tooltip" role="tooltip">{item.itemName}</span>
      </button>

      <button
        type="button"
        className="item-slot__info"
        aria-label={`Ver detalles de ${item.itemName}`}
        title="Ver detalles"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetail();
        }}
      >
        i
      </button>
    </div>
  );
};

export const PlayerLoot = ({
  playerName,
  items,
  visibility,
  groupByTier,
  onToggleItem,
}: PlayerLootProps) => {
  const [detailItem, setDetailItem] = useState<ItemSummary | null>(null);
  const itemList = sortItemsByTierThenQuantity(Object.values(items));

  return (
    <div className="loot-card">
      <h2 className="player-title">{playerName}</h2>

      {groupByTier ? (
        <div className="loot-tier-groups">
          {groupItemsByTier(itemList).map(({ tier, items: tierItems }) => (
            <section key={tier ?? 'na'} className="loot-tier-section">
              <h3 className="loot-tier-section__title">{formatItemTier(tier)}</h3>
              <div className="loot-grid">
                {tierItems.map((item) => (
                  <ItemSlot
                    key={item.itemId}
                    item={item}
                    playerName={playerName}
                    visibility={visibility}
                    onToggle={() => onToggleItem(playerName, item.itemId)}
                    onOpenDetail={() => setDetailItem(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="loot-grid">
          {itemList.map((item) => (
            <ItemSlot
              key={item.itemId}
              item={item}
              playerName={playerName}
              visibility={visibility}
              onToggle={() => onToggleItem(playerName, item.itemId)}
              onOpenDetail={() => setDetailItem(item)}
            />
          ))}
        </div>
      )}

      {detailItem && (
        <ItemDetailModal
          item={detailItem}
          playerName={playerName}
          onClose={() => setDetailItem(null)}
        />
      )}
    </div>
  );
};
