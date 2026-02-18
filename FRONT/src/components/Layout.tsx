import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './Layout.css'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="layout">
      <nav className="sidebar" style={{ transform: sidebarOpen ? 'translateX(0)' : '' }}>
        <div className="sidebar-header">
          <h2>Expense Tracker</h2>
          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className="nav-menu">
          <li>
            <a
              href="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => {
                navigate('/')
                setSidebarOpen(false)
              }}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="/expenses"
              className={`nav-link ${isActive('/expenses') ? 'active' : ''}`}
              onClick={() => {
                navigate('/expenses')
                setSidebarOpen(false)
              }}
            >
              <span className="nav-icon">💰</span>
              <span>Expenses</span>
            </a>
          </li>
          <li>
            <a
              href="/budgets"
              className={`nav-link ${isActive('/budgets') ? 'active' : ''}`}
              onClick={() => {
                navigate('/budgets')
                setSidebarOpen(false)
              }}
            >
              <span className="nav-icon">📈</span>
              <span>Budgets</span>
            </a>
          </li>
          <li>
            <a
              href="/reports"
              className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
              onClick={() => {
                navigate('/reports')
                setSidebarOpen(false)
              }}
            >
              <span className="nav-icon">📉</span>
              <span>Reports</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.firstName} {user?.lastName}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="layout-overlay" onClick={() => setSidebarOpen(false)} />

      <div className="main-content">
        <header className="header">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="header-title">
            <h1>Expense Tracker</h1>
          </div>
          <div className="header-spacer" />
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import React from 'react'
