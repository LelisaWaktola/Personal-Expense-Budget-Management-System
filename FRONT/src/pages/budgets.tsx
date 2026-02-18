import { useEffect, useState } from 'react'
import { budgetAPI, BudgetResponse, BudgetRequest } from '../api/budgets'
import BudgetForm from '../components/BudgetForm'
import BudgetCard from '../components/BudgetCard'
import './budgets.css'

export default function Budgets() {
  const [budgets, setBudgets] = useState<BudgetResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<BudgetRequest | null>(null)

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const response = await budgetAPI.list()
      setBudgets(response.data.data)
    } catch (error) {
      console.error('Failed to fetch budgets', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBudget = async (data: BudgetRequest) => {
    try {
      await budgetAPI.create(data)
      setShowForm(false)
      fetchBudgets()
    } catch (error) {
      console.error('Failed to create budget', error)
      throw error
    }
  }

  const handleUpdateBudget = async (data: BudgetRequest) => {
    if (!editingId) return
    try {
      await budgetAPI.update(editingId, data)
      setEditingId(null)
      setEditData(null)
      fetchBudgets()
    } catch (error) {
      console.error('Failed to update budget', error)
      throw error
    }
  }

  const handleDeleteBudget = async (id: number) => {
    if (!confirm('Are you sure you want to delete this budget?')) return
    try {
      await budgetAPI.delete(id)
      fetchBudgets()
    } catch (error) {
      console.error('Failed to delete budget', error)
    }
  }

  const handleCheckAlerts = async (id: number) => {
    try {
      await budgetAPI.checkAlerts(id)
      fetchBudgets()
    } catch (error) {
      console.error('Failed to check alerts', error)
    }
  }

  const handleEdit = (budget: BudgetResponse) => {
    setEditingId(budget.id)
    setEditData({
      category: budget.category,
      limitAmount: budget.limitAmount,
      month: budget.month,
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
          <h1>Budgets</h1>
          <p className="text-secondary">Set and monitor your monthly spending limits</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Create Budget'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <BudgetForm
            initialData={editData}
            onSubmit={editingId ? handleUpdateBudget : handleAddBudget}
            onCancel={handleCancel}
            isEditing={!!editingId}
          />
        </div>
      )}

      {loading ? (
        <div className="card">
          <p className="text-secondary">Loading budgets...</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="card text-center">
          <p className="text-secondary mt-4 mb-4">No budgets created yet</p>
          <p className="text-secondary">Create your first budget to start tracking spending limits</p>
        </div>
      ) : (
        <div className="budgets-grid">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={handleDeleteBudget}
              onCheckAlerts={handleCheckAlerts}
            />
          ))}
        </div>
      )}
    </div>
  )
}
