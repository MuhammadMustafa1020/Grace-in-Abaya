import { Routes, Route } from 'react-router-dom'
import Navbar            from './components/Navbar'
import Footer            from './components/Footer'
import CartDrawer        from './components/CartDrawer'
import ChatbotWidget     from './components/ChatbotWidget'
import AdminRoute        from './components/AdminRoute'
import HomePage          from './pages/HomePage'
import ProductsPage      from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrdersPage        from './pages/OrdersPage'
import WardrobePage      from './pages/WardrobePage'
import CheckoutPage      from './pages/CheckoutPage'
import AdminPage         from './pages/AdminPage'
import TrendsPage        from './pages/TrendsPage'
import FashionAgentPage  from './pages/FashionAgentPage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/products"       element={<ProductsPage />} />
          <Route path="/products/:id"   element={<ProductDetailPage />} />
          <Route path="/orders"         element={<OrdersPage />} />
          <Route path="/wardrobe"       element={<WardrobePage />} />
          <Route path="/checkout"       element={<CheckoutPage />} />
          <Route path="/trends"         element={<TrendsPage />} />
          <Route path="/outfit-planner" element={<FashionAgentPage />} />
          <Route path="/admin"          element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <ChatbotWidget />
    </div>
  )
}
