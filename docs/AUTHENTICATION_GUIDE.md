# Authentication & Authorization Guide

This guide explains how to use the authentication and authorization system in the Al-Burhan Tasbiaat Mamolaat application.

## Overview

The application uses a two-layer protection system:

1. **ProtectedRoute**: Handles authentication (checks if user is logged in)
2. **RoleGuard**: Handles authorization (checks if user has the required role)

## Components

### ProtectedRoute
- **Purpose**: Ensures only authenticated users can access protected pages
- **Location**: `src/components/ProtectedRoute.jsx`
- **Functionality**: 
  - Checks if user is logged in and has valid tokens
  - Redirects to `/login` if not authenticated
  - Shows loading spinner during authentication check

### RoleGuard
- **Purpose**: Ensures only users with specific roles can access certain content
- **Location**: `src/components/RoleGuard.jsx`
- **Functionality**:
  - Checks if user's role is in the allowed roles list
  - Shows 403 error page if user doesn't have permission
  - Redirects to dashboard if user is not authenticated

## Usage Examples

### Basic Authentication Protection
For pages that require login but no specific role:

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function SomePage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Your page content here */}
        <h1>This page requires login</h1>
      </div>
    </ProtectedRoute>
  );
}
```

### Role-Based Protection
For pages that require specific roles:

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleGuard from '@/components/RoleGuard';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['Admin']}>
        <div>
          {/* Admin-only content */}
          <h1>Admin Dashboard</h1>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
```

### Multiple Roles
For pages accessible by multiple roles:

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleGuard from '@/components/RoleGuard';

export default function ManagementPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['Admin', 'Sheikh', 'Masool']}>
        <div>
          {/* Management content */}
          <h1>Management Dashboard</h1>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
```

### Conditional Content Within a Page
For showing different content based on roles within the same page:

```jsx
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import RoleGuard from '@/components/RoleGuard';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        {/* Common content for all authenticated users */}
        <h1>Welcome, {user?.name}</h1>
        
        {/* Admin-only section */}
        <RoleGuard allowedRoles={['Admin']}>
          <div className="admin-section">
            <h2>Admin Controls</h2>
            {/* Admin-specific content */}
          </div>
        </RoleGuard>
        
        {/* Sheikh and Admin section */}
        <RoleGuard allowedRoles={['Sheikh', 'Admin']}>
          <div className="management-section">
            <h2>Management Tools</h2>
            {/* Management content */}
          </div>
        </RoleGuard>
      </div>
    </ProtectedRoute>
  );
}
```

## Available Roles

The system supports the following roles:
- `Saalik`: Regular user/student
- `Murabi`: Teacher/mentor
- `Masool`: Manager/supervisor
- `Sheikh`: Senior authority
- `Admin`: System administrator

## Authentication Flow

1. **User visits protected page**
2. **ProtectedRoute checks authentication**
   - If not authenticated → Redirect to `/login`
   - If authenticated → Continue to step 3
3. **RoleGuard checks authorization** (if used)
   - If role not allowed → Show 403 error
   - If role allowed → Show page content

## Best Practices

### 1. Always Use ProtectedRoute First
```jsx
// ✅ Correct order
<ProtectedRoute>
  <RoleGuard allowedRoles={['Admin']}>
    {/* Content */}
  </RoleGuard>
</ProtectedRoute>

// ❌ Wrong order
<RoleGuard allowedRoles={['Admin']}>
  <ProtectedRoute>
    {/* Content */}
  </ProtectedRoute>
</RoleGuard>
```

### 2. Use Specific Roles
```jsx
// ✅ Specific roles
<RoleGuard allowedRoles={['Admin', 'Sheikh']}>

// ❌ Empty array (allows all authenticated users)
<RoleGuard allowedRoles={[]}>
```

### 3. Handle Loading States
Both components handle loading states automatically, but you can add custom loading if needed:

```jsx
import { useAuth } from '@/contexts/AuthContext';

export default function MyPage() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Custom loading...</div>;
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['Admin']}>
        {/* Content */}
      </RoleGuard>
    </ProtectedRoute>
  );
}
```

## Error Handling

### Authentication Errors
- **No token**: Automatic redirect to `/login`
- **Invalid token**: Automatic token refresh attempt
- **Refresh failed**: Logout and redirect to `/login`

### Authorization Errors
- **Wrong role**: 403 error page with "Back to Dashboard" button
- **No role**: Treated as unauthorized

## Integration with AuthContext

The components integrate seamlessly with the AuthContext:

```jsx
// AuthContext provides:
const {
  user,           // Current user object with role
  authToken,      // Access token
  refreshToken,   // Refresh token
  loading,        // Authentication loading state
  login,          // Login function
  logout,         // Logout function
  refreshAccessToken // Token refresh function
} = useAuth();
```

## Troubleshooting

### Common Issues

1. **Infinite redirect loops**
   - Check if ProtectedRoute is used on login page
   - Ensure AuthMiddleware is properly configured

2. **403 errors for valid users**
   - Verify user role matches allowedRoles
   - Check if role is properly set in user object

3. **Token refresh issues**
   - Check backend refresh endpoint
   - Verify refresh token is stored correctly

### Debug Tips

```jsx
// Add debug logging
const { user, authToken, loading } = useAuth();
console.log('Auth Debug:', { user, authToken, loading });
```

## Security Considerations

1. **Never expose sensitive data** in client-side code
2. **Always validate permissions** on the backend
3. **Use HTTPS** in production
4. **Implement proper token expiration** handling
5. **Log security events** for audit purposes

## Migration from Old System

If migrating from the old RoleGuard-only system:

```jsx
// Old way
<RoleGuard allowedRoles={['Admin']}>
  {/* Content */}
</RoleGuard>

// New way
<ProtectedRoute>
  <RoleGuard allowedRoles={['Admin']}>
    {/* Content */}
  </RoleGuard>
</ProtectedRoute>
```

This ensures both authentication and authorization are properly handled.