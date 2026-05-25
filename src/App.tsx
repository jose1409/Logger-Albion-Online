import { useState } from 'react';
import { parseLootCsv } from './lib/csvParser';
import { parseLootJson } from './lib/jsonParser';
import {
  createDefaultVisibility,
  toggleItemVisibility,
  toggleTierFilter,
  type LootVisibilityState,
} from './lib/tierFilters';
import type { ItemTier, PlayersLootMap } from './types';
import { PlayerLoot } from './components/loot/PlayerLoot';
import { LootFileUploader } from './components/loot/LootFileUploader';
import { PlayerSilverEstimate } from './components/loot/PlayerSilverEstimate';
import { TierFilterBar } from './components/loot/TierFilterBar';

type LootFileFormat = 'csv' | 'json';

function App() {
  const [lootData, setLootData] = useState<PlayersLootMap | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileFormat, setFileFormat] = useState<LootFileFormat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [iconSize, setIconSize] = useState<number>(60);
  const [groupLootByTier, setGroupLootByTier] = useState(false);
  const [visibility, setVisibility] = useState<LootVisibilityState>(createDefaultVisibility);

  const handleToggleTier = (tier: ItemTier) => {
    if (!lootData) return;
    setVisibility((prev) => toggleTierFilter(tier, prev, lootData));
  };

  const handleToggleItem = (playerName: string, itemId: string) => {
    const item = lootData?.[playerName]?.[itemId];
    if (!item) return;
    setVisibility((prev) => ({
      ...prev,
      ...toggleItemVisibility(item, playerName, prev),
    }));
  };

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let parsedData: PlayersLootMap;

      switch (extension) {
        case 'csv':
          parsedData = await parseLootCsv(file);
          setFileFormat('csv');
          break;

        case 'json': {
          const text = await file.text();
          const jsonData = JSON.parse(text);
          parsedData = parseLootJson(jsonData.entries);
          setFileFormat('json');
          break;
        }

        default:
          alert('Formato de archivo no soportado');
          return;
      }
      
      setLootData(parsedData);
      setFileName(file.name);
      setVisibility(createDefaultVisibility());

      // Usa parsedData (el valor ya procesado), no lootData (el estado aún no se actualizó)
      console.log('LootData listo:', parsedData);
      
    } catch (error) {
      console.error('Hubo un error leyendo el archivo:', error);
      alert('Hubo un error al procesar el archivo. Revisa la consola.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div style={{ '--icon-size': `${iconSize}px` } as React.CSSProperties}>
        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
          <h1>Repartidor de Loot</h1>

          {!lootData && (
            <LootFileUploader
              variant="initial"
              isLoading={isLoading}
              onFileSelect={handleFileSelect}
            />
          )}

          {lootData && fileName && (
            <>
              <div>
                <div className="loot-summary-header">
                  <h2>Resumen de Botín</h2>
                  <span className="loot-summary-header__badge">
                    {Object.keys(lootData).length} Jugadores
                  </span>
                </div>

                <TierFilterBar
                  visibility={visibility}
                  lootData={lootData}
                  onToggleTier={handleToggleTier}
                  iconSize={iconSize}
                  onIconSizeChange={setIconSize}
                  groupLootByTier={groupLootByTier}
                  onGroupLootByTierChange={setGroupLootByTier}
                />

                {Object.entries(lootData).map(([playerName, items]) => (
                  <div key={playerName} className="player-loot-group">
                    <PlayerLoot
                      playerName={playerName}
                      items={items}
                      visibility={visibility}
                      groupByTier={groupLootByTier}
                      onToggleItem={handleToggleItem}
                    />
                    {fileFormat === 'json' && (
                      <PlayerSilverEstimate
                        playerName={playerName}
                        items={items}
                        visibility={visibility}
                      />
                    )}
                  </div>
                ))}
              </div>

              <LootFileUploader
                variant="secondary"
                fileName={fileName}
                isLoading={isLoading}
                onFileSelect={handleFileSelect}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
