import {ButtonHTMLAttributes, forwardRef} from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, className = '', ...props}, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={`
          flex h-super w-full items-center justify-center
          rounded-full bg-primary text-lg font-semibold text-white transition-all
          active:scale-95 select-none
          enabled:cursor-pointer enabled:hover:bg-backdrop-primary
          disabled:cursor-not-allowed disabled:opacity-20
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background
          ${className}
        `}
      >
        {children}
      </button>
    );
  }
);

export default Button;
