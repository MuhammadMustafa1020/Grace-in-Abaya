import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [items, setItems]     = useState([])
  const [isOpen, setIsOpen]   = useState(false)

  const addItem = (product, size, color, quantity = 1) => {
    setItems(prev => {
      const key = `${product._id}-${size}-${color}`
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, { key, product, size, color, quantity }]
    })
    setIsOpen(true)
  }

  const removeItem = (key) => setItems(prev => prev.filter(i => i.key !== key))

  const updateQty = (key, quantity) => {
    if (quantity < 1) return removeItem(key)
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const total      = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
  const itemCount  = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
