import {ButtonHTMLAttributes, forwardRef} from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'icon-secondary';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, variant = 'primary', className = '', ...props}, ref) => {
    const baseStyles = `
      h-super flex items-center justify-center rounded-full transition-all
      active:scale-95 select-none
      enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-20
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background
    `;

    const variants = {
      primary: `
        w-full bg-primary text-lg font-semibold text-white
        enabled:hover:bg-backdrop-primary focus-visible:ring-primary/50
      `,
      'icon-secondary': `
        aspect-square bg-background text-text-content shadow-md
        enabled:hover:bg-foreground-soft focus-visible:ring-foreground
      `,
    };

    return (
      <button
        ref={ref}
        {...props}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${className}
        `}
      >
        {children}
      </button>
    );
  }
);

export default Button;
