import { Dialog } from '@base-ui/react/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASING } from '@/constants/animations-easing';

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export function CustomModal({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
}: CustomModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal keepMounted>
            <Dialog.Backdrop
              render={
                <motion.div
                  className={cn(
                    'fixed inset-0 z-50 bg-popover-backdrop backdrop-blur-sm',
                    overlayClassName
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={EASING.normalSpring}
                />
              }
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Popup
                render={
                  <motion.div
                    className={cn(
                      'w-full max-w-md rounded-4xl overflow-hidden bg-popover focus:outline-none',
                      className
                    )}
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                    transition={EASING.normalSpring}
                  />
                }
              >
                {children}
              </Dialog.Popup>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export const ModalTitle = Dialog.Title;
export const ModalDescription = Dialog.Description;
export const ModalCloseButton = Dialog.Close;
export const ModalClose = Dialog.Close;