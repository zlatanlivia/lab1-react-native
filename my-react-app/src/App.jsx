import { useEffect, useMemo, useState } from 'react'
import './App.css'
import ResourcePanel from './components/ResourcePanel.jsx'
import Inventory from './components/Inventory.jsx'
import CraftingGrid from './components/CraftingGrid.jsx'
import DiscoveryPanel from './components/DiscoveryPanel.jsx'
import TrashBin from './components/TrashBin.jsx'
import { GameDataProvider, useGameData } from './context/GameDataContext.jsx'
import { usePersistentState } from './hooks/usePersistentState.js'
import { resetAll } from './state/persist.js'

function InnerApp() {
  const { ITEMS, FINAL_ITEM_ID, matchRecipe } = useGameData()
  const [inventory, setInventory] = usePersistentState('craft_game_inventory_v1', [])
  const [discovered, setDiscovered] = usePersistentState('craft_game_discovered_v1', [])
  const [grid, setGrid] = useState(Array.from({length:3},()=>Array(3).fill(null)))
  const [victory, setVictory] = useState(false)

  function handleSpawn(itemId){
    setInventory(prev=> [...prev, itemId])
  }

  function handleRemoveFromInventory(index){
    setInventory(prev => prev.filter((_,i)=> i!==index))
  }

  function handleReorder(from, to){
    setInventory(prev => {
      const arr = [...prev]
      const [m] = arr.splice(from,1)
      arr.splice(to,0,m)
      return arr
    })
  }

  function placeFromInventory(row, col, itemId, invIndex){
    setGrid(prev => {
      const next = prev.map(r=>[...r])
      next[row][col] = itemId
      return next
    })
    if (typeof invIndex === 'number') {
      setInventory(prev => prev.filter((_,i)=> i!==invIndex))
    }
  }

  function clearCell(row,col){
    setGrid(prev => {
      const next = prev.map(r=>[...r])
      next[row][col] = null
      return next
    })
  }

  function confirmCraft(resultItemId){
    setInventory(prev=>[...prev, resultItemId])
    setDiscovered(prev => prev.includes(resultItemId) ? prev : [...prev, resultItemId])
    setGrid(Array.from({length:3},()=>Array(3).fill(null)))
    if (resultItemId === FINAL_ITEM_ID) setVictory(true)
  }

  function resetGame(){
    resetAll()
    setInventory([])
    setDiscovered([])
    setGrid(Array.from({length:3},()=>Array(3).fill(null)))
    setVictory(false)
  }

  const placements = useMemo(()=>{
    const acc = []
    for (let r=0;r<3;r++) for (let c=0;c<3;c++) if (grid[r][c]) acc.push({row:r,col:c,itemId:grid[r][c]})
    return acc
  }, [grid])

  return (
    <div className="app-layout">
      <header>
        <h1>Joc de Crafting</h1>
        <button onClick={resetGame}>Reset</button>
      </header>
      <main className="layout">
        <ResourcePanel onSpawn={handleSpawn} discoveredIds={discovered} />
        <Inventory items={inventory} onReorderStart={handleReorder} />
        <CraftingGrid grid={grid} onPlaceFromInventory={placeFromInventory} onClearCell={clearCell} />
        <DiscoveryPanel discoveredIds={discovered} />
        <TrashBin onDropPayload={(payload)=>{
          // from inventory
          if (payload?.type === 'inventory' && typeof payload.index === 'number') {
            setInventory(prev => prev.filter((_,i)=> i!==payload.index))
          }
          // from crafting grid
          if (payload?.type === 'craft' && typeof payload.row === 'number' && typeof payload.col === 'number') {
            setGrid(prev => {
              const next = prev.map(r=>[...r])
              next[payload.row][payload.col] = null
              return next
            })
          }
        }} />
      </main>
      <footer>
        <CraftAction grid={grid} onConfirm={confirmCraft} matchRecipe={matchRecipe} ITEMS={ITEMS} />
      </footer>
      {victory && (
        <div className="modal">
          <div className="modal-body">
            <h2>Ai câștigat!</h2>
            <p>Ai creat {ITEMS[FINAL_ITEM_ID].name} {ITEMS[FINAL_ITEM_ID].icon}</p>
            <button onClick={()=>setVictory(false)}>Închide</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CraftAction({ grid, onConfirm, matchRecipe, ITEMS }){
  const placements = []
  for (let r=0;r<3;r++) for (let c=0;c<3;c++) if (grid[r][c]) placements.push({row:r,col:c,itemId:grid[r][c]})
  const recipe = matchRecipe(placements)
  return (
    <div className="craft-action">
      {recipe ? (
        <button className="confirm" onClick={()=>onConfirm(recipe.resultItemId)}>
          Creează: {ITEMS[recipe.resultItemId]?.name} {ITEMS[recipe.resultItemId]?.icon}
        </button>
      ) : (
        <button className="confirm" disabled>Introdu o rețetă validă</button>
      )}
    </div>
  )
}

function App(){
  return (
    <GameDataProvider>
      <InnerApp />
    </GameDataProvider>
  )
}

export default App
