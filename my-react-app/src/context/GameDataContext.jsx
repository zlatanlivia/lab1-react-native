import { createContext, useContext, useMemo } from 'react'
import data from '../data/gameData.json'

const GameDataContext = createContext(null)

function buildMaps(itemsArray){
  const map = {}
  for (const it of itemsArray) map[it.id] = it
  return map
}

export function GameDataProvider({ children }){
  const value = useMemo(()=>{
    const ITEMS = buildMaps(data.items)
    const BASE_RESOURCES = {}
    for (const it of data.items) if (it.base) BASE_RESOURCES[it.id] = it
    const RECIPES = data.recipes
    const FINAL_ITEM_ID = data.finalItemId

    const matchRecipe = (placements)=>{
      if (!placements || placements.length===0) return null
      const norm = (arr)=>{
        const minRow = Math.min(...arr.map(p=>p.row))
        const minCol = Math.min(...arr.map(p=>p.col))
        return arr
          .map(p=>({ row: p.row - minRow, col: p.col - minCol, itemId: p.itemId }))
          .sort((a,b)=> a.row - b.row || a.col - b.col || a.itemId.localeCompare(b.itemId))
      }
      const placementsN = norm(placements)
      for (const r of RECIPES) {
        const recipeN = norm(r.pattern)
        if (recipeN.length !== placementsN.length) continue
        let same = true
        for (let i=0;i<recipeN.length;i++){
          const a = recipeN[i], b = placementsN[i]
          if (a.row!==b.row || a.col!==b.col || a.itemId!==b.itemId){ same=false; break }
        }
        if (same) return r
      }
      return null
    }

    return { ITEMS, BASE_RESOURCES, RECIPES, FINAL_ITEM_ID, matchRecipe }
  }, [])

  return (
    <GameDataContext.Provider value={value}>{children}</GameDataContext.Provider>
  )
}

export function useGameData(){
  const ctx = useContext(GameDataContext)
  if (!ctx) throw new Error('useGameData must be used within GameDataProvider')
  return ctx
}


