# CivicsCoach Frontend

A React (Vite) frontend for AI-powered constitutional debate generation with Chain of Thought prompting controls.

## Features

- **Modern React Interface**: Built with Vite for fast development
- **Chain of Thought Toggle**: User control over CoT reasoning
- **Real-time Debate Generation**: Interactive form with live results
- **Structured Response Display**: Tabbed interface for stance, counter-stance, citations, and quiz
- **Responsive Design**: Works on desktop and mobile devices
- **Token Usage Tracking**: Real-time metrics display

## Architecture

```
frontend/
├── src/
│   ├── components/
│   │   └── DebateBox.jsx          # Debate results display component
│   ├── pages/
│   │   └── Debate.jsx             # Main debate generation page
│   ├── services/
│   │   └── api.js                 # API integration service
│   ├── styles.css                 # Global styles and components
│   ├── App.jsx                    # Main application component
│   └── main.jsx                   # Application entry point
├── public/
│   └── index.html                 # HTML template
└── package.json
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## User Interface

### Main Debate Page

The interface includes:

1. **Query Input**: Large textarea for constitutional questions
2. **Proficiency Level**: Dropdown (Beginner/Intermediate/Advanced)
3. **Top-K Control**: Number of citations to retrieve (1-10)
4. **Temperature Slider**: Model creativity control (0.0-2.0)
5. **Top-P Slider**: Sampling parameter (0.0-1.0)
6. **Chain of Thought Toggle**: Enable/disable internal reasoning
7. **Generate Button**: Submit request to backend

### Results Display

Results are displayed in a tabbed interface:

1. **Stance Tab**: Main argument/position
2. **Counter-Stance Tab**: Opposing viewpoint
3. **Citations Tab**: Evidence and sources with metadata
4. **Quiz Tab**: Knowledge check questions with answers

### Metadata Panel

Shows generation statistics:
- Tokens used (input/output/total)
- Number of citations retrieved
- CoT status (enabled/disabled)
- Generation parameters

## Components

### DebateBox Component

```jsx
<DebateBox data={result.data} />
```

**Props:**
- `data`: Object containing stance, counterStance, citations, quiz

**Features:**
- Tabbed navigation between result sections
- Citation display with source attribution
- Quiz questions with correct answer highlighting
- Responsive design for mobile devices

### Debate Page Component

```jsx
<Debate />
```

**State Management:**
- Form inputs (query, proficiency, topK, etc.)
- Loading states
- Error handling
- Results display

## API Integration

### Service Layer

```javascript
// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const generateDebate = async (params) => {
  const response = await fetch(`${API_BASE_URL}/api/debate/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return response.json();
};
```

### Request Format

```javascript
{
  query: "What is the Basic Structure Doctrine?",
  proficiency: "intermediate",
  topK: 4,
  useCoT: true,
  temperature: 0.2,
  top_p: 1.0
}
```

### Response Handling

```javascript
if (response.ok) {
  setResult(response.data);
  setError(null);
} else {
  setError(response.error || 'Failed to generate debate');
}
```

## Styling

### CSS Architecture

- **Global Styles**: Reset, typography, layout
- **Component Styles**: Form elements, buttons, cards
- **Responsive Design**: Mobile-first approach
- **Theme**: Purple/blue gradient with modern UI

### Key Style Features

1. **Gradient Background**: Professional purple/blue theme
2. **Card-based Layout**: Clean, modern interface
3. **Smooth Animations**: Hover effects and transitions
4. **Form Validation**: Visual feedback for errors
5. **Loading States**: Spinner and disabled states

## User Experience

### Form Validation

- Required field validation
- Real-time error display
- Loading state management
- Success feedback

### Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color scheme

### Mobile Responsiveness

- Responsive grid layouts
- Touch-friendly controls
- Optimized typography
- Collapsible sections

## Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_APP_TITLE`: Application title
- `VITE_APP_VERSION`: Application version

### Build Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

## Development

### Adding New Features

1. **New Components**: Create in `src/components/`
2. **New Pages**: Add to `src/pages/` and update routing
3. **Styling**: Add to `src/styles.css` or create component-specific CSS
4. **API Integration**: Extend `src/services/api.js`

### Code Structure

```javascript
// Component template
import React, { useState, useEffect } from 'react';

const ComponentName = ({ props }) => {
  const [state, setState] = useState(initialValue);

  const handleEvent = () => {
    // Event handling logic
  };

  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

## Testing

### Manual Testing

1. **Form Submission**: Test all input combinations
2. **Error Handling**: Test API failures and validation
3. **Responsive Design**: Test on different screen sizes
4. **Accessibility**: Test with screen readers

### Automated Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Performance

### Optimization

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format and lazy loading
- **Caching**: Service worker for offline support

### Monitoring

- **Bundle Size**: Track JavaScript bundle size
- **Load Times**: Monitor page load performance
- **API Response**: Track backend response times
- **User Interactions**: Monitor form submission success rates

## Deployment

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

1. **Vercel**: Automatic deployment from Git
2. **Netlify**: Drag-and-drop deployment
3. **GitHub Pages**: Static site hosting
4. **AWS S3**: Cloud hosting with CDN

## Troubleshooting

### Common Issues

1. **API Connection**: Check VITE_API_BASE_URL configuration
2. **CORS Errors**: Ensure backend CORS is properly configured
3. **Build Errors**: Check for missing dependencies
4. **Styling Issues**: Verify CSS class names and structure

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('debug', 'true');
```

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain responsive design principles
4. Add comprehensive error handling
5. Include accessibility features
6. Test on multiple devices and browsers
