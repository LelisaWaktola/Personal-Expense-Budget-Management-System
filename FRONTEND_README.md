# Expense Tracker Frontend

A modern, responsive React + TypeScript frontend for the Personal Expense & Budget Management System.

## Features

- **User Authentication**: Secure login and registration
- **Dashboard**: Real-time overview of spending and budgets
- **Expense Management**: Create, edit, and delete expenses with categories
- **Budget Management**: Set and monitor monthly budget limits
- **Alerts**: Real-time notifications for budget thresholds
- **Reports & Analytics**: Detailed spending insights and trends
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **CSS3** - Styling with CSS variables

## Project Structure

```
src/
├── api/                    # API client services
│   ├── auth.ts
│   ├── expenses.ts
│   ├── budgets.ts
│   ├── alerts.ts
│   └── reports.ts
├── components/             # Reusable components
│   ├── Layout.tsx         # Main layout with sidebar
│   ├── ExpenseForm.tsx
│   ├── ExpenseList.tsx
│   ├── BudgetForm.tsx
│   └── BudgetCard.tsx
├── pages/                  # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Expenses.tsx
│   ├── Budgets.tsx
│   └── Reports.tsx
├── store/                  # State management
│   └── authStore.ts       # Authentication state
├── App.tsx                # Main app component with routing
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Spring Boot backend running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Configuration

The API base URL is configured in `src/api/client.ts`:
```typescript
const API_BASE_URL = '/api'
```

The frontend uses Vite's proxy to forward `/api` requests to the Spring Boot backend at `http://localhost:8080`. This is configured in `vite.config.ts`.

If your backend is running on a different URL, update:
- `vite.config.ts` - Change the proxy target
- `src/api/client.ts` - Update API_BASE_URL if not using proxy

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## API Integration

### Authentication Flow

1. User registers or logs in
2. Backend returns JWT token and user info
3. Token stored in localStorage
4. Token automatically included in all API requests via axios interceptor
5. If token expires (401), user is redirected to login

### Request/Response Format

All API responses follow a standard format:

```json
{
  "success": true,
  "message": "Success",
  "data": { /* response data */ }
}
```

### Error Handling

- Network errors and validation errors are displayed to users
- 401 responses trigger automatic logout
- Global exception handler in axios client

## State Management

The app uses Zustand for state management. Currently manages:

- **Auth State** (`useAuthStore`):
  - User information
  - JWT token
  - Authentication status
  - Login/logout actions

Example usage:
```typescript
const { user, login, logout, isAuthenticated } = useAuthStore()
```

## Styling

The app uses CSS modules with a consistent color system defined in `src/index.css`:

- **Colors**: Primary, secondary, accent, success, warning, error
- **Spacing**: 8px base unit
- **Typography**: Clean sans-serif with proper hierarchy
- **Responsive**: Mobile-first design with breakpoints at 480px, 768px, 1024px

### CSS Classes

Common utility classes available:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.card`, `.card-hover`
- `.grid`, `.grid-2`, `.grid-3`
- `.form-group`
- `.alert`, `.alert-success`, `.alert-error`, `.alert-warning`
- `.badge`, `.badge-primary`, `.badge-success`

## Features in Detail

### Dashboard
- Shows summary of total spending
- Displays active budgets with progress bars
- Shows unacknowledged alerts
- Quick overview of financial status

### Expenses
- Paginated list of all expenses
- Filter by date range and category
- Create/edit/delete expenses
- Soft delete support on backend
- Categories: Food, Transportation, Utilities, Entertainment, Healthcare, Shopping, Education, Insurance, Rent, Other

### Budgets
- Create monthly budgets per category
- Visual progress indicators
- Spent vs. remaining amount
- Manual alert checking
- Status indicators (OK, Warning, Exceeded)

### Reports & Analytics
- Monthly spending summary
- Spending by category with percentages
- Custom date range reports
- Transaction list view
- Visual category breakdown

### Alerts
- Auto-generated at 80% budget threshold
- Auto-generated when budget exceeded
- Acknowledge/dismiss alerts
- Alert history view

## Customization

### Adding New Pages

1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`

### Styling Components

Follow the existing pattern:
1. Component file (e.g., `MyComponent.tsx`)
2. Matching CSS file (e.g., `MyComponent.css`)
3. Use CSS variables for colors and spacing

### API Changes

If backend API changes:
1. Update types in `src/api/*.ts`
2. Update request/response handling
3. Update UI to handle new data

## Troubleshooting

### Backend Connection Issues
- Ensure Spring Boot is running on `http://localhost:8080`
- Check CORS configuration in backend
- Check browser console for network errors

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check if JWT token is expired
- Verify backend auth endpoints are working

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Delete `dist` folder: `rm -rf dist`
- Run `npm run build` again

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of routes
- Memoized components for expensive renders
- Optimized CSS with variables
- Gzip compression in production build

## Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- CORS configured in backend
- Input validation on frontend and backend
- Automatic logout on 401 unauthorized
- Secure password fields with validation

## Future Enhancements

- Add offline support with service workers
- Implement expense categories customization
- Add recurring expense support
- Add expense export (CSV, PDF)
- Add dark mode
- Add push notifications
- Add transaction search
- Add spending goals
- Add multi-currency support

## License

This project is part of the Personal Expense & Budget Management System.
