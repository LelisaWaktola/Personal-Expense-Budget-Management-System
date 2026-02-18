import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { budgetAPI } from '../api/budgets';
import { alertAPI } from '../api/alerts';
import { expenseAPI } from '../api/expenses';
import './dashboard.css';
export default function Dashboard() {
    const user = useAuthStore((state) => state.user);
    const [budgets, setBudgets] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [budgetsRes, alertsRes, expensesRes] = await Promise.all([
                    budgetAPI.list(),
                    alertAPI.getUnacknowledged(),
                    expenseAPI.list(0, 100),
                ]);
                setBudgets(budgetsRes.data.data);
                setAlerts(alertsRes.data.data);
                const expenses = expensesRes.data.data.content;
                const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                setTotalSpent(total);
            }
            catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const handleAcknowledgeAlert = async (alertId) => {
        try {
            await alertAPI.acknowledge(alertId);
            setAlerts(alerts.filter((a) => a.id !== alertId));
        }
        catch (error) {
            console.error('Failed to acknowledge alert', error);
        }
    };
    const getAlertColor = (type) => {
        return type === 'BUDGET_EXCEEDED' ? 'alert-error' : 'alert-warning';
    };
    if (loading) {
        return _jsx("div", { className: "container mt-4", children: "Loading..." });
    }
    return (_jsxs("div", { className: "container mt-4", children: [_jsxs("div", { className: "page-header", children: [_jsxs("h1", { children: ["Welcome back, ", user?.firstName, "!"] }), _jsx("p", { className: "text-secondary", children: "Here's your financial overview" })] }), alerts.length > 0 && (_jsxs("div", { className: "alerts-section", children: [_jsx("h3", { children: "Active Alerts" }), _jsx("div", { className: "alerts-list", children: alerts.map((alert) => (_jsx("div", { className: `alert ${getAlertColor(alert.alertType)} alert-dismissible`, children: _jsxs("div", { className: "flex-between", children: [_jsxs("div", { children: [_jsx("strong", { children: alert.alertType === 'BUDGET_EXCEEDED'
                                                    ? 'Budget Exceeded'
                                                    : 'Budget Warning' }), _jsx("p", { children: alert.message })] }), _jsx("button", { onClick: () => handleAcknowledgeAlert(alert.id), className: "btn btn-sm btn-secondary", children: "Dismiss" })] }) }, alert.id))) })] })), _jsxs("div", { className: "grid grid-2 mb-4", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "stat-box", children: [_jsx("div", { className: "stat-label", children: "Total Spent (All Time)" }), _jsxs("div", { className: "stat-value", children: ["$", totalSpent.toFixed(2)] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "stat-box", children: [_jsx("div", { className: "stat-label", children: "Active Budgets" }), _jsx("div", { className: "stat-value", children: budgets.length })] }) })] }), _jsxs("div", { className: "card", children: [_jsx("h3", { children: "Budget Overview" }), budgets.length === 0 ? (_jsx("p", { className: "text-secondary mt-3", children: "No budgets created yet" })) : (_jsx("div", { className: "budgets-grid mt-3", children: budgets.map((budget) => {
                            const percentage = Math.min((budget.spentAmount / budget.limitAmount) * 100, 100);
                            const statusClass = percentage >= 100
                                ? 'status-exceeded'
                                : percentage >= 80
                                    ? 'status-warning'
                                    : 'status-ok';
                            return (_jsxs("div", { className: "budget-item", children: [_jsxs("div", { className: "budget-header", children: [_jsx("h4", { children: budget.category }), _jsxs("span", { className: `badge ${statusClass}`, children: [percentage.toFixed(0), "%"] })] }), _jsx("div", { className: "budget-progress", children: _jsx("div", { className: `progress-bar ${statusClass}`, style: { width: `${percentage}%` } }) }), _jsxs("div", { className: "budget-info flex-between mt-2", children: [_jsxs("small", { children: ["$", budget.spentAmount.toFixed(2), " / $", budget.limitAmount.toFixed(2)] }), _jsx("small", { className: "text-secondary", children: budget.month })] })] }, budget.id));
                        }) }))] })] }));
}
