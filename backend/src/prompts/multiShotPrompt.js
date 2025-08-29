/**
 * Multi-Shot Prompting System for CivicsCoach
 * 
 * This system demonstrates multi-shot prompting by:
 * 1. Providing multiple examples of the desired output format
 * 2. Using few-shot learning to improve AI model performance
 * 3. Leveraging examples to establish patterns and expectations
 * 4. Creating prompts that guide the AI through demonstration rather than just instruction
 * 
 * Multi-shot prompting is particularly effective for:
 * - Complex output formats that require specific structure
 * - Tasks where the AI needs to understand nuanced requirements
 * - Improving consistency and quality of responses
 * - Teaching the AI model through examples rather than just instructions
 */

class MultiShotPromptEngine {
  constructor() {
    this.taskDefinitions = this.createTaskDefinitions();
    this.promptTemplates = this.createPromptTemplates();
    this.exampleSets = this.createExampleSets();
  }

  /**
   * Defines different types of tasks that can be performed with multi-shot prompting
   */
  createTaskDefinitions() {
    return {
      debate: {
        description: "Generate a structured debate with stance, counter-stance, citations, and quiz using multi-shot examples",
        outputFormat: "JSON with stance, counterStance, citations[], quiz[]",
        constraints: [
          "Use retrieved chunks as source-of-truth",
          "Provide balanced arguments",
          "Include relevant citations",
          "Create educational quiz questions",
          "Follow the exact format shown in examples"
        ],
        examplesCount: 2
      },
      analysis: {
        description: "Analyze constitutional concepts with detailed explanations using multi-shot examples",
        outputFormat: "Structured analysis with key points, implications, and examples",
        constraints: [
          "Focus on constitutional principles",
          "Explain implications clearly",
          "Provide historical context where relevant",
          "Use accessible language for the specified proficiency level",
          "Match the analysis depth and structure of examples"
        ],
        examplesCount: 2
      },
      comparison: {
        description: "Compare constitutional concepts using multi-shot examples for consistent structure",
        outputFormat: "Comparison table with similarities, differences, and conclusions",
        constraints: [
          "Identify key similarities and differences",
          "Provide balanced analysis",
          "Include relevant constitutional references",
          "Draw meaningful conclusions",
          "Follow the comparison framework from examples"
        ],
        examplesCount: 2
      },
      explanation: {
        description: "Explain constitutional concepts using multi-shot examples for clarity",
        outputFormat: "Clear explanation with examples and key takeaways",
        constraints: [
          "Use simple, clear language",
          "Provide concrete examples",
          "Break down complex concepts",
          "Include practical implications",
          "Match the explanation style and structure of examples"
        ],
        examplesCount: 2
      }
    };
  }

  /**
   * Creates comprehensive example sets for multi-shot learning
   */
  createExampleSets() {
    return {
      debate: [
        {
          topic: "Separation of Powers in Indian Constitution",
          proficiency: "Intermediate",
          example: {
            stance: "The Indian Constitution establishes a clear separation of powers between the Executive, Legislature, and Judiciary. Article 50 emphasizes the separation of judiciary from executive, while Articles 53, 79, and 124 establish distinct roles for each branch. This separation prevents concentration of power and ensures checks and balances.",
            counterStance: "While the Constitution establishes separation of powers, there are areas of overlap. The Executive (Council of Ministers) is drawn from the Legislature, creating a fusion rather than strict separation. Additionally, the Judiciary's power of judicial review allows it to strike down laws, potentially encroaching on legislative domain.",
            citations: [
              {
                id: "article50",
                source: "Constitution of India, Article 50",
                snippet: "The State shall take steps to separate the judiciary from the executive in the public services of the State.",
                relevance: "Establishes the principle of separation of judiciary from executive"
              }
            ],
            quiz: [
              {
                question: "Which article of the Indian Constitution emphasizes separation of judiciary from executive?",
                options: ["Article 48", "Article 50", "Article 52", "Article 54"],
                answerIndex: 1,
                explanation: "Article 50 specifically mandates the separation of judiciary from executive in public services"
              }
            ],
            keyTakeaways: [
              "Separation of powers prevents concentration of authority",
              "Indian system has some fusion between executive and legislature",
              "Judicial review provides additional check on other branches"
            ]
          }
        },
        {
          topic: "Fundamental Rights vs Directive Principles",
          proficiency: "Advanced",
          example: {
            stance: "Fundamental Rights (Part III) are justiciable and enforceable through courts, providing immediate protection to citizens. They establish negative obligations on the state and create a framework for individual liberty and equality. The Supreme Court has consistently upheld these rights as essential to democracy.",
            counterStance: "Directive Principles (Part IV) are non-justiciable but fundamental to governance. They represent positive obligations and socio-economic goals. Critics argue that making them non-justiciable weakens their implementation and creates a hierarchy between civil-political and socio-economic rights.",
            citations: [
              {
                id: "part3",
                source: "Constitution of India, Part III",
                snippet: "Fundamental Rights are guaranteed under Part III and are enforceable through courts under Article 32 and 226.",
                relevance: "Establishes the justiciable nature of Fundamental Rights"
              }
            ],
            quiz: [
              {
                question: "Which part of the Indian Constitution contains Fundamental Rights?",
                options: ["Part II", "Part III", "Part IV", "Part V"],
                answerIndex: 1,
                explanation: "Part III contains all Fundamental Rights guaranteed to citizens"
              }
            ],
            keyTakeaways: [
              "Fundamental Rights are justiciable and enforceable",
              "Directive Principles guide state policy but are non-justiciable",
              "Both are essential for comprehensive constitutional governance"
            ]
          }
        }
      ],
      analysis: [
        {
          topic: "Basic Structure Doctrine",
          proficiency: "Intermediate",
          example: {
            conceptDefinition: "The Basic Structure Doctrine holds that while Parliament can amend the Constitution under Article 368, it cannot alter the Constitution's fundamental features or 'basic structure'.",
            constitutionalBasis: "Article 368 provides amendment power, but Supreme Court rulings in Kesavananda Bharati (1973) established limitations to protect basic structure.",
            keyPrinciples: [
              "Constitutional supremacy over parliamentary sovereignty",
              "Protection of fundamental democratic values",
              "Judicial review of constitutional amendments"
            ],
            historicalContext: "Established in 1973 through Kesavananda Bharati case, responding to concerns about unlimited amendment power.",
            currentRelevance: "Continues to protect core constitutional values from arbitrary amendments.",
            implications: "Balances democratic governance with constitutional stability.",
            challenges: "Determining what constitutes 'basic structure' remains subjective.",
            summary: "Essential doctrine protecting constitutional democracy through judicial oversight."
          }
        },
        {
          topic: "Federalism in India",
          proficiency: "Advanced",
          example: {
            conceptDefinition: "Indian federalism is a cooperative federal system with strong central government and state autonomy in specific areas.",
            constitutionalBasis: "Articles 245-263 establish federal structure, Seventh Schedule divides powers between Union and States.",
            keyPrinciples: [
              "Division of powers between Union and States",
              "Supremacy of Union in concurrent matters",
              "Financial federalism with central control"
            ],
            historicalContext: "Evolved from British unitary system to accommodate India's diversity.",
            currentRelevance: "Critical for managing center-state relations and regional aspirations.",
            implications: "Balances national unity with regional autonomy.",
            challenges: "Center-state conflicts over jurisdiction and resources.",
            summary: "Unique federal model balancing centralization with decentralization."
          }
        }
      ],
      comparison: [
        {
          topic: "Parliamentary vs Presidential Systems",
          proficiency: "Intermediate",
          example: {
            conceptA: {
              name: "Parliamentary System",
              definition: "System where executive is accountable to legislature and can be removed by vote of no confidence",
              constitutionalBasis: "Articles 74, 75 establish Council of Ministers responsible to Lok Sabha",
              keyFeatures: [
                "Executive drawn from legislature",
                "Collective responsibility to parliament",
                "Flexible term with possibility of early elections"
              ]
            },
            conceptB: {
              name: "Presidential System",
              definition: "System with separate executive and legislative branches with fixed terms",
              constitutionalBasis: "Not applicable in India, but seen in countries like USA",
              keyFeatures: [
                "Separate executive and legislature",
                "Fixed presidential terms",
                "Checks and balances between branches"
              ]
            },
            comparison: {
              similarities: [
                "Both aim for democratic governance",
                "Both have separation of powers",
                "Both provide for executive leadership"
              ],
              differences: [
                "Accountability mechanism (parliament vs fixed term)",
                "Executive-legislature relationship (fusion vs separation)",
                "Flexibility in governance (variable vs fixed terms)"
              ],
              relativeStrengths: "Parliamentary system provides flexibility and accountability, presidential system offers stability and clear separation.",
              practicalImplications: "Parliamentary system better suited for India's diverse and dynamic political landscape."
            },
            conclusion: "India's parliamentary system balances democratic accountability with governance stability."
          }
        },
        {
          topic: "Fundamental Rights vs Human Rights",
          proficiency: "Advanced",
          example: {
            conceptA: {
              name: "Fundamental Rights",
              definition: "Constitutionally guaranteed rights enforceable through courts",
              constitutionalBasis: "Part III of Indian Constitution, Articles 12-35",
              keyFeatures: [
                "Justiciable and enforceable",
                "Specific to Indian constitutional context",
                "Can be suspended during emergency"
              ]
            },
            conceptB: {
              name: "Human Rights",
              definition: "Universal rights inherent to all human beings regardless of nationality",
              constitutionalBasis: "International instruments like UDHR, ICCPR, ICESCR",
              keyFeatures: [
                "Universal and inalienable",
                "Not tied to specific legal system",
                "Internationally recognized standards"
              ]
            },
            comparison: {
              similarities: [
                "Both protect human dignity and freedom",
                "Both establish standards for state behavior",
                "Both are essential for democracy"
              ],
              differences: [
                "Scope (national vs international)",
                "Enforcement mechanism (courts vs international bodies)",
                "Flexibility (amendable vs universal principles)"
              ],
              relativeStrengths: "Fundamental Rights provide immediate local enforcement, Human Rights establish universal standards.",
              practicalImplications: "Both work together to create comprehensive human rights protection."
            },
            conclusion: "Fundamental Rights and Human Rights complement each other in protecting human dignity."
          }
        }
      ],
      explanation: [
        {
          topic: "Judicial Review",
          proficiency: "Beginner",
          example: {
            simpleDefinition: "Judicial review is the power of courts to examine and invalidate laws that violate the Constitution.",
            detailedExplanation: "When Parliament passes a law, courts can review it to ensure it doesn't conflict with constitutional provisions. If a law violates fundamental rights or exceeds constitutional authority, courts can declare it unconstitutional and strike it down.",
            keyComponents: [
              "Constitutional supremacy",
              "Judicial authority to interpret constitution",
              "Power to invalidate unconstitutional laws"
            ],
            examples: [
              {
                scenario: "Parliament passes a law restricting freedom of speech",
                explanation: "Courts can review this law and strike it down if it violates Article 19(1)(a) guaranteeing freedom of speech"
              }
            ],
            whyItMatters: "Protects constitutional democracy by ensuring laws respect fundamental rights and constitutional limits.",
            commonMisconceptions: [
              "Judges make laws (they only interpret and apply)",
              "Judicial review is anti-democratic (it protects democracy)"
            ],
            practicalApplications: "Citizens can challenge unconstitutional laws through public interest litigation.",
            summary: "Judicial review is the guardian of constitutional democracy."
          }
        },
        {
          topic: "Rule of Law",
          proficiency: "Intermediate",
          example: {
            simpleDefinition: "Rule of law means everyone, including government, must follow the law equally.",
            detailedExplanation: "The rule of law ensures that no one is above the law. Government actions must be authorized by law, and all individuals are subject to the same legal standards. It prevents arbitrary exercise of power and ensures predictable legal outcomes.",
            keyComponents: [
              "Equality before law",
              "Government under law",
              "Predictable legal processes"
            ],
            examples: [
              {
                scenario: "Government official accused of corruption",
                explanation: "Under rule of law, the official must face the same legal process as any citizen, with no special privileges"
              }
            ],
            whyItMatters: "Essential for democracy, prevents abuse of power, ensures justice for all citizens.",
            commonMisconceptions: [
              "Rule of law means strict punishment (it means fair legal process)",
              "Government can ignore law for public good (government must always follow law)"
            ],
            practicalApplications: "Citizens can challenge arbitrary government actions and expect fair legal treatment.",
            summary: "Rule of law is the foundation of constitutional democracy and justice."
          }
        }
      ]
    };
  }

  /**
   * Creates prompt templates optimized for multi-shot learning
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

You will be provided with multiple examples to guide your responses. Study these examples carefully to understand the expected format, style, and depth of responses.`
      },
      
      debate: {
        role: "user",
        template: `TASK: Generate a structured debate on the following topic using multi-shot prompting.

TOPIC: {topic}
USER PROFICIENCY: {proficiency}
CITATIONS TO USE: {retrievedChunks}

EXAMPLES OF EXPECTED OUTPUT FORMAT:

{examples}

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
1. Study the provided examples to understand the expected format and style
2. Use ONLY the provided citations as factual sources
3. Generate balanced arguments without bias
4. Create educational quiz questions that test understanding
5. Ensure all claims are supported by citations
6. Adapt language complexity to match user proficiency level
7. Follow the exact structure and depth shown in the examples
8. Return ONLY valid JSON - no additional commentary

This is a multi-shot task - you have been provided with examples to guide your response format and quality.`
      },

      analysis: {
        role: "user",
        template: `TASK: Perform a multi-shot analysis of the following constitutional concept.

CONCEPT: {topic}
ANALYSIS DEPTH: {proficiency}
CONTEXT: {retrievedChunks}

EXAMPLES OF EXPECTED OUTPUT FORMAT:

{examples}

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
1. Study the provided examples to understand the expected analysis depth and structure
2. Analyze the concept using your constitutional knowledge
3. Provide specific constitutional references where possible
4. Explain implications clearly and practically
5. Adapt complexity to user proficiency level
6. Use the provided context to enhance your analysis
7. Match the analytical depth and structure shown in the examples
8. Return ONLY valid JSON - no additional commentary

This is a multi-shot analysis task - you have been provided with examples to guide your response format and quality.`
      },

      comparison: {
        role: "user",
        template: `TASK: Perform a multi-shot comparison of constitutional concepts.

CONCEPTS TO COMPARE: {topic}
COMPARISON SCOPE: {proficiency}
REFERENCE MATERIAL: {retrievedChunks}

EXAMPLES OF EXPECTED OUTPUT FORMAT:

{examples}

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
1. Study the provided examples to understand the expected comparison framework
2. Identify the concepts to compare from the topic
3. Provide balanced analysis of both concepts
4. Highlight meaningful similarities and differences
5. Draw practical conclusions about governance implications
6. Use constitutional knowledge to support your analysis
7. Follow the comparison structure shown in the examples
8. Return ONLY valid JSON - no additional commentary

This is a multi-shot comparison task - you have been provided with examples to guide your response format and quality.`
      },

      explanation: {
        role: "user",
        template: `TASK: Provide a multi-shot explanation of a constitutional concept.

CONCEPT TO EXPLAIN: {topic}
EXPLANATION LEVEL: {proficiency}
SUPPORTING CONTEXT: {retrievedChunks}

EXAMPLES OF EXPECTED OUTPUT FORMAT:

{examples}

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
1. Study the provided examples to understand the expected explanation style and structure
2. Explain the concept in simple, accessible language
3. Use concrete examples to illustrate abstract concepts
4. Connect the concept to everyday governance
5. Address common misunderstandings
6. Make the explanation practical and actionable
7. Match the explanation depth and style shown in the examples
8. Return ONLY valid JSON - no additional commentary

This is a multi-shot explanation task - you have been provided with examples to guide your response format and quality.`
      }
    };
  }

  /**
   * Generates a multi-shot prompt for the specified task type
   */
  generateMultiShotPrompt(taskType, topic, proficiency, retrievedChunks, options = {}) {
    // Validate task type
    if (!this.taskDefinitions[taskType]) {
      throw new Error(`Unknown task type: ${taskType}. Available types: ${Object.keys(this.taskDefinitions).join(', ')}`);
    }

    // Get task definition, template, and examples
    const taskDef = this.taskDefinitions[taskType];
    const template = this.promptTemplates[taskType];
    const examples = this.exampleSets[taskType];

    // Select appropriate examples based on proficiency level
    const selectedExamples = this.selectExamplesByProficiency(examples, proficiency, taskDef.examplesCount);

    // Format examples for inclusion in prompt
    const formattedExamples = this.formatExamples(selectedExamples, taskType);

    // Format the template with actual values
    const formattedTemplate = template.template
      .replace('{topic}', topic)
      .replace('{proficiency}', proficiency)
      .replace('{retrievedChunks}', this.formatRetrievedChunks(retrievedChunks))
      .replace('{examples}', formattedExamples);

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
        examplesCount: selectedExamples.length,
        multiShotFeatures: [
          'multiple_examples_provided',
          'few_shot_learning',
          'pattern_establishment',
          'quality_improvement_through_examples',
          'structured_output_guidance'
        ]
      }
    };
  }

  /**
   * Selects examples based on proficiency level and count requirements
   */
  selectExamplesByProficiency(examples, proficiency, requiredCount) {
    // Map proficiency levels to complexity
    const proficiencyLevels = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };

    const complexity = proficiencyLevels[proficiency.toLowerCase()] || 2;
    
    // Select examples that match or are below the user's proficiency level
    const suitableExamples = examples.filter(example => 
      example.proficiency.toLowerCase() === proficiency.toLowerCase() ||
      proficiencyLevels[example.proficiency.toLowerCase()] <= complexity
    );

    // Return the required number of examples, prioritizing exact proficiency matches
    const exactMatches = suitableExamples.filter(example => 
      example.proficiency.toLowerCase() === proficiency.toLowerCase()
    );

    const otherExamples = suitableExamples.filter(example => 
      example.proficiency.toLowerCase() !== proficiency.toLowerCase()
    );

    const selectedExamples = [...exactMatches, ...otherExamples].slice(0, requiredCount);
    
    // If we don't have enough examples, use what we have
    return selectedExamples.length > 0 ? selectedExamples : examples.slice(0, requiredCount);
  }

  /**
   * Formats examples for inclusion in the prompt
   */
  formatExamples(examples, taskType) {
    return examples.map((example, index) => {
      const exampleOutput = JSON.stringify(example.example, null, 2);
      return `EXAMPLE ${index + 1}:
Topic: ${example.topic}
Proficiency: ${example.proficiency}
Output:
${exampleOutput}

---`;
    }).join('\n\n');
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
   * Generates a debate prompt using multi-shot approach
   */
  generateDebatePrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateMultiShotPrompt('debate', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Generates an analysis prompt using multi-shot approach
   */
  generateAnalysisPrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateMultiShotPrompt('analysis', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Generates a comparison prompt using multi-shot approach
   */
  generateComparisonPrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateMultiShotPrompt('comparison', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Generates an explanation prompt using multi-shot approach
   */
  generateExplanationPrompt(topic, proficiency, retrievedChunks, options = {}) {
    return this.generateMultiShotPrompt('explanation', topic, proficiency, retrievedChunks, options);
  }

  /**
   * Gets statistics about the multi-shot prompting system
   */
  getSystemStats() {
    const stats = {};
    
    for (const [taskType, examples] of Object.entries(this.exampleSets)) {
      stats[taskType] = {
        totalExamples: examples.length,
        proficiencyLevels: [...new Set(examples.map(ex => ex.proficiency))],
        averageExampleLength: examples.reduce((sum, ex) => 
          sum + JSON.stringify(ex.example).length, 0) / examples.length
      };
    }

    return {
      totalTaskTypes: Object.keys(this.taskDefinitions).length,
      totalExamples: Object.values(this.exampleSets).reduce((sum, examples) => sum + examples.length, 0),
      taskTypes: Object.keys(this.taskDefinitions),
      examplesByTask: stats
    };
  }
}

// Export the multi-shot prompt engine
module.exports = { MultiShotPromptEngine };
