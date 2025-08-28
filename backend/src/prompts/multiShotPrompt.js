/**
 * Multi-Shot Prompting System for CivicsCoach
 * 
 * This system demonstrates multi-shot prompting by:
 * 1. Providing multiple examples to guide AI responses
 * 2. Using diverse examples to improve understanding and accuracy
 * 3. Adapting examples based on user proficiency and query complexity
 * 4. Creating comprehensive learning patterns for the AI
 * 5. Leveraging example variety to enhance response quality
 */

class MultiShotPromptEngine {
  constructor() {
    this.exampleDatabase = this.createExampleDatabase();
    this.promptTemplates = this.createPromptTemplates();
    this.exampleSelector = this.createExampleSelector();
  }

  /**
   * Creates a comprehensive database of examples for different scenarios
   */
  createExampleDatabase() {
    return {
      debate: {
        beginner: [
          {
            query: "What is the Constitution of India?",
            response: {
              stance: "The Constitution of India is the supreme law that establishes the framework for governance, fundamental rights, and duties of citizens. It was adopted on 26th January 1950 and serves as the foundation of India's democratic republic.",
              counterStance: "While the Constitution provides a strong framework, some argue that its complexity and length (the longest written constitution) make it difficult for ordinary citizens to understand and access their rights effectively.",
              citations: [
                {
                  id: "constitution_basic",
                  source: "Constitution of India",
                  snippet: "The Constitution establishes the framework for governance and fundamental rights"
                }
              ],
              quiz: [
                {
                  q: "When was the Constitution of India adopted?",
                  options: ["26th January 1950", "15th August 1947", "26th November 1949", "26th January 1949"],
                  answerIndex: 0
                }
              ]
            }
          },
          {
            query: "What are Fundamental Rights?",
            response: {
              stance: "Fundamental Rights are basic human rights guaranteed by the Constitution to all citizens. They include rights to equality, freedom, protection against exploitation, freedom of religion, cultural and educational rights, and constitutional remedies.",
              counterStance: "Some critics argue that Fundamental Rights are not absolute and can be suspended during emergencies, raising concerns about their effectiveness in protecting citizens during critical times.",
              citations: [
                {
                  id: "fundamental_rights",
                  source: "Part III, Constitution of India",
                  snippet: "Fundamental Rights are guaranteed to all citizens"
                }
              ],
              quiz: [
                {
                  q: "Which part of the Constitution deals with Fundamental Rights?",
                  options: ["Part I", "Part II", "Part III", "Part IV"],
                  answerIndex: 2
                }
              ]
            }
          }
        ],
        intermediate: [
          {
            query: "How does the Indian Parliament work?",
            response: {
              stance: "The Indian Parliament consists of two houses: Lok Sabha (House of the People) and Rajya Sabha (Council of States). Lok Sabha has 543 elected members representing constituencies, while Rajya Sabha has 250 members with 12 nominated by the President. Both houses must pass bills for them to become law.",
              counterStance: "The Parliament's effectiveness is sometimes questioned due to frequent disruptions, low attendance, and the dominance of the ruling party, which can limit meaningful debate and opposition participation.",
              citations: [
                {
                  id: "parliament_structure",
                  source: "Articles 79-122, Constitution of India",
                  snippet: "Parliament consists of President and two Houses"
                }
              ],
              quiz: [
                {
                  q: "How many members does the Lok Sabha have?",
                  options: ["250", "543", "545", "552"],
                  answerIndex: 1
                }
              ]
            }
          },
          {
            query: "What is the role of the President in Indian democracy?",
            response: {
              stance: "The President is the ceremonial head of state with specific constitutional powers including appointing the Prime Minister, dissolving Parliament, and giving assent to bills. While largely ceremonial, the President has discretionary powers in appointing the Prime Minister when no party has a clear majority.",
              counterStance: "Critics argue that the President's role is too limited and ceremonial, with real power concentrated in the Prime Minister and Council of Ministers, making the presidency largely symbolic.",
              citations: [
                {
                  id: "president_powers",
                  source: "Articles 52-78, Constitution of India",
                  snippet: "President has specific constitutional powers and discretionary authority"
                }
              ],
              quiz: [
                {
                  q: "Who appoints the Prime Minister of India?",
                  options: ["Lok Sabha", "Rajya Sabha", "President", "Supreme Court"],
                  answerIndex: 2
                }
              ]
            }
          }
        ],
        advanced: [
          {
            query: "Explain the Basic Structure Doctrine and its implications for constitutional amendments",
            response: {
              stance: "The Basic Structure Doctrine, established in Kesavananda Bharati v. State of Kerala (1973), holds that while Parliament can amend the Constitution under Article 368, it cannot alter its 'basic structure' - fundamental features like democracy, secularism, federalism, and fundamental rights. This doctrine serves as a check on parliamentary power.",
              counterStance: "The Basic Structure Doctrine has been criticized for being vague and subjective, as the Supreme Court has not clearly defined what constitutes the 'basic structure,' leading to judicial discretion and potential overreach in constitutional matters.",
              citations: [
                {
                  id: "basic_structure_doctrine",
                  source: "Kesavananda Bharati v. State of Kerala (1973)",
                  snippet: "Basic Structure Doctrine limits Parliament's amending power"
                }
              ],
              quiz: [
                {
                  q: "In which landmark case was the Basic Structure Doctrine established?",
                  options: ["Golak Nath v. State of Punjab", "Kesavananda Bharati v. State of Kerala", "Minerva Mills v. Union of India", "S.R. Bommai v. Union of India"],
                  answerIndex: 1
                }
              ]
            }
          },
          {
            query: "Analyze the federal structure of India and its evolution",
            response: {
              stance: "India follows a quasi-federal structure with a strong central government. The Constitution provides for a federal system with unitary bias, where the Union government has more powers than state governments. The Seventh Schedule divides subjects into Union, State, and Concurrent lists, with the Union having overriding authority in concurrent matters.",
              counterStance: "The federal structure has been criticized for centralizing too much power, with states having limited financial autonomy and the Union government using various mechanisms like Article 356 (President's Rule) to interfere in state matters, undermining true federalism.",
              citations: [
                {
                  id: "federal_structure",
                  source: "Seventh Schedule, Constitution of India",
                  snippet: "Division of powers between Union and States"
                }
              ],
              quiz: [
                {
                  q: "Which schedule of the Constitution divides subjects between Union and States?",
                  options: ["Fifth Schedule", "Sixth Schedule", "Seventh Schedule", "Eighth Schedule"],
                  answerIndex: 2
                }
              ]
            }
          }
        ]
      },
      analysis: {
        beginner: [
          {
            query: "What is Judicial Review?",
            response: {
              conceptDefinition: "Judicial Review is the power of courts to examine the constitutionality of laws and government actions.",
              constitutionalBasis: "Article 13 declares laws inconsistent with fundamental rights as void, and Article 32 provides right to constitutional remedies.",
              keyPrinciples: ["Constitutionality check", "Protection of fundamental rights", "Separation of powers"],
              historicalContext: "Established through various Supreme Court judgments, particularly in the early years of the Republic.",
              currentRelevance: "Essential for protecting citizens' rights and maintaining constitutional supremacy.",
              implications: "Ensures government actions comply with constitutional principles.",
              challenges: "Can lead to judicial activism and delays in governance.",
              summary: "Judicial Review is a cornerstone of constitutional democracy in India."
            }
          }
        ],
        intermediate: [
          {
            query: "Explain the concept of Directive Principles of State Policy",
            response: {
              conceptDefinition: "Directive Principles are guidelines for the government to establish a just society, though not legally enforceable.",
              constitutionalBasis: "Articles 36-51 of the Constitution outline various social, economic, and political principles.",
              keyPrinciples: ["Social justice", "Economic welfare", "International peace", "Environmental protection"],
              historicalContext: "Inspired by Irish Constitution and socialist principles, reflecting the vision of the Constituent Assembly.",
              currentRelevance: "Guide government policies and programs for social development.",
              implications: "Shape legislative and executive actions towards welfare state goals.",
              challenges: "Non-justiciable nature limits their effectiveness in ensuring government accountability.",
              summary: "Directive Principles provide a roadmap for India's social and economic development."
            }
          }
        ],
        advanced: [
          {
            query: "Analyze the evolution of constitutional interpretation in India",
            response: {
              conceptDefinition: "Constitutional interpretation has evolved from literal to purposive approaches, adapting to changing social realities.",
              constitutionalBasis: "Article 141 empowers Supreme Court to declare law, and Article 142 provides enforcement powers.",
              keyPrinciples: ["Living constitution theory", "Purposive interpretation", "Social justice orientation"],
              historicalContext: "Evolved from British colonial legal traditions to Indian constitutional jurisprudence.",
              currentRelevance: "Critical for addressing contemporary challenges and protecting constitutional values.",
              implications: "Shapes the balance between individual rights and collective interests.",
              challenges: "Risk of judicial overreach and lack of democratic accountability in interpretation.",
              summary: "Constitutional interpretation has been instrumental in India's democratic evolution."
            }
          }
        ]
      }
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

Your task is to generate high-quality, accurate responses based on the examples provided and your constitutional knowledge. Study the examples carefully to understand the expected format, style, and level of detail.`
      },
      
      debate: {
        role: "user",
        template: `TASK: Generate a structured debate on the following topic using multi-shot prompting.

TOPIC: {topic}
USER PROFICIENCY: {proficiency}
CITATIONS TO USE: {retrievedChunks}

EXAMPLES TO FOLLOW:
{examples}

REQUIRED OUTPUT FORMAT (JSON):
{
  "stance": "Main argument supporting the topic (150 words max)",
  "counterStance": "Opposing viewpoint or counter-argument (150 words max)",
  "citations": [
    {
      "id": "unique_identifier",
      "source": "source_name",
      "snippet": "relevant_text_excerpt"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0
    }
  ]
}

INSTRUCTIONS:
1. Study the provided examples to understand the expected format and style
2. Use ONLY the provided citations as factual sources
3. Generate balanced arguments without bias
4. Create educational quiz questions that test understanding
5. Ensure all claims are supported by citations
6. Adapt language complexity to match user proficiency level
7. Return ONLY valid JSON - no additional commentary

Use the examples as a guide for the quality, structure, and depth of your response.`
      },

      analysis: {
        role: "user",
        template: `TASK: Perform a multi-shot analysis of the following constitutional concept.

CONCEPT: {topic}
ANALYSIS DEPTH: {proficiency}
CONTEXT: {retrievedChunks}

EXAMPLES TO FOLLOW:
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
7. Return ONLY valid JSON - no additional commentary

Use the examples as a guide for the quality and depth of your analysis.`
      }
    };
  }

  /**
   * Creates an example selector that chooses appropriate examples
   */
  createExampleSelector() {
    const self = this; // Store reference to the main class
    return {
      selectExamples(taskType, proficiency, query, count = 2) {
        const examples = self.exampleDatabase[taskType]?.[proficiency] || [];
        
        if (examples.length === 0) {
          // Fallback to intermediate level if proficiency not found
          return self.exampleDatabase[taskType]?.['intermediate'] || [];
        }

        // Select examples based on query similarity
        const scoredExamples = examples.map(example => {
          const queryWords = query.toLowerCase().split(' ');
          const exampleWords = example.query.toLowerCase().split(' ');
          
          let score = 0;
          queryWords.forEach(word => {
            if (exampleWords.includes(word)) score += 1;
          });
          
          return { ...example, score };
        });

        // Sort by score and return top examples
        return scoredExamples
          .sort((a, b) => b.score - a.score)
          .slice(0, count);
      },

      formatExamples(examples) {
        return examples.map((example, index) => 
          `EXAMPLE ${index + 1}:
Query: "${example.query}"
Response: ${JSON.stringify(example.response, null, 2)}`
        ).join('\n\n');
      }
    };
  }

  /**
   * Generates a multi-shot prompt for the specified task type
   */
  generateMultiShotPrompt(taskType, topic, proficiency, retrievedChunks, options = {}) {
    // Validate task type
    if (!this.exampleDatabase[taskType]) {
      throw new Error(`Unknown task type: ${taskType}. Available types: ${Object.keys(this.exampleDatabase).join(', ')}`);
    }

    // Select appropriate examples
    const examples = this.exampleSelector.selectExamples(
      taskType, 
      proficiency, 
      topic, 
      options.exampleCount || 2
    );

    // Get task definition and template
    const template = this.promptTemplates[taskType];

    // Format the template with actual values
    const formattedTemplate = template.template
      .replace('{topic}', topic)
      .replace('{proficiency}', proficiency)
      .replace('{retrievedChunks}', this.formatRetrievedChunks(retrievedChunks))
      .replace('{examples}', this.exampleSelector.formatExamples(examples));

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
        proficiency,
        examplesUsed: examples.length,
        exampleQueries: examples.map(ex => ex.query),
        promptLength: formattedTemplate.length,
        multiShotFeatures: [
          'multiple_examples_provided',
          'example_based_learning',
          'format_guidance',
          'style_adaptation',
          'quality_benchmarking'
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
   * Adds a new example to the database
   */
  addExample(taskType, proficiency, example) {
    if (!this.exampleDatabase[taskType]) {
      this.exampleDatabase[taskType] = {};
    }
    if (!this.exampleDatabase[taskType][proficiency]) {
      this.exampleDatabase[taskType][proficiency] = [];
    }
    
    this.exampleDatabase[taskType][proficiency].push(example);
    return true;
  }

  /**
   * Gets statistics about the example database
   */
  getDatabaseStats() {
    const stats = {};
    Object.keys(this.exampleDatabase).forEach(taskType => {
      stats[taskType] = {};
      Object.keys(this.exampleDatabase[taskType]).forEach(proficiency => {
        stats[taskType][proficiency] = this.exampleDatabase[taskType][proficiency].length;
      });
    });
    return stats;
  }
}

// Export the multi-shot prompt engine
module.exports = { MultiShotPromptEngine };
