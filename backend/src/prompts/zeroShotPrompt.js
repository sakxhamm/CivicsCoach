/**
 * Zero-Shot Prompting System for CivicsCoach
 * 
 * This system demonstrates zero-shot prompting by:
 * 1. Providing clear task instructions without examples
 * 2. Using structured prompts that guide the AI to understand the task
 * 3. Leveraging the AI's pre-trained knowledge to perform tasks it wasn't specifically trained for
 * 4. Creating prompts that are self-contained and don't require prior examples
 */

class ZeroShotPromptEngine {
  constructor() {
    this.taskDefinitions = this.createTaskDefinitions();
    this.promptTemplates = this.createPromptTemplates();
  }

  /**
   * Defines different types of tasks that can be performed with zero-shot prompting
   */
  createTaskDefinitions() {
    return {
      debate: {
        description: "Generate a structured debate with stance, counter-stance, citations, and quiz",
        outputFormat: "JSON with stance, counterStance, citations[], quiz[]",
        constraints: [
          "Use retrieved chunks as source-of-truth",
          "Provide balanced arguments",
          "Include relevant citations",
          "Create educational quiz questions"
        ]
      },
      analysis: {
        description: "Analyze constitutional concepts and provide detailed explanations",
        outputFormat: "Structured analysis with key points, implications, and examples",
        constraints: [
          "Focus on constitutional principles",
          "Explain implications clearly",
          "Provide historical context where relevant",
          "Use accessible language for the specified proficiency level"
        ]
      },
      comparison: {
        description: "Compare and contrast different constitutional concepts or doctrines",
        outputFormat: "Comparison table with similarities, differences, and conclusions",
        constraints: [
          "Identify key similarities and differences",
          "Provide balanced analysis",
          "Include relevant constitutional references",
          "Draw meaningful conclusions"
        ]
      },
      explanation: {
        description: "Explain complex constitutional concepts in simple terms",
        outputFormat: "Clear explanation with examples and key takeaways",
        constraints: [
          "Use simple, clear language",
          "Provide concrete examples",
          "Break down complex concepts",
          "Include practical implications"
        ]
      }
    };
  }

  /**
   * Creates prompt templates optimized for zero-shot learning
   */
  createPromptTemplates() {
    return {
      system: {
        role: "system",
        content: `You are CivicsCoach, an expert AI assistant specializing in Indian Constitutional Law and Political Science. You have comprehensive knowledge of constitutional principles, legal doctrines, and political systems.

Your capabilities include:
- Analyzing constitutional concepts and legal principles
- Generating balanced debates and arguments
- Explaining complex legal concepts in accessible terms
- Comparing different constitutional doctrines
- Providing evidence-based analysis using constitutional sources

You can perform these tasks without specific examples or training data, relying on your pre-trained knowledge and understanding of constitutional law.`
      },
      
      debate: {
        role: "user",
        template: `TASK: Generate a structured debate on the following topic using zero-shot prompting.

TOPIC: {topic}
USER PROFICIENCY: {proficiency}
CITATIONS TO USE: {retrievedChunks}

REQUIRED OUTPUT FORMAT (JSON):
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

INSTRUCTIONS:
1. Use ONLY the provided citations as factual sources
2. Generate balanced arguments without bias
3. Create educational quiz questions that test understanding
4. Ensure all claims are supported by citations
5. Adapt language complexity to match user proficiency level
6. Return ONLY valid JSON - no additional commentary

This is a zero-shot task - you have not been specifically trained for this exact format, but you can perform it based on your understanding of debate structure and constitutional law.`
      },

      analysis: {
        role: "user",
        template: `TASK: Perform a zero-shot analysis of the following constitutional concept.

CONCEPT: {topic}
ANALYSIS DEPTH: {proficiency}
CONTEXT: {retrievedChunks}

REQUIRED OUTPUT FORMAT (JSON):
{
  "conceptDefinition": "Clear definition of the concept",
  "constitutionalBasis": "Constitutional articles and provisions that establish this concept",
  "keyPrinciples": ["Principle 1", "Principle 2", "Principle 3"],
  "historicalContext": "Brief historical background and evolution",
  "currentRelevance": "How this concept applies in contemporary governance",
  "implications": "Practical implications for democracy and governance",
  "challenges": "Current challenges or controversies related to this concept",
  "summary": "Concise summary of key points"
}

INSTRUCTIONS:
1. Analyze the concept using your constitutional knowledge
2. Provide specific constitutional references where possible
3. Explain implications clearly and practically
4. Adapt complexity to user proficiency level
5. Use the provided context to enhance your analysis
6. Return ONLY valid JSON - no additional commentary

This is a zero-shot analysis task - you can perform it based on your understanding of constitutional law without specific training examples.`
      },

      comparison: {
        role: "user",
        template: `TASK: Perform a zero-shot comparison of constitutional concepts.

CONCEPTS TO COMPARE: {topic}
COMPARISON SCOPE: {proficiency}
REFERENCE MATERIAL: {retrievedChunks}

REQUIRED OUTPUT FORMAT (JSON):
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
    "relativeStrengths": "Analysis of which concept is stronger in different contexts",
    "practicalImplications": "How these differences affect governance"
  },
  "conclusion": "Synthesized conclusion about the comparison"
}

INSTRUCTIONS:
1. Identify the concepts to compare from the topic
2. Provide balanced analysis of both concepts
3. Highlight meaningful similarities and differences
4. Draw practical conclusions about governance implications
5. Use constitutional knowledge to support your analysis
6. Return ONLY valid JSON - no additional commentary

This is a zero-shot comparison task - you can perform it based on your understanding of constitutional concepts without specific training examples.`
      },

      explanation: {
        role: "user",
        template: `TASK: Provide a zero-shot explanation of a constitutional concept.

CONCEPT TO EXPLAIN: {topic}
EXPLANATION LEVEL: {proficiency}
SUPPORTING CONTEXT: {retrievedChunks}

REQUIRED OUTPUT FORMAT (JSON):
{
  "simpleDefinition": "One-sentence definition in simple terms",
  "detailedExplanation": "Comprehensive explanation breaking down the concept",
  "keyComponents": ["Component 1", "Component 2", "Component 3"],
  "examples": [
    {
      "scenario": "Real-world scenario where this concept applies",
      "explanation": "How the concept works in this scenario"
    }
  ],
  "whyItMatters": "Why this concept is important for democracy and governance",
  "commonMisconceptions": ["Misconception 1", "Misconception 2"],
  "practicalApplications": "How citizens can understand and apply this concept",
  "summary": "Key takeaway in simple terms"
}

INSTRUCTIONS:
1. Explain the concept in simple, accessible language
2. Use concrete examples to illustrate abstract concepts
3. Connect the concept to everyday governance
4. Address common misunderstandings
5. Make the explanation practical and actionable
6. Return ONLY valid JSON - no additional commentary

This is a zero-shot explanation task - you can perform it based on your understanding of constitutional law without specific training examples.`
      }
    };
  }

  /**
   * Generates a zero-shot prompt for the specified task type
   */
  generateZeroShotPrompt(taskType, topic, proficiency, retrievedChunks, options = {}) {
    // Validate task type
    if (!this.taskDefinitions[taskType]) {
      throw new Error(`Unknown task type: ${taskType}. Available types: ${Object.keys(this.taskDefinitions).join(', ')}`);
    }

    // Get task definition and template
    const taskDef = this.taskDefinitions[taskType];
    const template = this.promptTemplates[taskType];

    // Format the template with actual values
    const formattedTemplate = template.template
      .replace('{topic}', topic)
      .replace('{proficiency}', proficiency)
      .replace('{retrievedChunks}', this.formatRetrievedChunks(retrievedChunks));

    // Build the message structure
    const messages = [
      this.promptTemplates.system,
      {
        role: template.role,
        content: formattedTemplate
      }
    ];

    // Add any additional context if provided
    if (options.additionalContext) {
      messages.push({
        role: "user",
        content: `ADDITIONAL CONTEXT: ${options.additionalContext}`
      });
    }

    return {
      messages,
      metadata: {
        taskType,
        taskDescription: taskDef.description,
        outputFormat: taskDef.outputFormat,
        constraints: taskDef.constraints,
        promptLength: formattedTemplate.length,
        zeroShotFeatures: [
          'no_examples_provided',
          'self_contained_instructions',
          'pre_trained_knowledge_utilization',
          'structured_output_format'
        ]
      }
    };
  }

  /**
   * Formats retrieved chunks for inclusion in prompts
   */
  formatRetrievedChunks(chunks) {
    if (!chunks || chunks.length === 0) {
      return "No specific citations provided. Use your constitutional knowledge to provide accurate information.";
    }

    return chunks.map((chunk, i) => 
      `${i + 1}) [${chunk.id || 'chunk' + i}] ${chunk.text.slice(0, 300)}...`
    ).join('\n\n');
  }

  /**
   * Generates a debate prompt using zero-shot approach
   */
  generateDebatePrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateZeroShotPrompt('debate', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Generates an analysis prompt using zero-shot approach
   */
  generateAnalysisPrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateZeroShotPrompt('analysis', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Generates a comparison prompt using zero-shot approach
   */
  generateComparisonPrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateZeroShotPrompt('comparison', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Generates an explanation prompt using zero-shot approach
   */
  generateExplanationPrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateZeroShotPrompt('explanation', topic, proficiency, retrievedChunks, options);
  }
}

// Export the zero-shot prompt engine
module.exports = { ZeroShotPromptEngine };
