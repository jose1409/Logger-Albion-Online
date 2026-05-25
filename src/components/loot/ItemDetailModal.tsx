import { useEffect } from 'react';
import type { ItemSummary } from '../../types';
import { formatItemTier } from '../../lib/itemTier';
import { formatSilver } from '../../lib/formatSilver';

interface ItemDetailModalProps {
  item: ItemSummary;
  playerName: string;
  onClose: () => void;
}

export const ItemDetailModal = ({ item, playerName, onClose }: ItemDetailModalProps) => {
  const noPrice = item.price === 0 && item.totalprice === 0;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="item-detail-modal" role="dialog" aria-modal="true" aria-labelledby="item-detail-title">
      <button
        type="button"
        className="item-detail-modal__backdrop"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div className="item-detail-modal__panel">
        <button
          type="button"
          className="item-detail-modal__close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>

        <div className="item-detail-modal__hero">
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className="item-detail-modal__image"
          />
          <div className="item-detail-modal__hero-text">
            <h3 id="item-detail-title" className="item-detail-modal__title">
              {item.itemName}
            </h3>
            <p className="item-detail-modal__player">{playerName}</p>
          </div>
        </div>

        <dl className="item-detail-modal__fields">
          <div className="item-detail-modal__field">
            <dt>ID</dt>
            <dd>{item.itemId}</dd>
          </div>
          <div className="item-detail-modal__field">
            <dt>Tier</dt>
            <dd>{formatItemTier(item.tier)}</dd>
          </div>
          <div className="item-detail-modal__field">
            <dt>Cantidad total</dt>
            <dd>{item.totalQuantity}</dd>
          </div>
          <div className="item-detail-modal__field">
            <dt>Precio estimado (mercado)</dt>
            <dd className={noPrice ? 'item-detail-modal__value--missing' : ''}>
              {noPrice ? 'N/A' : `${formatSilver(item.price)} silver`}
            </dd>
          </div>
          <div className="item-detail-modal__field">
            <dt>Valor total</dt>
            <dd className={noPrice ? 'item-detail-modal__value--missing' : ''}>
              {noPrice ? 'N/A' : `${formatSilver(item.totalprice)} silver`}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
