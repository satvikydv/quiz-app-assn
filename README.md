# Quiz Application

A modern, interactive quiz application built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Start Page**: Email collection with form validation
- **Quiz Interface**: 15 multiple-choice questions with navigation
- **Timer**: 30-minute countdown timer with auto-submission
- **Progress Tracking**: Visual progress bar and question navigation
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful design with shadcn/ui components

## Quiz Flow

1. **Start Page**: User enters their email address
2. **Loading**: Questions are fetched from the API
3. **Quiz**: 15 questions with 30-minute timer
4. **Completion**: Results are submitted and displayed

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
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── StartPage.tsx     # Email collection page
│   ├── QuizPage.tsx      # Main quiz interface
│   ├── QuestionCard.tsx  # Individual question component
│   ├── Timer.tsx         # Countdown timer
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api.ts           # API functions (mock data)
│   └── utils.ts         # Utility functions
└── types/
    └── quiz.ts          # TypeScript interfaces
```

## API Integration

The application currently uses mock data in `src/lib/api.ts`. To integrate with your real API:

### 1. Update `fetchQuestions()` function

Replace the mock implementation with your API call:

```typescript
export async function fetchQuestions(): Promise<Question[]> {
  const response = await fetch('YOUR_API_ENDPOINT/questions');
  const data = await response.json();
  return data.questions;
}
```

### 2. Update `submitQuizResults()` function

Replace with your submission endpoint:

```typescript
export async function submitQuizResults(submission: QuizSubmission): Promise<{ success: boolean; message: string }> {
  const response = await fetch('YOUR_API_ENDPOINT/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submission),
  });
  
  return response.json();
}
```

## Question Format

Questions should follow this structure:

```typescript
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
}
```

## Features

### Timer
- 30-minute countdown
- Color-coded (green → yellow → red)
- Auto-submits when time runs out

### Navigation
- Previous/Next buttons
- Question number grid
- Visual indicators for answered questions

### Progress Tracking
- Progress bar showing completion percentage
- Question counter
- Time remaining display

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-friendly controls

## Customization

### Styling
- Uses Tailwind CSS for styling
- shadcn/ui components for consistent design
- Easy to customize colors and themes

### Timer Duration
- Change `30 * 60` in `QuizPage.tsx` to modify timer duration
- Update the start page description accordingly

### Question Count
- Modify the question array in `api.ts`
- Update progress calculations if needed

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
