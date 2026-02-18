# Design System Documentation

## Overview

This document provides comprehensive guidance for the unified design system implemented across the Attendance Management application. The system ensures consistency, maintainability, and a professional appearance across all pages.

**Design Philosophy:** Enterprise-level minimal UI with only 3 primary brand colors, semantic coloring, and reusable component patterns.

---

## Brand Colors (3-Color System)

The entire application uses only 3 primary brand colors, with semantic colors for specific states.

### Primary Brand Colors

#### 1. **Deep Blue (#1e40af)** - Primary Color
- **Used for:** Primary buttons, links, active states, main CTAs
- **Variations:**
  - Dark: `#1e3a8a`
  - Light: `#3b82f6`
  - 50% (background): `#eff6ff`

**Tailwind Classes:**
```css
bg-brand-primary          /* #1e40af */
bg-brand-primary-dark     /* #1e3a8a */
bg-brand-primary-light    /* #3b82f6 */
bg-brand-primary-50       /* #eff6ff */
text-brand-primary        /* for text */
```

#### 2. **Professional Gray (#6b7280)** - Secondary Color
- **Used for:** Secondary buttons, labels, less important text, disabled states
- **Variations:**
  - Dark: `#4b5563`
  - Light: `#9ca3af`
  - 50% (background): `#f9fafb`

**Tailwind Classes:**
```css
bg-brand-secondary        /* #6b7280 */
bg-brand-secondary-dark   /* #4b5563 */
bg-brand-secondary-light  /* #9ca3af */
bg-brand-secondary-50     /* #f9fafb */
text-brand-secondary      /* for text */
```

#### 3. **Modern Teal (#14b8a6)** - Accent Color
- **Used for:** Accent UI elements, hover states, highlights, special emphasis
- **Variations:**
  - Dark: `#0d9488`
  - Light: `#2dd4bf`
  - 50% (background): `#f0fdfa`

**Tailwind Classes:**
```css
bg-brand-accent           /* #14b8a6 */
bg-brand-accent-dark      /* #0d9488 */
bg-brand-accent-light     /* #2dd4bf */
bg-brand-accent-50        /* #f0fdfa */
text-brand-accent         /* for text */
```

---

## Semantic Colors

Used for universal status indication across the entire application.

| Color | Hex Code | Use Case | Tailwind Class |
|-------|----------|----------|-----------------|
| **Success** | #10b981 | Success messages, confirmations, valid states | `bg-success`, `text-success` |
| **Warning** | #f59e0b | Warning alerts, caution states | `bg-warning`, `text-warning` |
| **Error** | #ef4444 | Error messages, form validation errors | `bg-error`, `text-error` |
| **Info** | #3b82f6 | Information alerts, helpful messages | `bg-info`, `text-info` |

---

## Text Colors (Semantic)

Consistent text color hierarchy throughout the application.

| Level | Color | Hex Code | Usage | Tailwind Class |
|-------|-------|----------|-------|-----------------|
| **Primary** | Dark Gray | #1f2937 | Main body text, headings | `text-text-primary` |
| **Secondary** | Medium Gray | #6b7280 | Secondary text, labels, meta info | `text-text-secondary` |
| **Tertiary** | Light Gray | #9ca3af | Subtle text, placeholders, hints | `text-text-tertiary` |

---

## Reusable Components

### 1. **Button Component**

From: [src/components/ui/Button.jsx](src/components/ui/Button.jsx)

**Variants:**
- `primary` - Deep blue, main CTA
- `secondary` - Gray, secondary actions
- `accent` - Teal, special emphasis
- `outline` - Bordered, alternative style
- `ghost` - Transparent background
- `danger` - Red, destructive actions
- `success` - Green, positive actions

**Sizes:** `xs`, `sm`, `md` (default), `lg`, `xl`

**States:**
- Default (hover effect, active scale)
- Disabled (50% opacity)
- Loading (spinner, disabled)
- Focus (ring effect)

**Usage Example:**

```jsx
import { Button } from '@/components/ui'

export function LoginForm() {
  return (
    <div>
      <Button variant="primary" size="md" fullWidth>
        Sign In
      </Button>
      <Button variant="ghost" size="sm">
        Forgot Password?
      </Button>
      <Button variant="danger" size="md" disabled>
        Delete Account
      </Button>
      <Button variant="primary" loading>
        Processing...
      </Button>
    </div>
  )
}
```

---

### 2. **Input Component**

From: [src/components/ui/Input.jsx](src/components/ui/Input.jsx)

**Types Supported:**
- `text` - Standard text input
- `email` - Email validation
- `password` - Password with visibility toggle
- `number` - Numeric input
- `textarea` - Multi-line text

**Variants:**
- `default` - Standard bordered input
- `filled` - Filled background variant

**Sizes:** `sm`, `md` (default), `lg`

**Features:**
- Label with optional required indicator
- Placeholder text
- Error message display
- Helper text
- Icon support (left-aligned)
- Password visibility toggle
- Disabled state
- Full width support

**Usage Example:**

```jsx
import { Input } from '@/components/ui'
import { useState } from 'react'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  return (
    <div>
      <Input
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter secure password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText="At least 8 characters, uppercase, lowercase, number"
        error={errors.password}
        required
      />
    </div>
  )
}
```

---

### 3. **Card Component**

From: [src/components/ui/Card.jsx](src/components/ui/Card.jsx)

**Main Component & Sub-components:**

```jsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui'
```

**Properties:**
- `padding` - `xs`, `sm`, `md` (default), `lg`
- `elevated` - Shadow effect
- `bordered` - Border styling
- `hoverable` - Hover scale effect
- `className` - Custom tailwind classes

**Usage Example:**

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from '@/components/ui'

export function ProfileCard() {
  return (
    <Card elevated padding="md">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Email: user@example.com</p>
        <p>Role: Employee</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
```

---

### 4. **Layout Components**

From: [src/components/ui/PageContainer.jsx](src/components/ui/PageContainer.jsx)

#### PageContainer

Centers content with responsive max-width.

```jsx
import { PageContainer } from '@/components/ui'

export function MyPage() {
  return (
    <PageContainer maxWidth="2xl" padding="lg">
      {/* Page content */}
    </PageContainer>
  )
}
```

**Props:**
- `maxWidth` - `sm`, `md`, `lg`, `xl`, `2xl`, `4xl`, `full`
- `padding` - `xs`, `sm`, `md`, `lg`, `xl`
- `centered` - Auto-center content (default: true)

#### GridContainer

Responsive grid layout.

```jsx
<GridContainer columns={3} gap="md" responsive>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</GridContainer>
```

#### Section

Semantic section with optional title and subtitle.

```jsx
<Section title="Employee List" subtitle="Manage all employees">
  {/* Section content */}
</Section>
```

#### Divider

Horizontal divider with optional label.

```jsx
<Divider />
<Divider label="OR" />
```

---

### 5. **Navbar Component**

From: [src/components/ui/Navbar.jsx](src/components/ui/Navbar.jsx)

**Features:**
- Fixed top navigation
- Logo/brand section
- Menu items
- User dropdown with profile, settings, logout
- Responsive design
- Avatar with user initial

**Usage Example:**

```jsx
import { Navbar } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export function MainLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <>
      <Navbar
        logo="Attendance System"
        user={user}
        onLogout={logout}
        menuItems={[
          { label: 'Dashboard', onClick: () => navigate('/dashboard') },
          { label: 'Employees', onClick: () => navigate('/employees') },
        ]}
      />
      <div className="pt-16">
        {children}
      </div>
    </>
  )
}
```

---

## Color Usage Guidelines

### Button Styling by Role/Context

```jsx
// Primary Actions
<Button variant="primary">Save</Button>
<Button variant="primary">Submit</Button>

// Secondary Actions
<Button variant="secondary">Cancel</Button>
<Button variant="secondary">Back</Button>

// Destructive Actions
<Button variant="danger">Delete</Button>
<Button variant="danger">Remove</Button>

// Success Feedback
<Button variant="success">Confirm</Button>

// Special Emphasis
<Button variant="accent">Special Action</Button>
```

### Form Field Styling

```jsx
// Normal state
<Input label="Name" />

// Error state
<Input label="Email" error="Invalid email format" />

// Disabled state
<Input label="Phone" disabled />

// With helper text
<Input label="Password" helperText="Min 8 chars" />
```

### Card Usage

```jsx
// Elevated card (for featured content)
<Card elevated>Content</Card>

// Bordered card
<Card bordered>Content</Card>

// Interactive card
<Card hoverable>Content</Card>

// Compact card
<Card padding="sm">Content</Card>
```

---

## Typography

Global font system using **Inter** (sans-serif).

| Size | Class | Pixel Size | Line Height | Use Case |
|------|-------|-----------|-------------|----------|
| XS | `text-xs` | 12px | 16px | Small labels, badges |
| SM | `text-sm` | 14px | 20px | Helper text, captions |
| Base | `text-base` | 16px | 24px | Body text |
| LG | `text-lg` | 18px | 28px | Small headings |
| XL | `text-xl` | 20px | 28px | Subheadings |
| 2XL | `text-2xl` | 24px | 32px | Section titles |
| 3XL | `text-3xl` | 30px | 36px | Page titles |
| 4XL | `text-4xl` | 36px | 40px | Large titles |

**Usage:**

```jsx
<h1 className="text-4xl font-bold">Page Title</h1>
<h2 className="text-2xl font-bold">Section Title</h2>
<p className="text-base text-text-primary">Body text</p>
<span className="text-sm text-text-secondary">Helper text</span>
```

---

## Spacing System

Consistent spacing increments for padding, margins, and gaps.

| Alias | Pixels | Tailwind | Use Case |
|-------|--------|----------|----------|
| xs | 4px | `p-1`, `m-1`, `gap-1` | Tight spacing |
| sm | 8px | `p-2`, `m-2`, `gap-2` | Small spacing |
| md | 16px | `p-4`, `m-4`, `gap-4` | Standard spacing |
| lg | 24px | `p-6`, `m-6`, `gap-6` | Large spacing |
| xl | 32px | `p-8`, `m-8`, `gap-8` | Extra large spacing |

---

## Shadow System

Depth indicators using box shadows.

| Level | Tailwind | Use Case |
|-------|----------|----------|
| XS | `shadow-xs` | Subtle elevation |
| SM | `shadow-sm` | Light elevation |
| MD | `shadow-md` | Normal cards (default) |
| LG | `shadow-lg` | Elevated content |
| XL | `shadow-xl` | Maximum elevation |

---

## Border Radius

Consistent rounded corner system.

| Size | Pixels | Tailwind | Use Case |
|------|--------|----------|----------|
| XS | 4px | `rounded-xs` | Subtle |
| SM | 6px | `rounded-sm` | Default |
| Base | 8px | `rounded-md` | Standard |
| LG | 12px | `rounded-lg` | Large elements |
| Full | 9999px | `rounded-full` | Circles, pills |

---

## Transition System

Consistent animation durations.

| Duration | Milliseconds | Tailwind | Use Case |
|----------|--------------|----------|----------|
| Fast | 150ms | `duration-fast` | Micro-interactions |
| Base | 200ms | `duration-base` | Standard transitions |
| Slow | 300ms | `duration-slow` | Important changes |

---

## Implementation Checklist

Use this checklist when implementing new pages or components:

- [ ] Use only the 3 brand colors (blue, gray, teal)
- [ ] Apply consistent text color hierarchy (primary/secondary/tertiary)
- [ ] Use reusable button component for all buttons
- [ ] Use input component for all form fields
- [ ] Use card component for content sections
- [ ] Wrap pages in PageContainer
- [ ] Apply proper spacing using the spacing system
- [ ] Use semantic colors for status (success, error, warning, info)
- [ ] Test on mobile (responsive design)
- [ ] Follow typography sizing guidelines
- [ ] Add proper labels to all form inputs
- [ ] Include error states for form validation
- [ ] Use button variants appropriately (primary for main action)

---

## Component Export Reference

All components are exported from a central location:

```javascript
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  PageContainer,
  GridContainer,
  Section,
  Divider,
  Navbar,
} from '@/components/ui'
```

---

## File Locations

| Component | Location |
|-----------|----------|
| Button | `src/components/ui/Button.jsx` |
| Input | `src/components/ui/Input.jsx` |
| Card | `src/components/ui/Card.jsx` |
| PageContainer | `src/components/ui/PageContainer.jsx` |
| Navbar | `src/components/ui/Navbar.jsx` |
| Index (exports) | `src/components/ui/index.js` |
| Global Styles | `src/index.css` |
| Tailwind Config | `tailwind.config.js` |

---

## Next Steps

To apply this design system across the application:

1. **Signup Pages** - Replace forms with Input components, update buttons
2. **Login Pages** - Use new Button + Input components
3. **Dashboard** - Convert sections to Card components, use updated Navbar
4. **Forms** - Replace all form inputs with reusable Input component
5. **Profile Pages** - Use Card layouts with consistent styling
6. **Error Pages** - Apply consistent error color system

---

## Questions & Additional Documentation

For detailed usage of each component, refer to the respective component files which include JSDoc comments and prop documentation.

For design system updates or new components, follow the same pattern:
1. Create component in `src/components/ui/`
2. Export from `src/components/ui/index.js`
3. Document prop types and usage
4. Add examples to this guide
