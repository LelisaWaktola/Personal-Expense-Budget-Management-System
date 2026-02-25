import { useState } from 'react'
import { BudgetRequest } from '../api/budgets'

interface BudgetFormProps {
  initialData?: BudgetRequest | null
  onSubmit: (data: BudgetRequest) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

const CATEGORIES = [
  'FOOD',
  'TRANSPORTATION',
  'UTILITIES',
  'ENTERTAINMENT',
  'HEALTHCARE',
  'SHOPPING',
  'EDUCATION',
  'INSURANCE',
  'RENT',
  'OTHER',
]

export default function BudgetForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}: BudgetFormProps) {
const getCurrentMonth = () => {
  const date = new Date()
  return date.toISOString().substring(0, 7)
}

const [data, setData] = useState<BudgetRequest>(
  initialData || {
    category: 'FOOD',
    limitAmount: 0,
    month: getCurrentMonth(),
  }
)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: name === 'limitAmount' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (data.limitAmount <= 0) {
        throw new Error('Budget limit must be greater than 0')
      }
      await onSubmit(data)
    } catch (err: any) {
      setError(err.message || 'Failed to save budget')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error mb-3">{error}</div>}

      <div className="grid grid-2 gap-3">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={data.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Budget Limit</label>
          <input
            type="number"
            name="limitAmount"
            value={data.limitAmount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Month</label>
          <input
            type="month"
            name="month"
            value={data.month}
            onChange={handleChange}
            required
            disabled={isEditing}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'} Budget
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
