import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './ExpenseList.css';
export default function ExpenseList({ expenses, onEdit, onDelete, }) {
    const getCategoryColor = (category) => {
        const colors = {
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
        };
        return colors[category] || '#64748b';
    };
    return (_jsx("div", { className: "expenses-table", children: _jsx("div", { className: "table-wrapper", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Date" }), _jsx("th", { children: "Category" }), _jsx("th", { children: "Description" }), _jsx("th", { children: "Amount" }), _jsx("th", { children: "Method" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: expenses.map((expense) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("span", { className: "text-nowrap", children: new Date(expense.expenseDate).toLocaleDateString() }) }), _jsx("td", { children: _jsx("span", { className: "category-badge", style: {
                                            backgroundColor: `${getCategoryColor(expense.category)}20`,
                                            color: getCategoryColor(expense.category),
                                        }, children: expense.category.replace('_', ' ') }) }), _jsx("td", { className: "description-cell", children: expense.description }), _jsx("td", { className: "amount-cell", children: _jsxs("strong", { children: ["$", expense.amount.toFixed(2)] }) }), _jsx("td", { children: _jsx("small", { children: expense.paymentMethod.replace('_', ' ') }) }), _jsx("td", { children: _jsxs("div", { className: "action-buttons", children: [_jsx("button", { onClick: () => onEdit(expense), className: "btn btn-sm btn-secondary", children: "Edit" }), _jsx("button", { onClick: () => onDelete(expense.id), className: "btn btn-sm btn-danger", children: "Delete" })] }) })] }, expense.id))) })] }) }) }));
}
