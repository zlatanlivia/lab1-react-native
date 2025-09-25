

/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} resultItemId
 * @property {Array<{row:number,col:number,itemId:string}>} pattern Positions in 3x3 grid (0..2)
 */

export const BASE_RESOURCES = /** @type {Record<string, Item>} */ ({
  wood: { id: 'wood', name: 'Lemn', description: 'Bucată de lemn', icon: '🪵' },
  stone: { id: 'stone', name: 'Piatră', description: 'Bucată de piatră', icon: '🪨' },
  fiber: { id: 'fiber', name: 'Fibră', description: 'Fibră vegetală', icon: '🧵' },
});

export const ITEMS = /** @type {Record<string, Item>} */ ({
  ...BASE_RESOURCES,
  stick: { id: 'stick', name: 'Băț', description: 'Un băț simplu', icon: '🥢' },
  axe: { id: 'axe', name: 'Topor', description: 'Unelte pentru tăiat', icon: '🪓' },
  rope: { id: 'rope', name: 'Funie', description: 'Funie rezistentă', icon: '🪢' },
  campfire: { id: 'campfire', name: 'Foc de tabără', description: 'Te încălzește', icon: '🔥' },
  final_relic: { id: 'final_relic', name: 'Căsuță', description: 'Obiectul victoriei', icon: '🏠' },
});

/** @type {Recipe[]} */
export const RECIPES = [
  {
    id: 'stick-from-wood',
    name: 'Băț',
    description: 'Două lemne aliniate orizontal',
    resultItemId: 'stick',
    pattern: [
      { row: 1, col: 0, itemId: 'wood' },
      { row: 1, col: 1, itemId: 'wood' },
    ],
  },
  {
    id: 'rope-from-fiber',
    name: 'Funie',
    description: 'Trei fibre pe verticală',
    resultItemId: 'rope',
    pattern: [
      { row: 0, col: 2, itemId: 'fiber' },
      { row: 1, col: 2, itemId: 'fiber' },
      { row: 2, col: 2, itemId: 'fiber' },
    ],
  },
  {
    id: 'axe-from-stick-stone',
    name: 'Topor',
    description: 'Piatră și băț în L',
    resultItemId: 'axe',
    pattern: [
      { row: 0, col: 0, itemId: 'stone' },
      { row: 0, col: 1, itemId: 'stone' },
      { row: 1, col: 0, itemId: 'stick' },
    ],
  },
  {
    id: 'campfire-from-wood-stone',
    name: 'Foc de tabără',
    description: 'Un pătrat de lemn cu piatră în centru',
    resultItemId: 'campfire',
    pattern: [
      { row: 0, col: 0, itemId: 'wood' },
      { row: 0, col: 2, itemId: 'wood' },
      { row: 2, col: 0, itemId: 'wood' },
      { row: 2, col: 2, itemId: 'wood' },
      { row: 1, col: 1, itemId: 'stone' },
    ],
  },
  {
    id: 'final-from-axe-rope-campfire',
    name: 'Căsuță',
    description: 'Combinație finală pentru victorie',
    resultItemId: 'final_relic',
    pattern: [
      { row: 0, col: 0, itemId: 'axe' },
      { row: 1, col: 1, itemId: 'rope' },
      { row: 2, col: 2, itemId: 'campfire' },
    ],
  },
];

export const FINAL_ITEM_ID = 'final_relic';

/**
 * Build a 3x3 key of placed items for comparison
 * @param {Array<{row:number,col:number,itemId:string}>} placements
 */
// (toKey) was used by strict matching; no longer needed after translation-based matching

/**
 * @param {Array<{row:number,col:number,itemId:string}>} placements
 * @returns {Recipe|null}
 */
export function matchRecipe(placements) {
  // Flexible: match by shape and items ignoring absolute position (translation only)
  if (!placements || placements.length === 0) return null

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


