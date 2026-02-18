import React from 'react'

/**
 * Button Component
 * Supports multiple variants: primary, secondary, outline, ghost
 * Supports multiple sizes: sm, md, lg
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className,
  ...props
}) => {
  const baseStyles = `
    inline-flex
    items-center
    justify-center
    font-medium
    rounded-md
    transition-all duration-base
    cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
  `

  const variantStyles = {
    primary: `
      bg-brand-primary
      text-white
      hover:bg-brand-primary-dark
      focus:ring-brand-primary
      active:scale-95
    `,
    secondary: `
      bg-brand-secondary
      text-white
      hover:bg-brand-secondary-dark
      focus:ring-brand-secondary
      active:scale-95
    `,
    accent: `
      bg-brand-accent
      text-white
      hover:bg-brand-accent-dark
      focus:ring-brand-accent
      active:scale-95
    `,
    outline: `
      bg-transparent
      border-2
      border-brand-primary
      text-brand-primary
      hover:bg-brand-primary-50
      focus:ring-brand-primary
    `,
    ghost: `
      bg-transparent
      text-brand-primary
      hover:bg-brand-primary-50
      focus:ring-brand-primary
    `,
    danger: `
      bg-error
      text-white
      hover:bg-red-700
      focus:ring-error
      active:scale-95
    `,
    success: `
      bg-success
      text-white
      hover:bg-green-700
      focus:ring-success
      active:scale-95
    `,
  }

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-3',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {Icon && !loading && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}
      {children}
    </button>
  )
}

export default Button
