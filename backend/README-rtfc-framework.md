# RTFC Framework - Comprehensive Prompting System

## Overview

The RTFC Framework is a comprehensive prompting methodology that ensures clear, structured, and effective AI interactions. This framework is specifically designed for the CivicsCoach project to generate high-quality, consistent responses for constitutional education.

## What is RTFC?

RTFC is an acronym representing five essential components of effective AI prompting:

- **R** - **ROLE**: Defines the AI's identity and capabilities
- **T** - **TASK**: Specifies what needs to be accomplished
- **F** - **FORMAT**: Defines the expected output structure
- **C** - **CONTEXT**: Provides relevant background and information
- **C** - **CONSTRAINTS**: Sets boundaries and requirements

## Quick Start

### Installation

The RTFC framework is already included in the CivicsCoach backend. No additional installation required.

### Basic Usage

```javascript
const RTFCPromptEngine = require('./src/prompts/rtfcPrompt');

// Create engine instance
const engine = new RTFCPromptEngine();

// Generate RTFC prompt
const prompt = engine.generateRTFCPrompt('debate', {
  topic: "Should the President have veto power over constitutional amendments?",
  proficiency: 'intermediate',
  retrievedChunks: constitutionalChunks,
  context: 'constitutionalEducation'
});

// Use prompt with AI service
const response = await callAI(prompt);

// Validate response
const validation = engine.validateResponse(response, 'debate');
if (validation.isValid) {
  console.log(validation.response);
} else {
  console.error('Validation failed:', validation.error);
}
```

## Framework Components

### 1. ROLE (R)

Defines the AI's identity, expertise, and capabilities.

```javascript
civicsCoach: {
  identity: "CivicsCoach",
  expertise: "Indian Constitutional Law and Political Science",
  qualifications: [
    "Expert knowledge of constitutional principles and legal doctrines",
    "Deep understanding of Indian political systems and governance"
  ],
  capabilities: [
    "Analyze constitutional concepts with precision and clarity",
    "Generate balanced debates with evidence-based arguments"
  ],
  personality: [
    "Professional and authoritative yet approachable",
    "Balanced and objective in analysis"
  ]
}
```

**Benefits:**
- Ensures consistent AI identity across interactions
- Establishes credibility and authority
- Sets expectations for response quality and style

### 2. TASK (T)

Specifies what the AI needs to accomplish.

```javascript
debate: {
  name: "Structured Constitutional Debate Generation",
  objective: "Create a balanced, evidence-based debate on constitutional topics",
  requirements: [
    "Generate opposing viewpoints with equal weight",
    "Support arguments with constitutional citations",
    "Create educational quiz questions"
  ],
  complexity: "High - requires balanced analysis and evidence synthesis",
  expectedOutcome: "Comprehensive debate structure ready for educational use"
}
```

**Benefits:**
- Eliminates ambiguity about what is expected
- Sets clear success criteria
- Ensures comprehensive coverage of requirements

### 3. FORMAT (F)

Defines the expected output structure and organization.

```javascript
debate: {
  structure: "JSON object with specific fields",
  fields: {
    stance: {
      type: "string",
      maxLength: 150,
      description: "Main argument supporting the topic",
      requirements: "Clear, logical, evidence-based"
    },
    counterStance: {
      type: "string",
      maxLength: 150,
      description: "Opposing viewpoint or counter-argument",
      requirements: "Balanced, reasonable, well-argued"
    }
  },
  validation: "Must be valid JSON with all required fields"
}
```

**Benefits:**
- Ensures consistent output structure
- Makes UI rendering predictable
- Provides validation criteria
- Supports scalability across different topics

### 4. CONTEXT (C)

Provides relevant background information and audience context.

```javascript
constitutionalEducation: {
  audience: "Students and learners of constitutional law",
  background: "Indian constitutional framework and democratic principles",
  objectives: [
    "Understanding constitutional concepts",
    "Learning democratic governance",
    "Developing civic awareness"
  ],
  constraints: [
    "Must be accurate and legally sound",
    "Should be accessible to target proficiency level"
  ]
}
```

**Benefits:**
- Tailors responses to specific audiences
- Provides relevant background information
- Sets learning objectives
- Ensures appropriate complexity levels

### 5. CONSTRAINTS (C)

Sets boundaries and quality requirements.

```javascript
legalAccuracy: {
  category: "Legal and Constitutional",
  requirements: [
    "All constitutional references must be accurate",
    "Legal interpretations must be sound",
    "Supreme Court judgments must be correctly cited"
  ],
  limitations: [
    "Cannot provide legal advice",
    "Cannot predict court decisions",
    "Cannot interpret laws beyond constitutional context"
  ]
}
```

**Benefits:**
- Ensures quality standards are maintained
- Prevents inappropriate responses
- Sets ethical and legal boundaries
- Maintains professional standards

## Task Types Supported

### 1. Debate Generation
- Creates structured debates with opposing viewpoints
- Includes citations, quiz questions, and key takeaways
- Ensures balanced and evidence-based arguments

### 2. Concept Analysis
- Provides comprehensive constitutional concept analysis
- Includes definition, basis, principles, and implications
- Adapts complexity to user proficiency level

### 3. Comparison
- Compares and contrasts constitutional concepts
- Identifies similarities, differences, and practical implications
- Provides actionable insights for governance

### 4. Explanation
- Simplifies complex constitutional concepts
- Uses accessible language and concrete examples
- Focuses on practical understanding and application

### 5. Quiz Generation
- Creates educational assessment questions
- Tests different cognitive levels
- Aligns with learning objectives

## Context Templates

### Constitutional Education
- **Audience**: Students and learners
- **Focus**: Understanding and learning
- **Style**: Educational and informative

### Academic Research
- **Audience**: Researchers and scholars
- **Focus**: Deep analysis and rigor
- **Style**: Scholarly and comprehensive

### Public Policy
- **Audience**: Policy makers and practitioners
- **Focus**: Practical implications and implementation
- **Style**: Actionable and relevant

### General Public
- **Audience**: General citizens
- **Focus**: Civic awareness and engagement
- **Style**: Accessible and relatable

## Specialization Options

### Academic Specialization
```javascript
const academicPrompt = engine.generateSpecializedPrompt('analysis', parameters, 'academic');
// Adds: Maintain scholarly rigor, comprehensive analysis, detailed citations
```

### Beginner Specialization
```javascript
const beginnerPrompt = engine.generateSpecializedPrompt('explanation', parameters, 'beginner');
// Adds: Simple language, concrete examples, fundamental concepts
```

### Policy Specialization
```javascript
const policyPrompt = engine.generateSpecializedPrompt('comparison', parameters, 'policy');
// Adds: Practical implications, implementation challenges, actionable insights
```

## API Reference

### RTFCPromptEngine

#### Constructor
```javascript
new RTFCPromptEngine()
```

#### Methods

##### `generateRTFCPrompt(taskType, parameters)`
Generates a complete RTFC prompt.

**Parameters:**
- `taskType` (string): Type of task ('debate', 'analysis', 'comparison', 'explanation', 'quiz')
- `parameters` (object): Task-specific parameters
  - `topic` (string): The topic or question
  - `proficiency` (string): User proficiency level ('beginner', 'intermediate', 'advanced')
  - `retrievedChunks` (array): Retrieved context chunks
  - `context` (string): Context template to use
  - `customConstraints` (array): Additional custom constraints

**Returns:** Array of messages for AI model

##### `generateSpecializedPrompt(taskType, parameters, specialization)`
Generates a specialized prompt with additional requirements.

**Parameters:**
- `taskType` (string): Type of task
- `parameters` (object): Task-specific parameters
- `specialization` (string): Specialization type ('academic', 'beginner', 'policy')

**Returns:** Array of messages for AI model

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

##### `getAvailableTasks()`
Gets available task types and their descriptions.

**Returns:** Array of task objects

##### `getAvailableContexts()`
Gets available context templates and their descriptions.

**Returns:** Array of context objects

## Quality Assurance

### Response Validation
The framework includes comprehensive response validation that:
- Checks for required fields
- Validates JSON structure
- Ensures field requirements are met
- Provides specific error messages

### Validation Example
```javascript
const validation = engine.validateResponse(aiResponse, 'debate');
if (validation.isValid) {
  // Use the response
  console.log(validation.response);
} else {
  // Handle validation error
  console.error('Validation failed:', validation.error);
}
```

## Best Practices

### 1. Role Definition
- Be specific about expertise and capabilities
- Include relevant qualifications and experience
- Define personality traits and approach
- Ensure consistency across all interactions

### 2. Task Specification
- Clearly define objectives and requirements
- Set appropriate complexity levels
- Specify expected outcomes
- Include all necessary requirements

### 3. Format Design
- Design formats that support UI rendering
- Include validation criteria
- Ensure all required fields are defined
- Consider data structure and relationships

### 4. Context Provision
- Provide relevant background information
- Consider audience needs and proficiency
- Include learning objectives
- Use retrieved chunks as source material

### 5. Constraint Setting
- Set clear boundaries and limitations
- Include quality requirements
- Define ethical and legal constraints
- Balance flexibility with control

## Testing

### Run Tests
```bash
# Run comprehensive RTFC tests
node scripts/test_rtfc_framework.js

# Run demo
node scripts/demo_rtfc_framework.js
```

### Test Coverage
The test suite covers:
- Component functionality testing
- Prompt generation validation
- Response validation testing
- Specialization feature testing
- Framework benefits demonstration

## Benefits of RTFC Framework

### 1. **Structured Approach**
- Systematic prompt generation
- Consistent quality across all interactions
- Clear organization and flow

### 2. **Quality Control**
- Built-in validation and constraints
- Consistent output formats
- Professional standards maintenance

### 3. **Flexibility**
- Multiple role definitions
- Context-specific templates
- Specialization options
- Custom constraint support

### 4. **Educational Value**
- Clear learning objectives
- Proficiency-level adaptation
- Structured knowledge delivery
- Assessment and validation tools

### 5. **Scalability**
- Works across different topics
- Adapts to various user needs
- Maintains consistency at scale
- Easy to extend and modify

## Implementation Examples

### Basic Usage
```javascript
const engine = new RTFCPromptEngine();
const prompt = engine.generateRTFCPrompt('debate', {
  topic: "Your constitutional topic here",
  proficiency: 'intermediate',
  retrievedChunks: yourChunks,
  context: 'constitutionalEducation'
});
```

### Specialized Usage
```javascript
const academicPrompt = engine.generateSpecializedPrompt('analysis', {
  topic: "Advanced constitutional concept",
  proficiency: 'advanced',
  retrievedChunks: chunks,
  context: 'academicResearch'
}, 'academic');
```

### Response Validation
```javascript
const response = await callAI(prompt);
const validation = engine.validateResponse(response, 'debate');

if (validation.isValid) {
  // Process valid response
  return validation.response;
} else {
  // Handle validation error
  throw new Error(`Response validation failed: ${validation.error}`);
}
```

## Troubleshooting

### Common Issues

1. **Missing Role Properties**
   - Ensure all roles have identity, expertise, qualifications, capabilities, and personality
   - Check that arrays are properly defined

2. **Context Template Errors**
   - Verify context templates have all required properties
   - Check for undefined or null values

3. **Validation Failures**
   - Ensure AI responses match expected format
   - Check that all required fields are present
   - Verify JSON structure is valid

### Debug Mode
```javascript
// Enable debug logging
console.log('Generated prompt:', JSON.stringify(prompt, null, 2));
console.log('AI response:', JSON.stringify(response, null, 2));
```

## Future Enhancements

### 1. **Dynamic Role Generation**
- AI-generated role definitions
- Context-aware role adaptation
- User preference-based roles

### 2. **Advanced Context Management**
- Dynamic context generation
- User behavior-based context
- Real-time context updates

### 3. **Enhanced Validation**
- Content quality assessment
- Fact-checking integration
- Plagiarism detection

### 4. **Performance Optimization**
- Prompt caching and optimization
- Token usage optimization
- Response time improvement

## Contributing

### Adding New Task Types
1. Define task in `createTaskDefinitions()`
2. Create format in `createFormatDefinitions()`
3. Update validation logic
4. Add tests

### Adding New Contexts
1. Create context template in `createContextTemplates()`
2. Define audience, background, and objectives
3. Set appropriate constraints
4. Test with different task types

### Improving Components
1. Analyze current implementations
2. Identify areas for improvement
3. Test with various scenarios
4. Update documentation

## License

This framework is part of the CivicsCoach project and follows the same licensing terms.

## Support

For questions or issues:
1. Check the documentation
2. Run the test suite
3. Review example implementations
4. Open an issue on GitHub

---

**Note**: The RTFC Framework is designed to work with AI models that support structured prompting. Results may vary depending on the specific AI model used.
