// 1. Lo que esperamos recibir exactamente del CSV de Albion
export interface RawLootRow {
    timestamp_utc: string;
    looted_by__name: string;
    item_id: string;
    item_name: string;
    quantity: string; // Viene como texto del CSV, lo convertiremos a número en el parseo
  }

// 2. Lo que esperamos recibir del Json
export interface RawLootJson {
  timestamp_utc: string;
  cluster: string;
  type: string;
  loot: {
    looted_by: {
      alliance: string;
      guild: string;
      name: string;
    };
    item: {
      id: string;
      quantity: number;
      average_est_market_value: number;
    };
    looted_from: {
      alliance: string;
      guild: string;
      name: string;
    };
  };
}
  
  /** Tier numérico de Albion (4–8). null = sin regla conocida (antes N/A). */
  export type ItemTier = 4 | 5 | 6 | 7 | 8;

  // 2. El objeto final de cada ítem ya procesado y sumado
  export interface ItemSummary {
    itemId: string;
    itemName: string;
    tier: ItemTier | null;
    totalQuantity: number;
    price: number;
    totalprice: number;
    imageUrl: string;
  }
  
  export type PlayersLootMap = Record<string, Record<string, ItemSummary>>;