import React from 'react'

/**
 * Card Component
 * Reusable card wrapper with consistent styling and variants
 * Flexible for headers, footers, and custom content
 */
export const Card = ({
  children,
  className,
  elevated = false,
  bordered = false,
  hoverable = false,
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const baseStyles = `
    bg-white
    rounded-md
    transition-all duration-base
  `

  const shadowStyles = elevated
    ? 'shadow-md hover:shadow-lg'
    : 'shadow-sm'

  const borderStyles = bordered ? 'border-2 border-border' : ''

  const hoverStyles = hoverable
    ? 'hover:shadow-lg hover:scale-105 cursor-pointer'
    : ''

  return (
    <div
      className={`
        ${baseStyles}
        ${shadowStyles}
        ${borderStyles}
        ${hoverStyles}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader Component
 * Semantic header section for cards
 */
export const CardHeader = ({ children, className, ...props }) => (
  <div
    className={`border-b-2 border-border pb-4 mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
)

/**
 * CardTitle Component
 * Semantic title/heading for card headers
 */
export const CardTitle = ({ children, className, ...props }) => (
  <h3
    className={`text-xl font-bold text-text-primary ${className}`}
    {...props}
  >
    {children}
  </h3>
)

/**
 * CardDescription Component
 * Semantic subtitle/description for cards
 */
export const CardDescription = ({ children, className, ...props }) => (
  <p
    className={`text-sm text-text-secondary mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
)

/**
 * CardContent Component
 * Main content section for cards
 */
export const CardContent = ({ children, className, ...props }) => (
  <div className={`text-text-primary ${className}`} {...props}>
    {children}
  </div>
)

/**
 * CardFooter Component
 * Footer section for cards (often buttons)
 */
export const CardFooter = ({ children, className, ...props }) => (
  <div
    className={`border-t-2 border-border pt-4 mt-6 flex gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
)

export default Card
