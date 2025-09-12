# Authentication System

This document describes the authentication system implemented for the Cassava Disease Classifier application.

## Overview

The authentication system integrates with the Casava API (`https://casava-api.dataverseafrica.org/api/auth`) and provides:

- User registration (sign up)
- User login
- User logout
- Token-based authentication
- User management (admin functionality)
- Persistent authentication state

## API Endpoints

### Sign Up
- **Endpoint**: `POST /api/auth/signup`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: User data with success status

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ "username": "string", "password": "string" }`
- **Response**: User data with JWT token

### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success confirmation

### Get Users (Admin)
- **Endpoint**: `GET /api/auth/admin/users`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of all registered users

## Components

### Pages
- **SignUp** (`/signup`): User registration form
- **Login** (`/login`): User login form
- **Users** (`/users`): Admin page to view all users

### Services
- **AuthService** (`src/services/auth.ts`): API communication and token management
- **AuthContext** (`src/contexts/AuthContext.tsx`): Global authentication state management

### Features
- Form validation
- Error handling
- Loading states
- Responsive design
- Token persistence in localStorage
- Automatic token refresh
- Cross-tab synchronization

## Usage

### Authentication Flow
1. User visits the application
2. If not authenticated, they see "Sign In" and "Sign Up" buttons
3. User can register a new account or sign in with existing credentials
4. Upon successful login, JWT token is stored and user is redirected to home
5. Authenticated users see their username and logout option
6. Admin users can access the Users page to view all registered users

### Protected Routes
- `/users` - Requires authentication (admin functionality)

### Token Management
- Tokens are stored in localStorage
- Automatic token validation
- Cross-tab synchronization
- Secure logout with server-side token invalidation

## Security Features

- Password validation (minimum 6 characters)
- Email format validation
- JWT token-based authentication
- Secure token storage
- Server-side logout
- Error handling without exposing sensitive information

## Styling

The authentication pages use Material-UI components with a consistent design:
- Green gradient background matching the app theme
- White form fields with transparency
- Responsive design for mobile and desktop
- Loading states and error messages
- Consistent typography and spacing

## Error Handling

- Form validation errors
- API error messages
- Network error handling
- User-friendly error display
- Automatic error clearing on user input

## Future Enhancements

- Password reset functionality
- Email verification
- Role-based access control
- Remember me option
- Social login integration
- Two-factor authentication
