# Multi-Shot Prompting in CivicsCoach

## Overview

Multi-shot prompting is an advanced AI technique that provides multiple examples to guide AI responses, enabling the system to learn from patterns and maintain consistent quality. Instead of relying on single examples or no examples at all, multi-shot prompting gives the AI a comprehensive understanding of what's expected through multiple demonstrations.

## What is Multi-Shot Prompting?

Multi-shot prompting is like having a master craftsman show you multiple finished pieces before asking you to create your own. The AI receives several examples of the task it needs to perform, each showing:

- The input query or question
- The expected output format and structure
- The quality standard to maintain
- The style and approach to use

By studying multiple examples, the AI can:
- Understand the expected format and structure
- Learn the appropriate level of detail and complexity
- Maintain consistent quality across responses
- Adapt to different user proficiency levels
- Recognize patterns and apply them appropriately

### Key Characteristics

1. **Multiple Examples**: Provides several examples for comprehensive learning
2. **Quality Benchmarking**: Examples serve as quality standards
3. **Format Guidance**: Clear understanding of expected output structure
4. **Style Adaptation**: Learns and replicates specific writing styles
5. **Consistency Maintenance**: Ensures uniform quality across responses

## Why Multi-Shot Prompting Matters

### Traditional AI Limitations
- Single examples provide limited guidance
- Inconsistent quality across responses
- Difficulty maintaining format standards
- Limited understanding of user expectations

### Multi-Shot Advantages
- **Better Learning**: Multiple examples provide comprehensive guidance
- **Quality Consistency**: Maintains high standards across all responses
- **Format Standardization**: Ensures uniform output structure
- **Proficiency Adaptation**: Automatically adjusts to user knowledge levels
- **Professional Standards**: Examples serve as quality benchmarks

## How It Works

### 1. Example Database
The system maintains a comprehensive database of examples organized by:

```javascript
const exampleDatabase = {
  debate: {
    beginner: [/* beginner-level debate examples */],
    intermediate: [/* intermediate-level debate examples */],
    advanced: [/* advanced-level debate examples */]
  },
  analysis: {
    beginner: [/* beginner-level analysis examples */],
    intermediate: [/* intermediate-level analysis examples */],
    advanced: [/* advanced-level analysis examples */]
  }
};
```

### 2. Intelligent Example Selection
The system automatically selects the most appropriate examples:

```javascript
selectExamples(taskType, proficiency, query, count = 2) {
  // Get examples for the specified task type and proficiency
  const examples = this.exampleDatabase[taskType]?.[proficiency] || [];
  
  // Score examples based on query similarity
  const scoredExamples = examples.map(example => {
    const queryWords = query.toLowerCase().split(' ');
    const exampleWords = example.query.toLowerCase().split(' ');
    
    let score = 0;
    queryWords.forEach(word => {
      if (exampleWords.includes(word)) score += 1;
    });
    
    return { ...example, score };
  });
  
  // Return top-scoring examples
  return scoredExamples
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
```

### 3. Multi-Shot Prompt Generation
Each prompt includes multiple examples for learning:

```javascript
const promptTemplate = `TASK: Generate a structured debate using multi-shot prompting.

TOPIC: {topic}
USER PROFICIENCY: {proficiency}
CITATIONS TO USE: {retrievedChunks}

EXAMPLES TO FOLLOW:
{examples}

REQUIRED OUTPUT FORMAT (JSON):
{
  "stance": "Main argument supporting the topic (150 words max)",
  "counterStance": "Opposing viewpoint or counter-argument (150 words max)",
  "citations": [...],
  "quiz": [...]
}

INSTRUCTIONS:
1. Study the provided examples to understand the expected format and style
2. Use ONLY the provided citations as factual sources
3. Generate balanced arguments without bias
4. Create educational quiz questions that test understanding
5. Ensure all claims are supported by citations
6. Adapt language complexity to match user proficiency level
7. Return ONLY valid JSON - no additional commentary

Use the examples as a guide for the quality, structure, and depth of your response.`;
```

## Implementation Architecture

### Core Components

#### MultiShotPromptEngine
Main orchestrator that coordinates all multi-shot prompting functionality.

#### Example Database
Comprehensive collection of examples organized by task type and user proficiency.

#### Example Selector
Intelligent system that chooses the most relevant examples for each query.

#### Prompt Templates
Structured prompts that incorporate multiple examples for learning.

### Code Structure

```javascript
class MultiShotPromptEngine {
  constructor() {
    this.exampleDatabase = this.createExampleDatabase();
    this.promptTemplates = this.createPromptTemplates();
    this.exampleSelector = this.createExampleSelector();
  }

  generateMultiShotPrompt(taskType, topic, proficiency, retrievedChunks, options) {
    // Validate task type
    // Select appropriate examples
    // Format template with examples
    // Build message structure
    // Return formatted prompt
  }
}
```

## Available Task Types

### 1. Debate Generation
**Purpose**: Create structured debates with balanced arguments
**Output**: JSON with stance, counter-stance, citations, and quiz
**Examples**: Multiple debate examples showing different constitutional topics
**Use Case**: When users want to explore both sides of a constitutional issue

### 2. Concept Analysis
**Purpose**: Deep analysis of constitutional concepts
**Output**: Structured analysis with definition, constitutional basis, and implications
**Examples**: Multiple analysis examples demonstrating different levels of detail
**Use Case**: When users need comprehensive understanding of a concept

## Example Database Content

### Debate Examples

#### Beginner Level
- **Constitution of India**: Basic explanation with simple language
- **Fundamental Rights**: Clear, accessible explanation of basic rights

#### Intermediate Level
- **Indian Parliament**: Detailed explanation of parliamentary structure
- **President's Role**: Comprehensive analysis of presidential powers

#### Advanced Level
- **Basic Structure Doctrine**: Complex analysis with legal implications
- **Federal Structure**: Detailed examination of India's federal system

### Analysis Examples

#### Beginner Level
- **Judicial Review**: Simple explanation of court powers

#### Intermediate Level
- **Directive Principles**: Detailed explanation of government guidelines

#### Advanced Level
- **Constitutional Interpretation**: Complex analysis of legal evolution

## Usage Examples

### Example 1: Multi-Shot Debate Generation
```javascript
const multiShotPrompt = multiShotPromptEngine.generateDebatePrompt(
  "What is the Basic Structure Doctrine?",
  "advanced",
  retrievedChunks,
  { exampleCount: 3 }
);
```

**What Happens**: The AI receives three advanced-level debate examples, learns the expected format and depth, then generates a response that matches this quality standard.

### Example 2: Multi-Shot Concept Analysis
```javascript
const analysisPrompt = multiShotPromptEngine.generateAnalysisPrompt(
  "Federalism in India",
  "intermediate",
  retrievedChunks,
  { exampleCount: 2 }
);
```

**What Happens**: The AI receives two intermediate-level analysis examples, understands the expected depth and structure, then creates an analysis that matches this standard.

## Integration with Existing System

### Backend Integration
The multi-shot prompting system is seamlessly integrated with the existing debate generation:

```javascript
// In debateController.js
if (useMultiShot) {
  const multiShotPrompt = multiShotPromptEngine.generateMultiShotPrompt(
    taskType,
    query,
    proficiency,
    retrievedChunks,
    { 
      exampleCount: parseInt(exampleCount),
      additionalContext: req.body.additionalContext 
    }
  );
  messages = multiShotPrompt.messages;
  promptMetadata = {
    promptingStrategy: 'multi-shot',
    taskType: multiShotPrompt.metadata.taskType,
    proficiency: multiShotPrompt.metadata.proficiency,
    examplesUsed: multiShotPrompt.metadata.examplesUsed,
    exampleQueries: multiShotPrompt.metadata.exampleQueries,
    multiShotFeatures: multiShotPrompt.metadata.multiShotFeatures
  };
} else {
  // Fallback to traditional prompting
  messages = buildChainMessages({...});
}
```

### Frontend Controls
Users can enable/disable multi-shot prompting and configure settings:

```jsx
<div className="form-group checkbox-group">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={useMultiShot}
      onChange={(e) => setUseMultiShot(e.target.checked)}
    />
    <span className="checkmark"></span>
    Enable Multi-Shot Prompting
  </label>
  <small className="help-text">
    Multi-shot prompting provides multiple examples to guide AI responses
  </small>
</div>

{useMultiShot && (
  <>
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="taskType">Task Type:</label>
        <select
          id="taskType"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
        >
          <option value="debate">Debate Generation</option>
          <option value="analysis">Concept Analysis</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="exampleCount">Number of Examples:</label>
        <input
          type="number"
          id="exampleCount"
          value={exampleCount}
          onChange={(e) => setExampleCount(e.target.value)}
          min="1"
          max="5"
        />
      </div>
    </div>
  </>
)}
```

## Configuration Options

### Task Types
- **debate**: Structured debate generation with multiple examples
- **analysis**: Concept analysis with multiple examples

### User Proficiency Levels
- **beginner**: Simple language and basic concepts
- **intermediate**: Balanced complexity and detailed explanations
- **advanced**: Advanced analysis with nuanced perspectives

### Example Count
- **Range**: 1-5 examples per prompt
- **Default**: 2 examples for optimal learning
- **Adaptive**: System can adjust based on query complexity

## Performance Metrics

The system tracks comprehensive metadata for multi-shot prompting:

```javascript
metadata: {
  promptingStrategy: 'multi-shot',
  taskType: 'debate',
  proficiency: 'advanced',
  examplesUsed: 3,
  exampleQueries: [
    "Explain the Basic Structure Doctrine and its implications",
    "Analyze the federal structure of India and its evolution"
  ],
  multiShotFeatures: [
    'multiple_examples_provided',
    'example_based_learning',
    'format_guidance',
    'style_adaptation',
    'quality_benchmarking'
  ]
}
```

## Fallback Behavior

When multi-shot prompting is disabled or encounters issues, the system gracefully falls back to traditional prompting:

```javascript
// Fallback to traditional chain-of-thought prompt
messages = buildChainMessages({ 
  audience: proficiency, 
  topic: query, 
  retrievedChunks, 
  minCitations: 2, 
  proficiency, 
  examples: true 
});
```

## Best Practices

### 1. Example Quality
- Ensure all examples meet the highest quality standards
- Examples should demonstrate the expected output format
- Include diverse examples to cover different scenarios
- Regularly update examples based on user feedback

### 2. Example Selection
- Choose examples that are relevant to the user's query
- Match examples to user proficiency levels
- Provide enough examples for comprehensive learning
- Balance example quantity with prompt length

### 3. Format Consistency
- Maintain consistent structure across all examples
- Use clear, unambiguous formatting
- Ensure examples demonstrate the expected output schema
- Include examples that show different complexity levels

### 4. Content Relevance
- Examples should be relevant to the constitutional domain
- Include examples that cover different types of queries
- Ensure examples are appropriate for the target audience
- Regularly review and update example content

## Troubleshooting

### Common Issues

1. **Poor Example Quality**
   - Review and update examples regularly
   - Ensure examples demonstrate expected standards
   - Test examples with different AI models

2. **Example Selection Problems**
   - Check example database coverage
   - Verify proficiency level matching
   - Review example relevance scoring

3. **Format Inconsistencies**
   - Validate example output formats
   - Ensure consistent JSON schemas
   - Test examples for format compliance

### Debug Mode

Enable debug logging to troubleshoot issues:

```javascript
// Add debug logging
console.log('Multi-Shot Prompt Debug:', {
  taskType,
  topic,
  proficiency,
  examplesSelected: examples.length,
  exampleQueries: examples.map(ex => ex.query)
});
```

## Future Enhancements

1. **More Task Types**: Adding specialized analysis types like timeline creation, impact assessment, and policy analysis
2. **Dynamic Example Generation**: Creating examples automatically based on user feedback and performance
3. **Quality Metrics**: Tracking which examples produce the best responses
4. **User Customization**: Allowing users to provide their own examples
5. **Hybrid Approaches**: Combining multi-shot with other prompting strategies

## Conclusion

Multi-shot prompting represents a significant advancement in AI capabilities. By providing multiple examples, we enable AI systems to learn not just what to do, but how to do it well and consistently.

In CivicsCoach, this technology provides users with:
- Consistently high-quality constitutional analysis
- Uniform formatting and structure across all responses
- Automatic adaptation to user proficiency levels
- Professional-grade educational content
- Reliable and predictable AI responses

The key to successful multi-shot prompting is maintaining a high-quality example database and ensuring that examples demonstrate the expected standards. When done correctly, it enables AI systems to produce consistently excellent results that meet established quality benchmarks.

Multi-shot prompting is particularly valuable in educational applications where consistency, quality, and format standardization are crucial for effective learning experiences.
