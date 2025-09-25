import { useEffect, useState } from 'react'
import { useGameData } from '../context/GameDataContext.jsx'

export default function Inventory({ items, onReorderStart }) {
  const [dragIndex, setDragIndex] = useState(null)
  const { ITEMS } = useGameData()

  useEffect(() => { setDragIndex(null) }, [items])

  function handleDragStart(e, index, itemId) {
    setDragIndex(index)
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'inventory', itemId, index }))
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragEnd() {
    setDragIndex(null)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e, index) {
    e.preventDefault()
    const payload = JSON.parse(e.dataTransfer.getData('text/plain') || '{}')
    if (payload.type === 'inventory' && typeof payload.index === 'number') {
      onReorderStart && onReorderStart(payload.index, index)
    }
    // asigură resetarea stării de dragging la final
    setDragIndex(null)
  }

  return (
    <div className="panel inventory" onDragOver={handleDragOver}>
      <h3>Inventar</h3>
      <ul className="inventory-list">
        {items.map((id, idx) => (
          <li key={idx}
              className={`inv-slot ${dragIndex===idx?'dragging':''}`}
              draggable
              onDragStart={(e)=>handleDragStart(e, idx, id)}
              onDragEnd={handleDragEnd}
              onDrop={(e)=>handleDrop(e, idx)}>
            <span className="icon" aria-label={ITEMS[id]?.name}>{ITEMS[id]?.icon}</span>
            <span className="label">{ITEMS[id]?.name || id}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


