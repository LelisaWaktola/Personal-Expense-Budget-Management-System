import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { budgetAPI } from '../api/budgets';
import BudgetForm from '../components/BudgetForm';
import BudgetCard from '../components/BudgetCard';
import './budgets.css';
export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    useEffect(() => {
        fetchBudgets();
    }, []);
    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const response = await budgetAPI.list();
            setBudgets(response.data.data);
        }
        catch (error) {
            console.error('Failed to fetch budgets', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddBudget = async (data) => {
        try {
            await budgetAPI.create(data);
            setShowForm(false);
            fetchBudgets();
        }
        catch (error) {
            console.error('Failed to create budget', error);
            throw error;
        }
    };
    const handleUpdateBudget = async (data) => {
        if (!editingId)
            return;
        try {
            await budgetAPI.update(editingId, data);
            setEditingId(null);
            setEditData(null);
            fetchBudgets();
        }
        catch (error) {
            console.error('Failed to update budget', error);
            throw error;
        }
    };
    const handleDeleteBudget = async (id) => {
        if (!confirm('Are you sure you want to delete this budget?'))
            return;
        try {
            await budgetAPI.delete(id);
            fetchBudgets();
        }
        catch (error) {
            console.error('Failed to delete budget', error);
        }
    };
    const handleCheckAlerts = async (id) => {
        try {
            await budgetAPI.checkAlerts(id);
            fetchBudgets();
        }
        catch (error) {
            console.error('Failed to check alerts', error);
        }
    };
    const handleEdit = (budget) => {
        setEditingId(budget.id);
        setEditData({
            category: budget.category,
            limitAmount: budget.limitAmount,
            month: budget.month,
        });
        setShowForm(true);
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setEditData(null);
    };
    return (_jsxs("div", { className: "container mt-4", children: [_jsxs("div", { className: "page-header flex-between", children: [_jsxs("div", { children: [_jsx("h1", { children: "Budgets" }), _jsx("p", { className: "text-secondary", children: "Set and monitor your monthly spending limits" })] }), _jsx("button", { onClick: () => setShowForm(!showForm), className: "btn btn-primary", children: showForm ? 'Cancel' : '+ Create Budget' })] }), showForm && (_jsx("div", { className: "card mb-4", children: _jsx(BudgetForm, { initialData: editData, onSubmit: editingId ? handleUpdateBudget : handleAddBudget, onCancel: handleCancel, isEditing: !!editingId }) })), loading ? (_jsx("div", { className: "card", children: _jsx("p", { className: "text-secondary", children: "Loading budgets..." }) })) : budgets.length === 0 ? (_jsxs("div", { className: "card text-center", children: [_jsx("p", { className: "text-secondary mt-4 mb-4", children: "No budgets created yet" }), _jsx("p", { className: "text-secondary", children: "Create your first budget to start tracking spending limits" })] })) : (_jsx("div", { className: "budgets-grid", children: budgets.map((budget) => (_jsx(BudgetCard, { budget: budget, onEdit: handleEdit, onDelete: handleDeleteBudget, onCheckAlerts: handleCheckAlerts }, budget.id))) }))] }));
}
