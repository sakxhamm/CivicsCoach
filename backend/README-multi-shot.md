# Multi-Shot Prompting System - CivicsCoach

## Overview

The Multi-Shot Prompting System is an advanced AI prompting technique that provides multiple examples to guide AI model responses. This system significantly improves response quality, consistency, and educational value for constitutional law education.

## What is Multi-Shot Prompting?

Multi-shot prompting provides 2-3 carefully crafted examples to the AI model, enabling it to:
- Understand expected output format and style
- Learn through demonstration rather than just instructions
- Produce more consistent and high-quality responses
- Reduce ambiguity and improve accuracy

## Key Features

- **4 Task Types**: Debate, Analysis, Comparison, Explanation
- **Proficiency-Based Examples**: Beginner, Intermediate, Advanced levels
- **Automatic Example Selection**: Smart matching based on user needs
- **Comprehensive Examples**: 8 curated examples across all task types
- **Flexible Configuration**: Custom options and additional context support

## Installation

The system is already included in the CivicsCoach backend. No additional installation required.

## Quick Start

### Basic Usage

```javascript
const { MultiShotPromptEngine } = require('./src/prompts/multiShotPrompt');

// Initialize the engine
const multiShotEngine = new MultiShotPromptEngine();

// Generate a debate prompt
const debatePrompt = multiShotEngine.generateDebatePrompt(
  "Judicial Activism in Indian Democracy",
  "Intermediate",
  retrievedChunks
);

// Use the prompt with your AI service
const response = await callAI(debatePrompt.messages);
```

### Available Task Types

#### 1. Debate Generation
```javascript
const debatePrompt = multiShotEngine.generateDebatePrompt(
  topic,           // string: debate topic
  proficiency,     // string: "Beginner", "Intermediate", "Advanced"
  retrievedChunks, // array: constitutional source chunks
  options          // object: additional options
);
```

#### 2. Analysis Generation
```javascript
const analysisPrompt = multiShotEngine.generateAnalysisPrompt(
  topic,           // string: concept to analyze
  proficiency,     // string: proficiency level
  retrievedChunks, // array: source material
  options          // object: additional options
);
```

#### 3. Comparison Generation
```javascript
const comparisonPrompt = multiShotEngine.generateComparisonPrompt(
  topic,           // string: concepts to compare
  proficiency,     // string: proficiency level
  retrievedChunks, // array: source material
  options          // object: additional options
);
```

#### 4. Explanation Generation
```javascript
const explanationPrompt = multiShotEngine.generateExplanationPrompt(
  topic,           // string: concept to explain
  proficiency,     // string: proficiency level
  retrievedChunks, // array: source material
  options          // object: additional options
);
```

### Advanced Options

```javascript
const prompt = multiShotEngine.generateDebatePrompt(
  topic,
  proficiency,
  retrievedChunks,
  {
    additionalContext: "Focus on recent developments and current challenges",
    customFormat: "specific_format_requirements"
  }
);
```

## Example Sets

### Debate Examples
- **Separation of Powers** (Intermediate)
- **Fundamental Rights vs Directive Principles** (Advanced)

### Analysis Examples
- **Basic Structure Doctrine** (Intermediate)
- **Federalism in India** (Advanced)

### Comparison Examples
- **Parliamentary vs Presidential Systems** (Intermediate)
- **Fundamental Rights vs Human Rights** (Advanced)

### Explanation Examples
- **Judicial Review** (Beginner)
- **Rule of Law** (Intermediate)

## Proficiency Levels

### Beginner
- Simple, clear explanations
- Basic constitutional concepts
- Practical examples and applications
- Common misconceptions addressed

### Intermediate
- Moderate complexity
- Detailed explanations
- Constitutional provisions referenced
- Balanced analysis

### Advanced
- Complex reasoning
- Sophisticated analysis
- Comprehensive citations
- Current challenges and debates

## Output Format

Each task type produces structured JSON output:

### Debate Output
```json
{
  "stance": "Main argument supporting the topic",
  "counterStance": "Opposing viewpoint",
  "citations": [
    {
      "id": "unique_identifier",
      "source": "source_name",
      "snippet": "relevant_text_excerpt",
      "relevance": "explanation_of_relevance"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Why this is correct"
    }
  ],
  "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"]
}
```

### Analysis Output
```json
{
  "conceptDefinition": "Clear definition",
  "constitutionalBasis": "Relevant articles and provisions",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"],
  "historicalContext": "Historical background",
  "currentRelevance": "Contemporary application",
  "implications": "Practical implications",
  "challenges": "Current challenges",
  "summary": "Concise summary"
}
```

## Testing

### Run Basic Tests
```bash
cd backend/scripts
node test_multi_shot_prompting.js
```

### Run Comparison Demo
```bash
node demo_multi_shot_vs_zero_shot.js
```

### Expected Test Output
```
🚀 Testing Multi-Shot Prompting System

📊 System Statistics:
- Total Task Types: 4
- Total Examples: 8
- Task Types: debate, analysis, comparison, explanation

✅ Successfully generated prompts for all task types
✅ Examples are properly selected based on proficiency levels
✅ Prompt structure includes comprehensive examples
```

## System Statistics

```javascript
const stats = multiShotEngine.getSystemStats();
console.log(stats);
```

Output:
```json
{
  "totalTaskTypes": 4,
  "totalExamples": 8,
  "taskTypes": ["debate", "analysis", "comparison", "explanation"],
  "examplesByTask": {
    "debate": {
      "totalExamples": 2,
      "proficiencyLevels": ["Intermediate", "Advanced"],
      "averageExampleLength": 1418
    }
  }
}
```

## Integration with AI Services

### Google Gemini
```javascript
const { callGemini } = require('./src/services/geminiService');

const prompt = multiShotEngine.generateDebatePrompt(topic, proficiency, chunks);
const response = await callGemini({
  messages: prompt.messages,
  temperature: 0.2,
  top_p: 1.0
});
```

### OpenAI GPT
```javascript
const { Configuration, OpenAIApi } = require('openai');

const prompt = multiShotEngine.generateAnalysisPrompt(topic, proficiency, chunks);
const response = await openai.createChatCompletion({
  model: "gpt-4",
  messages: prompt.messages,
  temperature: 0.2
});
```

## Best Practices

### 1. Example Selection
- Ensure examples match the task type
- Use appropriate proficiency levels
- Include diverse constitutional topics
- Maintain high quality standards

### 2. Proficiency Matching
- Match examples to user skill level
- Provide progressive complexity
- Ensure examples are understandable
- Balance challenge and accessibility

### 3. Context Integration
- Use relevant retrieved chunks
- Provide additional context when needed
- Adapt to specific user requirements
- Maintain constitutional accuracy

### 4. Quality Assurance
- Regularly review and update examples
- Test with different proficiency levels
- Validate output quality
- Gather user feedback

## Troubleshooting

### Common Issues

#### 1. Examples Not Selected
```javascript
// Check proficiency level spelling
const prompt = multiShotEngine.generateDebatePrompt(
  topic,
  "Intermediate", // Must match exactly: "Beginner", "Intermediate", "Advanced"
  chunks
);
```

#### 2. Prompt Too Long
```javascript
// Reduce examples count in task definitions
// Or use zero-shot prompting for simple tasks
```

#### 3. Format Inconsistencies
```javascript
// Ensure examples follow exact output format
// Check JSON structure in examples
```

### Debug Mode

```javascript
// Enable detailed logging
const prompt = multiShotEngine.generateDebatePrompt(topic, proficiency, chunks);
console.log('Prompt Metadata:', prompt.metadata);
console.log('Prompt Messages:', prompt.messages);
```

## Performance Considerations

### Token Usage
- Multi-shot prompts use more tokens than zero-shot
- Examples increase prompt length by 2-3x
- Consider token limits of your AI service
- Balance quality vs cost

### Response Time
- Longer prompts may increase response time
- Examples improve response quality
- Consider caching for repeated queries
- Optimize example selection

## Future Enhancements

### Planned Features
- Dynamic example generation
- Enhanced proficiency levels
- Quality metrics and feedback
- Multi-modal examples

### Customization Options
- User-specific example sets
- Adaptive difficulty adjustment
- Personalized learning paths
- Integration with learning management systems

## Contributing

### Adding New Examples
1. Identify the task type and proficiency level
2. Create high-quality example output
3. Ensure constitutional accuracy
4. Test with the system
5. Update documentation

### Improving Examples
1. Gather user feedback
2. Analyze response quality
3. Refine example structure
4. Test with different topics
5. Validate improvements

## Support

For questions or issues:
1. Check the test scripts
2. Review the documentation
3. Examine example outputs
4. Test with different parameters
5. Contact the development team

## License

This system is part of CivicsCoach and follows the same licensing terms.

---

**Multi-Shot Prompting: Transforming AI Constitutional Law Education**

The Multi-Shot Prompting System represents a significant advancement in AI-powered education, providing students with high-quality, consistent, and educational constitutional law content while maintaining the flexibility to adapt to different proficiency levels and task requirements.
