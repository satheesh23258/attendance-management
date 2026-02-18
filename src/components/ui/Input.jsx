import React, { useState } from 'react'

/**
 * Input Component
 * Supports different types: text, email, password, number, etc.
 * Supports labels, error messages, and helper text
 */
export const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  helperText,
  icon: Icon,
  className,
  size = 'md',
  variant = 'default',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  const baseStyles = `
    w-full
    px-4
    py-2.5
    bg-white
    border-2
    rounded-md
    font-medium
    transition-all duration-base
    focus:outline-none
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:bg-surface
  `

  const variantStyles = {
    default: `
      border-border
      text-text-primary
      placeholder:text-text-tertiary
      focus:border-brand-primary
      focus:ring-2
      focus:ring-brand-primary-50
      hover:border-brand-secondary
    `,
    filled: `
      border-0
      bg-surface
      text-text-primary
      placeholder:text-text-tertiary
      focus:border-2
      focus:border-brand-primary
      focus:ring-2
      focus:ring-brand-primary-50
    `,
  }

  const sizeStyles = {
    sm: 'text-sm h-9',
    md: 'text-base h-11',
    lg: 'text-lg h-13',
  }

  const errorStyles = error ? 'border-error focus:border-error focus:ring-red-50' : ''

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
            <Icon size={20} />
          </div>
        )}

        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            ${baseStyles}
            ${variantStyles[variant]}
            ${sizeStyles[size]}
            ${errorStyles}
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-error mt-2 font-medium">{error}</p>}
      {helperText && !error && <p className="text-sm text-text-tertiary mt-2">{helperText}</p>}
    </div>
  )
}

export default Input
