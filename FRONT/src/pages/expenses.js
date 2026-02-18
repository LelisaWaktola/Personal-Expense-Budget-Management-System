import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { expenseAPI } from '../api/expenses';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import './expenses.css';
export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    useEffect(() => {
        fetchExpenses();
    }, [page]);
    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const response = await expenseAPI.list(page, 10);
            setExpenses(response.data.data.content);
            setTotalPages(response.data.data.totalPages);
        }
        catch (error) {
            console.error('Failed to fetch expenses', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddExpense = async (data) => {
        try {
            await expenseAPI.create(data);
            setShowForm(false);
            setPage(0);
            fetchExpenses();
        }
        catch (error) {
            console.error('Failed to create expense', error);
            throw error;
        }
    };
    const handleUpdateExpense = async (data) => {
        if (!editingId)
            return;
        try {
            await expenseAPI.update(editingId, data);
            setEditingId(null);
            setEditData(null);
            fetchExpenses();
        }
        catch (error) {
            console.error('Failed to update expense', error);
            throw error;
        }
    };
    const handleDeleteExpense = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?'))
            return;
        try {
            await expenseAPI.delete(id);
            fetchExpenses();
        }
        catch (error) {
            console.error('Failed to delete expense', error);
        }
    };
    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setEditData({
            amount: expense.amount,
            category: expense.category,
            paymentMethod: expense.paymentMethod,
            expenseDate: expense.expenseDate,
            description: expense.description,
        });
        setShowForm(true);
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setEditData(null);
    };
    return (_jsxs("div", { className: "container mt-4", children: [_jsxs("div", { className: "page-header flex-between", children: [_jsxs("div", { children: [_jsx("h1", { children: "Expenses" }), _jsx("p", { className: "text-secondary", children: "Track and manage your daily expenses" })] }), _jsx("button", { onClick: () => setShowForm(!showForm), className: "btn btn-primary", children: showForm ? 'Cancel' : '+ Add Expense' })] }), showForm && (_jsx("div", { className: "card mb-4", children: _jsx(ExpenseForm, { initialData: editData, onSubmit: editingId ? handleUpdateExpense : handleAddExpense, onCancel: handleCancel, isEditing: !!editingId }) })), loading ? (_jsx("div", { className: "card", children: _jsx("p", { className: "text-secondary", children: "Loading expenses..." }) })) : expenses.length === 0 ? (_jsx("div", { className: "card text-center", children: _jsx("p", { className: "text-secondary mt-4 mb-4", children: "No expenses recorded yet" }) })) : (_jsxs(_Fragment, { children: [_jsx(ExpenseList, { expenses: expenses, onEdit: handleEdit, onDelete: handleDeleteExpense }), totalPages > 1 && (_jsxs("div", { className: "pagination mt-4", children: [_jsx("button", { onClick: () => setPage(Math.max(0, page - 1)), disabled: page === 0, className: "btn btn-secondary", children: "Previous" }), _jsxs("span", { className: "pagination-info", children: ["Page ", page + 1, " of ", totalPages] }), _jsx("button", { onClick: () => setPage(Math.min(totalPages - 1, page + 1)), disabled: page >= totalPages - 1, className: "btn btn-secondary", children: "Next" })] }))] }))] }));
}
