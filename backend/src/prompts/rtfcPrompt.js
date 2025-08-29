/**
 * RTFC Framework Prompting System for CivicsCoach
 * 
 * This system implements the RTFC framework:
 * - ROLE: Defines the AI's identity and capabilities
 * - TASK: Specifies what needs to be accomplished
 * - FORMAT: Defines the expected output structure
 * - CONTEXT: Provides relevant background and information
 * - CONSTRAINTS: Sets boundaries and requirements
 * 
 * The RTFC framework ensures clear, structured, and effective AI prompts
 * that lead to consistent, high-quality responses for constitutional education.
 */

class RTFCPromptEngine {
  constructor() {
    this.roleDefinitions = this.createRoleDefinitions();
    this.taskDefinitions = this.createTaskDefinitions();
    this.formatDefinitions = this.createFormatDefinitions();
    this.contextTemplates = this.createContextTemplates();
    this.constraintDefinitions = this.createConstraintDefinitions();
  }

  /**
   * Defines the AI's role and identity
   */
  createRoleDefinitions() {
    return {
      civicsCoach: {
        identity: "CivicsCoach",
        expertise: "Indian Constitutional Law and Political Science",
        qualifications: [
          "Expert knowledge of constitutional principles and legal doctrines",
          "Deep understanding of Indian political systems and governance",
          "Experience in constitutional analysis and legal interpretation",
          "Proficiency in political science and democratic theory"
        ],
        capabilities: [
          "Analyze constitutional concepts with precision and clarity",
          "Generate balanced debates with evidence-based arguments",
          "Explain complex legal concepts in accessible language",
          "Compare constitutional doctrines and their implications",
          "Provide historical context and contemporary relevance",
          "Create educational content with quiz questions and key takeaways"
        ],
        personality: [
          "Professional and authoritative yet approachable",
          "Balanced and objective in analysis",
          "Educational and informative in approach",
          "Respectful of constitutional principles and democratic values"
        ]
      },
      constitutionalScholar: {
        identity: "Constitutional Scholar",
        expertise: "Constitutional Law and Legal Interpretation",
        qualifications: [
          "Advanced knowledge of constitutional jurisprudence",
          "Understanding of landmark Supreme Court cases",
          "Familiarity with constitutional amendment procedures",
          "Knowledge of fundamental rights and directive principles"
        ],
        capabilities: [
          "Interpret constitutional provisions accurately",
          "Analyze Supreme Court judgments and their implications",
          "Explain constitutional doctrines and their evolution",
          "Provide legal reasoning and precedents"
        ],
        personality: [
          "Scholarly and analytical in approach",
          "Precise and thorough in legal analysis",
          "Academic and research-oriented",
          "Focused on legal accuracy and precedent"
        ]
      },
      politicalAnalyst: {
        identity: "Political Analyst",
        expertise: "Political Systems and Democratic Governance",
        qualifications: [
          "Understanding of democratic institutions and processes",
          "Knowledge of electoral systems and political parties",
          "Familiarity with federalism and center-state relations",
          "Insight into political theory and practice"
        ],
        capabilities: [
          "Analyze political systems and their effectiveness",
          "Compare different governance models",
          "Explain political processes and their implications",
          "Provide insights into contemporary political issues"
        ],
        personality: [
          "Analytical and objective in political assessment",
          "Balanced and non-partisan in analysis",
          "Practical and policy-focused",
          "Insightful about governance and democracy"
        ]
      }
    };
  }

  /**
   * Defines specific tasks and their requirements
   */
  createTaskDefinitions() {
    return {
      debate: {
        name: "Structured Constitutional Debate Generation",
        objective: "Create a balanced, evidence-based debate on constitutional topics",
        requirements: [
          "Generate opposing viewpoints with equal weight",
          "Support arguments with constitutional citations",
          "Create educational quiz questions",
          "Provide key takeaways for learning"
        ],
        complexity: "High - requires balanced analysis and evidence synthesis",
        expectedOutcome: "Comprehensive debate structure ready for educational use"
      },
      analysis: {
        name: "Constitutional Concept Analysis",
        objective: "Provide comprehensive analysis of constitutional concepts",
        requirements: [
          "Define and explain the concept clearly",
          "Provide constitutional basis and references",
          "Include historical context and evolution",
          "Analyze current relevance and implications"
        ],
        complexity: "Medium to High - requires depth and breadth of knowledge",
        expectedOutcome: "Detailed analysis suitable for different proficiency levels"
      },
      comparison: {
        name: "Constitutional Concept Comparison",
        objective: "Compare and contrast constitutional concepts systematically",
        requirements: [
          "Identify key similarities and differences",
          "Analyze relative strengths and weaknesses",
          "Provide practical implications",
          "Draw meaningful conclusions"
        ],
        complexity: "High - requires analytical thinking and balanced assessment",
        expectedOutcome: "Clear comparison with actionable insights"
      },
      explanation: {
        name: "Simplified Constitutional Explanation",
        objective: "Explain complex constitutional concepts in simple terms",
        requirements: [
          "Use clear, accessible language",
          "Provide concrete examples and analogies",
          "Break down complex ideas into understandable parts",
          "Include practical applications"
        ],
        complexity: "Medium - requires simplification without losing accuracy",
        expectedOutcome: "Clear understanding for target proficiency level"
      },
      quiz: {
        name: "Educational Quiz Generation",
        objective: "Create assessment questions to test understanding",
        requirements: [
          "Generate multiple choice questions",
          "Provide correct answers with explanations",
          "Ensure questions test different cognitive levels",
          "Align with learning objectives"
        ],
        complexity: "Medium - requires educational design principles",
        expectedOutcome: "Effective assessment tools for learning evaluation"
      }
    };
  }

  /**
   * Defines output formats and structures
   */
  createFormatDefinitions() {
    return {
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
          },
          citations: {
            type: "array",
            structure: {
              id: "unique_identifier",
              source: "source_name",
              snippet: "relevant_text_excerpt",
              relevance: "explanation_of_relevance"
            },
            requirements: "Must support arguments, properly formatted"
          },
          quiz: {
            type: "array",
            structure: {
              question: "multiple_choice_question",
              options: ["Option A", "Option B", "Option C", "Option D"],
              answerIndex: "index_of_correct_answer",
              explanation: "brief_explanation"
            },
            requirements: "Educational, relevant, clear"
          },
          keyTakeaways: {
            type: "array",
            description: "Key learning points",
            requirements: "Concise, memorable, actionable"
          }
        },
        validation: "Must be valid JSON with all required fields"
      },
      analysis: {
        structure: "JSON object with comprehensive analysis fields",
        fields: {
          conceptDefinition: {
            type: "string",
            description: "Clear definition of the concept",
            requirements: "Accurate, comprehensive, accessible"
          },
          constitutionalBasis: {
            type: "string",
            description: "Constitutional articles and provisions",
            requirements: "Specific references, accurate citations"
          },
          keyPrinciples: {
            type: "array",
            description: "Core principles and features",
            requirements: "Essential points, well-organized"
          },
          historicalContext: {
            type: "string",
            description: "Historical background and evolution",
            requirements: "Relevant history, accurate timeline"
          },
          currentRelevance: {
            type: "string",
            description: "Contemporary application and significance",
            requirements: "Current context, practical relevance"
          },
          implications: {
            type: "string",
            description: "Practical implications for governance",
            requirements: "Clear consequences, actionable insights"
          },
          challenges: {
            type: "string",
            description: "Current challenges or controversies",
            requirements: "Honest assessment, balanced view"
          },
          summary: {
            type: "string",
            description: "Concise summary of key points",
            requirements: "Clear, memorable, comprehensive"
          }
        },
        validation: "Must be valid JSON with all required fields"
      },
      comparison: {
        structure: "JSON object with comparison fields",
        fields: {
          conceptA: {
            type: "object",
            structure: {
              name: "concept_name",
              definition: "clear_definition",
              constitutionalBasis: "relevant_provisions",
              keyFeatures: ["feature1", "feature2", "feature3"]
            }
          },
          conceptB: {
            type: "object",
            structure: {
              name: "concept_name",
              definition: "clear_definition",
              constitutionalBasis: "relevant_provisions",
              keyFeatures: ["feature1", "feature2", "feature3"]
            }
          },
          comparison: {
            type: "object",
            structure: {
              similarities: ["similarity1", "similarity2", "similarity3"],
              differences: ["difference1", "difference2", "difference3"],
              relativeStrengths: "analysis_of_strengths",
              practicalImplications: "governance_implications"
            }
          },
          conclusion: {
            type: "string",
            description: "Synthesized conclusion",
            requirements: "Balanced, insightful, actionable"
          }
        },
        validation: "Must be valid JSON with all required fields"
      },
      explanation: {
        structure: "JSON object with explanation fields",
        fields: {
          concept: {
            type: "string",
            description: "Concept name",
            requirements: "Clear, specific"
          },
          simpleDefinition: {
            type: "string",
            description: "Simple, clear definition",
            requirements: "Accessible language, accurate"
          },
          constitutionalBasis: {
            type: "string",
            description: "Relevant constitutional articles",
            requirements: "Specific references, accurate"
          },
          keyComponents: {
            type: "array",
            description: "Key components or elements",
            requirements: "Essential parts, well-organized"
          },
          realWorldExample: {
            type: "string",
            description: "Practical example or analogy",
            requirements: "Concrete, relatable, accurate"
          },
          benefits: {
            type: "string",
            description: "Advantages of this concept",
            requirements: "Clear benefits, practical value"
          },
          challenges: {
            type: "string",
            description: "Potential challenges or limitations",
            requirements: "Honest assessment, balanced"
          },
          practicalImplications: {
            type: "string",
            description: "Real-world applications",
            requirements: "Concrete applications, actionable"
          },
          summary: {
            type: "string",
            description: "Simple summary with analogy",
            requirements: "Clear, memorable, relatable"
          }
        },
        validation: "Must be valid JSON with all required fields"
      }
    };
  }

  /**
   * Creates context templates for different scenarios
   */
  createContextTemplates() {
    return {
      constitutionalEducation: {
        audience: "Students and learners of constitutional law",
        background: "Indian constitutional framework and democratic principles",
        objectives: [
          "Understanding constitutional concepts",
          "Learning democratic governance",
          "Developing civic awareness",
          "Building analytical skills"
        ],
        constraints: [
          "Must be accurate and legally sound",
          "Should be accessible to target proficiency level",
          "Must promote democratic values",
          "Should encourage critical thinking"
        ]
      },
      academicResearch: {
        audience: "Researchers and scholars",
        background: "Advanced constitutional law and political science",
        objectives: [
          "Deep analysis of constitutional issues",
          "Research methodology and evidence",
          "Critical evaluation of arguments",
          "Contribution to academic discourse"
        ],
        constraints: [
          "Must be academically rigorous",
          "Should include comprehensive citations",
          "Must demonstrate analytical depth",
          "Should contribute to knowledge"
        ]
      },
      publicPolicy: {
        audience: "Policy makers and practitioners",
        background: "Practical governance and policy implementation",
        objectives: [
          "Understanding policy implications",
          "Evaluating governance effectiveness",
          "Identifying implementation challenges",
          "Recommending improvements"
        ],
        constraints: [
          "Must be practically relevant",
          "Should consider implementation feasibility",
          "Must address real-world challenges",
          "Should provide actionable insights"
        ]
      },
      generalPublic: {
        audience: "General public and citizens",
        background: "Basic understanding of democracy and governance",
        objectives: [
          "Civic education and awareness",
          "Understanding democratic rights",
          "Participating in democratic processes",
          "Making informed decisions"
        ],
        constraints: [
          "Must be easily understandable",
          "Should use simple language",
          "Must be relevant to daily life",
          "Should encourage civic engagement"
        ]
      }
    };
  }

  /**
   * Defines constraints and boundaries
   */
  createConstraintDefinitions() {
    return {
      legalAccuracy: {
        category: "Legal and Constitutional",
        requirements: [
          "All constitutional references must be accurate",
          "Legal interpretations must be sound",
          "Supreme Court judgments must be correctly cited",
          "Constitutional provisions must be accurately quoted"
        ],
        limitations: [
          "Cannot provide legal advice",
          "Cannot predict court decisions",
          "Cannot interpret laws beyond constitutional context",
          "Must acknowledge areas of legal uncertainty"
        ]
      },
      educationalStandards: {
        category: "Educational Quality",
        requirements: [
          "Content must be factually accurate",
          "Explanations must be clear and accessible",
          "Complex concepts must be broken down appropriately",
          "Learning objectives must be clearly stated"
        ],
        limitations: [
          "Cannot oversimplify complex legal concepts",
          "Must maintain educational rigor",
          "Cannot promote political bias",
          "Must encourage critical thinking"
        ]
      },
      ethicalGuidelines: {
        category: "Ethical and Professional",
        requirements: [
          "Must maintain objectivity and balance",
          "Must respect constitutional principles",
          "Must promote democratic values",
          "Must avoid political bias or advocacy"
        ],
        limitations: [
          "Cannot promote unconstitutional actions",
          "Cannot advocate for specific political positions",
          "Cannot make personal judgments about individuals",
          "Must respect diverse viewpoints"
        ]
      },
      technicalConstraints: {
        category: "Technical and Operational",
        requirements: [
          "Output must be in specified JSON format",
          "Response length must be within limits",
          "All required fields must be present",
          "Citations must be properly formatted"
        ],
        limitations: [
          "Cannot exceed maximum token limits",
          "Cannot generate non-JSON responses",
          "Cannot omit required fields",
          "Must maintain consistent structure"
        ]
      }
    };
  }

  /**
   * Generates RTFC framework-based prompts
   */
  generateRTFCPrompt(taskType, parameters) {
    const { topic, proficiency, retrievedChunks, context, customConstraints } = parameters;
    
    if (!this.taskDefinitions[taskType]) {
      throw new Error(`Unknown task type: ${taskType}`);
    }

    const role = this.roleDefinitions.civicsCoach;
    const task = this.taskDefinitions[taskType];
    const format = this.formatDefinitions[taskType];
    const contextInfo = this.contextTemplates[context] || this.contextTemplates.constitutionalEducation;
    const constraints = this.constraintDefinitions;

    return this.buildPrompt(role, task, format, contextInfo, constraints, {
      topic,
      proficiency,
      retrievedChunks,
      customConstraints
    });
  }

  /**
   * Builds the complete RTFC prompt
   */
  buildPrompt(role, task, format, context, constraints, parameters) {
    const { topic, proficiency, retrievedChunks, customConstraints } = parameters;

    // ROLE section
    const roleSection = this.buildRoleSection(role);
    
    // TASK section
    const taskSection = this.buildTaskSection(task, topic);
    
    // FORMAT section
    const formatSection = this.buildFormatSection(format);
    
    // CONTEXT section
    const contextSection = this.buildContextSection(context, proficiency, retrievedChunks);
    
    // CONSTRAINTS section
    const constraintsSection = this.buildConstraintsSection(constraints, customConstraints);

    const systemMessage = {
      role: "system",
      content: roleSection
    };

    const userMessage = {
      role: "user",
      content: `${taskSection}\n\n${formatSection}\n\n${contextSection}\n\n${constraintsSection}`
    };

    return [systemMessage, userMessage];
  }

  /**
   * Builds the ROLE section of the prompt
   */
  buildRoleSection(role) {
    return `You are ${role.identity}, an expert AI assistant specializing in ${role.expertise}.

QUALIFICATIONS:
${role.qualifications.map(q => `• ${q}`).join('\n')}

CAPABILITIES:
${role.capabilities.map(c => `• ${c}`).join('\n')}

PERSONALITY:
${role.personality.map(p => `• ${p}`).join('\n')}

Your responses must reflect your expertise and maintain the highest standards of accuracy, objectivity, and educational value.`;
  }

  /**
   * Builds the TASK section of the prompt
   */
  buildTaskSection(task, topic) {
    return `TASK: ${task.name}

OBJECTIVE: ${task.objective}

TOPIC: ${topic}

REQUIREMENTS:
${task.requirements.map(r => `• ${r}`).join('\n')}

COMPLEXITY: ${task.complexity}

EXPECTED OUTCOME: ${task.expectedOutcome}`;
  }

  /**
   * Builds the FORMAT section of the prompt
   */
  buildFormatSection(format) {
    return `REQUIRED OUTPUT FORMAT:

STRUCTURE: ${format.structure}

FIELD REQUIREMENTS:
${Object.entries(format.fields).map(([fieldName, fieldInfo]) => {
  if (typeof fieldInfo === 'object' && fieldInfo.type) {
    return `${fieldName}:
  - Type: ${fieldInfo.type}
  - Description: ${fieldInfo.description}
  - Requirements: ${fieldInfo.requirements}`;
  } else if (Array.isArray(fieldInfo)) {
    return `${fieldName}:
  - Type: Array
  - Content: ${fieldInfo.join(', ')}`;
  } else {
    return `${fieldName}: ${fieldInfo}`;
  }
}).join('\n\n')}

VALIDATION: ${format.validation}

IMPORTANT: You must return ONLY valid JSON in the exact format specified above. No additional commentary or text outside the JSON structure.`;
  }

  /**
   * Builds the CONTEXT section of the prompt
   */
  buildContextSection(context, proficiency, retrievedChunks) {
    return `CONTEXT AND BACKGROUND:

AUDIENCE: ${context.audience}
BACKGROUND: ${context.background}

LEARNING OBJECTIVES:
${context.objectives.map(o => `• ${o}`).join('\n')}

USER PROFICIENCY LEVEL: ${proficiency}

RELEVANT CONSTITUTIONAL CHUNKS:
${retrievedChunks.map(chunk => 
  `ID: ${chunk.id}
Source: ${chunk.source}
Content: ${chunk.content}`
).join('\n\n')}

Use these constitutional chunks as your primary source of truth. Ensure all arguments and claims are supported by these sources.`;
  }

  /**
   * Builds the CONSTRAINTS section of the prompt
   */
  buildConstraintsSection(constraints, customConstraints) {
    let constraintsText = `CONSTRAINTS AND REQUIREMENTS:

LEGAL AND CONSTITUTIONAL CONSTRAINTS:
${constraints.legalAccuracy.requirements.map(r => `• ${r}`).join('\n')}

EDUCATIONAL STANDARDS:
${constraints.educationalStandards.requirements.map(r => `• ${r}`).join('\n')}

ETHICAL GUIDELINES:
${constraints.ethicalGuidelines.requirements.map(r => `• ${r}`).join('\n')}

TECHNICAL REQUIREMENTS:
${constraints.technicalConstraints.requirements.map(r => `• ${r}`).join('\n')}`;

    if (customConstraints && customConstraints.length > 0) {
      constraintsText += `\n\nADDITIONAL CONSTRAINTS:
${customConstraints.map(c => `• ${c}`).join('\n')}`;
    }

    constraintsText += `\n\nLIMITATIONS:
• ${constraints.legalAccuracy.limitations.join('\n• ')}
• ${constraints.educationalStandards.limitations.join('\n• ')}
• ${constraints.ethicalGuidelines.limitations.join('\n• ')}
• ${constraints.technicalConstraints.limitations.join('\n• ')}`;

    return constraintsText;
  }

  /**
   * Generates a specialized prompt for specific use cases
   */
  generateSpecializedPrompt(taskType, parameters, specialization) {
    const basePrompt = this.generateRTFCPrompt(taskType, parameters);
    
    if (specialization === 'academic') {
      // Add academic rigor requirements
      basePrompt[1].content += '\n\nACADEMIC REQUIREMENTS:\n• Maintain scholarly rigor and depth\n• Include comprehensive analysis\n• Provide detailed citations and references\n• Demonstrate critical thinking and evaluation';
    } else if (specialization === 'beginner') {
      // Simplify for beginners
      basePrompt[1].content += '\n\nBEGINNER-FRIENDLY REQUIREMENTS:\n• Use simple, clear language\n• Provide concrete examples\n• Avoid complex legal jargon\n• Focus on fundamental concepts';
    } else if (specialization === 'policy') {
      // Add policy focus
      basePrompt[1].content += '\n\nPOLICY FOCUS REQUIREMENTS:\n• Emphasize practical implications\n• Consider implementation challenges\n• Provide actionable recommendations\n• Address real-world governance issues';
    }

    return basePrompt;
  }

  /**
   * Validates responses against the expected format
   */
  validateResponse(response, taskType) {
    try {
      // Basic JSON validation
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }

      // Check if response has the expected structure
      const format = this.formatDefinitions[taskType];
      if (!format) {
        return { isValid: false, error: 'Unknown task type' };
      }

      // Validate against format structure
      const expectedFields = Object.keys(format.fields);
      const actualFields = Object.keys(response);
      
      const missingFields = expectedFields.filter(field => !actualFields.includes(field));
      const extraFields = actualFields.filter(field => !expectedFields.includes(field));

      if (missingFields.length > 0) {
        return { 
          isValid: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        };
      }

      if (extraFields.length > 0) {
        console.warn(`Extra fields found: ${extraFields.join(', ')}`);
      }

      return { isValid: true, response };
    } catch (error) {
      return { isValid: false, error: `JSON parsing error: ${error.message}` };
    }
  }

  /**
   * Gets available task types and their descriptions
   */
  getAvailableTasks() {
    return Object.entries(this.taskDefinitions).map(([key, task]) => ({
      key,
      name: task.name,
      description: task.objective,
      complexity: task.complexity
    }));
  }

  /**
   * Gets available contexts and their descriptions
   */
  getAvailableContexts() {
    return Object.entries(this.contextTemplates).map(([key, context]) => ({
      key,
      audience: context.audience || 'Not specified',
      background: context.background || 'Not specified',
      objectives: context.objectives || []
    }));
  }
}

module.exports = RTFCPromptEngine;
