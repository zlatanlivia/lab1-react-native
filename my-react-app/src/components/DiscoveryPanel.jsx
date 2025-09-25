import { useGameData } from '../context/GameDataContext.jsx'

export default function DiscoveryPanel({ discoveredIds }){
  const { ITEMS, BASE_RESOURCES, RECIPES } = useGameData()
  const available = new Set([...Object.keys(BASE_RESOURCES), ...discoveredIds])
  const nextCraftables = RECIPES
    .filter(r => r.pattern.every(p => available.has(p.itemId)))
    .map(r => r.resultItemId)
    .filter(id => !discoveredIds.includes(id))
    .filter((id, idx, arr) => arr.indexOf(id) === idx)
  return (
    <div className="panel discovery">
      <h3>Poți crea în continuare</h3>
      {nextCraftables.length === 0 ? (
        <div className="empty">Nimic nou deocamdată.</div>
      ) : (
        <ul>
          {nextCraftables.map(id => (
            <li key={id} className="discovery-item">
              <span className="icon" aria-label={ITEMS[id]?.name}>{ITEMS[id]?.icon}</span>
              <span className="label">{ITEMS[id]?.name || id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


