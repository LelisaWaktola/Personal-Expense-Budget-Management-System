import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/expenses'
import Budgets from './pages/budgets'
import Reports from './pages/reports'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const initialized = useAuthStore((state) => state.initialize)

  if (!initialized) return <div>Loading...</div>  // wait until store initializes

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const initialize = useAuthStore((state) => state.initialize)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
            path="/"
            element={
                <ProtectedRoute>
                <Layout />
                </ProtectedRoute>
            }
            >
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="reports" element={<Reports />} />
            </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
