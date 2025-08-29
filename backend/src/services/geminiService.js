const axios = require("axios");

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

// Token Analysis and Logging System
const TOKEN_ANALYSIS_CONFIG = {
  // Token estimation for different content types
  contentTypes: {
    constitutional: {
      legalTerms: ['constitution', 'amendment', 'article', 'fundamental', 'rights', 'doctrine', 'jurisdiction', 'supreme court', 'parliament'],
      tokenMultiplier: 1.2 // Legal terms are more complex
    },
    academic: {
      academicTerms: ['analysis', 'research', 'study', 'investigation', 'examination', 'evaluation', 'assessment'],
      tokenMultiplier: 1.1
    },
    creative: {
      creativeTerms: ['imagine', 'create', 'design', 'innovate', 'brainstorm', 'explore', 'discover'],
      tokenMultiplier: 1.0
    }
  },
  
  // Token estimation rules
  estimationRules: {
    wordsPerToken: 0.75, // Average words per token (varies by language)
    punctuationMultiplier: 1.05, // Punctuation adds tokens
    specialCharMultiplier: 1.1, // Special characters add tokens
    newlineMultiplier: 1.02 // Newlines add tokens
  }
};

// Estimate tokens for text content
function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  
  const words = text.trim().split(/\s+/).length;
  const characters = text.length;
  const hasPunctuation = /[.,!?;:()"'\[\]{}]/.test(text);
  const hasSpecialChars = /[^a-zA-Z0-9\s.,!?;:()"'\[\]{}]/.test(text);
  const hasNewlines = /\n/.test(text);
  
  // Base token estimation
  let estimatedTokens = Math.ceil(words / TOKEN_ANALYSIS_CONFIG.estimationRules.wordsPerToken);
  
  // Apply multipliers
  if (hasPunctuation) {
    estimatedTokens = Math.ceil(estimatedTokens * TOKEN_ANALYSIS_CONFIG.estimationRules.punctuationMultiplier);
  }
  
  if (hasSpecialChars) {
    estimatedTokens = Math.ceil(estimatedTokens * TOKEN_ANALYSIS_CONFIG.estimationRules.specialCharMultiplier);
  }
  
  if (hasNewlines) {
    estimatedTokens = Math.ceil(estimatedTokens * TOKEN_ANALYSIS_CONFIG.estimationRules.newlineMultiplier);
  }
  
  // Content type analysis
  const textLower = text.toLowerCase();
  let contentMultiplier = 1.0;
  
  if (TOKEN_ANALYSIS_CONFIG.contentTypes.constitutional.legalTerms.some(term => textLower.includes(term))) {
    contentMultiplier = TOKEN_ANALYSIS_CONFIG.contentTypes.constitutional.tokenMultiplier;
  } else if (TOKEN_ANALYSIS_CONFIG.contentTypes.academic.academicTerms.some(term => textLower.includes(term))) {
    contentMultiplier = TOKEN_ANALYSIS_CONFIG.contentTypes.academic.tokenMultiplier;
  } else if (TOKEN_ANALYSIS_CONFIG.contentTypes.creative.creativeTerms.some(term => textLower.includes(term))) {
    contentMultiplier = TOKEN_ANALYSIS_CONFIG.contentTypes.creative.tokenMultiplier;
  }
  
  estimatedTokens = Math.ceil(estimatedTokens * contentMultiplier);
  
  return {
    estimated: estimatedTokens,
    words,
    characters,
    hasPunctuation,
    hasSpecialChars,
    hasNewlines,
    contentType: contentMultiplier > 1.0 ? 'complex' : 'standard'
  };
}

// Analyze tokens for messages array
function analyzeMessageTokens(messages) {
  const analysis = {
    totalMessages: messages.length,
    totalEstimatedTokens: 0,
    messageBreakdown: [],
    contentAnalysis: {
      constitutional: 0,
      academic: 0,
      creative: 0,
      standard: 0
    }
  };
  
  messages.forEach((message, index) => {
    const tokenInfo = estimateTokens(message.content);
    const role = message.role || 'unknown';
    
    analysis.totalEstimatedTokens += tokenInfo.estimated;
    analysis.messageBreakdown.push({
      index,
      role,
      content: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
      estimatedTokens: tokenInfo.estimated,
      words: tokenInfo.words,
      characters: tokenInfo.characters,
      contentType: tokenInfo.contentType
    });
    
    // Count content types
    if (tokenInfo.contentType === 'complex') {
      if (role === 'user') {
        analysis.contentAnalysis.constitutional++;
      } else {
        analysis.contentAnalysis.academic++;
      }
    } else {
      analysis.contentAnalysis.standard++;
    }
  });
  
  return analysis;
}

// Enhanced token logging
function logTokenUsage(inputAnalysis, outputTokens, apiResponse, query = '') {
  const timestamp = new Date().toISOString();
  const totalInputTokens = inputAnalysis.totalEstimatedTokens;
  const totalOutputTokens = outputTokens || 0;
  const totalTokens = totalInputTokens + totalOutputTokens;
  
  console.log('\n🔢 TOKEN USAGE ANALYSIS');
  console.log('═'.repeat(80));
  console.log(`📅 Timestamp: ${timestamp}`);
  console.log(`🔍 Query: "${query.substring(0, 80)}${query.length > 80 ? '...' : ''}"`);
  console.log('');
  
  // Input Token Analysis
  console.log('📥 INPUT TOKENS:');
  console.log(`  Total Messages: ${inputAnalysis.totalMessages}`);
  console.log(`  Total Estimated Input Tokens: ${totalInputTokens}`);
  console.log(`  Content Distribution:`);
  console.log(`    Constitutional/Legal: ${inputAnalysis.contentAnalysis.constitutional}`);
  console.log(`    Academic/Research: ${inputAnalysis.contentAnalysis.academic}`);
  console.log(`    Standard: ${inputAnalysis.contentAnalysis.standard}`);
  console.log('');
  
  // Message Breakdown
  console.log('📋 MESSAGE BREAKDOWN:');
  inputAnalysis.messageBreakdown.forEach((msg, index) => {
    console.log(`  ${index + 1}. [${msg.role.toUpperCase()}] ${msg.estimatedTokens} tokens`);
    console.log(`     Content: "${msg.content}"`);
    console.log(`     Words: ${msg.words}, Characters: ${msg.characters}, Type: ${msg.contentType}`);
    console.log('');
  });
  
  // Output Token Analysis
  console.log('📤 OUTPUT TOKENS:');
  console.log(`  Actual Output Tokens: ${totalOutputTokens}`);
  console.log(`  API Response Tokens: ${apiResponse?.usageMetadata?.candidatesTokenCount || 'N/A'}`);
  console.log(`  Total API Tokens: ${apiResponse?.usageMetadata?.totalTokenCount || 'N/A'}`);
  console.log('');
  
  // Token Efficiency Analysis
  console.log('⚡ TOKEN EFFICIENCY:');
  console.log(`  Total Tokens Used: ${totalTokens}`);
  console.log(`  Input/Output Ratio: ${totalInputTokens > 0 ? (totalOutputTokens / totalInputTokens).toFixed(2) : 'N/A'}`);
  console.log(`  Cost Estimation: $${((totalTokens / 1000) * 0.0005).toFixed(6)} (approx. $0.0005 per 1K tokens)`);
  console.log('');
  
  // Performance Metrics
  if (apiResponse?.usageMetadata) {
    const promptTokens = apiResponse.usageMetadata.promptTokenCount || 0;
    const candidateTokens = apiResponse.usageMetadata.candidatesTokenCount || 0;
    const totalAPITokens = apiResponse.usageMetadata.totalTokenCount || 0;
    
    console.log('📊 API TOKEN METRICS:');
    console.log(`  Prompt Tokens: ${promptTokens}`);
    console.log(`  Candidate Tokens: ${candidateTokens}`);
    console.log(`  Total API Tokens: ${totalAPITokens}`);
    console.log(`  Estimation Accuracy: ${promptTokens > 0 ? ((inputAnalysis.totalEstimatedTokens / promptTokens) * 100).toFixed(1) : 'N/A'}%`);
    console.log('');
  }
  
  // Token Optimization Suggestions
  console.log('💡 TOKEN OPTIMIZATION SUGGESTIONS:');
  if (totalInputTokens > 1000) {
    console.log(`  ⚠️  High input token usage (${totalInputTokens}). Consider:`);
    console.log(`     - Breaking complex queries into smaller parts`);
    console.log(`     - Using more concise language`);
    console.log(`     - Limiting context chunks`);
  }
  
  if (totalOutputTokens > 500) {
    console.log(`  ⚠️  High output token usage (${totalOutputTokens}). Consider:`);
    console.log(`     - Setting lower maxOutputTokens`);
    console.log(`     - Using more specific prompts`);
    console.log(`     - Implementing response length limits`);
  }
  
  if (inputAnalysis.contentAnalysis.constitutional > 0) {
    console.log(`  📚 Constitutional content detected. Legal terms may increase token usage.`);
  }
  
  if (inputAnalysis.contentAnalysis.academic > 0) {
    console.log(`  🔬 Academic content detected. Complex terminology may increase token usage.`);
  }
  
  console.log('═'.repeat(80));
  console.log('');
  
  return {
    timestamp,
    inputTokens: totalInputTokens,
    outputTokens: totalOutputTokens,
    totalTokens,
    efficiency: totalInputTokens > 0 ? (totalOutputTokens / totalInputTokens) : 0,
    costEstimate: (totalTokens / 1000) * 0.0005
  };
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
 * Call Google Gemini API with comprehensive token logging
 * @param {Array} messages - Array of messages (role: "user"/"assistant", content: "...")
 * @param {number} temperature - Sampling temperature (0.0 to 2.0)
 * @param {number} top_p - Top-p sampling parameter (0.0 to 1.0)
 * @param {string} query - Query for token analysis and logging
 */
async function callGemini({ messages, temperature = 0.2, top_p = 1.0, query = '' }) {
  if (!GEMINI_KEY) {
    throw new Error("GEMINI_API_KEY is required. Please set it in your .env file.");
  }

  // Analyze input tokens before API call
  const inputTokenAnalysis = analyzeMessageTokens(messages);
  
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

    // Log comprehensive token usage
    const outputTokens = usage?.output || 0;
    const tokenLog = logTokenUsage(inputTokenAnalysis, outputTokens, resp.data, query);

    return {
      text,
      usage,
      raw: resp.data,
      tokenAnalysis: {
        input: inputTokenAnalysis,
        output: outputTokens,
        total: tokenLog.totalTokens,
        efficiency: tokenLog.efficiency,
        costEstimate: tokenLog.costEstimate,
        timestamp: tokenLog.timestamp
      }
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
      
      // Log token usage for mock response
      const mockOutputTokens = estimateTokens(JSON.stringify(mockData)).estimated;
      const tokenLog = logTokenUsage(inputTokenAnalysis, mockOutputTokens, { demo: true }, query);
      
      return {
        text: JSON.stringify(mockData),
        usage: { input: 100, output: 200, total: 300 },
        raw: { demo: true, message: "Rate limited - using demo response" },
        tokenAnalysis: {
          input: inputTokenAnalysis,
          output: mockOutputTokens,
          total: tokenLog.totalTokens,
          efficiency: tokenLog.efficiency,
          costEstimate: tokenLog.costEstimate,
          timestamp: tokenLog.timestamp,
          demo: true
        }
      };
    } else {
      throw new Error(`Gemini API error: ${err.response?.data?.error?.message || err.message}`);
    }
  }
}

module.exports = { 
  callGemini, 
  estimateTokens,
  analyzeMessageTokens,
  logTokenUsage,
  TOKEN_ANALYSIS_CONFIG
};
