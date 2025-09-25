const STORAGE_KEYS = {
  inventory: 'craft_game_inventory_v1',
  discovered: 'craft_game_discovered_v1',
};

export function loadInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.inventory);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInventory(inventory) {
  try {
    localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(inventory));
  } catch {}
}

export function loadDiscovered() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.discovered);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDiscovered(discovered) {
  try {
    localStorage.setItem(STORAGE_KEYS.discovered, JSON.stringify(discovered));
  } catch {}
}

export function resetAll() {
  try {
    localStorage.removeItem(STORAGE_KEYS.inventory);
    localStorage.removeItem(STORAGE_KEYS.discovered);
  } catch {}
}


