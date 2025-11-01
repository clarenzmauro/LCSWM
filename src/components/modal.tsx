import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  cardIndex: number;
}

export function Modal({ isOpen, title, description, onClose, cardIndex }: ModalProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isOpen && titleRef.current) {
      // Move focus to the panel title when it opens
      titleRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-panel"
      className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200 relative"
      role="region"
      aria-labelledby={`modal-title-${cardIndex}`}
    >
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        onClick={onClose}
        aria-label="Close panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h1
        ref={titleRef}
        id={`modal-title-${cardIndex}`}
        className="text-2xl font-bold text-black mb-4 pr-8"
        tabIndex={-1}
      >
        {title}
      </h1>

      <div className="text-gray-700 overflow-y-auto max-h-60">
        {description}
      </div>
    </div>
  );
}