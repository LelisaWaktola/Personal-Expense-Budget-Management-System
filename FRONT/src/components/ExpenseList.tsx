import { ExpenseResponse } from '../api/expenses'
import './ExpenseList.css'

interface ExpenseListProps {
  expenses: ExpenseResponse[]
  onEdit: (expense: ExpenseResponse) => void
  onDelete: (id: number) => void
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      FOOD: '#ef4444',
      TRANSPORTATION: '#f59e0b',
      UTILITIES: '#3b82f6',
      ENTERTAINMENT: '#8b5cf6',
      HEALTHCARE: '#06b6d4',
      SHOPPING: '#ec4899',
      EDUCATION: '#10b981',
      INSURANCE: '#6366f1',
      RENT: '#f97316',
      OTHER: '#64748b',
    }
    return colors[category] || '#64748b'
  }

  return (
    <div className="expenses-table">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>
                  <span className="text-nowrap">
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <span
                    className="category-badge"
                    style={{
                      backgroundColor: `${getCategoryColor(expense.category)}20`,
                      color: getCategoryColor(expense.category),
                    }}
                  >
                    {expense.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="description-cell">{expense.description}</td>
                <td className="amount-cell">
                  <strong>${expense.amount.toFixed(2)}</strong>
                </td>
                <td>
                  <small>{expense.paymentMethod.replace('_', ' ')}</small>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(expense)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
