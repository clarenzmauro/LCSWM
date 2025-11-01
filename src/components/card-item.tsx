import { forwardRef } from 'react';
import type { CardData } from '../types';

interface CardItemProps {
  card: CardData;
  isSelected: boolean;
  isFocused: boolean;
  isExpanded?: boolean;
  panelId?: string;
  onClick: () => void;
}

export const CardItem = forwardRef<HTMLButtonElement, CardItemProps>(
  ({ card, isSelected, isFocused, isExpanded = false, panelId, onClick }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          bg-white rounded-lg p-4 cursor-pointer transition-all duration-200
          w-[250px] h-[100px] text-center
          hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'}
          ${isFocused ? 'ring-2 ring-blue-500' : ''}
        `}
        onClick={onClick}
        role="button"
        tabIndex={0} // Focusable for keyboard navigation
        aria-label={`Open details for ${card.title}`}
        aria-expanded={isExpanded}
        aria-controls={panelId}
      >
        <h1 className="text-xl font-bold text-black wrap-break-words">
          {card.title}
        </h1>
      </button>
    );
  }
);

CardItem.displayName = 'CardItem';
