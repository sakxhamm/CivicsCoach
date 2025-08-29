/**
 * One-Shot Prompting System for CivicsCoach
 * 
 * This system demonstrates one-shot prompting by:
 * 1. Providing a single example to guide the AI's response format
 * 2. Using the example to establish the expected output structure
 * 3. Leveraging the AI's ability to learn from minimal examples
 * 4. Creating prompts that show the desired format through demonstration
 */

class OneShotPromptEngine {
  constructor() {
    this.taskDefinitions = this.createTaskDefinitions();
    this.promptTemplates = this.createPromptTemplates();
    this.examples = this.createExamples();
  }

  /**
   * Defines different types of tasks that can be performed with one-shot prompting
   */
  createTaskDefinitions() {
    return {
      debate: {
        description: "Generate a structured debate with stance, counter-stance, citations, and quiz using one example",
        outputFormat: "JSON with stance, counterStance, citations[], quiz[]",
        constraints: [
          "Use retrieved chunks as source-of-truth",
          "Provide balanced arguments",
          "Include relevant citations",
          "Create educational quiz questions",
          "Follow the exact format shown in the example"
        ]
      },
      analysis: {
        description: "Analyze constitutional concepts and provide detailed explanations with one example",
        outputFormat: "Structured analysis with key points, implications, and examples",
        constraints: [
          "Focus on constitutional principles",
          "Explain implications clearly",
          "Provide historical context where relevant",
          "Use accessible language for the specified proficiency level",
          "Match the structure and depth of the provided example"
        ]
      },
      comparison: {
        description: "Compare and contrast different constitutional concepts or doctrines with one example",
        outputFormat: "Comparison table with similarities, differences, and conclusions",
        constraints: [
          "Identify key similarities and differences",
          "Provide balanced analysis",
          "Include relevant constitutional references",
          "Draw meaningful conclusions",
          "Follow the comparison structure shown in the example"
        ]
      },
      explanation: {
        description: "Explain complex constitutional concepts in simple terms with one example",
        outputFormat: "Clear explanation with examples and key takeaways",
        constraints: [
          "Use simple, clear language",
          "Provide concrete examples",
          "Break down complex concepts",
          "Include practical implications",
          "Match the explanation style and structure of the example"
        ]
      }
    };
  }

  /**
   * Creates comprehensive examples for one-shot learning
   */
  createExamples() {
    return {
      debate: {
        topic: "Should the President have veto power over constitutional amendments?",
        proficiency: "intermediate",
        example: {
          stance: "The President should have veto power over constitutional amendments to serve as a check on Parliament's power. This would prevent hasty constitutional changes and ensure amendments reflect broad consensus. The President, as the guardian of the Constitution, can evaluate whether proposed amendments preserve fundamental constitutional values and democratic principles.",
          counterStance: "Giving the President veto power over constitutional amendments could create unnecessary delays and political gridlock. Since constitutional amendments already require special majorities in Parliament, additional executive oversight may be redundant and could undermine parliamentary sovereignty. The current system has worked effectively for decades.",
          citations: [
            {
              id: "article368",
              source: "Constitution of India, Article 368",
              snippet: "Article 368 provides the procedure for amending the Constitution, requiring special majorities in both houses of Parliament.",
              relevance: "Shows the current amendment procedure and highlights the absence of presidential veto power."
            }
          ],
          quiz: [
            {
              question: "What majority is required in Parliament to pass a constitutional amendment?",
              options: ["Simple majority", "Two-thirds majority", "Three-fourths majority", "Unanimous consent"],
              answerIndex: 1,
              explanation: "Constitutional amendments require a two-thirds majority of members present and voting in each house of Parliament."
            }
          ],
          keyTakeaways: [
            "Constitutional amendments currently require only parliamentary approval",
            "The President has no veto power over constitutional amendments",
            "Special majorities provide some protection against hasty changes"
          ]
        }
      },
      analysis: {
        topic: "Fundamental Rights vs Directive Principles",
        proficiency: "intermediate",
        example: {
          conceptDefinition: "Fundamental Rights are justiciable constitutional guarantees that protect individual liberties, while Directive Principles are non-justiciable guidelines for state policy.",
          constitutionalBasis: "Fundamental Rights are enshrined in Part III (Articles 12-35), while Directive Principles are in Part IV (Articles 36-51) of the Constitution.",
          keyPrinciples: [
            "Fundamental Rights are enforceable in courts",
            "Directive Principles guide state policy but are not legally binding",
            "Both aim to establish a just and equitable society"
          ],
          historicalContext: "The distinction reflects the framers' pragmatic approach - ensuring immediate protection of essential rights while setting long-term social and economic goals.",
          currentRelevance: "Courts now interpret Fundamental Rights in light of Directive Principles, creating a harmonious relationship between individual rights and collective welfare.",
          implications: "This balance allows for progressive social reform while maintaining individual liberty protections.",
          challenges: "Tension between individual rights and collective welfare goals, especially in cases involving property rights and social justice.",
          summary: "The Constitution balances immediate individual protections with long-term social goals through this dual approach."
        }
      },
      comparison: {
        topic: "Parliamentary vs Presidential Systems",
        proficiency: "intermediate",
        example: {
          conceptA: {
            name: "Parliamentary System",
            definition: "A system where the executive derives legitimacy from and is accountable to the legislature",
            constitutionalBasis: "Articles 74, 75 establish parliamentary executive with Prime Minister and Council of Ministers",
            keyFeatures: ["Executive accountable to legislature", "Fusion of powers", "Collective responsibility"]
          },
          conceptB: {
            name: "Presidential System",
            definition: "A system where the executive is independent of the legislature and directly elected",
            constitutionalBasis: "Not present in Indian Constitution, but seen in countries like USA",
            keyFeatures: ["Separation of powers", "Fixed terms", "Direct election of executive"]
          },
          comparison: {
            similarities: ["Both aim for democratic governance", "Both have checks and balances", "Both protect fundamental rights"],
            differences: ["Accountability mechanisms differ", "Power distribution varies", "Election processes differ"],
            relativeStrengths: "Parliamentary system provides better accountability, while presidential system offers more stability.",
            practicalImplications: "India's parliamentary system ensures executive accountability but can lead to political instability."
          },
          conclusion: "India's parliamentary system balances accountability with governance effectiveness, though it requires strong institutional safeguards."
        }
      },
      explanation: {
        topic: "Separation of Powers",
        proficiency: "beginner",
        example: {
          concept: "Separation of Powers",
          simpleDefinition: "The division of government responsibilities into distinct branches to prevent concentration of power",
          constitutionalBasis: "Articles 50, 123, 226 establish separate executive, legislative, and judicial functions",
          keyComponents: [
            "Legislature makes laws (Parliament)",
            "Executive implements laws (Government)",
            "Judiciary interprets laws (Courts)"
          ],
          realWorldExample: "When Parliament passes a law (legislative), the government enforces it (executive), and courts resolve disputes about it (judicial).",
          benefits: "Prevents abuse of power, protects individual rights, ensures government accountability",
          challenges: "Can lead to gridlock, requires cooperation between branches",
          practicalImplications: "Citizens can challenge government actions in court, ensuring their rights are protected",
          summary: "Separation of powers is like having three different teams with specific jobs, working together to run the country fairly."
        }
      }
    };
  }

  /**
   * Creates prompt templates optimized for one-shot learning
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

You will be provided with ONE example to demonstrate the expected output format and style. Use this example to understand the required structure, depth, and approach for your response.`
      },
      
      debate: {
        role: "user",
        template: `TASK: Generate a structured debate on the following topic using one-shot prompting.

TOPIC: {topic}
USER PROFICIENCY: {proficiency}
CITATIONS TO USE: {retrievedChunks}

HERE IS ONE EXAMPLE OF THE EXPECTED OUTPUT FORMAT:

EXAMPLE TOPIC: "Should the President have veto power over constitutional amendments?"
EXAMPLE OUTPUT:
{
  "stance": "The President should have veto power over constitutional amendments to serve as a check on Parliament's power. This would prevent hasty constitutional changes and ensure amendments reflect broad consensus. The President, as the guardian of the Constitution, can evaluate whether proposed amendments preserve fundamental constitutional values and democratic principles.",
  "counterStance": "Giving the President veto power over constitutional amendments could create unnecessary delays and political gridlock. Since constitutional amendments already require special majorities in Parliament, additional executive oversight may be redundant and could undermine parliamentary sovereignty. The current system has worked effectively for decades.",
  "citations": [
    {
      "id": "article368",
      "source": "Constitution of India, Article 368",
      "snippet": "Article 368 provides the procedure for amending the Constitution, requiring special majorities in both houses of Parliament.",
      "relevance": "Shows the current amendment procedure and highlights the absence of presidential veto power."
    }
  ],
  "quiz": [
    {
      "question": "What majority is required in Parliament to pass a constitutional amendment?",
      "options": ["Simple majority", "Two-thirds majority", "Three-fourths majority", "Unanimous consent"],
      "answerIndex": 1,
      "explanation": "Constitutional amendments require a two-thirds majority of members present and voting in each house of Parliament."
    }
  ],
  "keyTakeaways": [
    "Constitutional amendments currently require only parliamentary approval",
    "The President has no veto power over constitutional amendments",
    "Special majorities provide some protection against hasty changes"
  ]
}

NOW GENERATE YOUR RESPONSE FOR THE GIVEN TOPIC:
- Follow the EXACT same structure and format as the example
- Match the depth and style of the example
- Use the provided citations as factual sources
- Generate balanced arguments without bias
- Create educational quiz questions that test understanding
- Ensure all claims are supported by citations
- Adapt language complexity to match user proficiency level
- Return ONLY valid JSON - no additional commentary

This is a one-shot task - you have been shown ONE example of the expected format and should replicate that structure for the new topic.`
      },

      analysis: {
        role: "user",
        template: `TASK: Perform a one-shot analysis of the following constitutional concept.

CONCEPT: {topic}
ANALYSIS DEPTH: {proficiency}
CONTEXT: {retrievedChunks}

HERE IS ONE EXAMPLE OF THE EXPECTED OUTPUT FORMAT:

EXAMPLE TOPIC: "Fundamental Rights vs Directive Principles"
EXAMPLE OUTPUT:
{
  "conceptDefinition": "Fundamental Rights are justiciable constitutional guarantees that protect individual liberties, while Directive Principles are non-justiciable guidelines for state policy.",
  "constitutionalBasis": "Fundamental Rights are enshrined in Part III (Articles 12-35), while Directive Principles are in Part IV (Articles 36-51) of the Constitution.",
  "keyPrinciples": [
    "Fundamental Rights are enforceable in courts",
    "Directive Principles guide state policy but are not legally binding",
    "Both aim to establish a just and equitable society"
  ],
  "historicalContext": "The distinction reflects the framers' pragmatic approach - ensuring immediate protection of essential rights while setting long-term social and economic goals.",
  "currentRelevance": "Courts now interpret Fundamental Rights in light of Directive Principles, creating a harmonious relationship between individual rights and collective welfare.",
  "implications": "This balance allows for progressive social reform while maintaining individual liberty protections.",
  "challenges": "Tension between individual rights and collective welfare goals, especially in cases involving property rights and social justice.",
  "summary": "The Constitution balances immediate individual protections with long-term social goals through this dual approach."
}

NOW GENERATE YOUR ANALYSIS FOR THE GIVEN CONCEPT:
- Follow the EXACT same structure and format as the example
- Match the depth and style of the example
- Analyze the concept using your constitutional knowledge
- Provide specific constitutional references where possible
- Explain implications clearly and practically
- Adapt complexity to user proficiency level
- Use the provided context to enhance your analysis
- Return ONLY valid JSON - no additional commentary

This is a one-shot analysis task - you have been shown ONE example of the expected format and should replicate that structure for the new concept.`
      },

      comparison: {
        role: "user",
        template: `TASK: Perform a one-shot comparison of constitutional concepts.

CONCEPTS TO COMPARE: {topic}
COMPARISON SCOPE: {proficiency}
REFERENCE MATERIAL: {retrievedChunks}

HERE IS ONE EXAMPLE OF THE EXPECTED OUTPUT FORMAT:

EXAMPLE TOPIC: "Parliamentary vs Presidential Systems"
EXAMPLE OUTPUT:
{
  "conceptA": {
    "name": "Parliamentary System",
    "definition": "A system where the executive derives legitimacy from and is accountable to the legislature",
    "constitutionalBasis": "Articles 74, 75 establish parliamentary executive with Prime Minister and Council of Ministers",
    "keyFeatures": ["Executive accountable to legislature", "Fusion of powers", "Collective responsibility"]
  },
  "conceptB": {
    "name": "Presidential System",
    "definition": "A system where the executive is independent of the legislature and directly elected",
    "constitutionalBasis": "Not present in Indian Constitution, but seen in countries like USA",
    "keyFeatures": ["Separation of powers", "Fixed terms", "Direct election of executive"]
  },
  "comparison": {
    "similarities": ["Both aim for democratic governance", "Both have checks and balances", "Both protect fundamental rights"],
    "differences": ["Accountability mechanisms differ", "Power distribution varies", "Election processes differ"],
    "relativeStrengths": "Parliamentary system provides better accountability, while presidential system offers more stability.",
    "practicalImplications": "India's parliamentary system ensures executive accountability but can lead to political instability."
  },
  "conclusion": "India's parliamentary system balances accountability with governance effectiveness, though it requires strong institutional safeguards."
}

NOW GENERATE YOUR COMPARISON FOR THE GIVEN CONCEPTS:
- Follow the EXACT same structure and format as the example
- Match the depth and style of the example
- Identify the concepts to compare from the topic
- Provide balanced analysis of both concepts
- Highlight meaningful similarities and differences
- Draw practical conclusions about governance implications
- Use constitutional knowledge to support your analysis
- Return ONLY valid JSON - no additional commentary

This is a one-shot comparison task - you have been shown ONE example of the expected format and should replicate that structure for the new comparison.`
      },

      explanation: {
        role: "user",
        template: `TASK: Perform a one-shot explanation of the following constitutional concept.

CONCEPT: {topic}
EXPLANATION DEPTH: {proficiency}
CONTEXT: {retrievedChunks}

HERE IS ONE EXAMPLE OF THE EXPECTED OUTPUT FORMAT:

EXAMPLE TOPIC: "Separation of Powers"
EXAMPLE OUTPUT:
{
  "concept": "Separation of Powers",
  "simpleDefinition": "The division of government responsibilities into distinct branches to prevent concentration of power",
  "constitutionalBasis": "Articles 50, 123, 226 establish separate executive, legislative, and judicial functions",
  "keyComponents": [
    "Legislature makes laws (Parliament)",
    "Executive implements laws (Government)",
    "Judiciary interprets laws (Courts)"
  ],
  "realWorldExample": "When Parliament passes a law (legislative), the government enforces it (executive), and courts resolve disputes about it (judicial).",
  "benefits": "Prevents abuse of power, protects individual rights, ensures government accountability",
  "challenges": "Can lead to gridlock, requires cooperation between branches",
  "practicalImplications": "Citizens can challenge government actions in court, ensuring their rights are protected",
  "summary": "Separation of powers is like having three different teams with specific jobs, working together to run the country fairly."
}

NOW GENERATE YOUR EXPLANATION FOR THE GIVEN CONCEPT:
- Follow the EXACT same structure and format as the example
- Match the depth and style of the example
- Use simple, clear language appropriate for the proficiency level
- Provide concrete examples and analogies
- Break down complex concepts into understandable parts
- Include practical implications and real-world applications
- Use the provided context to enhance your explanation
- Return ONLY valid JSON - no additional commentary

This is a one-shot explanation task - you have been shown ONE example of the expected format and should replicate that structure for the new concept.`
      }
    };
  }

  /**
   * Generates a one-shot prompt for the specified task
   * @param {string} taskType - Type of task (debate, analysis, comparison, explanation)
   * @param {Object} parameters - Task-specific parameters
   * @returns {Array} Array of messages for the AI model
   */
  generatePrompt(taskType, parameters) {
    const { topic, proficiency, retrievedChunks } = parameters;
    
    if (!this.promptTemplates[taskType]) {
      throw new Error(`Unknown task type: ${taskType}`);
    }

    const systemMessage = this.promptTemplates.system;
    const userMessage = {
      role: "user",
      content: this.promptTemplates[taskType].template
        .replace('{topic}', topic)
        .replace('{proficiency}', proficiency)
        .replace('{retrievedChunks}', JSON.stringify(retrievedChunks, null, 2))
    };

    return [systemMessage, userMessage];
  }

  /**
   * Gets the example for a specific task type
   * @param {string} taskType - Type of task
   * @returns {Object} Example for the task type
   */
  getExample(taskType) {
    return this.examples[taskType];
  }

  /**
   * Validates the AI response against the expected format
   * @param {Object} response - AI response to validate
   * @param {string} taskType - Type of task
   * @returns {Object} Validation result
   */
  validateResponse(response, taskType) {
    try {
      // Basic JSON validation
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }

      // Check if response has the expected structure based on task type
      const example = this.examples[taskType];
      if (!example) {
        return { isValid: false, error: 'Unknown task type' };
      }

      // Validate against example structure
      const expectedKeys = Object.keys(example.example);
      const actualKeys = Object.keys(response);
      
      const missingKeys = expectedKeys.filter(key => !actualKeys.includes(key));
      const extraKeys = actualKeys.filter(key => !expectedKeys.includes(key));

      if (missingKeys.length > 0) {
        return { 
          isValid: false, 
          error: `Missing required keys: ${missingKeys.join(', ')}` 
        };
      }

      if (extraKeys.length > 0) {
        console.warn(`Extra keys found: ${extraKeys.join(', ')}`);
      }

      return { isValid: true, response };
    } catch (error) {
      return { isValid: false, error: `JSON parsing error: ${error.message}` };
    }
  }

  /**
   * Generates a prompt with custom example
   * @param {string} taskType - Type of task
   * @param {Object} parameters - Task-specific parameters
   * @param {Object} customExample - Custom example to use
   * @returns {Array} Array of messages for the AI model
   */
  generateCustomPrompt(taskType, parameters, customExample) {
    const { topic, proficiency, retrievedChunks } = parameters;
    
    if (!this.promptTemplates[taskType]) {
      throw new Error(`Unknown task type: ${taskType}`);
    }

    const systemMessage = this.promptTemplates.system;
    
    // Create custom template with the provided example
    let customTemplate = this.promptTemplates[taskType].template;
    
    // Replace the example section with custom example
    const exampleStart = customTemplate.indexOf('EXAMPLE TOPIC:');
    const exampleEnd = customTemplate.indexOf('NOW GENERATE YOUR');
    
    if (exampleStart !== -1 && exampleEnd !== -1) {
      const beforeExample = customTemplate.substring(0, exampleStart);
      const afterExample = customTemplate.substring(exampleEnd);
      
      customTemplate = beforeExample + 
        `EXAMPLE TOPIC: "${customExample.topic || 'Custom Example'}"\n` +
        `EXAMPLE OUTPUT:\n${JSON.stringify(customExample.example, null, 2)}\n\n` +
        afterExample;
    }

    const userMessage = {
      role: "user",
      content: customTemplate
        .replace('{topic}', topic)
        .replace('{proficiency}', proficiency)
        .replace('{retrievedChunks}', JSON.stringify(retrievedChunks, null, 2))
    };

    return [systemMessage, userMessage];
  }
}

module.exports = OneShotPromptEngine;
