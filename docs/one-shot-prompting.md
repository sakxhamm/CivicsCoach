# One-Shot Prompting in CivicsCoach

## What is One-Shot Prompting?

One-shot prompting is a technique where the AI model is provided with **exactly one example** of the desired output format before being asked to generate a similar response for a new input. This approach bridges the gap between zero-shot prompting (no examples) and few-shot prompting (multiple examples).

### Key Characteristics

- **Single Example**: Only one demonstration is provided
- **Format Learning**: The AI learns the expected structure from the example
- **Consistency**: Ensures uniform output format across different inputs
- **Efficiency**: More efficient than few-shot while more reliable than zero-shot

## How One-Shot Prompting Works

### 1. Example Provision
The system provides a complete, well-structured example that demonstrates:
- The expected output format
- The desired level of detail
- The specific structure and organization
- The tone and style to be replicated

### 2. Pattern Recognition
The AI model:
- Analyzes the provided example
- Identifies the structural patterns
- Understands the expected depth and style
- Learns the required output format

### 3. Response Generation
Using the learned pattern, the AI:
- Generates a response for the new input
- Maintains the same structure and format
- Applies the same level of detail
- Replicates the demonstrated style

## Implementation in CivicsCoach

### Core Components

#### OneShotPromptEngine Class
```javascript
class OneShotPromptEngine {
  constructor() {
    this.taskDefinitions = this.createTaskDefinitions();
    this.promptTemplates = this.createPromptTemplates();
    this.examples = this.createExamples();
  }
}
```

#### Task Types Supported
1. **Debate Generation**: Structured arguments with citations and quiz
2. **Concept Analysis**: Detailed constitutional analysis
3. **Comparison**: Side-by-side analysis of concepts
4. **Explanation**: Simplified explanations for different proficiency levels

### Example Structure

Each task type has a carefully crafted example that demonstrates:

#### Debate Example
```json
{
  "stance": "Main argument supporting the topic (150 words max)",
  "counterStance": "Opposing viewpoint or counter-argument (150 words max)",
  "citations": [
    {
      "id": "unique_identifier",
      "source": "source_name",
      "snippet": "relevant_text_excerpt",
      "relevance": "explanation_of_why_this_citation_supports_the_argument"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0,
      "explanation": "Brief explanation of why this is the correct answer"
    }
  ],
  "keyTakeaways": ["Key point 1", "Key point 2", "Key point 3"]
}
```

#### Analysis Example
```json
{
  "conceptDefinition": "Clear definition of the concept",
  "constitutionalBasis": "Constitutional articles and provisions",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"],
  "historicalContext": "Brief historical background and evolution",
  "currentRelevance": "How this concept applies in contemporary governance",
  "implications": "Practical implications for democracy and governance",
  "challenges": "Current challenges or controversies",
  "summary": "Concise summary of key points"
}
```

### Prompt Generation

The system generates prompts that include:

1. **System Message**: Defines the AI's role and capabilities
2. **User Message**: Contains the task, input, and the example
3. **Clear Instructions**: Specific guidance on following the example format

### Example Prompt Structure
```
TASK: Generate a structured debate using one-shot prompting.

TOPIC: {topic}
USER PROFICIENCY: {proficiency}
CITATIONS TO USE: {retrievedChunks}

HERE IS ONE EXAMPLE OF THE EXPECTED OUTPUT FORMAT:

EXAMPLE TOPIC: "Should the President have veto power over constitutional amendments?"
EXAMPLE OUTPUT:
{detailed_example_here}

NOW GENERATE YOUR RESPONSE FOR THE GIVEN TOPIC:
- Follow the EXACT same structure and format as the example
- Match the depth and style of the example
- Use the provided citations as factual sources
- Return ONLY valid JSON - no additional commentary

This is a one-shot task - you have been shown ONE example of the expected format and should replicate that structure for the new topic.
```

## Advantages of One-Shot Prompting

### 1. **Consistency**
- Ensures uniform output format across different topics
- Maintains consistent structure and organization
- Provides predictable response patterns

### 2. **Quality Control**
- Sets clear expectations for output quality
- Demonstrates the desired level of detail
- Establishes appropriate tone and style

### 3. **Efficiency**
- Requires only one example (vs. multiple in few-shot)
- Faster prompt generation
- Lower token usage compared to few-shot

### 4. **Reliability**
- More predictable than zero-shot approaches
- Reduces ambiguity about desired output
- Improves success rate for complex tasks

## Comparison with Other Approaches

### One-Shot vs Zero-Shot

| Aspect | One-Shot | Zero-Shot |
|--------|----------|-----------|
| **Examples** | 1 example provided | No examples |
| **Format Consistency** | High (follows example) | Variable (AI interpretation) |
| **Predictability** | High | Medium |
| **Token Usage** | Medium | Low |
| **Success Rate** | High | Medium |

### One-Shot vs Few-Shot

| Aspect | One-Shot | Few-Shot |
|--------|----------|----------|
| **Examples** | 1 example | 2-5 examples |
| **Format Consistency** | High | Very High |
| **Token Usage** | Medium | High |
| **Setup Time** | Low | Medium |
| **Flexibility** | Medium | High |

## Best Practices

### 1. **Example Quality**
- Use high-quality, well-structured examples
- Ensure examples are representative of desired output
- Include all required fields and proper formatting

### 2. **Clear Instructions**
- Provide explicit guidance on following the example
- Emphasize the importance of structure replication
- Include validation requirements

### 3. **Task-Specific Examples**
- Create examples tailored to each task type
- Consider user proficiency levels
- Adapt complexity based on requirements

### 4. **Validation**
- Implement response validation against expected format
- Check for missing required fields
- Ensure output matches example structure

## Use Cases in CivicsCoach

### 1. **Educational Content Generation**
- Consistent quiz question formats
- Uniform explanation structures
- Standardized debate formats

### 2. **Constitutional Analysis**
- Structured concept breakdowns
- Consistent citation formats
- Uniform comparison structures

### 3. **User Experience**
- Predictable response formats
- Consistent UI rendering
- Reliable data structures

## Testing and Validation

### Test Scripts
The system includes comprehensive test scripts that:
- Validate prompt generation
- Test response validation
- Compare with other prompting approaches
- Demonstrate functionality across task types

### Response Validation
```javascript
validateResponse(response, taskType) {
  // Validates AI response against expected format
  // Checks for required fields
  // Ensures structure matches example
}
```

## Future Enhancements

### 1. **Dynamic Examples**
- Generate examples based on user preferences
- Adapt examples to different proficiency levels
- Create examples from user feedback

### 2. **Template Customization**
- Allow users to define custom output formats
- Support for different response structures
- Flexible example modification

### 3. **Performance Optimization**
- Cache frequently used examples
- Optimize prompt generation
- Reduce token usage while maintaining quality

## Conclusion

One-shot prompting in CivicsCoach provides a balanced approach that combines the efficiency of zero-shot prompting with the reliability of few-shot prompting. By providing a single, well-crafted example, the system ensures consistent, high-quality outputs while maintaining reasonable token usage and setup complexity.

This approach is particularly valuable for educational applications where consistency and reliability are crucial for user experience and learning outcomes.
