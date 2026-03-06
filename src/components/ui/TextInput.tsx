import {forwardRef, InputHTMLAttributes, ReactNode, useState} from 'react';
import Icon from './Icon.tsx';
import {ICONS} from '../../constants/icons.ts';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: keyof typeof ICONS;
  error?: boolean;
  leftElement?: ReactNode;
  variant?: 'primary' | 'secondary';
  placeholderIcon?: keyof typeof ICONS;
  placeholderAlign?: 'left' | 'center' | 'right';
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({
     icon,
     variant = 'primary',
     leftElement,
     error,
     className = '',
     value,
     type,
     placeholder,
     placeholderIcon,
     placeholderAlign = 'left',
     ...props
   }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const hasText = Boolean(value || props.defaultValue);
    const isPasswordInput = type === 'password';
    const inputType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

    const hasLeft = Boolean(icon || leftElement);
    const paddingStyles = `
      ${!hasLeft ? 'pl-xxxxl' : 'pl-2'}
      ${!isPasswordInput ? 'pr-xxxxl' : 'pr-2'}
    `;

    const baseStyles = `
      flex h-xxxxl w-full items-center rounded-full transition-shadow relative
      ${error ? 'ring-2 !ring-backdrop-red' : ''}
      ${paddingStyles}
    `;
    const variants = {
      primary: 'bg-background border border-border shadow-shadow',
      secondary: 'bg-foreground-soft',
    };

    const alignStyles = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    };

    return (
      <div
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${className}
        `}
      >
        {(icon || leftElement) && (
          <div className="flex aspect-square h-full shrink-0 items-center justify-center relative">
            {leftElement ? (
              leftElement
            ) : icon ? (
              <Icon
                icon={icon}
                size={24}
                className={`
                transition-colors ${hasText ? 'text-text-main' : 'text-text-secondary'}
                ${error ? '!text-red' : ''}
              `}
              />
            ) : null}
          </div>
        )}

        <div className="relative flex flex-1 h-full items-center">
          <input
            ref={ref}
            value={value}
            type={inputType}
            className="peer text-md h-full w-full bg-transparent focus:outline-none"
            placeholder=" "
            {...props}
          />

          <div
            className={`
              z-10 pointer-events-none absolute inset-0 flex items-center gap-xs text-text-secondary
              opacity-0 transition-opacity peer-placeholder-shown:opacity-100
              ${alignStyles[placeholderAlign]}
            `}
          >
            {placeholderIcon && (
              <Icon icon={placeholderIcon} size={20}/>
            )}
            {placeholder && (
              <span className="text-md select-none">{placeholder}</span>
            )}
          </div>
        </div>

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
