import { useEffect, useState } from 'react'
import { reportAPI } from '../api/reports'
import './reports.css'

interface MonthlyReport {
  month: string
  totalSpent: number
  expenseCount: number
  categoryBreakdown: { [key: string]: number }
  expenses: any[]
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

export default function Reports() {
  const [reportType, setReportType] = useState<'monthly' | 'category' | 'daterange'>('monthly')
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [category, setCategory] = useState('FOOD')
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      let response
      if (reportType === 'monthly') {
        response = await reportAPI.getMonthly(month)
      } else if (reportType === 'category') {
        response = await reportAPI.getByCategory(category)
      } else {
        response = await reportAPI.getByDateRange(startDate, endDate)
      }
      setReport(response.data.data)
    } catch (error) {
      console.error('Failed to fetch report', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReportTypeChange = (type: 'monthly' | 'category' | 'daterange') => {
    setReportType(type)
  }

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
    <div className="container mt-4">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p className="text-secondary">View detailed spending insights and analytics</p>
      </div>

      <div className="card mb-4">
        <div className="report-tabs">
          <button
            className={`report-tab ${reportType === 'monthly' ? 'active' : ''}`}
            onClick={() => handleReportTypeChange('monthly')}
          >
            Monthly Report
          </button>
          <button
            className={`report-tab ${reportType === 'category' ? 'active' : ''}`}
            onClick={() => handleReportTypeChange('category')}
          >
            By Category
          </button>
          <button
            className={`report-tab ${reportType === 'daterange' ? 'active' : ''}`}
            onClick={() => handleReportTypeChange('daterange')}
          >
            Date Range
          </button>
        </div>

        <div className="report-filters mt-3">
          {reportType === 'monthly' && (
            <div className="filter-group">
              <label>Month</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          )}

          {reportType === 'category' && (
            <div className="filter-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'daterange' && (
            <div className="filter-group-row">
              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            onClick={fetchReport}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <p className="text-secondary">Generating report...</p>
        </div>
      ) : report ? (
        <>
          <div className="grid grid-2 mb-4">
            <div className="card">
              <div className="stat-box">
                <div className="stat-label">Total Spent</div>
                <div className="stat-value">${report.totalSpent.toFixed(2)}</div>
              </div>
            </div>

            <div className="card">
              <div className="stat-box">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{report.expenseCount}</div>
              </div>
            </div>
          </div>

          {report.categoryBreakdown && Object.keys(report.categoryBreakdown).length > 0 && (
            <div className="card mb-4">
              <h3>Spending by Category</h3>
              <div className="category-breakdown mt-3">
                {Object.entries(report.categoryBreakdown).map(
                  ([cat, amount]: [string, any]) => {
                    const percentage = (amount / report.totalSpent) * 100
                    return (
                      <div key={cat} className="category-row">
                        <div className="category-info">
                          <span
                            className="category-dot"
                            style={{ backgroundColor: getCategoryColor(cat) }}
                          />
                          <span className="category-name">{cat.replace('_', ' ')}</span>
                        </div>
                        <div className="category-stats">
                          <span className="category-amount">${amount.toFixed(2)}</span>
                          <span className="category-percentage">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          )}

          {report.expenses && report.expenses.length > 0 && (
            <div className="card">
              <h3>Transactions</h3>
              <div className="expense-list mt-3">
                {report.expenses.map((exp: any, idx: number) => (
                  <div key={idx} className="expense-item">
                    <div className="expense-info">
                      <div className="expense-category">
                        <span
                          className="category-dot"
                          style={{ backgroundColor: getCategoryColor(exp.category) }}
                        />
                        <div>
                          <div className="expense-desc">{exp.description}</div>
                          <small className="text-secondary">
                            {new Date(exp.expenseDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="expense-amount">${exp.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
