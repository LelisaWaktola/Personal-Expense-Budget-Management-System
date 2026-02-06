# System Architecture

Personal Expense & Budget Management System - Complete Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript Frontend (Port 5173)          │  │
│  │  ├─ Pages (Login, Dashboard, Expenses, etc.)        │  │
│  │  ├─ Components (Forms, Lists, Cards)                │  │
│  │  ├─ State Management (Zustand)                      │  │
│  │  └─ HTTP Client (Axios)                            │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP/REST (JSON)
                   │ JWT Authentication
                   ▼
┌─────────────────────────────────────────────────────────────┐
│         Spring Boot Backend API (Port 8080)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers                                         │  │
│  │  ├─ AuthController (/auth/login, /auth/register)   │  │
│  │  ├─ ExpenseController (/expenses/*)                │  │
│  │  ├─ BudgetController (/budgets/*)                  │  │
│  │  ├─ AlertController (/alerts/*)                    │  │
│  │  └─ ReportController (/reports/*)                  │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │  Services                                            │  │
│  │  ├─ AuthService (JWT, registration)                │  │
│  │  ├─ ExpenseService (CRUD, filtering)               │  │
│  │  ├─ BudgetService (Budget logic, alerts)           │  │
│  │  ├─ AlertService (Alert management)                │  │
│  │  └─ ReportService (Analytics, aggregation)         │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │  Repositories (JPA/Spring Data)                      │  │
│  │  ├─ UserRepository                                  │  │
│  │  ├─ ExpenseRepository (with custom queries)         │  │
│  │  ├─ BudgetRepository                                │  │
│  │  └─ AlertRepository                                 │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │ JPA/Hibernate ORM                   │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │  Entities (JPA)                                      │  │
│  │  ├─ User (with relationships)                       │  │
│  │  ├─ Expense (soft delete support)                   │  │
│  │  ├─ Budget (monthly tracking)                       │  │
│  │  └─ Alert (notification system)                     │  │
│  └────────────────────┬────────────────────────────────┘  │
│                       │                                      │
│  ┌────────────────────▼────────────────────────────────┐  │
│  │  Security                                            │  │
│  │  ├─ JwtTokenProvider (Token generation/validation)  │  │
│  │  ├─ JwtAuthenticationFilter (Request filtering)     │  │
│  │  ├─ JwtAuthenticationEntryPoint (Error handling)    │  │
│  │  └─ SecurityConfig (Spring Security setup)          │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────┘
                   │ SQL
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL Database                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables                                              │  │
│  │  ├─ users (user accounts)                           │  │
│  │  ├─ expenses (with soft delete, indexes)            │  │
│  │  ├─ budgets (monthly limits per category)           │  │
│  │  └─ alerts (notifications)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (React)

### Component Hierarchy

```
App (routing)
├─ Public Routes
│  ├─ Login
│  └─ Register
│
└─ Protected Routes (Layout)
   ├─ Dashboard
   ├─ Expenses
   │  ├─ ExpenseForm
   │  └─ ExpenseList
   ├─ Budgets
   │  ├─ BudgetForm
   │  └─ BudgetCard
   └─ Reports
```

### State Management (Zustand)

```
useAuthStore
├─ user: User | null
├─ token: string | null
├─ isAuthenticated: boolean
├─ login(user, token)
├─ logout()
└─ initialize() [from localStorage]
```

### API Client Structure

```
src/api/
├─ client.ts (Axios instance with JWT interceptor)
├─ auth.ts (login, register)
├─ expenses.ts (CRUD + queries)
├─ budgets.ts (CRUD + alerts)
├─ alerts.ts (manage alerts)
└─ reports.ts (analytics)
```

## Backend Architecture (Spring Boot)

### Layer Structure

```
Controller Layer
    ↓ (DTOs)
Service Layer
    ↓ (Entities)
Repository Layer
    ↓ (SQL)
Database Layer
```

### Data Flow Example: Create Expense

1. **Frontend**: User fills ExpenseForm → `expenseAPI.create(data)`
2. **Network**: Axios sends POST to `/api/expenses` with JWT token
3. **Controller**: `ExpenseController.createExpense()` receives request
4. **Service**: `ExpenseService.createExpense()` validates and processes
5. **Repository**: `ExpenseRepository.save()` persists to database
6. **Response**: Returns `ExpenseResponse` DTO with created expense
7. **Frontend**: Response handled, UI updated

### Entity Relationships

```
User (1) ──┬─→ (Many) Expense
           ├─→ (Many) Budget
           └─→ (Many) Alert

Budget (1) ──→ (Many) Alert

Expense (Many) ─→ (1) User
Budget (Many) ─→ (1) User
Alert (Many) ──→ (1) User
Alert (Many) ──→ (1) Budget
```

## Authentication Flow

### Registration
```
1. User submits registration form
2. Frontend: POST /api/auth/register with email, password, name
3. Backend:
   - Validate email not in use
   - Hash password with BCrypt
   - Create User entity
   - Generate JWT token
4. Return user + token
5. Frontend stores token + user in localStorage
6. Navigate to dashboard
```

### Login
```
1. User submits login form
2. Frontend: POST /api/auth/login with email, password
3. Backend:
   - Find user by email
   - Spring Security authenticates password
   - Generate JWT token
4. Return user + token
5. Frontend stores in localStorage
6. Navigate to dashboard
```

### Request Authentication
```
1. Frontend makes API request
2. Axios interceptor adds: Authorization: Bearer {token}
3. Backend:
   - JwtAuthenticationFilter extracts token
   - JwtTokenProvider validates signature
   - Extract userId from token
   - Load user via CustomUserDetailsService
   - Add to SecurityContext
4. Request processed with user context
5. Response returned
```

### Token Expiration
```
1. JWT expires (after 24 hours)
2. Frontend makes request with expired token
3. Backend returns 401 Unauthorized
4. Axios interceptor catches 401
5. Clear localStorage
6. Redirect to login
```

## Database Schema

### Users Table
```sql
id (PK)
email (UNIQUE)
password (hashed)
first_name
last_name
created_at
updated_at
```

### Expenses Table
```sql
id (PK)
user_id (FK)
amount (DECIMAL)
category (ENUM)
payment_method (ENUM)
expense_date (DATE)
description
created_at
updated_at
deleted_at (soft delete)

Indexes:
- user_id
- expense_date
- category
- (user_id, expense_date)
```

### Budgets Table
```sql
id (PK)
user_id (FK)
category (ENUM)
limit_amount (DECIMAL)
month (YYYY-MM)
created_at
updated_at

Unique Constraint:
- (user_id, category, month)
```

### Alerts Table
```sql
id (PK)
user_id (FK)
budget_id (FK)
alert_type (ENUM: BUDGET_80_PERCENT, BUDGET_EXCEEDED)
message
created_at
acknowledged_at

Indexes:
- user_id
- budget_id
- alert_type
```

## API Endpoints Overview

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/login            - Login user
```

### Expenses
```
GET    /api/expenses              - List expenses (paginated)
POST   /api/expenses              - Create expense
GET    /api/expenses/{id}         - Get expense
PUT    /api/expenses/{id}         - Update expense
DELETE /api/expenses/{id}         - Delete expense
GET    /api/expenses/date-range   - Filter by date
GET    /api/expenses/category/{cat} - Filter by category
```

### Budgets
```
GET    /api/budgets               - List all budgets
POST   /api/budgets               - Create budget
GET    /api/budgets/{id}          - Get budget
PUT    /api/budgets/{id}          - Update budget
DELETE /api/budgets/{id}          - Delete budget
GET    /api/budgets/month/{month} - Get by month
POST   /api/budgets/{id}/check-alerts - Trigger alert check
```

### Alerts
```
GET    /api/alerts                - List all alerts
GET    /api/alerts/unacknowledged - Get new alerts
POST   /api/alerts/{id}/acknowledge - Mark as read
DELETE /api/alerts/{id}           - Delete alert
```

### Reports
```
GET    /api/reports/monthly/{month} - Monthly report
GET    /api/reports/category/{cat}  - Category report
GET    /api/reports/date-range      - Date range report
```

## Security Architecture

### Spring Security Setup
```
1. Request arrives
2. JwtAuthenticationFilter intercepts
3. Extract JWT from Authorization header
4. JwtTokenProvider validates token
5. Load user from database
6. Set in SecurityContext
7. Request processes with authenticated user
```

### JWT Structure
```
Header.Payload.Signature

Payload contains:
- sub: userId
- iat: issued at
- exp: expiration time
- Signed with HS512 algorithm
```

### Password Security
```
1. User password submitted
2. BCryptPasswordEncoder hashes with salt
3. Hashed password stored in database
4. On login, compare hashes (not plain text)
```

## Scalability Considerations

### Frontend
- Code splitting with React Router
- Lazy loading of components
- Image optimization
- Caching strategies

### Backend
- Database connection pooling
- Query optimization with indexes
- Pagination for large datasets
- Caching for reports
- Async processing for alerts

### Database
- Indexes on frequently queried columns
- Partitioning by date for large expense tables
- Archive old data to separate storage

## Deployment Architecture

### Development
```
Frontend: http://localhost:5173 (Vite dev server)
Backend: http://localhost:8080 (Spring Boot)
Database: localhost:5432 (PostgreSQL)
```

### Production
```
Frontend: Static files on CDN/Web server
Backend: Spring Boot on container/server
Database: Managed PostgreSQL service
Reverse proxy: Nginx/Apache (optional)
```

## Error Handling

### Frontend
```
try/catch in components
API error responses displayed to user
401 errors trigger logout
Network errors show user feedback
```

### Backend
```
Global ExceptionHandler catches all exceptions
Custom exceptions for business logic errors
401 for authentication failures
403 for authorization failures
400 for validation errors
500 for server errors
All responses include error message
```

## Performance Optimizations

### Frontend
- Memoization of expensive components
- Lazy loading of routes
- CSS variables instead of inline styles
- Gzip compression
- Minified production build

### Backend
- Connection pooling
- Query optimization
- Pagination
- Soft deletes instead of hard deletes
- Indexes on foreign keys and date columns

### Database
- Indexes on filter columns
- Foreign key indexes
- Unique constraints where applicable
- Soft delete column indexed

## Monitoring & Logging

### Backend Logging
```
Application logs to console/file
Different log levels: DEBUG, INFO, WARN, ERROR
Can be configured per class/package
```

### Frontend Logging
```
Browser console for errors
Network tab for API calls
Redux DevTools for state changes
```

## Future Architecture Enhancements

1. **Caching**
   - Redis for session caching
   - Query result caching
   - Frontend caching strategies

2. **Search**
   - Elasticsearch for expense search
   - Full-text search capabilities

3. **Real-time Updates**
   - WebSocket for live alerts
   - Server-sent events

4. **Analytics**
   - Data warehouse for aggregation
   - Analytics service for reports

5. **Microservices**
   - Separate auth service
   - Separate reporting service
   - Event-driven architecture

6. **Mobile**
   - React Native app
   - Offline support
   - Push notifications

This architecture provides a solid foundation for expansion and handles typical use cases for expense tracking systems.
