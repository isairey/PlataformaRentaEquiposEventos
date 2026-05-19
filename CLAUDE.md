# Claude Development Guidelines for ERS Project

## 🎯 Project Overview

ERS (Event Rental System) is a modern web application for renting party supplies and event equipment, built with Next.js 15 and Firebase.

## 📋 Development Rules

### 1. Code Style & Conventions

- **TypeScript**: Always use TypeScript with proper type definitions
- **Components**: Use functional components with TypeScript interfaces
- **Naming**: 
  - Components: PascalCase (e.g., `ItemCard.tsx`)
  - Files: kebab-case for routes, PascalCase for components
  - Variables/functions: camelCase
- **Imports**: Use absolute imports with `@/` prefix
- **No console.logs**: Remove all console statements before committing

### 2. Component Structure

```typescript
// Always follow this structure
import React from 'react';
import { motion } from 'framer-motion';
import { ComponentProps } from '@/types';

interface MyComponentProps {
  // Define props with clear types
}

export const MyComponent: React.FC<MyComponentProps> = ({ props }) => {
  // Component logic
  return <div>...</div>;
};
```

### 3. Git Commit Conventions

- **feat**: New feature (e.g., `feat: Add item listing page`)
- **fix**: Bug fix (e.g., `fix: Resolve login redirect issue`)
- **refactor**: Code refactoring
- **style**: Styling changes
- **docs**: Documentation updates
- **test**: Test additions/changes
- **chore**: Maintenance tasks

Always include the Claude signature in commits:
```
🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 4. Firebase Conventions

- **Security**: Never expose sensitive data in client-side code
- **Queries**: Optimize Firestore queries with proper indexes
- **Real-time**: Use real-time listeners only when necessary
- **Batch Operations**: Use batch writes for multiple document updates

### 5. UI/UX Guidelines

- **Mobile-First**: Always design for mobile screens first
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Loading States**: Always show loading indicators
- **Error Handling**: Display user-friendly error messages
- **Animations**: Use subtle animations with Framer Motion

### 6. Testing Requirements

Before marking any feature as complete:
- Run `npm run build` to ensure no build errors
- Test on mobile and desktop viewports
- Verify all user flows work correctly
- Check for TypeScript errors

### 7. File Organization

```
app/
  (auth)/          # Auth-related pages
  (dashboard)/     # Protected dashboard pages
  items/           # Public item pages
  api/            # API routes (if needed)
components/
  ui/             # Base UI components
  features/       # Feature-specific components
  layouts/        # Layout components
lib/
  firebase/       # Firebase utilities
  hooks/          # Custom React hooks
  utils/          # Helper functions
```

### 8. State Management

- **Local State**: useState for component-specific state
- **Global State**: Zustand for app-wide state
- **Server State**: React Query for API data
- **Form State**: React Hook Form for forms

### 9. Performance Guidelines

- Use Next.js Image component for all images
- Implement lazy loading for heavy components
- Use React.memo for expensive components
- Optimize bundle size with dynamic imports

### 10. Security Best Practices

- Validate all user inputs
- Sanitize data before displaying
- Use Firebase Security Rules properly
- Never trust client-side validation alone
- Implement rate limiting for API calls

## 🚀 Development Workflow

1. **Before Starting**: Read existing code to understand patterns
2. **During Development**: Follow established conventions
3. **Before Committing**: 
   - Run `npm run lint` (when available)
   - Run `npm run build`
   - Test all changes thoroughly
4. **After Committing**: Push changes to GitHub

## 📝 Current Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **State**: Zustand + React Query

## 🎨 Design System

- **Primary Color**: #FF385C (Accent)
- **Text**: #222222 (Primary), #717171 (Secondary)
- **Background**: #FFFFFF
- **Border**: #EBEBEB
- **Font**: Inter

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔄 Update Guidelines

This document should be updated when:
- New conventions are established
- Tech stack changes
- New patterns are introduced
- Common issues are discovered

---

Last Updated: 2025-06-28