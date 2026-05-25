import type { ItemTier, PlayersLootMap } from '../../types';
import { formatItemTier } from '../../lib/itemTier';
import {
  areAllTiersFullyVisible,
  getTierButtonState,
  LOOT_TIERS,
  type LootVisibilityState,
  type TierFilterButtonState,
} from '../../lib/tierFilters';

interface TierFilterBarProps {
  visibility: LootVisibilityState;
  lootData: PlayersLootMap;
  onToggleTier: (tier: ItemTier) => void;
  iconSize: number;
  onIconSizeChange: (size: number) => void;
  groupLootByTier: boolean;
  onGroupLootByTierChange: (enabled: boolean) => void;
}

const TIER_BTN_CLASS: Record<TierFilterButtonState, string> = {
  all: 'tier-filter-bar__btn--on',
  none: 'tier-filter-bar__btn--off',
  partial: 'tier-filter-bar__btn--partial',
};

export const TierFilterBar = ({
  visibility,
  lootData,
  onToggleTier,
  iconSize,
  onIconSizeChange,
  groupLootByTier,
  onGroupLootByTierChange,
}: TierFilterBarProps) => {
  const allVisible = areAllTiersFullyVisible(visibility, lootData);

  return (
    <div className="tier-filter-bar">
      <div className="tier-filter-bar__grid">
        <section className="tier-filter-bar__section" aria-label="Filtro por tier">
          <div className="tier-filter-bar__header">
            <span className="tier-filter-bar__title">Filtro por tier</span>
            <span className="tier-filter-bar__status">
              {allVisible
                ? 'Todo visible · Clic en ítem para ocultar · Con tier oculto, clic muestra excepciones'
                : 'Morado: todo el tier · Rojo: oculto · Amarillo: oculto con excepciones visibles'}
            </span>
          </div>

          <div className="tier-filter-bar__buttons" role="group" aria-label="Filtro por tier">
            {LOOT_TIERS.map((tier) => {
              const state = getTierButtonState(tier, visibility, lootData);
              return (
                <button
                  key={tier}
                  type="button"
                  className={`tier-filter-bar__btn ${TIER_BTN_CLASS[state]}`}
                  aria-pressed={state !== 'none'}
                  onClick={() => onToggleTier(tier)}
                  title={
                    state === 'all'
                      ? 'Ocultar todo este tier'
                      : state === 'none'
                        ? 'Mostrar todo este tier'
                        : 'Mostrar todo este tier (quita excepciones)'
                  }
                >
                  {formatItemTier(tier)}
                </button>
              );
            })}
          </div>
        </section>

        <section className="tier-filter-bar__section" aria-label="Tamaño de iconos">
          <span className="tier-filter-bar__title">Tamaño de iconos</span>
          <div className="tier-filter-bar__field">
            <label className="tier-filter-bar__label" htmlFor="icon-size-range">
              <span className="tier-filter-bar__value">{iconSize}px</span>
            </label>
            <input
              id="icon-size-range"
              type="range"
              min={60}
              max={90}
              value={iconSize}
              onChange={(e) => onIconSizeChange(Number(e.target.value))}
              className="tier-filter-bar__range"
            />
          </div>
        </section>

        <section className="tier-filter-bar__section" aria-label="Agrupar por tier">
          <span className="tier-filter-bar__title">Agrupar por tier</span>
          <div className="tier-filter-bar__toggle-row">
            <p className="tier-filter-bar__hint">
              Secciones con título T4, T5, etc.
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={groupLootByTier}
              aria-label="Agrupar por tier"
              className={`tier-filter-bar__toggle ${groupLootByTier ? 'tier-filter-bar__toggle--on' : ''}`}
              onClick={() => onGroupLootByTierChange(!groupLootByTier)}
            >
              <span className="tier-filter-bar__toggle-track" aria-hidden="true">
                <span className="tier-filter-bar__toggle-thumb" />
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
