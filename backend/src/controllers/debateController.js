// backend/src/controllers/debateController.js
const { buildChainMessages } = require('../prompts/chainOfThoughtPrompt');

const { ZeroShotPromptEngine } = require('../prompts/zeroShotPrompt');
const { callGemini, getOptimalTopP } = require('../services/geminiService');
const { safeParseJSONMaybe, validateDebateSchema } = require('../utils/jsonValidator');

// Initialize zero-shot prompt engine
const zeroShotPromptEngine = new ZeroShotPromptEngine();
const { DynamicPromptEngine } = require('../prompts/dynamicPrompt');

// Initialize dynamic prompt engine
const dynamicPromptEngine = new DynamicPromptEngine();

// Load corpus data for retrieval
const corpus = require('../../data/corpus_chunks.json');

// Enhanced retrieval function with Top P optimization
function retrieveChunks(query, topK = 4, context = 'constitutionalEducation', taskType = 'debate', proficiency = 'intermediate') {
  console.log(`🔍 Retrieval Configuration:`);
  console.log(`  Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
  console.log(`  Top K: ${topK}`);
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
  
  // Sort by score and return top K
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(chunk => ({ 
      id: chunk.id, 
      text: chunk.text, 
      metadata: chunk.metadata,
      score: chunk.score
    }));
}

async function generate(req, res) {
  try {
    const { 
      query, 
      topK = 4, 
      metric = 'cosine', 
      proficiency = 'intermediate', 
      temperature = 0.2, 
      top_p = null, // Use null to trigger optimal Top P calculation
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

    // 1) RETRIEVE relevant chunks
    const retrievedChunks = retrieveChunks(query, topK, context, taskType, proficiency);

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

    // 3) Call Gemini API with Top P optimization
    const llmResp = await callGemini({ 
      messages, 
      temperature, 
      top_p,
      context,
      taskType,
      query,
      proficiency,
      customTopP: top_p
    });

    // 4) Parse & validate JSON
    const parsed = safeParseJSONMaybe(llmResp.text);
    if (!parsed.ok) {
      return res.status(500).json({ 
        ok: false, 
        error: 'Could not parse model output', 
        details: parsed.error, 
        raw: llmResp.text 
      });
    }

    const valid = validateDebateSchema(parsed.data);
    if (!valid.ok) {
      return res.status(500).json({ 
        ok: false, 
        error: 'Schema validation failed', 
        details: valid.error, 
        parsed: parsed.data 
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
        top_p: llmResp.topP,
        tokens: llmResp.usage || { input: 0, output: 0 },
        topP: llmResp.topP,
        context: llmResp.context,
        taskType: llmResp.taskType,
        queryComplexity: llmResp.queryComplexity,
        hasCreativeElements: llmResp.hasCreativeElements,
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
          top_p: 0.85,
          tokens: { input: 0, output: 0 },
          topP: 0.85,
          context: 'constitutionalEducation',
          taskType: 'debate',
          queryComplexity: 'moderate',
          hasCreativeElements: false,
          proficiency: 'intermediate',
          retrievalScores: [],
          promptingStrategy: 'demo',
          demo: true
        },
        raw: { demo: true, message: "Rate limited - using demo response" }
      });
    } else {
      return res.status(500).json({ 
        ok: false, 
        error: err.message 
      });
    }
  }
}

module.exports = { generate };
