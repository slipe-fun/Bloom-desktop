import Icon from "../ui/Icon.tsx";
import {ICONS} from "../../constants/icons.ts";
import React from "react";
import {AnimatePresence, motion} from "framer-motion";

interface AuthContainerProps {
  icon: keyof typeof ICONS;
  title: string;
  description?: string | React.ReactNode;
  errorText?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  formId?: string;
  isError?: boolean;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
                                                              icon,
                                                              title,
                                                              description,
                                                              errorText,
                                                              onSubmit,
                                                              children,
                                                              className = '',
                                                              formId = 'auth-step-form',
                                                              isError = false
                                                            }) => {
  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className="flex-1 select-none flex flex-col justify-center items-center gap-lg w-[356px]"
    >
      <div className={`flex select-none flex-col justify-center items-center gap-sm ${className}`}>
        <Icon icon={icon} size={108}
              className={`transition-colors duration-300 ${isError ? "text-red" : "text-primary"}`}/>
        <h1 className="text-xxxl font-bold text-text-main">{title}</h1>
      </div>

      <div className="w-full flex flex-col items-center gap-md">
        {children}
      </div>

      <div className="relative h-12 w-full min-h-[3rem] flex items-start justify-center">
        <AnimatePresence mode="popLayout">
          {isError && errorText ? (
            <motion.p
              key="error"
              initial={{opacity: 0, y: 5}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -5}}
              className="text-center font-medium text-md text-red w-full break-words"
            >
              {errorText}
            </motion.p>
          ) : (
            <motion.p
              key="desc"
              initial={{opacity: 0, y: 5}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -5}}
              className="text-center font-medium text-md text-text-secondary w-full break-words"
            >
              {description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button type="submit" className="hidden"/>
    </form>
  );
};

export default AuthContainer;
