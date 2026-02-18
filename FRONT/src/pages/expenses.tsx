import { useEffect, useState } from 'react'
import { expenseAPI, ExpenseResponse, ExpenseRequest } from '../api/expenses'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import './expenses.css'

export default function Expenses() {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<ExpenseRequest | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchExpenses()
  }, [page])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await expenseAPI.list(page, 10)
      setExpenses(response.data.data.content)
      setTotalPages(response.data.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch expenses', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (data: ExpenseRequest) => {
    try {
      await expenseAPI.create(data)
      setShowForm(false)
      setPage(0)
      fetchExpenses()
    } catch (error) {
      console.error('Failed to create expense', error)
      throw error
    }
  }

  const handleUpdateExpense = async (data: ExpenseRequest) => {
    if (!editingId) return
    try {
      await expenseAPI.update(editingId, data)
      setEditingId(null)
      setEditData(null)
      fetchExpenses()
    } catch (error) {
      console.error('Failed to update expense', error)
      throw error
    }
  }

  const handleDeleteExpense = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    try {
      await expenseAPI.delete(id)
      fetchExpenses()
    } catch (error) {
      console.error('Failed to delete expense', error)
    }
  }

  const handleEdit = (expense: ExpenseResponse) => {
    setEditingId(expense.id)
    setEditData({
      amount: expense.amount,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      expenseDate: expense.expenseDate,
      description: expense.description,
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setEditData(null)
  }

  return (
    <div className="container mt-4">
      <div className="page-header flex-between">
        <div>
          <h1>Expenses</h1>
          <p className="text-secondary">Track and manage your daily expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <ExpenseForm
            initialData={editData}
            onSubmit={editingId ? handleUpdateExpense : handleAddExpense}
            onCancel={handleCancel}
            isEditing={!!editingId}
          />
        </div>
      )}

      {loading ? (
        <div className="card">
          <p className="text-secondary">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="card text-center">
          <p className="text-secondary mt-4 mb-4">No expenses recorded yet</p>
        </div>
      ) : (
        <>
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDeleteExpense}
          />

          {totalPages > 1 && (
            <div className="pagination mt-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="btn btn-secondary"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
