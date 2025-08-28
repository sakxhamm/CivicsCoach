# CivicsCoach Backend

A Node.js/Express backend for AI-powered constitutional debate generation using Google Gemini API with Chain of Thought prompting.

## Features

- **Chain of Thought Prompting**: Safe internal reasoning for improved accuracy
- **Evidence-Based Responses**: Retrieval from constitutional corpus
- **Structured JSON Output**: Validated debate responses with citations and quiz
- **Google Gemini Integration**: Advanced language model for constitutional analysis
- **Evaluation Framework**: Automated testing with 5 sample prompts

## Architecture

```
backend/
├── src/
│   ├── controllers/
│   │   └── debateController.js    # Main debate generation logic
│   ├── services/
│   │   └── geminiService.js       # Google Gemini API integration
│   ├── prompts/
│   │   └── chainOfThoughtPrompt.js # CoT prompt engineering
│   ├── utils/
│   │   └── jsonValidator.js       # Response validation
│   ├── routes/
│   │   └── debateRoutes.js        # API endpoints
│   └── index.js                   # Express server setup
├── data/
│   └── corpus_chunks.json         # Constitutional knowledge base
├── scripts/
│   ├── run_eval.js               # Evaluation framework
│   └── seed_corpus.js            # Corpus management
└── package.json
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

## API Endpoints

### POST /api/debate/generate

Generate a structured debate response with evidence and citations.

**Request Body:**
```json
{
  "query": "What is the Basic Structure Doctrine?",
  "proficiency": "intermediate",
  "topK": 4,
  "useCoT": true,
  "temperature": 0.2,
  "top_p": 1.0
}
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "stance": "The Basic Structure Doctrine...",
    "counterStance": "However, critics argue...",
    "citations": [
      {
        "id": "basic_structure",
        "source": "Supreme Court Judgment",
        "snippet": "The Basic Structure Doctrine was established..."
      }
    ],
    "quiz": [
      {
        "q": "Which case established the Basic Structure Doctrine?",
        "options": ["Kesavananda Bharati", "Golak Nath"],
        "answerIndex": 0
      }
    ]
  },
  "metadata": {
    "retrievedChunks": 3,
    "useCoT": true,
    "temperature": 0.2,
    "top_p": 1.0,
    "tokens": {
      "input": 1500,
      "output": 800,
      "total": 2300
    }
  }
}
```

## Chain of Thought Implementation

### Safe CoT Prompting

The system uses "Safe Chain of Thought" where:
- AI performs internal step-by-step reasoning
- Internal thoughts are NOT revealed to users
- Stop token `</reasoning>` prevents internal reasoning from appearing
- Only final, polished answers are shown

### Prompt Structure

```javascript
ROLE: You are CivicsCoach — an evidence-first debate coach for Indian Polity.
TASK: Produce a JSON object with fields: stance, counterStance, citations[], quiz[].
FORMAT: Return ONLY valid JSON (no extra commentary).
CONSTRAINTS: You MAY use internal step-by-step reasoning to improve accuracy, 
BUT DO NOT reveal the chain-of-thought. Use the provided retrieved text chunks 
as source-of-truth. Provide at least 2 citations where possible.
Stop token for internal scratchpad: </reasoning>
```

## Corpus Management

### Seed Corpus
The system includes 5 constitutional knowledge chunks:
- Article 110 (Money Bills)
- Basic Structure Doctrine
- Emergency Powers (Article 352)
- Judicial Review
- Federal Structure

### Adding New Chunks
```bash
node scripts/seed_corpus.js
```

## Evaluation Framework

### Running Evaluation
```bash
node scripts/run_eval.js
```

The evaluation script:
- Tests 5 sample constitutional questions
- Compares CoT ON vs CoT OFF responses
- Measures token usage and quality metrics
- Provides judge prompts for manual evaluation

### Test Prompts
1. "What is the Basic Structure Doctrine and why is it important?"
2. "How does the Indian Constitution define Money Bills?"
3. "What are the emergency powers of the President under Article 352?"
4. "Explain the concept of Judicial Review in the Indian Constitution."
5. "How does federalism work in India's constitutional framework?"

## Configuration

### Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key (required)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Model Parameters
- `temperature`: Sampling temperature (0.0-2.0, default: 0.2)
- `top_p`: Top-p sampling (0.0-1.0, default: 1.0)
- `maxOutputTokens`: Maximum response length (default: 2048)

## Error Handling

The system includes comprehensive error handling:
- API key validation
- Rate limiting protection
- JSON parsing validation
- Schema validation for responses
- Graceful fallbacks for missing data

## Performance

### Token Usage Optimization
- Efficient prompt engineering
- Stop token implementation
- Configurable response length
- Caching for repeated queries

### Response Time
- Average response time: 2-5 seconds
- Depends on query complexity and CoT usage
- Optimized for constitutional accuracy

## Security

- No API keys in code
- Environment variable protection
- Input validation and sanitization
- CORS configuration
- Rate limiting considerations

## Development

### Adding New Features
1. Extend the corpus with new constitutional topics
2. Modify prompts for different debate styles
3. Add new validation schemas
4. Implement additional evaluation metrics

### Testing
```bash
# Run evaluation tests
npm run eval

# Test specific endpoints
curl -X POST http://localhost:5000/api/debate/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the Basic Structure Doctrine?"}'
```

## Troubleshooting

### Common Issues
1. **Missing API Key**: Ensure GEMINI_API_KEY is set in .env
2. **Rate Limiting**: Implement delays between requests
3. **JSON Parsing Errors**: Check response format validation
4. **Corpus Not Found**: Verify data/corpus_chunks.json exists

### Debug Mode
Set `NODE_ENV=development` for detailed logging and error messages.

## Contributing

1. Follow the existing code structure
2. Add comprehensive error handling
3. Include evaluation tests for new features
4. Update documentation for API changes
5. Maintain constitutional accuracy standards
