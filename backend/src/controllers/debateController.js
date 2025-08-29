// backend/src/controllers/debateController.js
const { callGemini } = require('../services/geminiService');
const { retrieveChunks } = require('../services/similarityService');
const { buildChainMessages } = require('../prompts/chainOfThoughtPrompt');
const { ZeroShotPromptEngine } = require('../prompts/zeroShotPrompt');

const { callGemini, getOptimalTopK } = require('../services/geminiService');
const { safeParseJSONMaybe, validateDebateSchema } = require('../utils/jsonValidator');

// Initialize zero-shot prompt engine
const zeroShotPromptEngine = new ZeroShotPromptEngine();
const { DynamicPromptEngine } = require('../prompts/dynamicPrompt');

const { DynamicPromptEngine } = require('../prompts/dynamicPrompt');
const { safeParseJSONMaybe } = require('../utils/jsonValidator');


// Initialize prompting engines
const zeroShotPromptEngine = new ZeroShotPromptEngine();
const dynamicPromptEngine = new DynamicPromptEngine();


// Load corpus data for retrieval
const corpus = require('../../data/corpus_chunks.json');

// Enhanced retrieval function with Top K optimization
function retrieveChunks(query, topK = 4, context = 'constitutionalEducation', taskType = 'debate', proficiency = 'intermediate') {
  // Get optimal Top K if not explicitly provided
  const optimalTopK = getOptimalTopK(context, taskType, 'moderate', proficiency, topK);
  
  console.log(`🔍 Retrieval Configuration:`);
  console.log(`  Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
  console.log(`  Requested Top K: ${topK}`);
  console.log(`  Optimal Top K: ${optimalTopK}`);
  console.log(`  Context: ${context}`);
  console.log(`  Task Type: ${taskType}`);
  console.log(`  Proficiency: ${proficiency}`);

  // Simple keyword matching for demo (can be enhanced with vector search)
  const queryLower = query.toLowerCase();
  const scoredChunks = corpus.map(chunk => {
    const textLower = chunk.text.toLowerCase();
    let score = 0;
    
    // Simple keyword scoring
    const keywords = queryLower.split(' ');
    keywords.forEach(keyword => {
      if (textLower.includes(keyword)) score += 1;
    });
    
    // Bonus for constitutional terms
    if (/(constitution|amendment|article|fundamental|rights|doctrine)/i.test(chunk.text)) {
      score += 0.5;
    }
    
    return { ...chunk, score };
  });
  
  // Sort by score and return optimal Top K
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, optimalTopK)
    .map(chunk => ({ 
      id: chunk.id, 
      text: chunk.text, 
      metadata: chunk.metadata,
      score: chunk.score
    }));
}

async function generate(req, res) {
/**
 * Generate a debate using the specified prompting strategy
 */
async function generateDebate(req, res) {

  try {
    const { 
      query, 
      topK = null, // Use null to trigger optimal Top K calculation
      metric = 'cosine', 
      proficiency = 'intermediate', 
      temperature = null, 
      top_p = 1.0, 
      useCoT = true,
      useZeroShot = false,
      taskType = 'debate',
      context = 'constitutionalEducation'
    } = req.body;

    if (!query) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Query is required' 
      });
    }

    // 1) RETRIEVE relevant chunks with Top K optimization
    const retrievedChunks = retrieveChunks(query, topK, context, taskType, proficiency);
    // 1) RETRIEVE relevant chunks
    const retrievedChunks = retrieveChunks(query, topK);


    // 2) Build messages based on prompting strategy
    let messages;
    let promptMetadata = {};
    
    if (useZeroShot) {
      // Use zero-shot prompting
      const zeroShotPrompt = zeroShotPromptEngine.generateZeroShotPrompt(
        taskType,
        query,
        proficiency,
        retrievedChunks,
        { additionalContext: req.body.additionalContext }
      );
      messages = zeroShotPrompt.messages;
      promptMetadata = {
        promptingStrategy: 'zero-shot',
        taskType: zeroShotPrompt.metadata.taskType,
        taskDescription: zeroShotPrompt.metadata.taskDescription,
        outputFormat: zeroShotPrompt.metadata.outputFormat,
        constraints: zeroShotPrompt.metadata.constraints,
        zeroShotFeatures: zeroShotPrompt.metadata.zeroShotFeatures
      };

    } else if (req.body.useDynamicPrompting !== false) {
      // Use dynamic prompting
      const dynamicPrompt = dynamicPromptEngine.generateDynamicPrompt(
        query, 
        proficiency, 
        retrievedChunks,
        { previousResponses: req.body.previousResponses || [] }
      );
      messages = dynamicPrompt.messages;
      promptMetadata = {
        promptingStrategy: 'dynamic',
        ...dynamicPrompt.metadata
      };

    } else {
      // Use traditional chain-of-thought prompting
      messages = buildChainMessages({ 
        audience: proficiency, 
        topic: query, 
        retrievedChunks, 
        minCitations: 2, 
        proficiency, 
        examples: true 
      });

      promptMetadata = {
        promptingStrategy: 'chain-of-thought',
        examples: true,
        reasoning: useCoT ? 'enabled' : 'disabled'
      };
    }

    if (!useCoT) {
      messages[0].content = messages[0].content.replace(
        'You MAY use internal step-by-step reasoning to improve accuracy, BUT DO NOT reveal the chain-of-thought.',
        'Do NOT use internal step-by-step reasoning. Answer directly.'
      );
    }

    // 3) Call Gemini API with Top K optimization

    // 3) Call Gemini API with optimized temperature
    const llmResp = await callGemini({ 
      messages, 
      temperature, 
      top_p,
      context,
      taskType,
      query,
      proficiency,
      customTopK: topK
      proficiency
    });

    // 4) Parse & validate JSON
    const parsed = safeParseJSONMaybe(llmResp.text);
    if (!parsed.ok) {
      return res.status(500).json({
        ok: false,
        error: 'Failed to parse AI response',
        details: parsed.error,
        rawResponse: llmResp.text
      });
    }

    // 5) Return successful response
    return res.json({
      ok: true,
      data: parsed.data,
      metadata: {
        ...promptMetadata,
        temperature: llmResp.temperature,
        context: llmResp.context,
        taskType: llmResp.taskType,
        proficiency: llmResp.proficiency,
        usage: llmResp.usage,
        retrievedChunks: retrievedChunks.length
      }
    });

  } catch (error) {
    console.error('Debate generation error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Generate a debate with chain-of-thought prompting
 */
async function generateDebateWithCoT(req, res) {
  try {
    const { 
      query, 
      topK = 4, 
      metric = 'cosine', 
      proficiency = 'intermediate', 
      temperature = null, 
      top_p = 1.0,
      context = 'constitutionalEducation'
    } = req.body;

    if (!query) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Query is required' 
      });
    }

    // 1) RETRIEVE relevant chunks
    const retrievedChunks = retrieveChunks(query, topK);

    // 2) Build chain-of-thought messages
    const messages = buildChainMessages({ 
      audience: proficiency, 
      topic: query, 
      retrievedChunks, 
      minCitations: 2, 
      proficiency, 
      examples: true 
    });

    // 3) Call Gemini API with optimized temperature
    const llmResp = await callGemini({ 
      messages, 
      temperature, 
      top_p,
      context,
      taskType: 'debate',
      proficiency
    });

    // 4) Parse & validate JSON
    const parsed = safeParseJSONMaybe(llmResp.text);
    if (!parsed.ok) {
      return res.status(500).json({
        ok: false,
        error: 'Failed to parse AI response',
        details: parsed.error,
        rawResponse: llmResp.text
      });
    }

    // 5) Return successful response
    return res.json({
      ok: true,
      data: parsed.data,
      metadata: {
        promptingStrategy: 'chain-of-thought',
        examples: true,
        reasoning: 'enabled',
        temperature: llmResp.temperature,
        context: llmResp.context,
        taskType: llmResp.taskType,
        proficiency: llmResp.proficiency,
        usage: llmResp.usage,
        retrievedChunks: retrievedChunks.length
      }
    });

  } catch (error) {
    console.error('Chain-of-thought debate generation error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Generate a debate with zero-shot prompting
 */
async function generateDebateWithZeroShot(req, res) {
  try {
    const { 
      query, 
      topK = 4, 
      metric = 'cosine', 
      proficiency = 'intermediate', 
      temperature = null, 
      top_p = 1.0,
      taskType = 'debate',
      context = 'constitutionalEducation'
    } = req.body;

    if (!query) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Query is required' 
      });
    }


    // 5) Return structured response with enhanced metadata
    res.json({ 
      ok: true, 
      data: parsed.data, 
      metadata: {
        retrievedChunks: retrievedChunks.length,
        useCoT,
        temperature,
        top_p,
        tokens: llmResp.usage || { input: 0, output: 0 },
        topK: llmResp.topK,
        context: llmResp.context,
        taskType: llmResp.taskType,
        queryComplexity: llmResp.queryComplexity,
        proficiency: llmResp.proficiency,
        retrievalScores: retrievedChunks.map(chunk => ({
          id: chunk.id,
          score: chunk.score
        })),
        ...promptMetadata
      },
      raw: llmResp.raw 
    });
  } catch (err) {
    console.error('Debate generation error:', err);
    
    // Handle rate limit specifically
    if (err.message.includes('Rate limit exceeded')) {
      // Return a demo response for rate limited cases
      const mockData = {
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
      
      return res.json({
        ok: true,
        data: mockData,
        metadata: {
          retrievedChunks: 0,
          useCoT: false,
          temperature: 0.2,
          top_p: 1.0,
          tokens: { input: 0, output: 0 },
          topK: 4,
          context: 'constitutionalEducation',
          taskType: 'debate',
          queryComplexity: 'moderate',
          proficiency: 'intermediate',
          retrievalScores: [],
          promptingStrategy: 'demo',
          demo: true
        },
        raw: { demo: true, message: "Rate limited - using demo response" }

    // 1) RETRIEVE relevant chunks
    const retrievedChunks = retrieveChunks(query, topK);

    // 2) Generate zero-shot prompt
    const zeroShotPrompt = zeroShotPromptEngine.generateZeroShotPrompt(
      taskType,
      query,
      proficiency,
      retrievedChunks,
      { additionalContext: req.body.additionalContext }
    );

    // 3) Call Gemini API with optimized temperature
    const llmResp = await callGemini({ 
      messages: zeroShotPrompt.messages, 
      temperature, 
      top_p,
      context,
      taskType,
      proficiency
    });

    // 4) Parse & validate JSON
    const parsed = safeParseJSONMaybe(llmResp.text);
    if (!parsed.ok) {
      return res.status(500).json({
        ok: false,
        error: 'Failed to parse AI response',
        details: parsed.error,
        rawResponse: llmResp.text
      });
    }

    // 5) Return successful response
    return res.json({
      ok: true,
      data: parsed.data,
      metadata: {
        promptingStrategy: 'zero-shot',
        taskType: zeroShotPrompt.metadata.taskType,
        taskDescription: zeroShotPrompt.metadata.taskDescription,
        outputFormat: zeroShotPrompt.metadata.outputFormat,
        constraints: zeroShotPrompt.metadata.constraints,
        zeroShotFeatures: zeroShotPrompt.metadata.zeroShotFeatures,
        temperature: llmResp.temperature,
        context: llmResp.context,
        taskType: llmResp.taskType,
        proficiency: llmResp.proficiency,
        usage: llmResp.usage,
        retrievedChunks: retrievedChunks.length
      }
    });

  } catch (error) {
    console.error('Zero-shot debate generation error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error'
    });
  }
}

/**
 * Generate a debate with dynamic prompting
 */
async function generateDebateWithDynamicPrompting(req, res) {
  try {
    const { 
      query, 
      topK = 4, 
      metric = 'cosine', 
      proficiency = 'intermediate', 
      temperature = null, 
      top_p = 1.0,
      context = 'constitutionalEducation'
    } = req.body;

    if (!query) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Query is required' 

      });
    } else {
      return res.status(500).json({ 
        ok: false, 
        error: err.message 
      });
    }


    // 1) RETRIEVE relevant chunks
    const retrievedChunks = retrieveChunks(query, topK);

    // 2) Generate dynamic prompt
    const dynamicPrompt = dynamicPromptEngine.generateDynamicPrompt(
      query, 
      proficiency, 
      retrievedChunks,
      { previousResponses: req.body.previousResponses || [] }
    );

    // 3) Call Gemini API with optimized temperature
    const llmResp = await callGemini({ 
      messages: dynamicPrompt.messages, 
      temperature, 
      top_p,
      context,
      taskType: 'debate',
      proficiency
    });

    // 4) Parse & validate JSON
    const parsed = safeParseJSONMaybe(llmResp.text);
    if (!parsed.ok) {
      return res.status(500).json({
        ok: false,
        error: 'Failed to parse AI response',
        details: parsed.error,
        rawResponse: llmResp.text
      });
    }

    // 5) Return successful response
    return res.json({
      ok: true,
      data: parsed.data,
      metadata: {
        promptingStrategy: 'dynamic',
        ...dynamicPrompt.metadata,
        temperature: llmResp.temperature,
        context: llmResp.context,
        taskType: llmResp.taskType,
        proficiency: llmResp.proficiency,
        usage: llmResp.usage,
        retrievedChunks: retrievedChunks.length
      }
    });

  } catch (error) {
    console.error('Dynamic prompting debate generation error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Internal server error'
    });

  }
}

module.exports = {
  generateDebate,
  generateDebateWithCoT,
  generateDebateWithZeroShot,
  generateDebateWithDynamicPrompting
};
