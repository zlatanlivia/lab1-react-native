import { useGameData } from '../context/GameDataContext.jsx'

export default function ResourcePanel({ onSpawn, discoveredIds = [] }) {
  const { BASE_RESOURCES, ITEMS } = useGameData()
  const discoveredNonBase = discoveredIds.filter(id => !(id in BASE_RESOURCES))
  return (
    <div className="panel resource-panel">
      <h3>Resurse</h3>
      <div className="grid">
        {Object.values(BASE_RESOURCES).map((it) => (
          <button key={it.id} className="resource-btn" onClick={() => onSpawn(it.id)}>
            <span className="icon" aria-label={it.name}>{it.icon}</span>
            <span className="label">{it.name}</span>
          </button>
        ))}
      </div>
      {discoveredNonBase.length>0 && (
        <>
          <h3>Descoperite</h3>
          <div className="grid">
            {discoveredNonBase.map(id => (
              <button key={id} className="resource-btn" onClick={() => onSpawn(id)}>
                <span className="icon" aria-label={ITEMS[id]?.name}>{ITEMS[id]?.icon}</span>
                <span className="label">{ITEMS[id]?.name || id}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


