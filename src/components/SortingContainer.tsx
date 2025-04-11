"use client"

import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from './Card';
import { Card as CardType } from '@/types/sorting';

const generateInitialCards = (count: number): CardType[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `card-${i}`,
    value: i + 1,
    color: `hsl(${Math.random() * 360}, 70%, 45%)`,
    isPinned: false,
    isRecommendation: true
  }));
};

const CardList = ({ cards, moveCard, onPinCard, onRemoveCard, showDragHandle }: { 
  cards: CardType[]; 
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onPinCard: (index: number) => void;
  onRemoveCard: (index: number) => void;
  showDragHandle: boolean;
}) => {
  return (
    <div className="space-y-8">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          moveCard={moveCard}
          onPinCard={onPinCard}
          onRemoveCard={onRemoveCard}
          showDragHandle={showDragHandle}
        />
      ))}
    </div>
  );
};

export const SortingContainer = () => {
  const [cards, setCards] = useState<CardType[]>(generateInitialCards(4));
  const [showDragHandles, setShowDragHandles] = useState(false);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const draggedCard = newCards[dragIndex];
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, draggedCard);
      return newCards;
    });
  }, []);

  const handlePinCard = useCallback((index: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], isPinned: true };
      return newCards;
    });
  }, []);

  const handleRemoveCard = useCallback((index: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards.splice(index, 1);
      // Find the highest value among remaining cards
      const maxValue = Math.max(...newCards.map(card => card.value), 0);
      // Add a new card with value one higher than the highest
      newCards.push({
        id: `card-${Date.now()}`,
        value: maxValue + 1,
        color: `hsl(${Math.random() * 360}, 70%, 45%)`,
        isPinned: false,
        isRecommendation: true
      });
      return newCards;
    });
  }, []);

  const handleReloadRecommendations = useCallback(() => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      // Find the highest unpinned card
      const unpinnedCards = newCards.filter(card => !card.isPinned);
      if (unpinnedCards.length === 0) return newCards; // If all cards are pinned, do nothing
      
      const highestUnpinnedCard = unpinnedCards.reduce((highest, current) => 
        current.value > highest.value ? current : highest
      );
      
      // Find the index of the highest unpinned card
      const indexToReplace = newCards.findIndex(card => 
        card.id === highestUnpinnedCard.id
      );
      
      // Replace it with a new card
      const maxValue = Math.max(...newCards.map(card => card.value), 0);
      newCards[indexToReplace] = {
        id: `card-${Date.now()}`,
        value: maxValue + 1,
        color: `hsl(${Math.random() * 360}, 70%, 45%)`,
        isPinned: true,
        isRecommendation: true
      };
      
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
                onClick={handleReloadRecommendations}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add a new one
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