import { useState } from 'react'
import { ExpenseRequest } from '../api/expenses'

interface ExpenseFormProps {
  initialData?: ExpenseRequest | null
  onSubmit: (data: ExpenseRequest) => Promise<void>
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

const PAYMENT_METHODS = [
  'CASH',
  'DEBIT_CARD',
  'CREDIT_CARD',
  'MOBILE_WALLET',
  'BANK_TRANSFER',
  'OTHER',
]

export default function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
}: ExpenseFormProps) {
  const [data, setData] = useState<ExpenseRequest>(
    initialData || {
      amount: 0,
      category: 'FOOD',
      paymentMethod: 'CASH',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
    }
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (data.amount <= 0) {
        throw new Error('Amount must be greater than 0')
      }
      if (!data.description.trim()) {
        throw new Error('Description is required')
      }
      await onSubmit(data)
    } catch (err: any) {
      setError(err.message || 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-error mb-3">{error}</div>}

      <div className="grid grid-2 gap-3">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={data.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="expenseDate"
            value={data.expenseDate}
            onChange={handleChange}
            required
          />
        </div>

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
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={data.paymentMethod}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          placeholder="What was this expense for?"
          rows={3}
          required
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Add'} Expense
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
