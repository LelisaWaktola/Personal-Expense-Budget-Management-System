import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Layout.css';
export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const isActive = (path) => location.pathname === path;
    return (_jsxs("div", { className: "layout", children: [_jsxs("nav", { className: "sidebar", style: { transform: sidebarOpen ? 'translateX(0)' : '' }, children: [_jsxs("div", { className: "sidebar-header", children: [_jsx("h2", { children: "Expense Tracker" }), _jsx("button", { className: "close-btn", onClick: () => setSidebarOpen(false), children: "\u2715" })] }), _jsxs("ul", { className: "nav-menu", children: [_jsx("li", { children: _jsxs("a", { href: "/", className: `nav-link ${isActive('/') ? 'active' : ''}`, onClick: () => {
                                        navigate('/');
                                        setSidebarOpen(false);
                                    }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCCA" }), _jsx("span", { children: "Dashboard" })] }) }), _jsx("li", { children: _jsxs("a", { href: "/expenses", className: `nav-link ${isActive('/expenses') ? 'active' : ''}`, onClick: () => {
                                        navigate('/expenses');
                                        setSidebarOpen(false);
                                    }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCB0" }), _jsx("span", { children: "Expenses" })] }) }), _jsx("li", { children: _jsxs("a", { href: "/budgets", className: `nav-link ${isActive('/budgets') ? 'active' : ''}`, onClick: () => {
                                        navigate('/budgets');
                                        setSidebarOpen(false);
                                    }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCC8" }), _jsx("span", { children: "Budgets" })] }) }), _jsx("li", { children: _jsxs("a", { href: "/reports", className: `nav-link ${isActive('/reports') ? 'active' : ''}`, onClick: () => {
                                        navigate('/reports');
                                        setSidebarOpen(false);
                                    }, children: [_jsx("span", { className: "nav-icon", children: "\uD83D\uDCC9" }), _jsx("span", { children: "Reports" })] }) })] }), _jsxs("div", { className: "sidebar-footer", children: [_jsxs("div", { className: "user-info", children: [_jsx("div", { className: "user-avatar", children: user?.firstName.charAt(0).toUpperCase() }), _jsxs("div", { className: "user-details", children: [_jsxs("p", { className: "user-name", children: [user?.firstName, " ", user?.lastName] }), _jsx("p", { className: "user-email", children: user?.email })] })] }), _jsx("button", { onClick: handleLogout, className: "btn btn-secondary btn-sm", style: { width: '100%' }, children: "Logout" })] })] }), _jsx("div", { className: "layout-overlay", onClick: () => setSidebarOpen(false) }), _jsxs("div", { className: "main-content", children: [_jsxs("header", { className: "header", children: [_jsx("button", { className: "menu-btn", onClick: () => setSidebarOpen(!sidebarOpen), children: "\u2630" }), _jsx("div", { className: "header-title", children: _jsx("h1", { children: "Expense Tracker" }) }), _jsx("div", { className: "header-spacer" })] }), _jsx("main", { className: "page-content", children: _jsx(Outlet, {}) })] })] }));
}
import React from 'react';
