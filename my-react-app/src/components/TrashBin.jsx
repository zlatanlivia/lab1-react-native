export default function TrashBin({ onDropPayload }){
  function handleDragOver(e){ e.preventDefault() }
  function handleDrop(e){
    e.preventDefault()
    const text = e.dataTransfer.getData('text/plain')
    try {
      const payload = JSON.parse(text)
      onDropPayload && onDropPayload(payload)
    } catch {}
  }
  return (
    <div className="panel trash-bin" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h3>Gunoi</h3>
      <div className="trash-body" aria-label="Șterge trăgând aici">🗑️ Trage aici pentru ștergere</div>
    </div>
  )
}


