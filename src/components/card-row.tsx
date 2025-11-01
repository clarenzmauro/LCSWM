import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Modal } from "./modal";
import { CardItem } from "./card-item";
import { cardData } from "../data";
import type { CardData } from "../types";

export function CardRow() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedCard = useMemo(() => {
    if (!selectedCardId) return null;
    return cardData.find(card => card.id === selectedCardId) || null;
  }, [selectedCardId]);

  const selectedCardIndex = useMemo(() => {
    if (!selectedCardId) return -1;
    return cardData.findIndex(card => card.id === selectedCardId);
  }, [selectedCardId]);

  const handleCardClick = useCallback((card: CardData, index: number) => {
    setSelectedCardId(card.id);
    setFocusedCardIndex(index);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleRowClick = useCallback((event: React.MouseEvent) => {
    // Close modal if clicking outside the modal (but inside the row)
    if (isModalOpen && event.target === event.currentTarget) {
      handleCloseModal();
    }
  }, [isModalOpen, handleCloseModal]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (isModalOpen) {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseModal();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();
        setFocusedCardIndex(prev => Math.max(0, prev - 1));
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        setFocusedCardIndex(prev => Math.min(cardData.length - 1, prev + 1));
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const focusedCard = cardData[focusedCardIndex];
        if (focusedCard) {
          handleCardClick(focusedCard, focusedCardIndex);
        }
        break;
      }
    }
  }, [isModalOpen, focusedCardIndex, handleCardClick, handleCloseModal]);

  // Update selectedCardId when focusedCardIndex changes (for visual feedback)
  useEffect(() => {
    const focusedCard = cardData[focusedCardIndex];
    if (focusedCard) {
      setSelectedCardId(focusedCard.id);
    }
  }, [focusedCardIndex]);

  // Scroll selected card into view
  useEffect(() => {
    if (selectedCardIndex >= 0 && cardRefs.current[selectedCardIndex]) {
      cardRefs.current[selectedCardIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedCardIndex]);

  return (
    <div className="relative">
      <div
        ref={rowRef}
        className="flex gap-4 justify-center overflow-x-auto px-4 py-8 focus:outline-none"
        onKeyDown={handleKeyDown}
        onClick={handleRowClick}
        tabIndex={0}
        role="group"
        aria-label="Card selection"
      >
        {cardData.map((card, index) => (
          <div key={card.id} className="flex items-center gap-4 shrink-0">
            {index > 0 && (
              <svg
                className="w-6 h-6 text-gray-400 shrink-0 hidden md:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <CardItem
              ref={(el) => { cardRefs.current[index] = el; }}
              card={card}
              isSelected={selectedCardId === card.id}
              isFocused={focusedCardIndex === index}
              isExpanded={isModalOpen && selectedCardId === card.id}
              panelId={isModalOpen && selectedCardId === card.id ? 'modal-panel' : undefined}
              onClick={() => handleCardClick(card, index)}
            />
          </div>
        ))}
      </div>
      {isModalOpen && selectedCard && selectedCardIndex >= 0 && (
        <div className="mt-4">
          <Modal
            isOpen={isModalOpen}
            title={selectedCard.title}
            description={selectedCard.description}
            onClose={handleCloseModal}
            cardIndex={selectedCardIndex}
          />
        </div>
      )}
    </div>
  );
}
