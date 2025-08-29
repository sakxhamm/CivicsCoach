const axios = require("axios");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

// Top K Optimization System
const TOP_K_PRESETS = {
  // Context-based presets
  constitutionalEducation: {
    debate: { min: 3, max: 6, default: 4 },
    analysis: { min: 4, max: 8, default: 5 },
    comparison: { min: 5, max: 10, default: 6 },
    explanation: { min: 3, max: 7, default: 4 },
    quiz: { min: 2, max: 5, default: 3 }
  },
  academicResearch: {
    debate: { min: 4, max: 8, default: 5 },
    analysis: { min: 5, max: 10, default: 6 },
    comparison: { min: 6, max: 12, default: 8 },
    explanation: { min: 4, max: 8, default: 5 },
    quiz: { min: 3, max: 6, default: 4 }
  },
  publicPolicy: {
    debate: { min: 3, max: 7, default: 4 },
    analysis: { min: 4, max: 8, default: 5 },
    comparison: { min: 5, max: 10, default: 6 },
    explanation: { min: 3, max: 6, default: 4 },
    quiz: { min: 2, max: 5, default: 3 }
  },
  generalPublic: {
    debate: { min: 2, max: 5, default: 3 },
    analysis: { min: 3, max: 6, default: 4 },
    comparison: { min: 4, max: 8, default: 5 },
    explanation: { min: 2, max: 5, default: 3 },
    quiz: { min: 2, max: 4, default: 3 }
  },
  creativeTasks: {
    debate: { min: 4, max: 10, default: 6 },
    analysis: { min: 5, max: 12, default: 7 },
    comparison: { min: 6, max: 15, default: 8 },
    explanation: { min: 4, max: 8, default: 5 },
    quiz: { min: 3, max: 7, default: 4 }
  }
};

// Query complexity analysis
function analyzeQueryComplexity(query) {
  const words = query.trim().split(/\s+/).length;
  const hasComplexTerms = /(doctrine|jurisdiction|constitutional|amendment|fundamental)/i.test(query);
  const hasMultipleConcepts = /(and|or|versus|versus|compared|difference)/i.test(query);
  
  let complexity = 'simple';
  if (words > 15 || hasComplexTerms || hasMultipleConcepts) {
    complexity = 'complex';
  } else if (words > 8 || hasComplexTerms) {
    complexity = 'moderate';
  }
  
  return complexity;
}

// Get optimal Top K value
function getOptimalTopK(context, taskType, queryComplexity, proficiency, customTopK = null) {
  // If custom Top K is provided, use it (with bounds checking)
  if (customTopK !== null && customTopK !== undefined) {
    return Math.max(1, Math.min(20, customTopK));
  }

  // Get context-specific preset
  const contextPresets = TOP_K_PRESETS[context] || TOP_K_PRESETS.constitutionalEducation;
  const taskPreset = contextPresets[taskType] || contextPresets.debate;
  
  let optimalTopK = taskPreset.default;

  // Adjust based on query complexity
  switch (queryComplexity) {
    case 'simple':
      optimalTopK = Math.max(taskPreset.min, optimalTopK - 1);
      break;
    case 'complex':
      optimalTopK = Math.min(taskPreset.max, optimalTopK + 2);
      break;
    case 'moderate':
    default:
      // Keep default value
      break;
  }

  // Adjust based on proficiency level
  switch (proficiency) {
    case 'beginner':
      // Beginners need more context, increase Top K slightly
      optimalTopK = Math.min(taskPreset.max, optimalTopK + 1);
      break;
    case 'advanced':
      // Advanced users can work with more focused results
      optimalTopK = Math.max(taskPreset.min, optimalTopK - 1);
      break;
    case 'intermediate':
    default:
      // Keep calculated value
      break;
  }

  // Ensure Top K stays within valid bounds
  return Math.max(1, Math.min(20, optimalTopK));
}

// Mock response for demo purposes when API is rate limited
const getMockResponse = (query, useCoT) => {
  const mockResponses = {
    "What is the Basic Structure Doctrine?": {
      stance: "The Basic Structure Doctrine, established in Kesavananda Bharati v. State of Kerala (1973), limits Parliament's power to amend the Constitution. While Article 368 allows amendments, the Court ruled that Parliament cannot alter the Constitution's 'basic structure,' encompassing elements like the Constitution's supremacy, republican and democratic governance, secularism, separation of powers, federalism, and fundamental rights.",
      counterStance: "The exact components of the 'basic structure' remain subject to judicial interpretation and debate, leading to ongoing controversies about the extent of Parliament's amending power. The doctrine's application in specific cases has been contested, highlighting the inherent tension between parliamentary sovereignty and judicial review.",
      citations: [
        {
          id: "KesavanandaBharati",
          source: "Kesavananda Bharati v. State of Kerala (1973)",
          snippet: "The Basic Structure Doctrine was established by the Supreme Court in Kesavananda Bharati v. State of Kerala (1973). It holds that while Parliament has the power to amend the Constitution under Article 368, it cannot alter the 'basic structure' or fundamental features of the Constitution."
        }
      ],
      quiz: [
        {
          q: "Which landmark Supreme Court case established the Basic Structure Doctrine?",
          options: ["Kesavananda Bharati v. State of Kerala", "Golak Nath v. State of Punjab", "Minerva Mills v. Union of India"],
          answerIndex: 0
        }
      ]
    },
    "How does the Indian Constitution define Money Bills?": {
      stance: "Article 110 of the Indian Constitution defines Money Bills as bills that contain only provisions dealing with matters like imposition, abolition, remission, alteration or regulation of any tax; regulation of borrowing of money; custody of Consolidated Fund or Contingency Fund; appropriation of moneys out of the Consolidated Fund; declaring of any expenditure to be expenditure charged on the Consolidated Fund; and receipt of money on account of the Consolidated Fund.",
      counterStance: "The definition of Money Bills has been subject to controversy, particularly regarding the Speaker's discretion in determining what constitutes a Money Bill. Critics argue that this broad definition has been used to bypass the Rajya Sabha's scrutiny on important financial matters.",
      citations: [
        {
          id: "article110",
          source: "Constitution of India",
          snippet: "Article 110 of the Indian Constitution defines Money Bills. A Bill is deemed to be a Money Bill if it contains only provisions dealing with all or any of the following matters: (a) the imposition, abolition, remission, alteration or regulation of any tax; (b) the regulation of the borrowing of money or the giving of any guarantee by the Government of India."
        }
      ],
      quiz: [
        {
          q: "Which article of the Indian Constitution defines Money Bills?",
          options: ["Article 110", "Article 112", "Article 114", "Article 116"],
          answerIndex: 0
        }
      ]
    }
  };

  const defaultResponse = {
    stance: "This is a demo response. The actual AI service is currently rate limited. Please try again later or contact support for API access.",
    counterStance: "In a real implementation, this would contain the opposing viewpoint generated by the AI model using Chain of Thought reasoning.",
    citations: [
      {
        id: "demo",
        source: "Demo Mode",
        snippet: "This is a placeholder citation. Real citations would be retrieved from the constitutional corpus."
      }
    ],
    quiz: [
      {
        q: "This is a demo quiz question. Real questions would be generated by the AI model.",
        options: ["Option A", "Option B", "Option C", "Option D"],
        answerIndex: 0
      }
    ]
  };

  return mockResponses[query] || defaultResponse;
};

/**
 * Call Google Gemini API with Top K optimization
 * @param {Array} messages - Array of messages (role: "user"/"assistant", content: "...")
 * @param {number} temperature - Sampling temperature (0.0 to 2.0)
 * @param {number} top_p - Top-p sampling parameter (0.0 to 1.0)
 * @param {string} context - Context for Top K optimization (default: 'constitutionalEducation')
 * @param {string} taskType - Task type for Top K optimization (default: 'debate')
 * @param {string} query - Query for complexity analysis
 * @param {string} proficiency - User proficiency level (default: 'intermediate')
 * @param {number} customTopK - Custom Top K override (optional)
 */
async function callGemini({ 
  messages, 
  temperature = 0.2, 
  top_p = 1.0,
  context = 'constitutionalEducation',
  taskType = 'debate',
  query = '',
  proficiency = 'intermediate',
  customTopK = null
}) {
  if (!GEMINI_KEY) {
    throw new Error("GEMINI_API_KEY is required. Please set it in your .env file.");
  }

  // Analyze query complexity for Top K optimization
  const queryComplexity = analyzeQueryComplexity(query);
  
  // Get optimal Top K value
  const optimalTopK = getOptimalTopK(context, taskType, queryComplexity, proficiency, customTopK);

  console.log(`🔍 Top K Configuration:`);
  console.log(`  Context: ${context}`);
  console.log(`  Task Type: ${taskType}`);
  console.log(`  Query Complexity: ${queryComplexity}`);
  console.log(`  Proficiency: ${proficiency}`);
  console.log(`  Custom Top K: ${customTopK !== null ? customTopK : 'Not specified'}`);
  console.log(`  Optimal Top K: ${optimalTopK}`);
  console.log(`  Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);

  try {
    // Google Gemini expects a different input format
    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const requestBody = {
      contents,
      generationConfig: {
        temperature,
        topP: top_p,
        maxOutputTokens: 2048,
        stopSequences: ["</reasoning>"]
      }
    };

    const resp = await axios.post(
      GEMINI_URL,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Extract response text
    const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract usage information if available
    const usage = resp.data?.usageMetadata ? {
      input: resp.data.usageMetadata.promptTokenCount || 0,
      output: resp.data.usageMetadata.candidatesTokenCount || 0,
      total: resp.data.usageMetadata.totalTokenCount || 0
    } : null;

    return {
      text,
      usage,
      raw: resp.data,
      topK: optimalTopK,
      context,
      taskType,
      queryComplexity,
      proficiency
    };
  } catch (err) {
    console.error("Gemini API call error:", err.response?.data || err.message);
    
    if (err.response?.status === 401) {
      throw new Error("Invalid GEMINI_API_KEY. Please check your API key.");
    } else if (err.response?.status === 429) {
      // Return mock response for rate limiting
      console.log("API rate limited, returning demo response");
      const queryText = messages[messages.length - 1]?.content || "";
      const mockData = getMockResponse(queryText, true);
      
      return {
        text: JSON.stringify(mockData),
        usage: { input: 100, output: 200, total: 300 },
        raw: { demo: true, message: "Rate limited - using demo response" },
        topK: optimalTopK,
        context,
        taskType,
        queryComplexity,
        proficiency
      };
    } else {
      throw new Error(`Gemini API error: ${err.response?.data?.error?.message || err.message}`);
    }
  }
}

module.exports = { 
  callGemini, 
  getOptimalTopK, 
  TOP_K_PRESETS,
  analyzeQueryComplexity 
};
