import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { reportAPI } from '../api/reports';
import './reports.css';
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
export default function Reports() {
    const [reportType, setReportType] = useState('monthly');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [category, setCategory] = useState('FOOD');
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchReport();
    }, []);
    const fetchReport = async () => {
        setLoading(true);
        try {
            let response;
            if (reportType === 'monthly') {
                response = await reportAPI.getMonthly(month);
            }
            else if (reportType === 'category') {
                response = await reportAPI.getByCategory(category);
            }
            else {
                response = await reportAPI.getByDateRange(startDate, endDate);
            }
            setReport(response.data.data);
        }
        catch (error) {
            console.error('Failed to fetch report', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleReportTypeChange = (type) => {
        setReportType(type);
    };
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
    return (_jsxs("div", { className: "container mt-4", children: [_jsxs("div", { className: "page-header", children: [_jsx("h1", { children: "Reports & Analytics" }), _jsx("p", { className: "text-secondary", children: "View detailed spending insights and analytics" })] }), _jsxs("div", { className: "card mb-4", children: [_jsxs("div", { className: "report-tabs", children: [_jsx("button", { className: `report-tab ${reportType === 'monthly' ? 'active' : ''}`, onClick: () => handleReportTypeChange('monthly'), children: "Monthly Report" }), _jsx("button", { className: `report-tab ${reportType === 'category' ? 'active' : ''}`, onClick: () => handleReportTypeChange('category'), children: "By Category" }), _jsx("button", { className: `report-tab ${reportType === 'daterange' ? 'active' : ''}`, onClick: () => handleReportTypeChange('daterange'), children: "Date Range" })] }), _jsxs("div", { className: "report-filters mt-3", children: [reportType === 'monthly' && (_jsxs("div", { className: "filter-group", children: [_jsx("label", { children: "Month" }), _jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value) })] })), reportType === 'category' && (_jsxs("div", { className: "filter-group", children: [_jsx("label", { children: "Category" }), _jsx("select", { value: category, onChange: (e) => setCategory(e.target.value), children: CATEGORIES.map((cat) => (_jsx("option", { value: cat, children: cat.replace('_', ' ') }, cat))) })] })), reportType === 'daterange' && (_jsxs("div", { className: "filter-group-row", children: [_jsxs("div", { className: "filter-group", children: [_jsx("label", { children: "Start Date" }), _jsx("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value) })] }), _jsxs("div", { className: "filter-group", children: [_jsx("label", { children: "End Date" }), _jsx("input", { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value) })] })] })), _jsx("button", { onClick: fetchReport, className: "btn btn-primary", disabled: loading, children: loading ? 'Loading...' : 'Generate Report' })] })] }), loading ? (_jsx("div", { className: "card", children: _jsx("p", { className: "text-secondary", children: "Generating report..." }) })) : report ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-2 mb-4", children: [_jsx("div", { className: "card", children: _jsxs("div", { className: "stat-box", children: [_jsx("div", { className: "stat-label", children: "Total Spent" }), _jsxs("div", { className: "stat-value", children: ["$", report.totalSpent.toFixed(2)] })] }) }), _jsx("div", { className: "card", children: _jsxs("div", { className: "stat-box", children: [_jsx("div", { className: "stat-label", children: "Transactions" }), _jsx("div", { className: "stat-value", children: report.expenseCount })] }) })] }), report.categoryBreakdown && Object.keys(report.categoryBreakdown).length > 0 && (_jsxs("div", { className: "card mb-4", children: [_jsx("h3", { children: "Spending by Category" }), _jsx("div", { className: "category-breakdown mt-3", children: Object.entries(report.categoryBreakdown).map(([cat, amount]) => {
                                    const percentage = (amount / report.totalSpent) * 100;
                                    return (_jsxs("div", { className: "category-row", children: [_jsxs("div", { className: "category-info", children: [_jsx("span", { className: "category-dot", style: { backgroundColor: getCategoryColor(cat) } }), _jsx("span", { className: "category-name", children: cat.replace('_', ' ') })] }), _jsxs("div", { className: "category-stats", children: [_jsxs("span", { className: "category-amount", children: ["$", amount.toFixed(2)] }), _jsxs("span", { className: "category-percentage", children: [percentage.toFixed(1), "%"] })] })] }, cat));
                                }) })] })), report.expenses && report.expenses.length > 0 && (_jsxs("div", { className: "card", children: [_jsx("h3", { children: "Transactions" }), _jsx("div", { className: "expense-list mt-3", children: report.expenses.map((exp, idx) => (_jsxs("div", { className: "expense-item", children: [_jsx("div", { className: "expense-info", children: _jsxs("div", { className: "expense-category", children: [_jsx("span", { className: "category-dot", style: { backgroundColor: getCategoryColor(exp.category) } }), _jsxs("div", { children: [_jsx("div", { className: "expense-desc", children: exp.description }), _jsx("small", { className: "text-secondary", children: new Date(exp.expenseDate).toLocaleDateString() })] })] }) }), _jsxs("div", { className: "expense-amount", children: ["$", exp.amount.toFixed(2)] })] }, idx))) })] }))] })) : null] }));
}
