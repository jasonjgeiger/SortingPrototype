import { Card as CardType } from '@/types/sorting';

interface PreviewSectionProps {
  cards: CardType[];
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ cards }) => {
  return (
    <div 
      className="w-full h-[30vh] flex items-center justify-center overflow-x-auto bg-gray-50 p-4 mb-6 rounded-lg shadow-sm"
    >
      {cards.map((card) => (
        <div
          key={`preview-${card.id}`}
          className="flex flex-col items-center justify-center min-w-[280px] h-[126px] mr-4 shadow-sm border border-gray-200 relative"
          style={{ 
            backgroundColor: card.color,
            borderRadius: '32px' 
          }}
        >
          <div className="text-2xl font-bold text-white drop-shadow-md">
            {card.value}
          </div>
          {card.isPinned && (
            <div className="absolute top-[-10px] left-0 w-full flex justify-center pointer-events-none"><span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">Liked</span></div>
          )}
        </div>
      ))}
    </div>
  );
};