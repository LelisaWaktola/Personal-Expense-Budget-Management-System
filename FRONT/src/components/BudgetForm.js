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
export default function BudgetForm({ initialData, onSubmit, onCancel, isEditing, }) {
    const [data, setData] = useState(initialData || {
        category: 'FOOD',
        limitAmount: 0,
        month: new Date().toISOString().slice(0, 7),
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: name === 'limitAmount' ? parseFloat(value) : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (data.limitAmount <= 0) {
                throw new Error('Budget limit must be greater than 0');
            }
            await onSubmit(data);
        }
        catch (err) {
            setError(err.message || 'Failed to save budget');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, children: [error && _jsx("div", { className: "alert alert-error mb-3", children: error }), _jsxs("div", { className: "grid grid-2 gap-3", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsx("select", { name: "category", value: data.category, onChange: handleChange, children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat.replace('_', ' ') }, cat))) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Budget Limit" }), _jsx("input", { type: "number", name: "limitAmount", value: data.limitAmount, onChange: handleChange, placeholder: "0.00", step: "0.01", min: "0.01", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Month" }), _jsx("input", { type: "month", name: "month", value: data.month, onChange: handleChange, required: true, disabled: isEditing })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { type: "submit", className: "btn btn-primary", disabled: loading, children: [loading ? 'Saving...' : isEditing ? 'Update' : 'Create', " Budget"] }), _jsx("button", { type: "button", onClick: onCancel, className: "btn btn-secondary", disabled: loading, children: "Cancel" })] })] }));
}
