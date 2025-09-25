import { useMemo } from 'react'
import { useGameData } from '../context/GameDataContext.jsx'

function Cell({ row, col, itemId, onDropItem, onSwap, ITEMS }) {
  function handleDragOver(e){ e.preventDefault() }
  function handleDrop(e){
    e.preventDefault()
    const payload = JSON.parse(e.dataTransfer.getData('text/plain')||'{}')
    if (payload.type === 'inventory' && payload.itemId){
      onDropItem(row, col, payload.itemId, payload.index)
    }
    if (payload.type === 'craft'){
      onSwap(payload.row, payload.col, row, col)
    }
  }
  return (
    <div className="craft-cell" onDragOver={handleDragOver} onDrop={handleDrop}>
      {itemId ? (
        <div className="craft-item" draggable onDragStart={(e)=>{
          e.dataTransfer.setData('text/plain', JSON.stringify({ type:'craft', row, col, itemId }))
          e.dataTransfer.effectAllowed = 'move'
        }}>
          <span className="icon" aria-label={ITEMS[itemId]?.name}>{ITEMS[itemId]?.icon}</span>
        </div>
      ) : null}
    </div>
  )
}

export default function CraftingGrid({ grid, onPlaceFromInventory, onClearCell }){
  const { ITEMS, matchRecipe } = useGameData()
  const placements = useMemo(()=>{
    const acc = []
    for (let r=0;r<3;r++){
      for (let c=0;c<3;c++){
        const id = grid[r][c]
        if (id) acc.push({row:r,col:c,itemId:id})
      }
    }
    return acc
  }, [grid])

  const recipe = useMemo(()=> matchRecipe(placements), [placements, matchRecipe])

  return (
    <div className="panel crafting">
      <h3>Crafting 3x3</h3>
      <div className="craft-grid">
        {Array.from({length:3}).map((_,r)=>(
          <div key={r} className="craft-row">
            {Array.from({length:3}).map((_,c)=>(
              <Cell key={c}
                    row={r}
                    col={c}
                    itemId={grid[r][c]}
                    onDropItem={onPlaceFromInventory}
                    onSwap={(fromR, fromC, toR, toC)=>{
                      if (fromR===toR && fromC===toC) return
                      const tmp = grid[fromR][fromC]
                      const target = grid[toR][toC]
                      onClearCell(fromR, fromC)
                      if (tmp) onPlaceFromInventory(toR, toC, tmp)
                      if (target) onPlaceFromInventory(fromR, fromC, target)
                    }}
                    ITEMS={ITEMS} />
            ))}
          </div>
        ))}
      </div>
      <div className="preview">
        <strong>Previzualizare:</strong>{' '}
        {recipe ? (
          <span className="icon" aria-label={ITEMS[recipe.resultItemId]?.name}>{ITEMS[recipe.resultItemId]?.icon}</span>
        ) : '—'}
      </div>
    </div>
  )
}


