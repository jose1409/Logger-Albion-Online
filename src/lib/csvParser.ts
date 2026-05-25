// src/lib/csvParser.ts
import Papa from 'papaparse';
import type { RawLootRow, PlayersLootMap } from '../types';
import { enrichPlayersLootWithTiers } from './itemTier';

export const parseLootCsv = (file: File): Promise<PlayersLootMap> => {
  return new Promise((resolve, reject) => {
    Papa.parse<RawLootRow>(file, {
      header: true,             // Usa la primera fila como llaves del objeto
      skipEmptyLines: true,     // Ignora líneas en blanco al final del archivo
      delimiter: ";",           // Según tu ejemplo, el separador es punto y coma
      complete: (results) => {
        const lootMap: PlayersLootMap = {};

        results.data.forEach((row) => {
          // Extraemos los datos que nos importan
          const playerName = row.looted_by__name;
          const itemId = row.item_id;
          const itemName = row.item_name;
          
          // Aseguramos que la cantidad sea un número válido
          const quantity = parseInt(row.quantity, 10);

          // Filtro de seguridad: ignoramos filas que no tengan jugador, item o cantidad válida
          if (!playerName || !itemId || isNaN(quantity)) return;

          // 1. Si el jugador no existe en nuestro diccionario, lo inicializamos
          if (!lootMap[playerName]) {
            lootMap[playerName] = {};
          }

          // 2. Si el objeto no existe para este jugador, lo creamos por primera vez
          if (!lootMap[playerName][itemId]) {
            lootMap[playerName][itemId] = {
              itemId: itemId,
              itemName: itemName || 'Objeto Desconocido',
              tier: null,
              totalQuantity: 0, // Empezamos en 0
              price: 0, //Price sera 0 ya que en CSV no tenemos este dato
              totalprice: 0,  //Lo mismo que price
              imageUrl: 'https://render.albiononline.com/v1/item/'+itemId+'.png',
            };
          }

          // 3. Sumamos la cantidad a la cantidad total existente
          lootMap[playerName][itemId].totalQuantity += quantity;
        });

        // Devolvemos el diccionario ya armado y sumado
        resolve(enrichPlayersLootWithTiers(lootMap));
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};