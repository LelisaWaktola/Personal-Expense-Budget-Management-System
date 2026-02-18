import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import './auth.css';
export default function Register() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authAPI.register(formData);
            const { data: user, accessToken } = response.data.data;
            login(user, accessToken);
            navigate('/');
        }
        catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-card", children: [_jsx("h1", { children: "Expense Tracker" }), _jsx("p", { className: "auth-subtitle", children: "Create your account" }), error && _jsx("div", { className: "alert alert-error", children: error }), _jsxs("form", { onSubmit: handleSubmit, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "First Name" }), _jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, placeholder: "John", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Last Name" }), _jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, placeholder: "Doe", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "your@email.com", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", minLength: 6, required: true }), _jsx("small", { children: "At least 6 characters" })] }), _jsx("button", { type: "submit", className: "btn btn-primary", disabled: loading, style: { width: '100%' }, children: loading ? 'Creating account...' : 'Create account' })] }), _jsxs("p", { className: "auth-footer", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "auth-link", children: "Sign in" })] })] }) }));
}
