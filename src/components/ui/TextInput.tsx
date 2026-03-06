import {forwardRef, InputHTMLAttributes, ReactNode, useState} from 'react';
import Icon from './Icon.tsx';
import {ICONS} from '../../constants/icons.ts';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: keyof typeof ICONS;
  error?: boolean;
  leftElement?: ReactNode;
  variant?: 'primary' | 'secondary';
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({icon = 'at', variant = 'primary', leftElement, error, className = '', value, type, ...props}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const hasText = Boolean(value || props.defaultValue);
    const isPasswordInput = type === 'password';
    const inputType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

    const baseStyles = `
      flex h-xxxxl w-full items-center rounded-full transition-shadow
      ${error ? 'ring-2 !ring-backdrop-red' : ''}
      ${!isPasswordInput ? 'pr-xxxxl' : 'pr-2'}
    `;

    const varians = {
      primary: 'bg-background border border-border',
      secondary: 'bg-foreground-soft',
    }

    return (
      <div
        className={`
          ${baseStyles}
          ${varians[variant]}
          ${className}
        `}
      >
        <div className="flex aspect-square h-full shrink-0 items-center justify-center relative">
          {leftElement ? (
            leftElement
          ) : (
            <Icon
              icon={icon}
              size={24}
              className={`
                transition-colors ${hasText ? 'text-text-main' : 'text-text-secondary'}
                ${error ? '!text-red' : ''}
              `}
            />
          )}
        </div>

        <input
          ref={ref}
          value={value}
          type={inputType}
          className="text-md h-full w-full bg-transparent focus:outline-none placeholder:text-text-secondary placeholder:text-md placeholder:select-none"
          {...props}
        />

        {isPasswordInput && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="flex aspect-square h-full shrink-0 items-center justify-center text-text-secondary hover:text-text-main transition-colors focus:outline-none hover:cursor-pointer"
          >
            <Icon
              icon={(showPassword ? 'eye.slashed' : 'eye') as keyof typeof ICONS}
              size={24}
            />
          </button>
        )}
      </div>
    );
  }
);

export default TextInput;
