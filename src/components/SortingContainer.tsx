"use client"

import { useState, useCallback } from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Card as CardType } from '@/types/sorting';

const getColorFromValue = (value: number): string => {
  // Create a 14-color spectrum that follows ROYGBIV and cycles
  const colors = [
    'hsl(0, 85%, 60%)',     // Red
    'hsl(25, 85%, 55%)',    // Orange-Red
    'hsl(35, 85%, 55%)',    // Orange
    'hsl(45, 85%, 55%)',    // Orange-Yellow
    'hsl(60, 85%, 55%)',    // Yellow
    'hsl(90, 85%, 45%)',    // Yellow-Green
    'hsl(120, 85%, 40%)',   // Green
    'hsl(180, 85%, 40%)',   // Cyan
    'hsl(210, 85%, 50%)',   // Light Blue
    'hsl(240, 85%, 55%)',   // Blue
    'hsl(270, 85%, 55%)',   // Purple
    'hsl(285, 85%, 45%)',   // Purple-Violet
    'hsl(300, 85%, 45%)',   // Violet
    'hsl(330, 85%, 55%)',   // Pink
  ];

  // Use modulo to cycle through the colors
  const colorIndex = (value - 1) % colors.length;
  return colors[colorIndex];
};

const generateInitialCards = (count: number): CardType[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `card-${i}`,
    value: i + 1,
    color: getColorFromValue(i + 1),
    isPinned: false,
    isRecommendation: true
  }));
};

export const SortingContainer = () => {
  const [cards, setCards] = useState<CardType[]>(generateInitialCards(4));
  const [showDragHandles, setShowDragHandles] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  const handleReset = useCallback(() => {
    setCards(generateInitialCards(4));
  }, []);

  const handleMove = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= cards.length) return;
    setCards(prevCards => {
      const newCards = [...prevCards];
      const [movedCard] = newCards.splice(fromIndex, 1);
      // Pin the card when moved
      if (!movedCard.isPinned) {
        movedCard.isPinned = true;
      }
      newCards.splice(toIndex, 0, movedCard);
      return newCards;
    });
  }, [cards.length]);

  const handleReorder = useCallback((newCards: CardType[]) => {
    setCards(prevCards => {
      return newCards.map(card => {
        // Only pin the card that was actually dragged
        if (card.id === draggedCardId && !card.isPinned) {
          return { ...card, isPinned: true };
        }
        return card;
      });
    });
  }, [draggedCardId]);

  const handlePinCard = useCallback((index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], isPinned: true };
      return newCards;
    });
  }, []);

  const handleRemoveCard = useCallback((index: number) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      newCards.splice(index, 1);
      const maxValue = Math.max(...newCards.map(card => card.value), 0);
      newCards.push({
        id: `card-${Date.now()}`,
        value: maxValue + 1,
        color: getColorFromValue(maxValue + 1),
        isPinned: false,
        isRecommendation: true
      });
      return newCards;
    });
  }, []);

  const handleReloadRecommendations = useCallback(() => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const unpinnedCards = newCards.filter(card => !card.isPinned);
      if (unpinnedCards.length === 0) return newCards;
      
      const highestUnpinnedCard = unpinnedCards.reduce((highest, current) => 
        current.value > highest.value ? current : highest
      );
      
      const indexToReplace = newCards.findIndex(card => 
        card.id === highestUnpinnedCard.id
      );
      
      const maxValue = Math.max(...newCards.map(card => card.value), 0);
      newCards[indexToReplace] = {
        id: `card-${Date.now()}`,
        value: maxValue + 1,
        color: getColorFromValue(maxValue + 1),
        isPinned: true,
        isRecommendation: true
      };
      
      return newCards;
    });
  }, []);

  const handleQueryNew = useCallback(() => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const initialUnpinnedCards = newCards.filter(card => !card.isPinned);
      if (initialUnpinnedCards.length === 0) return newCards; // If all cards are pinned, do nothing
      
      // Randomly select how many cards to replace (at least 1)
      const numToReplace = Math.max(1, Math.floor(Math.random() * initialUnpinnedCards.length));
      
      // Get the indices of unpinned cards
      const unpinnedIndices = newCards
        .map((card, index) => (!card.isPinned ? index : -1))
        .filter(index => index !== -1);
      
      // Shuffle and take the first numToReplace indices
      const indicesToReplace = unpinnedIndices
        .sort(() => Math.random() - 0.5)
        .slice(0, numToReplace);
      
      // Find the highest value among all cards
      const maxValue = Math.max(...newCards.map(card => card.value), 0);
      
      // Replace the selected cards
      indicesToReplace.forEach((index, i) => {
        newCards[index] = {
          id: `card-${Date.now()}-${i}`,
          value: maxValue + i + 1,
          color: getColorFromValue(maxValue + i + 1),
          isPinned: false,
          isRecommendation: true
        };
      });
      
      // Create a new array with pinned cards in their original positions
      const finalCards = [...newCards];
      
      // Get all unpinned cards and their original indices
      const unpinnedWithIndices = finalCards
        .map((card, index) => (!card.isPinned ? { card, index } : null))
        .filter(item => item !== null);
      
      // Sort unpinned cards by value
      const sortedUnpinned = unpinnedWithIndices
        .map(item => item!.card)
        .sort((a, b) => a.value - b.value);
      
      // Place sorted unpinned cards back in their original positions
      unpinnedWithIndices.forEach((item, i) => {
        finalCards[item!.index] = sortedUnpinned[i];
      });
      
      return finalCards;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Card Sorter</h1>
          <div className="flex gap-4 h-10">
            <button
              onClick={handleReset}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              title="Reset to initial state"
            >
              ↺
            </button>
            <button
              onClick={() => setShowDragHandles(!showDragHandles)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors"
              title={showDragHandles ? "Hide drag handles" : "Show drag handles"}
            >
              {showDragHandles ? "✋" : "👆"}
            </button>
            <button
              onClick={handleReloadRecommendations}
              className="px-6 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Add a new one
            </button>
            <button
              onClick={handleQueryNew}
              className="px-6 h-10 flex items-center justify-center bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
            >
              Query new
            </button>
          </div>
        </div>

        <Reorder.Group
          axis="y"
          values={cards}
          onReorder={handleReorder}
          className="flex flex-col"
          layoutScroll
          style={{ 
            minHeight: cards.length * 120 + 'px',  // Approximate height based on card count
            position: 'relative'
          }}
        >
          <AnimatePresence>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                onPinCard={handlePinCard}
                onRemoveCard={handleRemoveCard}
                onMove={handleMove}
                showDragHandle={showDragHandles}
                totalCards={cards.length}
                onDragStart={() => setDraggedCardId(card.id)}
                onDragEnd={() => setDraggedCardId(null)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  );
}; 