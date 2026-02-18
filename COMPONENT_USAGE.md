# Component Usage Guide

Quick reference with practical examples for all reusable UI components.

## Quick Start

Import components from the central export:

```jsx
import { Button, Input, Card, CardHeader, CardTitle, PageContainer, Navbar } from '@/components/ui'
```

---

## Button Component

### Basic Usage

```jsx
<Button>Click Me</Button>
```

### All Variants

```jsx
<div className="flex gap-2 flex-wrap">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="accent">Accent</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="success">Success</Button>
</div>
```

### All Sizes

```jsx
<div className="flex gap-2 items-center">
  <Button size="xs">XS</Button>
  <Button size="sm">SM</Button>
  <Button size="md">MD</Button>
  <Button size="lg">LG</Button>
  <Button size="xl">XL</Button>
</div>
```

### With Loading State

```jsx
const [loading, setLoading] = useState(false)

return (
  <Button loading={loading} onClick={handleSubmit}>
    {loading ? 'Saving...' : 'Save'}
  </Button>
)
```

### With Icon

```jsx
import { LockIcon } from 'lucide-react'

<Button icon={<LockIcon />} variant="primary">
  Secure Login
</Button>
```

### Full Width Button

```jsx
<Button fullWidth variant="primary">
  Sign In
</Button>
```

### Disabled Button

```jsx
<Button disabled>
  Disabled
</Button>
```

### Form Button Group

```jsx
<div className="flex gap-2 justify-end mt-6">
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Save Changes</Button>
</div>
```

---

## Input Component

### Basic Text Input

```jsx
const [name, setName] = useState('')

<Input
  type="text"
  label="Full Name"
  placeholder="John Doe"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Email Input

```jsx
const [email, setEmail] = useState('')

<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

### Password Input (with visibility toggle)

```jsx
const [password, setPassword] = useState('')

<Input
  type="password"
  label="Password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  helperText="At least 8 characters"
  required
/>
```

### Input with Error

```jsx
const [email, setEmail] = useState('')
const [error, setError] = useState('')

const handleChange = (e) => {
  const value = e.target.value
  setEmail(value)
  setError(value.includes('@') ? '' : 'Invalid email')
}

<Input
  type="email"
  label="Email"
  value={email}
  onChange={handleChange}
  error={error}
/>
```

### Number Input

```jsx
<Input
  type="number"
  label="Phone Number"
  placeholder="+1 (555) 123-4567"
/>
```

### Textarea Input

```jsx
<Input
  type="textarea"
  label="Comments"
  placeholder="Enter your feedback..."
  rows={5}
/>
```

### Input with Helper Text

```jsx
<Input
  type="password"
  label="New Password"
  helperText="Must contain uppercase, lowercase, and numbers"
/>
```

### Disabled Input

```jsx
<Input
  type="text"
  label="Account ID"
  value="ACC-12345"
  disabled
/>
```

### Different Sizes

```jsx
<Input type="text" size="sm" placeholder="Small" />
<Input type="text" size="md" placeholder="Medium (default)" />
<Input type="text" size="lg" placeholder="Large" />
```

### Filled Variant

```jsx
<Input
  type="text"
  variant="filled"
  placeholder="Filled style"
/>
```

---

## Card Component

### Basic Card

```jsx
<Card>
  <p>Simple card content</p>
</Card>
```

### Card with Structure

```jsx
<Card elevated padding="md">
  <CardHeader>
    <CardTitle>User Information</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Email: user@example.com</p>
    <p>Role: Employee</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Update</Button>
  </CardFooter>
</Card>
```

### Card with Description

```jsx
<Card elevated>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
    <CardDescription>Overview of your attendance metrics</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Dashboard content */}
  </CardContent>
</Card>
```

### Different Padding Sizes

```jsx
<Card padding="xs">Extra Small</Card>
<Card padding="sm">Small</Card>
<Card padding="md">Medium (default)</Card>
<Card padding="lg">Large</Card>
```

### Elevated vs Bordered

```jsx
<Card elevated>Elevated with shadow</Card>
<Card bordered>With border</Card>
<Card elevated bordered>Both</Card>
```

### Hoverable Card

```jsx
<Card hoverable onClick={() => navigate('/employee/123')}>
  <h3>Employee Name</h3>
  <p>Click to view details</p>
</Card>
```

### Grid of Cards

```jsx
<GridContainer columns={3} gap="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</GridContainer>
```

---

## Input Form Layout

### Complete Login Form

```jsx
import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, PageContainer } from '@/components/ui'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Handle login
    setLoading(false)
  }

  return (
    <PageContainer maxWidth="md">
      <Card elevated>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />
          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}
```

### Complete Signup Form

```jsx
import { useState } from 'react'
import { Button, Input, Card, PageContainer } from '@/components/ui'

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate form
    // Submit
  }

  return (
    <PageContainer maxWidth="md" padding="lg">
      <Card elevated>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          <Input
            name="email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            helperText="At least 8 characters"
            error={errors.password}
            required
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" variant="primary" fullWidth>
            Create Account
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}
```

---

## Page Container

### Basic Page Layout

```jsx
import { PageContainer } from '@/components/ui'

export function MyPage() {
  return (
    <PageContainer maxWidth="2xl" padding="lg">
      <h1>Page Title</h1>
      {/* Page content */}
    </PageContainer>
  )
}
```

### Different Max Widths

```jsx
<PageContainer maxWidth="sm">Small container (max 384px)</PageContainer>
<PageContainer maxWidth="md">Medium container (max 448px)</PageContainer>
<PageContainer maxWidth="lg">Large container (max 512px)</PageContainer>
<PageContainer maxWidth="xl">Extra large (max 576px)</PageContainer>
<PageContainer maxWidth="2xl">2XL (max 672px)</PageContainer>
<PageContainer maxWidth="4xl">4XL (max 896px)</PageContainer>
<PageContainer maxWidth="full">Full width</PageContainer>
```

---

## Grid Container

### Responsive Grid

```jsx
import { GridContainer, Card } from '@/components/ui'

export function EmployeeList() {
  const employees = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
  ]

  return (
    <GridContainer columns={3} gap="md" responsive>
      {employees.map(emp => (
        <Card key={emp.id} hoverable>
          <h3>{emp.name}</h3>
        </Card>
      ))}
    </GridContainer>
  )
}
```

### Different Gap Sizes

```jsx
<GridContainer gap="xs">Tight spacing</GridContainer>
<GridContainer gap="sm">Small spacing</GridContainer>
<GridContainer gap="md">Medium spacing</GridContainer>
<GridContainer gap="lg">Large spacing</GridContainer>
```

---

## Section Component

### Basic Section

```jsx
<Section title="Employees" subtitle="Manage all employees">
  {/* Content */}
</Section>
```

### Section with Custom Spacing

```jsx
<Section title="Dashboard" spacing="lg">
  {/* Content */}
</Section>
```

---

## Divider Component

### Simple Divider

```jsx
<div>
  <p>First section</p>
  <Divider />
  <p>Second section</p>
</div>
```

### Divider with Label

```jsx
<Divider label="OR" />
<Divider label="Continue with" />
```

---

## Navbar Component

### Basic Navigation

```jsx
import { Navbar } from '@/components/ui'

export function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </>
  )
}
```

### With User Menu

```jsx
const user = {
  name: 'John Doe',
  email: 'john@example.com',
}

<Navbar
  logo="Attendance System"
  user={user}
  onLogout={() => {/* Handle logout */}}
/>
```

### With Menu Items

```jsx
const menuItems = [
  { label: 'Dashboard', onClick: () => navigate('/dashboard') },
  { label: 'Employees', onClick: () => navigate('/employees') },
  { label: 'Reports', onClick: () => navigate('/reports') },
]

<Navbar
  logo="Attendance System"
  menuItems={menuItems}
  user={user}
  onLogout={handleLogout}
/>
```

---

## Complete Page Example

```jsx
import { 
  Navbar, 
  PageContainer, 
  Card, 
  CardHeader, 
  CardTitle,
  Section,
  Button,
  GridContainer,
} from '@/components/ui'

export function DashboardPage() {
  return (
    <>
      <Navbar logo="Attendance System" />
      
      <PageContainer maxWidth="4xl" padding="lg" className="pt-24">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <Section title="Quick Stats" subtitle="Your attendance overview">
          <GridContainer columns={4} gap="md" responsive>
            <Card elevated>
              <h3 className="font-semibold">Present Days</h3>
              <p className="text-3xl font-bold text-brand-primary mt-2">18</p>
            </Card>
            <Card elevated>
              <h3 className="font-semibold">Absent Days</h3>
              <p className="text-3xl font-bold text-error mt-2">2</p>
            </Card>
            <Card elevated>
              <h3 className="font-semibold">Pending</h3>
              <p className="text-3xl font-bold text-warning mt-2">1</p>
            </Card>
            <Card elevated>
              <h3 className="font-semibold">On Leave</h3>
              <p className="text-3xl font-bold text-brand-accent mt-2">3</p>
            </Card>
          </GridContainer>
        </Section>

        <Section title="Recent Activity">
          <Card>
            <div className="space-y-2">
              <p>Checked in at 9:00 AM</p>
              <p>Checked out at 5:30 PM</p>
            </div>
          </Card>
        </Section>
      </PageContainer>
    </>
  )
}
```

---

## Best Practices

1. **Always use components** - Don't create custom button/input styles
2. **Consistent spacing** - Use the spacing system (gap, p-, m-)
3. **Color semantics** - Use error for danger, success for positive, warning for caution
4. **Button variants** - Primary for main action, secondary for alternatives
5. **Form validation** - Always show error messages below inputs
6. **Responsive design** - Test on mobile, use responsive GridContainer
7. **Loading states** - Show loading indicator on buttons during submission
8. **Accessibility** - Always add labels to inputs, use semantic HTML

---

## Troubleshooting

**Button styling not working?**
- Make sure you're importing from `@/components/ui`
- Check that tailwind.config.js has the brand colors defined

**Input styling issues?**
- Ensure text-primary, text-secondary, text-tertiary are defined in tailwind config
- Check error-50 is defined for error backgrounds

**Components not rendering?**
- Verify index.js exports are correct
- Check that all dependencies are installed (React, React Router)

**Layout issues?**
- Use PageContainer for proper centering
- Use GridContainer for responsive grid layouts
- Remember Navbar is fixed, so add pt-16 to main content
