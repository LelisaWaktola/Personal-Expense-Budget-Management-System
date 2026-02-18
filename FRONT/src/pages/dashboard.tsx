import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { budgetAPI, BudgetResponse } from '../api/budgets'
import { alertAPI, AlertResponse } from '../api/alerts'
import { expenseAPI } from '../api/expenses'
import './dashboard.css'

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const [budgets, setBudgets] = useState<BudgetResponse[]>([])
  const [alerts, setAlerts] = useState<AlertResponse[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsRes, alertsRes, expensesRes] = await Promise.all([
          budgetAPI.list(),
          alertAPI.getUnacknowledged(),
          expenseAPI.list(0, 100),
        ])

        setBudgets(budgetsRes.data.data)
        setAlerts(alertsRes.data.data)

        const expenses = expensesRes.data.data.content
        const total = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)
        setTotalSpent(total)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAcknowledgeAlert = async (alertId: number) => {
    try {
      await alertAPI.acknowledge(alertId)
      setAlerts(alerts.filter((a) => a.id !== alertId))
    } catch (error) {
      console.error('Failed to acknowledge alert', error)
    }
  }

  const getAlertColor = (type: string) => {
    return type === 'BUDGET_EXCEEDED' ? 'alert-error' : 'alert-warning'
  }

  if (loading) {
    return <div className="container mt-4">Loading...</div>
  }

  return (
    <div className="container mt-4">
      <div className="page-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p className="text-secondary">Here's your financial overview</p>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>Active Alerts</h3>
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert ${getAlertColor(alert.alertType)} alert-dismissible`}
              >
                <div className="flex-between">
                  <div>
                    <strong>
                      {alert.alertType === 'BUDGET_EXCEEDED'
                        ? 'Budget Exceeded'
                        : 'Budget Warning'}
                    </strong>
                    <p>{alert.message}</p>
                  </div>
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="btn btn-sm btn-secondary"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="stat-box">
            <div className="stat-label">Total Spent (All Time)</div>
            <div className="stat-value">
              ${totalSpent.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="stat-box">
            <div className="stat-label">Active Budgets</div>
            <div className="stat-value">{budgets.length}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Budget Overview</h3>
        {budgets.length === 0 ? (
          <p className="text-secondary mt-3">No budgets created yet</p>
        ) : (
          <div className="budgets-grid mt-3">
            {budgets.map((budget) => {
              const percentage = Math.min(
                (budget.spentAmount / budget.limitAmount) * 100,
                100
              )
              const statusClass =
                percentage >= 100
                  ? 'status-exceeded'
                  : percentage >= 80
                    ? 'status-warning'
                    : 'status-ok'

              return (
                <div key={budget.id} className="budget-item">
                  <div className="budget-header">
                    <h4>{budget.category}</h4>
                    <span className={`badge ${statusClass}`}>
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="budget-progress">
                    <div
                      className={`progress-bar ${statusClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="budget-info flex-between mt-2">
                    <small>${budget.spentAmount.toFixed(2)} / ${budget.limitAmount.toFixed(2)}</small>
                    <small className="text-secondary">{budget.month}</small>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
