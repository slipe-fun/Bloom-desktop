import {forwardRef} from 'react';
import {HTMLMotionProps, motion} from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'icon-primary' | 'icon-secondary';
  error?: boolean;
}

const MotionButton = motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, variant = 'primary', error, className = '', ...props}, ref) => {
    const baseStyles = `
      h-smsuper flex items-center justify-center rounded-full select-none
      enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-20
      focus-visible:outline-none
      ${error ? '!bg-red !text-white' : ''}
    `;

    const variants = {
      primary: `
        w-full bg-primary text-md font-semibold text-white
      `,
      'icon-primary': `
        aspect-square bg-primary shadow-md text-white
      `,
      'icon-secondary': `
        aspect-square bg-background text-text-content shadow-md
      `,
    };

    return (
      <MotionButton
        ref={ref}
        {...props}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${className}
        `}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25
        }}
        whileHover={
          props.disabled ? {} : {
            filter: 'brightness(1.5)'
          }
        }
        whileTap={
          props.disabled ? {} : {
            filter: 'brightness(1.25)',
            scale: 1.075
          }
        }
        whileFocus={
          props.disabled ? {} : {
            filter: 'brightness(1.25)',
            scale: 1.075
          }
        }
      >
        {children}
      </MotionButton>
    );
  }
);

export default Button;
