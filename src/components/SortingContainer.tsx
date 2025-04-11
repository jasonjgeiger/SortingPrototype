"use client"
import { useState, useCallback } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Card as CardType, SortingMethod } from '@/types/sorting';

const getNextCardValue = (cards: CardType[]): number => {
  const maxValue = Math.max(...cards.map(card => card.value), 0);
  return maxValue + 1;
};

const generateRecommendation = (cards: CardType[]): CardType => ({
  id: `rec-${Date.now()}`,
  value: getNextCardValue(cards),
  color: `hsl(${(Math.random() * 360)}, 70%, 60%)`,
  isPinned: false,
  isRecommendation: true,
});

const generateInitialCards = (count: number = 4): CardType[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `rec-${i}`,
    value: i + 1,
    color: `hsl(${(i * 90) % 360}, 70%, 60%)`,
    isPinned: false,
    isRecommendation: true,
  }));
};

const CardList = ({ cards, moveCard, onPinCard, onRemoveCard, showDragHandle }: { 
  cards: CardType[]; 
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onPinCard: (index: number) => void;
  onRemoveCard: (index: number) => void;
  showDragHandle: boolean;
}) => {
  const [, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { id: string; index: number }) => {
      // This is a placeholder - the actual drop handling is done in the Card component
    },
  }));

  return (
    <div ref={drop as any} className="space-y-8">
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              card={card} 
              index={index} 
              moveCard={moveCard} 
              onPinCard={onPinCard}
              onRemoveCard={onRemoveCard}
              showDragHandle={showDragHandle}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const SortingContainer = () => {
  const [cards, setCards] = useState<CardType[]>(generateInitialCards(4));
  const [sortingMethod, setSortingMethod] = useState<SortingMethod>('bubble');
  const [isSorting, setIsSorting] = useState(false);
  const [showDragHandles, setShowDragHandles] = useState(false);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: CardType[]) => {
      const newCards = [...prevCards];
      const draggedCard = { ...newCards[dragIndex] };
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCard);
      return newCards;
    });
  }, []);

  const handlePinCard = useCallback((index: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[index] = {
        ...newCards[index],
        isPinned: true,
        isRecommendation: false,
      };
      return newCards;
    });
  }, []);

  const handleAddCard = useCallback(() => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const lastUnpinnedIndex = newCards.findIndex(card => !card.isPinned);
      if (lastUnpinnedIndex !== -1) {
        newCards[lastUnpinnedIndex] = generateRecommendation(newCards);
      }
      return newCards;
    });
  }, []);

  const handleRemoveCard = useCallback((index: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[index] = generateRecommendation(newCards);
      return newCards;
    });
  }, []);

  const reloadRecommendations = useCallback(() => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const maxValue = Math.max(...newCards.map(card => card.value), 0);
      
      // Only replace unpinned cards with new recommendations
      newCards.forEach((card, index) => {
        if (!card.isPinned) {
          newCards[index] = {
            id: `rec-${Date.now()}-${index}`,
            value: maxValue + index + 1,
            color: `hsl(${(Math.random() * 360)}, 70%, 60%)`,
            isPinned: false,
            isRecommendation: true,
          };
        }
      });
      
      return newCards;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Card Sorter</h1>
            <div className="space-x-4">
              <button
                onClick={() => setShowDragHandles(!showDragHandles)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                title={showDragHandles ? "Hide drag handles" : "Show drag handles"}
              >
                {showDragHandles ? "✋" : "👆"}
              </button>
              <button
                onClick={reloadRecommendations}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Get more
              </button>
            </div>
          </div>

          <CardList 
            cards={cards} 
            moveCard={moveCard} 
            onPinCard={handlePinCard}
            onRemoveCard={handleRemoveCard}
            showDragHandle={showDragHandles}
          />
        </div>
      </div>
    </DndProvider>
  );
}; 