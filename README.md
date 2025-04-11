# Card Sorter

A modern web application for sorting and organizing cards with drag-and-drop functionality and intuitive controls.

## Features

- **Card Management**
  - Add and remove cards
  - Like cards to keep them in place
  - Move cards up and down using arrow controls
  - Drag and drop cards to reorder (optional)

- **Intuitive Controls**
  - Arrow buttons (↑↓) for precise card movement
  - Like button (😊) to mark favorite cards
  - Remove button (❌) to delete cards
  - Toggle drag handles (✋/👆) for drag-and-drop functionality

- **Visual Feedback**
  - Smooth animations during card movement
  - Clear visual indicators for liked cards
  - Hover effects on interactive elements
  - Responsive layout

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd card-sorter
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Moving Cards**
   - Use the arrow buttons (↑↓) on the left side of each card to move it up or down
   - Toggle drag handles in the header to enable drag-and-drop functionality
   - Drag cards using the handle at the bottom of each card

2. **Managing Cards**
   - Click the 😊 button to like a card (it will stay in place)
   - Click the ❌ button to remove a card
   - Click "Get more" in the header to generate new cards

3. **Drag and Drop**
   - Click the hand emoji (✋) in the header to show drag handles
   - Drag cards using the handle at the bottom
   - Cards will automatically be liked when moved to a new position

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React DnD

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application can be easily deployed to Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or deploy directly through the [Vercel Dashboard](https://vercel.com) by connecting your GitHub repository.

## License

MIT
