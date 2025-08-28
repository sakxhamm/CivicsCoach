/**
 * Dynamic Prompting System for CivicsCoach
 * 
 * This system demonstrates dynamic prompting by:
 * 1. Adapting prompt complexity based on user proficiency
 * 2. Adjusting reasoning depth based on query complexity
 * 3. Dynamically selecting relevant examples and context
 * 4. Modifying output format based on user needs
 * 5. Real-time prompt optimization based on previous responses
 */

class DynamicPromptEngine {
  constructor() {
    this.complexityAnalyzer = this.createComplexityAnalyzer();
    this.contextBuilder = this.createContextBuilder();
    this.promptOptimizer = this.createPromptOptimizer();
  }

  /**
   * Analyzes query complexity to determine appropriate prompt strategy
   */
  createComplexityAnalyzer() {
    return {
      analyze(query) {
        const complexity = {
          level: 'medium',
          factors: [],
          score: 0
        };

        // Analyze query length and structure
        const words = query.split(' ').length;
        if (words < 8) {
          complexity.score += 0;
          complexity.factors.push('short_query');
        } else if (words > 20) {
          complexity.score += 2;
          complexity.factors.push('long_query');
        } else {
          complexity.score += 1;
          complexity.factors.push('medium_query');
        }

        // Analyze legal/constitutional terminology
        const legalTerms = [
          'doctrine', 'amendment', 'article', 'constitution', 'supreme court',
          'parliament', 'fundamental rights', 'judicial review', 'federalism',
          'separation of powers', 'basic structure', 'money bill', 'emergency'
        ];
        
        const foundTerms = legalTerms.filter(term => 
          query.toLowerCase().includes(term)
        );
        
        if (foundTerms.length > 0) {
          complexity.score += Math.min(foundTerms.length, 2); // Cap at 2 points
          complexity.factors.push(`legal_terms:${foundTerms.length}`);
        }

        // Analyze question types
        if (query.includes('?')) {
          if (query.toLowerCase().includes('why') || query.toLowerCase().includes('how')) {
            complexity.score += 1;
            complexity.factors.push('analytical_question');
          } else if (query.toLowerCase().includes('what') || query.toLowerCase().includes('which')) {
            complexity.score += 0;
            complexity.factors.push('factual_question');
          }
        }

        // Determine complexity level
        if (complexity.score <= 1) complexity.level = 'simple';
        else if (complexity.score <= 3) complexity.level = 'medium';
        else complexity.level = 'complex';

        return complexity;
      }
    };
  }

  /**
   * Builds contextual information based on query and user preferences
   */
  createContextBuilder() {
    return {
      buildContext(query, proficiency, complexity, retrievedChunks) {
        const context = {
          examples: this.selectExamples(complexity, proficiency),
          reasoningDepth: this.determineReasoningDepth(complexity, proficiency),
          outputFormat: this.determineOutputFormat(complexity, proficiency),
          additionalInstructions: this.generateAdditionalInstructions(complexity, proficiency)
        };

        return context;
      },

      selectExamples(complexity, proficiency) {
        const examples = {
          simple: {
            beginner: [
              {
                query: "What is the Constitution of India?",
                response: "The Constitution of India is the supreme law of the land..."
              }
            ],
            intermediate: [
              {
                query: "What are Fundamental Rights?",
                response: "Fundamental Rights are basic human rights guaranteed by the Constitution..."
              }
            ],
            advanced: [
              {
                query: "Explain the concept of Judicial Review",
                response: "Judicial Review is the power of courts to examine the constitutionality of laws..."
              }
            ]
          },
          medium: {
            beginner: [
              {
                query: "How does the Indian Parliament work?",
                response: "The Indian Parliament consists of two houses: Lok Sabha and Rajya Sabha..."
              }
            ],
            intermediate: [
              {
                query: "What is the role of the President in Indian democracy?",
                response: "The President is the ceremonial head of state with specific constitutional powers..."
              }
            ],
            advanced: [
              {
                query: "Explain the federal structure of India",
                response: "India follows a quasi-federal structure with a strong central government..."
              }
            ]
          },
          complex: {
            beginner: [
              {
                query: "What is the Basic Structure Doctrine and its implications?",
                response: "The Basic Structure Doctrine limits Parliament's power to amend the Constitution..."
              }
            ],
            intermediate: [
              {
                query: "How does the Indian Constitution balance individual rights with collective interests?",
                response: "The Constitution balances rights through reasonable restrictions and public interest clauses..."
              }
            ],
            advanced: [
              {
                query: "Analyze the evolution of federalism in India post-independence",
                response: "Indian federalism has evolved from centralized to more cooperative federalism..."
              }
            ]
          }
        };

        return examples[complexity.level][proficiency] || examples.medium.intermediate;
      },

      determineReasoningDepth(complexity, proficiency) {
        const depthMap = {
          simple: { beginner: 'minimal', intermediate: 'basic', advanced: 'detailed' },
          medium: { beginner: 'basic', intermediate: 'detailed', advanced: 'comprehensive' },
          complex: { beginner: 'detailed', intermediate: 'comprehensive', advanced: 'exhaustive' }
        };

        return depthMap[complexity.level][proficiency] || 'detailed';
      },

      determineOutputFormat(complexity, proficiency) {
        if (complexity.level === 'simple' && proficiency === 'beginner') {
          return 'simplified';
        } else if (complexity.level === 'complex' && proficiency === 'advanced') {
          return 'academic';
        } else {
          return 'standard';
        }
      },

      generateAdditionalInstructions(complexity, proficiency) {
        const instructions = [];

        if (complexity.level === 'simple' && proficiency === 'beginner') {
          instructions.push('Use simple language and avoid complex legal jargon');
          instructions.push('Provide concrete examples where possible');
        } else if (complexity.level === 'complex' && proficiency === 'advanced') {
          instructions.push('Include nuanced perspectives and counter-arguments');
          instructions.push('Reference specific legal precedents and scholarly opinions');
        }

        if (complexity.factors.includes('analytical_question')) {
          instructions.push('Focus on explaining the reasoning behind the concepts');
        }

        return instructions;
      }
    };
  }

  /**
   * Optimizes prompts based on previous interactions and performance
   */
  createPromptOptimizer() {
    return {
      optimizePrompt(basePrompt, context, previousResponses = []) {
        let optimizedPrompt = basePrompt;

        // Add context-specific modifications
        if (context.reasoningDepth === 'comprehensive') {
          optimizedPrompt += '\n\nREASONING_INSTRUCTIONS: Provide step-by-step analysis with intermediate conclusions.';
        }

        if (context.outputFormat === 'simplified') {
          optimizedPrompt += '\n\nFORMAT_INSTRUCTIONS: Use bullet points and simple language. Avoid complex legal terminology.';
        }

        if (context.outputFormat === 'academic') {
          optimizedPrompt += '\n\nFORMAT_INSTRUCTIONS: Use formal academic language with proper citations and nuanced analysis.';
        }

        // Add dynamic examples based on context
        if (context.examples && context.examples.length > 0) {
          const exampleSection = context.examples.map(ex => 
            `EXAMPLE: "${ex.query}" → ${ex.response}`
          ).join('\n');
          optimizedPrompt += `\n\nRELEVANT_EXAMPLES:\n${exampleSection}`;
        }

        // Add additional instructions
        if (context.additionalInstructions && context.additionalInstructions.length > 0) {
          optimizedPrompt += `\n\nADDITIONAL_INSTRUCTIONS:\n${context.additionalInstructions.join('\n')}`;
        }

        return optimizedPrompt;
      }
    };
  }

  /**
   * Main method to generate dynamic prompts
   */
  generateDynamicPrompt(query, proficiency, retrievedChunks, options = {}) {
    // Analyze query complexity
    const complexity = this.complexityAnalyzer.analyze(query);
    
    // Build context
    const context = this.contextBuilder.buildContext(query, proficiency, complexity, retrievedChunks);
    
    // Create base prompt
    const basePrompt = this.createBasePrompt(query, proficiency, retrievedChunks, complexity);
    
    // Optimize prompt based on context
    const optimizedPrompt = this.promptOptimizer.optimizePrompt(basePrompt, context, options.previousResponses);
    
    // Build final message structure
    const messages = [
      {
        role: "system",
        content: optimizedPrompt
      }
    ];

    // Add examples if they exist
    if (context.examples && context.examples.length > 0) {
      context.examples.forEach(example => {
        messages.push({ role: "user", content: example.query });
        messages.push({ role: "assistant", content: example.response });
      });
    }

    // Add the actual query
    messages.push({
      role: "user",
      content: `QUERY: ${query}\n\nPROFICIENCY: ${proficiency}\nCOMPLEXITY: ${complexity.level}\nREASONING_DEPTH: ${context.reasoningDepth}`
    });

    return {
      messages,
      metadata: {
        complexity,
        context,
        promptLength: optimizedPrompt.length,
        dynamicFeatures: Object.keys(context)
      }
    };
  }

  /**
   * Creates the base prompt template
   */
  createBasePrompt(query, proficiency, retrievedChunks, complexity) {
    const basePrompt = `
ROLE: You are CivicsCoach — an evidence-first debate coach for Indian Polity.

TASK: Produce a JSON object with fields: stance, counterStance, citations[], quiz[].

FORMAT: Return ONLY valid JSON (no extra commentary).

CONSTRAINTS: 
- Use the provided retrieved text chunks as source-of-truth
- Provide at least 2 citations where possible
- Adapt your response complexity to match the user's proficiency level: ${proficiency}
- Query complexity detected: ${complexity.level}
- Use internal step-by-step reasoning to improve accuracy, BUT DO NOT reveal the chain-of-thought
- Stop token for internal scratchpad: </reasoning>

OUTPUT_STRUCTURE:
{
  "stance": "Main argument (150 words max)",
  "counterStance": "Opposing viewpoint (150 words max)", 
  "citations": [{"id": "unique_id", "source": "source_name", "snippet": "relevant_text"}],
  "quiz": [{"q": "question", "options": ["A", "B", "C", "D"], "answerIndex": 0}],
  "rationale_1line": "Brief explanation of reasoning"
}

RETRIEVED_CHUNKS:
${retrievedChunks.map((c, i) => `${i+1}) [${c.id || 'chunk'+i}] ${c.text.slice(0,500)}`).join("\n\n")}
`.trim();

    return basePrompt;
  }
}

// Export the dynamic prompt engine
module.exports = { DynamicPromptEngine };
