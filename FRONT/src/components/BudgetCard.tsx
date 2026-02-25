import { BudgetResponse } from '../api/budgets'
import './BudgetCard.css'

interface BudgetCardProps {
  budget: BudgetResponse
  onEdit: (budget: BudgetResponse) => void
  onDelete: (id: number) => void
  onCheckAlerts: (id: number) => void
}

export default function BudgetCard({
  budget,
  onEdit,
  onDelete,
  onCheckAlerts,
}: BudgetCardProps) {
  const percentage =
  budget.limitAmount > 0
    ? Math.min((budget.spentAmount / budget.limitAmount) * 100, 100)
    : 0;
  const isExceeded = percentage >= 100
  const isWarning = percentage >= 80 && percentage < 100
  const isOk = percentage < 80

  const statusClass = isExceeded ? 'exceeded' : isWarning ? 'warning' : 'ok'

  return (
    <div className={`budget-card ${statusClass}`}>
      <div className="budget-card-header">
        <div>
          <h3>{budget.category.replace(/_/g, ' ')}</h3>
          <small className="text-secondary">{budget.month}</small>
        </div>
        <span className={`status-badge ${statusClass}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      <div className="budget-card-progress">
        <div className="progress-track">
          <div
            className={`progress-fill ${statusClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="budget-card-stats">
        <div className="stat">
          <span className="stat-label">Spent</span>
          <span className="stat-value">${budget.spentAmount.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Limit</span>
          <span className="stat-value">${budget.limitAmount.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining</span>
          <span className={`stat-value ${isExceeded ? 'negative' : ''}`}>
            ${Math.max(budget.remainingAmount, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {isExceeded && (
        <div className="alert alert-error mt-3">
          Budget exceeded by ${(budget.spentAmount - budget.limitAmount).toFixed(2)}
        </div>
      )}

      <div className="budget-card-actions">
        <button
          onClick={() => onCheckAlerts(budget.id)}
          className="btn btn-sm btn-secondary"
        >
          Check Alerts
        </button>
        <button
          onClick={() => onEdit(budget)}
          className="btn btn-sm btn-secondary"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(budget.id)}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
