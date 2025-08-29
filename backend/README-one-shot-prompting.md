# One-Shot Prompting System

## Overview

The One-Shot Prompting System is a core component of CivicsCoach that provides consistent, high-quality AI responses by showing the AI exactly one example of the desired output format. This approach bridges the gap between zero-shot prompting (no examples) and few-shot prompting (multiple examples).

## What is One-Shot Prompting?

One-shot prompting provides the AI with **exactly one example** of the desired output format before asking it to generate a similar response for new input. The AI learns the pattern from this single example and replicates it consistently.

### Key Benefits

- **Consistency**: Every response follows the same structure
- **Reliability**: More predictable than zero-shot approaches
- **Efficiency**: Only one example needed (vs. multiple in few-shot)
- **Quality Control**: Sets clear expectations for output quality

## Architecture

### Core Components

```
OneShotPromptEngine
├── Task Definitions
├── Prompt Templates
├── Examples Library
└── Response Validation
```

### Task Types Supported

1. **Debate Generation** - Structured arguments with citations and quiz
2. **Concept Analysis** - Detailed constitutional analysis
3. **Comparison** - Side-by-side analysis of concepts
4. **Explanation** - Simplified explanations for different proficiency levels

## Quick Start

### Installation

The system is already included in the CivicsCoach backend. No additional installation required.

### Basic Usage

```javascript
const OneShotPromptEngine = require('./src/prompts/oneShotPrompt');

// Create engine instance
const engine = new OneShotPromptEngine();

// Generate prompt for debate
const prompt = engine.generatePrompt('debate', {
  topic: "Should the President have veto power?",
  proficiency: 'intermediate',
  retrievedChunks: retrievedChunks
});

// Use prompt with AI service
const response = await callAI(prompt);

// Validate response
const validation = engine.validateResponse(response, 'debate');
if (validation.isValid) {
  // Use the response
  console.log(validation.response);
} else {
  console.error('Invalid response:', validation.error);
}
```

## API Reference

### OneShotPromptEngine

#### Constructor
```javascript
new OneShotPromptEngine()
```

#### Methods

##### `generatePrompt(taskType, parameters)`
Generates a one-shot prompt for the specified task.

**Parameters:**
- `taskType` (string): Type of task ('debate', 'analysis', 'comparison', 'explanation')
- `parameters` (object): Task-specific parameters
  - `topic` (string): The topic or question
  - `proficiency` (string): User proficiency level ('beginner', 'intermediate', 'advanced')
  - `retrievedChunks` (array): Retrieved context chunks

**Returns:** Array of messages for AI model

##### `getExample(taskType)`
Gets the example for a specific task type.

**Parameters:**
- `taskType` (string): Type of task

**Returns:** Example object with topic, proficiency, and example structure

##### `validateResponse(response, taskType)`
Validates AI response against expected format.

**Parameters:**
- `response` (object|string): AI response to validate
- `taskType` (string): Type of task

**Returns:** Validation result object
```javascript
{
  isValid: boolean,
  response?: object,
  error?: string
}
```

##### `generateCustomPrompt(taskType, parameters, customExample)`
Generates prompt with custom example.

**Parameters:**
- `taskType` (string): Type of task
- `parameters` (object): Task-specific parameters
- `customExample` (object): Custom example to use

**Returns:** Array of messages for AI model

## Task Types and Examples

### 1. Debate Generation

**Purpose**: Generate structured debates with balanced arguments

**Output Format**:
```json
{
  "stance": "Main argument supporting the topic (150 words max)",
  "counterStance": "Opposing viewpoint (150 words max)",
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
      "explanation": "Brief explanation"
    }
  ],
  "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"]
}
```

### 2. Concept Analysis

**Purpose**: Provide detailed constitutional concept analysis

**Output Format**:
```json
{
  "conceptDefinition": "Clear definition of the concept",
  "constitutionalBasis": "Constitutional articles and provisions",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"],
  "historicalContext": "Historical background and evolution",
  "currentRelevance": "Contemporary application",
  "implications": "Practical implications",
  "challenges": "Current challenges or controversies",
  "summary": "Concise summary of key points"
}
```

### 3. Comparison

**Purpose**: Compare and contrast constitutional concepts

**Output Format**:
```json
{
  "conceptA": {
    "name": "Name of first concept",
    "definition": "Clear definition",
    "constitutionalBasis": "Relevant constitutional provisions",
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"]
  },
  "conceptB": {
    "name": "Name of second concept",
    "definition": "Clear definition",
    "constitutionalBasis": "Relevant constitutional provisions",
    "keyFeatures": ["Feature 1", "Feature 2", "Feature 3"]
  },
  "comparison": {
    "similarities": ["Similarity 1", "Similarity 2", "Similarity 3"],
    "differences": ["Difference 1", "Difference 2", "Difference 3"],
    "relativeStrengths": "Analysis of relative strengths",
    "practicalImplications": "How differences affect governance"
  },
  "conclusion": "Synthesized conclusion"
}
```

### 4. Explanation

**Purpose**: Explain complex concepts in simple terms

**Output Format**:
```json
{
  "concept": "Concept name",
  "simpleDefinition": "Simple, clear definition",
  "constitutionalBasis": "Relevant constitutional articles",
  "keyComponents": ["Component 1", "Component 2", "Component 3"],
  "realWorldExample": "Practical example or analogy",
  "benefits": "Advantages of this concept",
  "challenges": "Potential challenges or limitations",
  "practicalImplications": "Real-world applications",
  "summary": "Simple summary with analogy"
}
```

## Examples

### Built-in Examples

The system includes carefully crafted examples for each task type:

- **Debate**: "Should the President have veto power over constitutional amendments?"
- **Analysis**: "Fundamental Rights vs Directive Principles"
- **Comparison**: "Parliamentary vs Presidential Systems"
- **Explanation**: "Separation of Powers"

### Custom Examples

You can create custom examples for specific use cases:

```javascript
const customExample = {
  topic: "Custom Topic",
  example: {
    // Your custom structure here
    field1: "Example value 1",
    field2: "Example value 2"
  }
};

const prompt = engine.generateCustomPrompt('debate', parameters, customExample);
```

## Testing

### Run Tests

```bash
# Run comprehensive tests
node scripts/test_one_shot_prompting.js

# Run demo
node scripts/demo_one_shot.js
```

### Test Coverage

The test suite covers:
- Prompt generation for all task types
- Response validation
- Custom example generation
- Comparison with zero-shot approaches
- Error handling

## Best Practices

### 1. Example Quality
- Use comprehensive, well-structured examples
- Ensure examples represent desired output quality
- Include all required fields with proper formatting

### 2. Prompt Instructions
- Provide clear, explicit guidance
- Emphasize structure replication
- Include validation requirements

### 3. Task-Specific Examples
- Create examples tailored to each task type
- Consider user proficiency levels
- Adapt complexity based on requirements

### 4. Response Validation
- Always validate AI responses
- Check for missing required fields
- Ensure output matches example structure

## Performance Considerations

### Token Usage
- One-shot prompts use moderate token counts
- More than zero-shot, less than few-shot
- Optimized examples balance quality and efficiency

### Response Time
- Fast prompt generation
- Consistent response times
- Scalable across different topics

## Integration with CivicsCoach

### Current Integration
- Integrated with Gemini AI service
- Used in debate and analysis controllers
- Supports all major task types

### Future Enhancements
- Dynamic example generation
- User preference-based examples
- Performance optimization
- Template customization

## Troubleshooting

### Common Issues

1. **Invalid Response Format**
   - Check that AI response matches example structure
   - Use `validateResponse()` to catch issues
   - Ensure all required fields are present

2. **Prompt Generation Errors**
   - Verify task type is supported
   - Check parameter completeness
   - Ensure retrieved chunks are properly formatted

3. **Performance Issues**
   - Monitor token usage
   - Optimize example length
   - Cache frequently used examples

### Debug Mode

Enable debug logging to troubleshoot issues:

```javascript
// Add to your environment
DEBUG=one-shot-prompting

// Or enable in code
console.log('Generated prompt:', JSON.stringify(prompt, null, 2));
```

## Contributing

### Adding New Task Types

1. Define task in `createTaskDefinitions()`
2. Create example in `createExamples()`
3. Add prompt template in `createPromptTemplates()`
4. Update validation logic
5. Add tests

### Improving Examples

1. Analyze current examples
2. Identify areas for improvement
3. Test with different topics
4. Validate output quality
5. Update documentation

## License

This system is part of the CivicsCoach project and follows the same licensing terms.

## Support

For questions or issues:
1. Check the documentation
2. Run the test suite
3. Review example implementations
4. Open an issue on GitHub

---

**Note**: This system is designed to work with AI models that support few-shot learning. Results may vary depending on the specific AI model used.
