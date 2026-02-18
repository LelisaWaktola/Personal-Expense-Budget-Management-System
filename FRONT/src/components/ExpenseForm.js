import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
];
const PAYMENT_METHODS = [
    'CASH',
    'DEBIT_CARD',
    'CREDIT_CARD',
    'MOBILE_WALLET',
    'BANK_TRANSFER',
    'OTHER',
];
export default function ExpenseForm({ initialData, onSubmit, onCancel, isEditing, }) {
    const [data, setData] = useState(initialData || {
        amount: 0,
        category: 'FOOD',
        paymentMethod: 'CASH',
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (data.amount <= 0) {
                throw new Error('Amount must be greater than 0');
            }
            if (!data.description.trim()) {
                throw new Error('Description is required');
            }
            await onSubmit(data);
        }
        catch (err) {
            setError(err.message || 'Failed to save expense');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [error && _jsx("div", { className: "alert alert-error mb-3", children: error }), _jsxs("div", { className: "grid grid-2 gap-3", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Amount" }), _jsx("input", { type: "number", name: "amount", value: data.amount, onChange: handleChange, placeholder: "0.00", step: "0.01", min: "0.01", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Date" }), _jsx("input", { type: "date", name: "expenseDate", value: data.expenseDate, onChange: handleChange, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsx("select", { name: "category", value: data.category, onChange: handleChange, children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat.replace('_', ' ') }, cat))) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Payment Method" }), _jsx("select", { name: "paymentMethod", value: data.paymentMethod, onChange: handleChange, children: PAYMENT_METHODS.map((method) => (_jsx("option", { value: method, children: method.replace('_', ' ') }, method))) })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Description" }), _jsx("textarea", { name: "description", value: data.description, onChange: handleChange, placeholder: "What was this expense for?", rows: 3, required: true })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "submit", className: "btn btn-primary", disabled: loading, children: [loading ? 'Saving...' : isEditing ? 'Update' : 'Add', " Expense"] }), _jsx("button", { type: "button", onClick: onCancel, className: "btn btn-secondary", disabled: loading, children: "Cancel" })] })] }));
}
