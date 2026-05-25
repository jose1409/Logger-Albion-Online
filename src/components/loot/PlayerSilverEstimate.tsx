import type { ItemSummary } from '../../types';
import { isItemIncludedInEstimate, type LootVisibilityState } from '../../lib/tierFilters';
import { formatSilver } from '../../lib/formatSilver';
import silverIcon from '../../assets/silver.png';

interface PlayerSilverEstimateProps {
  playerName: string;
  items: Record<string, ItemSummary>;
  visibility: LootVisibilityState;
}

export const PlayerSilverEstimate = ({
  playerName,
  items,
  visibility,
}: PlayerSilverEstimateProps) => {
  const totalSilver = Object.values(items).reduce(
    (sum, item) =>
      isItemIncludedInEstimate(item, playerName, visibility)
        ? sum + item.totalprice
        : sum,
    0,
  );

  return (
    <div className="player-silver-estimate">
      <img src={silverIcon} alt="" className="player-silver-estimate__icon" aria-hidden="true" />

      <div className="player-silver-estimate__content">
        <span className="player-silver-estimate__label">
          Estimado en plata — {playerName}
        </span>
        <span className="player-silver-estimate__amount">
          {formatSilver(totalSilver)}
          <span className="player-silver-estimate__unit"> silver</span>
        </span>
        <span className="player-silver-estimate__note">
          Valor aproximado según el precio de mercado de cada ítem
        </span>
      </div>
    </div>
  );
};
