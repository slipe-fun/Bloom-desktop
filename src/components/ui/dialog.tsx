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
                    'fixed inset-0 z-50 bg-black/15 backdrop-blur-sm',
                    overlayClassName
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={EASING.middleSpring}
                />
              }
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Popup
                render={
                  <motion.div
                    className={cn(
                      'w-full max-w-md rounded-[40px] bg-popover shadow-[0_5px_24px_0px_rgba(0,0,0,0.08)] focus:outline-none',
                      className
                    )}
                    initial={{ opacity: 0, y: "-25%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "25%" }}
                    transition={EASING.middleSpring}
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

// Экспортируем вспомогательные примитивы Base UI для семантики и accessibility
export const ModalTitle = Dialog.Title;
export const ModalDescription = Dialog.Description;
export const ModalClose = Dialog.Close;