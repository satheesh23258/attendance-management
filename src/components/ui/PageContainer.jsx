import React from 'react'

/**
 * PageContainer Component
 * Centered, responsive wrapper for page content
 * Handles max-width, padding, and consistent spacing
 */
export const PageContainer = ({
  children,
  className,
  maxWidth = 'lg',
  padding = 'md',
  centered = true,
  ...props
}) => {
  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
  }

  const paddingStyles = {
    xs: 'px-3 py-3',
    sm: 'px-4 py-4',
    md: 'px-6 py-6',
    lg: 'px-8 py-8',
    xl: 'px-10 py-10',
  }

  return (
    <div
      className={`
        w-full
        ${paddingStyles[padding]}
        ${centered ? 'mx-auto' : ''}
        ${maxWidthStyles[maxWidth]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * GridContainer Component
 * Responsive grid layout wrapper
 */
export const GridContainer = ({
  children,
  className,
  columns = 2,
  gap = 'md',
  responsive = true,
  ...props
}) => {
  const gapStyles = {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  const gridStyles = responsive
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    : `grid-cols-${columns}`

  return (
    <div
      className={`
        grid
        ${responsive ? gridStyles : `grid-cols-${columns}`}
        ${gapStyles[gap]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Section Component
 * Semantic section wrapper with consistent spacing
 */
export const Section = ({
  children,
  className,
  title,
  subtitle,
  spacing = 'md',
  ...props
}) => {
  const spacingStyles = {
    xs: 'mb-3',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8',
    xl: 'mb-10',
  }

  return (
    <section className={`${spacingStyles[spacing]} ${className}`} {...props}>
      {title && (
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          {subtitle && (
            <p className="text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/**
 * Divider Component
 * Horizontal divider with optional label
 */
export const Divider = ({
  label,
  className,
  spacing = 'md',
  ...props
}) => {
  const spacingStyles = {
    xs: 'my-2',
    sm: 'my-3',
    md: 'my-4',
    lg: 'my-6',
  }

  if (label) {
    return (
      <div
        className={`flex items-center gap-3 ${spacingStyles[spacing]} ${className}`}
        {...props}
      >
        <div className="flex-1 border-t-2 border-border" />
        <span className="text-sm text-text-tertiary font-medium">{label}</span>
        <div className="flex-1 border-t-2 border-border" />
      </div>
    )
  }

  return (
    <div
      className={`border-t-2 border-border ${spacingStyles[spacing]} ${className}`}
      {...props}
    />
  )
}

export default PageContainer
