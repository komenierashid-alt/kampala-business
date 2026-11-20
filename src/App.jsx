// Add this function inside your Dashboard component
const addBusiness = () => {
  const name = prompt("Business name? e.g. Rashid Fridges")
  const category = prompt("Category? e.g. fridge, tv, clothes, hardware")
  if(!name) return
  
  const newBiz = {
    id: Date.now(),
    name: name,
    category: category || 'tv',
    owner: localStorage.getItem('kba_user') ? JSON.parse(localStorage.getItem('kba_user')).name : 'You',
    location: 'Kikoni'
  }
  
  const existing = JSON.parse(localStorage.getItem('kba_businesses') || '[]')
  const updated = [...existing, newBiz]
  localStorage.setItem('kba_businesses', JSON.stringify(updated))
  window.location.reload() // Refresh to show in For You
}
