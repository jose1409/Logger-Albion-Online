// src/lib/jsonParser.ts

import type { RawLootJson, PlayersLootMap } from '../types';
import { enrichPlayersLootWithTiers } from './itemTier';

export const parseLootJson = (
  jsonData: RawLootJson[]
): PlayersLootMap => {

      const lootMap: PlayersLootMap = {};

      jsonData.forEach((entry) => {

        // Validamos que sea un evento de loot
        if (entry.type !== 'loot') return;

        const playerName = entry.loot?.looted_by?.name;

        const itemId = entry.loot?.item?.id;

        const quantity = entry.loot?.item?.quantity;

        const priceMarket = entry.loot?.item?.average_est_market_value ?? 0;

        const marketValue = priceMarket;

        // Seguridad
        if (
          !playerName ||
          !itemId ||
          !quantity ||
          isNaN(quantity)
        ) {
          return;
        }

        // El id sera el nombre
        const itemName = itemId;

        // Inicializamos jugador
        if (!lootMap[playerName]) {
          lootMap[playerName] = {};
        }

        // Inicializamos item
        if (!lootMap[playerName][itemId]) {

          lootMap[playerName][itemId] = {
            itemId,
            itemName,
            tier: null,
            totalQuantity: 0,
            totalprice: 0,
            price: 0,
            imageUrl:
              `https://render.albiononline.com/v1/item/${itemId}.png`,
          };

        }

        // Sumamos cantidad
        lootMap[playerName][itemId].totalQuantity += quantity;

        // Agregamos valor solamente si esta en 0
        if(lootMap[playerName][itemId].price == 0) {lootMap[playerName][itemId].price = marketValue;} 

        //Sumamos el valor de los objetos

        lootMap[playerName][itemId].totalprice += priceMarket * quantity

      });

    return enrichPlayersLootWithTiers(lootMap);
};