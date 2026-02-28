import {forwardRef, InputHTMLAttributes} from 'react';

export interface VerifyInputInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const VerifyInput = forwardRef<HTMLInputElement, VerifyInputInputProps>(
  ({error, className = '', value, ...props}, ref) => {

    return (
      <input
        ref={ref}
        value={value}
        className={`
          text-xxxl h-xsuper text-center rounded-sm flex-1 w-full selection:bg-transparent
          bg-foreground-soft focus:outline-none font-semibold transition
          placeholder:text-text-secondary 'text-text-main focus:ring-2
          ${error ? 'ring-2 ring-backdrop-red !text-red focus:ring-red' : 'ring-primary'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

export default VerifyInput;
