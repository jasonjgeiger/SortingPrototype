import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Card as CardType } from '@/types/sorting';
import { RefObject } from 'react';

interface CardProps {
  card: CardType;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onPinCard: (index: number) => void;
  onRemoveCard: (index: number) => void;
  showDragHandle: boolean;
}

interface DragItem {
  id: string;
  index: number;
  isRecommendation: boolean;
  isPinned: boolean;
}

export const Card = ({ card, index, moveCard, onPinCard, onRemoveCard, showDragHandle }: CardProps) => {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: 'CARD',
    item: { id: card.id, index, isRecommendation: card.isRecommendation, isPinned: card.isPinned },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'CARD',
    drop: (item) => {
      if (item.index !== index && !item.isPinned) {
        onPinCard(item.index);
      }
    },
    hover: (item, monitor) => {
      if (item.index === index) {
        return;
      }

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoveredElement = document.elementFromPoint(clientOffset.x, clientOffset.y);
      if (!hoveredElement) return;

      const hoveredRect = hoveredElement.getBoundingClientRect();
      const hoverMiddle = hoveredRect.top + hoveredRect.height / 2;
      const hoverClientY = clientOffset.y;

      // Only perform the move when the mouse has crossed half of the items height
      if (item.index < index && hoverClientY < hoverMiddle) {
        return;
      }
      if (item.index > index && hoverClientY > hoverMiddle) {
        return;
      }

      // Time to actually perform the action
      moveCard(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleMove = (newIndex: number) => {
    moveCard(index, newIndex);
    if (!card.isPinned) {
      onPinCard(newIndex);
    }
  };

  return (
    <motion.div
      ref={drop as any}
      className={`w-[400px] h-24 rounded-lg shadow-lg flex items-center select-none relative ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${card.isPinned ? 'ring-2 ring-blue-500' : ''} ${
        isOver ? 'my-24' : ''
      }`}
      style={{ backgroundColor: card.color }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Drag Handle */}
      {showDragHandle && (
        <div
          ref={drag as any}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 flex items-center justify-center cursor-move"
        >
          <div className="w-full h-full flex items-center justify-center hover:bg-white/10 rounded-b-lg">
            <span className="text-white text-2xl">⋮⋮</span>
          </div>
        </div>
      )}

      {/* Arrow Controls */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMove(index - 1);
          }}
          className="p-1 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30"
          title="Move up"
          disabled={index === 0}
        >
          ↑
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMove(index + 1);
          }}
          className="p-1 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30"
          title="Move down"
          disabled={index === 3}
        >
          ↓
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-white text-2xl font-bold select-none">{card.value}</span>
      </div>

      {/* Liked Indicator */}
      {card.isPinned && (
        <div className="absolute top-0 left-0 w-full flex justify-center">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-b-lg text-xs font-bold">
            Liked
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
        {card.isRecommendation && !card.isPinned && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPinCard(index);
            }}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30"
            title="Like this card"
          >
            😊
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveCard(index);
          }}
          className="p-1 rounded-full bg-white/20 hover:bg-white/30"
          title={card.isPinned ? "Remove liked card" : "Remove recommendation"}
        >
          ❌
        </button>
      </div>
    </motion.div>
  );
}; 