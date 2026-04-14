import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  confirmClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  confirmClassName = 'bg-[#E8003D] hover:bg-[#C70033]',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={!isLoading ? onCancel : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#0D0D0D] border border-[#2A2A2A] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-[#AAAAAA] text-sm mb-6">{message}</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#AAAAAA] h-10 px-5 rounded-lg text-sm font-medium hover:text-white hover:border-[#555555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`${confirmClassName} h-10 px-5 rounded-lg font-semibold text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2`}
              >
                {isLoading && <Spinner size={14} />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
