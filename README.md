# ERP/CRM Monorepo

A modern ERP/CRM system built with Next.js and NestJS, featuring HIPAA-compliant authentication and multi-tenant architecture.

## Architecture

- **Frontend**: Next.js (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: NestJS with self-hosted authentication
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: JWT tokens with HttpOnly cookies
- **Deployment**: Subdomain-based multi-tenancy

## Project Structure

```
erp-crm/
├── web/                 # Next.js frontend application
│   ├── app/
│   │   ├── admin/       # Employee dashboard (admin.appname.com)
│   │   ├── customer/    # Customer portal (customer.appname.com)
│   │   └── page.tsx     # Login page (appname.com)
│   ├── components/
│   │   ├── ui/          # shadcn/ui components (don't modify)
│   │   └── core/        # Custom components
│   └── middleware.ts    # Subdomain routing
├── api/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/        # Authentication module
│   │   ├── users/       # User management
│   │   └── common/      # Shared utilities
│   └── .env             # Environment variables
└── docs/                # Project documentation
```

## Quick Start

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) or npm/yarn
- PostgreSQL (for production)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd erp-crm
   pnpm install
   ```

2. **Set up environment variables**:
   
   **API (.env in /api directory)**:
   ```env
   NODE_ENV=development
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key
   COOKIE_DOMAIN=.localhost
   ```

   **Web (.env.local in /web directory)**:
   ```env
   API_URL=http://localhost:4000
   NEXT_PUBLIC_APP_NAME=ERP/CRM System
   ```

3. **Start development servers**:
   ```bash
   # Start both applications
   pnpm dev
   
   # Or start individually
   pnpm dev:web    # Next.js on http://localhost:3000
   pnpm dev:api    # NestJS on http://localhost:4000
   ```

## Development Workflow

### Available Scripts

```bash
# Development
pnpm dev          # Start both apps in development mode
pnpm dev:web      # Start only Next.js app
pnpm dev:api      # Start only NestJS app

# Building
pnpm build        # Build both applications
pnpm build:web    # Build Next.js app
pnpm build:api    # Build NestJS app

# Production
pnpm start        # Start both apps in production mode
pnpm start:web    # Start Next.js in production
pnpm start:api    # Start NestJS in production

# Quality
pnpm lint         # Lint all applications
pnpm test         # Run tests for all applications
pnpm clean        # Clean all node_modules and build artifacts
```

### Subdomain Testing

To test subdomain routing locally, add these entries to your `/etc/hosts` file:

```
127.0.0.1 admin.localhost
127.0.0.1 customer.localhost
```

Then access:
- **Login**: http://localhost:3000
- **Admin Dashboard**: http://admin.localhost:3000 (full sidebar with ERP/CRM navigation)
- **Customer Portal**: http://customer.localhost:3000 (clean header with user info)

### Demo Credentials

For testing the authentication system (credentials shown on login page):

**Employee (Admin)**:
- Email: `admin@example.com`
- Password: `password123`
- Role: `admin` (Employee)
- Redirects to: Admin Dashboard with full sidebar navigation
- Features: Orders, Customers, Settings, Analytics, Inventory Management
- Demo Banner: Blue banner showing admin credentials and role

**Customer (Manager)**:
- Email: `customer@example.com`
- Password: `password123`
- Role: `manager` (Customer)
- Redirects to: Customer Portal with header navigation
- Features: Recent Orders, Account Settings, Support
- Demo Banner: Green banner showing customer credentials and role

## API Endpoints

### Authentication (NestJS Backend)
- `POST /api/auth/login` - User login with credentials
- `POST /api/auth/logout` - User logout (clears session)
- `GET /api/auth/me` - Get current user profile
- `GET /auth/health` - Health check endpoint

### Frontend API Routes (Next.js Proxy)
- `POST /api/auth/login` - Login form handler (proxies to NestJS)
- `POST /api/auth/logout` - Logout handler (proxies to NestJS)
- `GET /api/auth/me` - User profile handler (proxies to NestJS)

### Development URLs
- **API Base**: http://localhost:4000
- **Health Check**: http://localhost:4000/auth/health
- **API Docs**: http://localhost:4000/api (when Swagger is added)

## Security Features

### HIPAA Compliance
- HttpOnly, Secure, SameSite cookies
- JWT tokens with proper expiration
- Audit logging capabilities
- Data encryption at rest (when database is added)
- Row Level Security (RLS) for tenant isolation

### Authentication Flow
1. User submits credentials to Next.js login form
2. Next.js proxies request to NestJS `/api/auth/login`
3. NestJS validates credentials against mock user database
4. NestJS issues JWT token with user info (id, email, role, type, tenantId)
5. JWT stored in HttpOnly cookie with proper security flags
6. User redirected to appropriate dashboard based on role (admin → `/admin`, customer → `/customer`)
7. Protected routes check for session cookie via middleware
8. Unauthenticated users redirected to login with return URL
9. Logout clears session cookie and redirects to login page

### User Interface Features
- **Admin Dashboard**: Full sidebar navigation with collapsible menu, breadcrumbs, and user dropdown
- **Customer Portal**: Clean header layout with user info and logout functionality
- **User Information**: Real-time display of email, role, and user type
- **Demo Credentials Display**: Login page shows both admin and customer credentials
- **Demo Mode Banners**: Context-aware banners showing current user credentials and role
- **Logout Functionality**: Available in both admin sidebar and customer header
- **Role-Based Navigation**: Different menu items based on user permissions
- **Responsive Design**: Works on desktop and mobile devices

## Current Features ✅

### Authentication System
- ✅ **HIPAA-Compliant Auth**: NestJS with JWT tokens and HttpOnly cookies
- ✅ **Role-Based Routing**: Automatic redirect based on user type
- ✅ **Session Management**: Secure cookie handling with proper domain settings
- ✅ **Inline Validation**: Client-side and server-side validation with inline error display
- ✅ **Logout Functionality**: Available in both admin and customer interfaces
- ✅ **Protected Routes**: Middleware authentication for all dashboard routes
- ✅ **Error Handling**: Graceful error messages without page redirects

### User Interfaces
- ✅ **Admin Dashboard**: shadcn/ui sidebar-07 layout with ERP/CRM navigation
- ✅ **Customer Portal**: Clean header-based layout with user information
- ✅ **Demo Mode Banners**: Context-aware credential display on both dashboards
- ✅ **User Information Display**: Real-time email, role, and type information
- ✅ **Credentials on Login**: Both admin and customer credentials shown on login page
- ✅ **Responsive Design**: Mobile and desktop compatibility
- ✅ **Subdomain Support**: admin.localhost and customer.localhost routing

### Navigation & UX
- ✅ **Admin Navigation**: Dashboard, Orders, Customers, Settings, Analytics
- ✅ **User Management**: Complete CRUD system with data table and forms
- ✅ **Sheet Components**: Mobile-friendly side sheets instead of modals
- ✅ **Skeleton Loading**: Professional loading states for tables and cards
- ✅ **User Avatars**: Initials-based fallback avatars
- ✅ **Dropdown Menus**: Profile, settings, and logout options
- ✅ **Breadcrumb Navigation**: Context-aware navigation in admin
- ✅ **Loading States**: Proper loading and error state handling
- ✅ **Inline Form Validation**: Real-time validation without page refreshes
- ✅ **Client-Side Validation**: Email format and required field validation

## Next Steps

1. **Database Integration**: Add PostgreSQL with Prisma/TypeORM
2. **Business Logic**: Implement orders, customers, and inventory modules
3. **Real User Data**: Replace mock users with database integration
4. **Role Permissions**: Implement granular RBAC system with permissions matrix
5. **Advanced Features**: Add bulk operations, user import/export, audit logs
6. **Testing**: Add comprehensive test suites for user management
7. **Deployment**: Configure for production with Docker

## User Management Features ✅

### 📋 **User Administration**
- ✅ **User Listing**: Data table with search, filters, and pagination-ready structure
- ✅ **User Creation**: Form validation with role-based field selection
- ✅ **User Editing**: Update name, type, role, and status
- ✅ **User Deletion**: Soft delete with confirmation dialogs
- ✅ **Status Management**: Activate/deactivate user accounts
- ✅ **Role Assignment**: Dynamic role selection based on user type

### 🎨 **User Interface**
- ✅ **Sheet Component**: Mobile-friendly side panel for forms
- ✅ **Data Table**: Professional table with sorting and filtering
- ✅ **Skeleton Loading**: Smooth loading animations
- ✅ **Statistics Cards**: Real-time user metrics and counts
- ✅ **Search & Filters**: Real-time filtering by name, email, type, status
- ✅ **Breadcrumb Navigation**: Clear navigation hierarchy

### 🔐 **Security & Validation**
- ✅ **Form Validation**: Zod schema validation with react-hook-form
- ✅ **Password Security**: Bcrypt hashing for user passwords
- ✅ **Role Validation**: Server-side role validation
- ✅ **Authentication**: JWT-protected API endpoints

## Documentation

- [Tech Stack](./docs/tech-stack.md) - Architecture and technology decisions
- [Frontend Guidelines](./docs/frontend-guidelines.md) - UI development standards
- [Cursor Policies](./docs/cursor-policies.md) - AI-assisted development workflow
- [CI Gates](./docs/ci-gates.md) - Quality assurance and testing

## Testing the Application

### 🧪 **Quick Test Steps**
1. **Start servers**: `pnpm dev` (starts both web and API)
2. **Visit login**: http://localhost:3000
3. **Test admin flow**:
   - Login: `admin@example.com` / `password123`
   - Verify: Redirected to admin dashboard with sidebar
   - Test logout: Click user avatar → "Log out"
4. **Test customer flow**:
   - Login: `customer@example.com` / `password123`
   - Verify: Redirected to customer portal with header
   - Check user info: Email and role displayed in header
   - Test logout: Click user dropdown → "Log out"
5. **Test subdomain routing**:
   - Direct access: http://admin.localhost:3000 (should redirect to login)
   - After login: Should access admin dashboard directly

### 🔍 **Troubleshooting**
- **401 Errors**: Ensure both servers are running (`pnpm dev`)
- **Cookie Issues**: Check that cookies are set without domain in development
- **Subdomain Access**: Add `127.0.0.1 admin.localhost` and `127.0.0.1 customer.localhost` to `/etc/hosts`
- **API Connection**: Verify API health at http://localhost:4000/auth/health

## Repository

- **GitHub**: https://github.com/paulostering/vent2.git
- **Clone**: `git clone https://github.com/paulostering/vent2.git`
- **Branch**: `main`

## Contributing

1. **Setup**: Clone repository and run `pnpm install` to install dependencies
2. **Development**: Use `pnpm dev` to start both web and API servers
3. **Guidelines**: Follow the engineering guidelines in `/docs/`
4. **Commits**: Use conventional commits for all changes
5. **Testing**: Test authentication flows thoroughly on both admin and customer portals
6. **Quality**: Ensure all CI gates pass before submitting PRs
7. **Security**: Maintain HIPAA compliance standards
8. **Documentation**: Update this README.md after any significant changes

### Git Workflow
```bash
# Clone and setup
git clone https://github.com/paulostering/vent2.git
cd vent2
pnpm install

# Development
pnpm dev          # Start both servers
git add .
git commit -m "feat: add new feature"
git push origin main
```
