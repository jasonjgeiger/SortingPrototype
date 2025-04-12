import { motion, Reorder, useDragControls } from 'framer-motion';
import { Card as CardType } from '@/types/sorting';

interface CardProps {
  card: CardType;
  index: number;
  onPinCard: (index: number) => void;
  onRemoveCard: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  showDragHandle: boolean;
  totalCards: number;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export const Card = ({ 
  card, 
  index, 
  onPinCard, 
  onRemoveCard, 
  onMove, 
  showDragHandle, 
  totalCards,
  onDragStart,
  onDragEnd 
}: CardProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={card}
      id={card.id}
      dragListener={false}
      dragControls={dragControls}
      className="py-4 w-full flex justify-center"
      style={{ position: 'relative' }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        layout="position"
        className="w-full max-w-4xl rounded-lg shadow-lg flex items-center select-none px-4"
        style={{ 
          backgroundColor: card.color,
          height: '6rem',
          touchAction: 'none'
        }}
        initial={false}
        animate={{ 
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            mass: 0.8 
          }
        }}
      >
        {/* Arrow Controls */}
        <div className="flex gap-4 h-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(index, index - 1);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 hover:cursor-pointer disabled:cursor-not-allowed"
            title="Move card up"
            disabled={index === 0}
          >
            ↑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMove(index, index + 1);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 hover:cursor-pointer disabled:cursor-not-allowed"
            title="Move card down"
            disabled={index === totalCards - 1}
          >
            ↓
          </button>
        </div>

        {/* Card Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <span className="text-white text-2xl font-bold select-none">{card.value}</span>
            {showDragHandle && (
              <div 
                className="w-10 h-10 flex items-center justify-center cursor-grab active:cursor-grabbing bg-white/10 rounded-lg hover:bg-white/20"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  dragControls.start(e);
                }}
                title="Drag to reorder"
              >
                <span className="select-none">⋮⋮</span>
              </div>
            )}
          </div>
        </div>

        {/* Liked Indicator */}
        {card.isPinned && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[5px] left-0 w-full flex justify-center pointer-events-none"
          >
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Liked
            </span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 h-10">
          {card.isRecommendation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!card.isPinned) {
                  onPinCard(index);
                }
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                card.isPinned 
                  ? 'bg-white/10 cursor-not-allowed opacity-30' 
                  : 'bg-white/20 hover:bg-white/30 hover:cursor-pointer'
              }`}
              title={card.isPinned ? "Already liked" : "Like this card"}
              disabled={card.isPinned}
            >
              😊
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveCard(index);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 hover:cursor-pointer"
            title="Remove this card"
          >
            ❌
          </button>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}; 