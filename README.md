
# Quiz Application

A modern, interactive quiz application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Start Page**: Email collection with form validation
- **Quiz Countdown**: 5-second countdown before quiz starts (prevents API rate limit issues)
- **Quiz Interface**: 15 multiple-choice questions with navigation
- **Timer**: 30-minute countdown timer with auto-submission
- **Progress Tracking**: Visual progress bar and question navigation
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful design with shadcn/ui components

## Quiz Flow

1. **Start Page**: User enters their email address
2. **Countdown**: 5-second countdown before quiz starts
3. **Loading**: Questions are fetched from the OpenTDB API via a Next.js API route
4. **Quiz**: 15 questions with 30-minute timer
5. **Completion**: Results are submitted and displayed

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
  ```bash
  npm install
  ```
3. Run the development server:
  ```bash
  npm run dev
  ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application page
│   ├── quiz/page.tsx     # Quiz logic and countdown
│   ├── reports/page.tsx  # Results page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── StartPage.tsx     # Email collection page
│   ├── QuizPage.tsx      # Main quiz interface
│   ├── QuestionCard.tsx  # Individual question component
│   ├── Timer.tsx         # Countdown timer
│   ├── QuizReport.tsx    # Results/report component
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api.ts            # API functions (fetches from /api/questions)
│   └── utils.ts          # Utility functions
└── types/
   └── quiz.ts           # TypeScript interfaces
```

## API Flow

- Questions are fetched from the OpenTDB API via the Next.js API route: `/api/questions`
- The frontend never calls OpenTDB directly (avoids CORS and rate limit issues)
- If the API is rate-limited, the user sees a friendly error and the page auto-retries

## Question Format

Questions follow this structure:

```typescript
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
}
```

## Customization

### Styling
- Uses Tailwind CSS for styling
- shadcn/ui components for consistent design
- Easy to customize colors and themes

### Timer Duration
- Change `30 * 60` in `QuizPage.tsx` to modify timer duration

### Question Count
- Change the API call in `src/app/api/questions/route.ts` to adjust the number of questions

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in `src/components/`
2. Import and use in main page
3. Add TypeScript interfaces if needed

## License

MIT License - feel free to use this project for your own applications.
