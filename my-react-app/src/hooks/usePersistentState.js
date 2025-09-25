import { useEffect, useState } from 'react'

export function usePersistentState(storageKey, initialValue){
  const [state, setState] = useState(()=>{
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(()=>{
    try { localStorage.setItem(storageKey, JSON.stringify(state)) } catch {}
  }, [storageKey, state])

  return [state, setState]
}


