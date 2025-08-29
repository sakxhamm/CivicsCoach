// backend/src/controllers/debateController.js
const { buildChainMessages } = require('../prompts/chainOfThoughtPrompt');

const { ZeroShotPromptEngine } = require('../prompts/zeroShotPrompt');
const { callGemini, estimateTokens } = require('../services/geminiService');
const { safeParseJSONMaybe, validateDebateSchema } = require('../utils/jsonValidator');

// Initialize zero-shot prompt engine
const zeroShotPromptEngine = new ZeroShotPromptEngine();
const { DynamicPromptEngine } = require('../prompts/dynamicPrompt');

// Initialize dynamic prompt engine
const dynamicPromptEngine = new DynamicPromptEngine();

// Load corpus data for retrieval
const corpus = require('../../data/corpus_chunks.json');

// Enhanced retrieval function with token analysis
function retrieveChunks(query, topK = 4) {
  console.log(`🔍 Retrieval Configuration:`);
  console.log(`  Query: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}"`);
  console.log(`  Top K: ${topK}`);
  
  // Analyze query tokens
  const queryTokenInfo = estimateTokens(query);
  console.log(`  Query Token Analysis:`);
  console.log(`    Estimated Tokens: ${queryTokenInfo.estimated}`);
  console.log(`    Words: ${queryTokenInfo.words}`);
  console.log(`    Characters: ${queryTokenInfo.characters}`);
  console.log(`    Content Type: ${queryTokenInfo.contentType}`);

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
  const retrievedChunks = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(chunk => ({ 
      id: chunk.id, 
      text: chunk.text, 
      metadata: chunk.metadata,
      score: chunk.score
    }));
  
  // Analyze retrieved chunks tokens
  const totalRetrievedTokens = retrievedChunks.reduce((total, chunk) => {
    return total + estimateTokens(chunk.text).estimated;
  }, 0);
  
  console.log(`  Retrieved Chunks Token Analysis:`);
  console.log(`    Total Retrieved Tokens: ${totalRetrievedTokens}`);
  console.log(`    Average Tokens per Chunk: ${Math.round(totalRetrievedTokens / retrievedChunks.length)}`);
  console.log('');
  
  return retrievedChunks;
}

async function generate(req, res) {
  try {
    const { 
      query, 
      topK = 4, 
      metric = 'cosine', 
      proficiency = 'intermediate', 
      temperature = 0.2, 
      top_p = 1.0, 
      useCoT = true,
      useZeroShot = false,
      taskType = 'debate'
    } = req.body;

    if (!query) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Query is required' 
      });
    }

    // Log initial query token analysis
    console.log('\n🚀 DEBATE GENERATION STARTED');
    console.log('═'.repeat(60));
    console.log(`📝 Query: "${query}"`);
    console.log(`👤 Proficiency: ${proficiency}`);
    console.log(`🎯 Task Type: ${taskType}`);
    console.log(`🌡️  Temperature: ${temperature}`);
    console.log(`🎲 Top P: ${top_p}`);
    console.log(`🔗 Use CoT: ${useCoT}`);
    console.log(`⚡ Use Zero-Shot: ${useZeroShot}`);
    console.log('═'.repeat(60));
    console.log('');

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

    // Log prompt token analysis
    console.log('📋 PROMPT TOKEN ANALYSIS');
    console.log('═'.repeat(40));
    console.log(`Total Messages: ${messages.length}`);
    messages.forEach((msg, index) => {
      const tokenInfo = estimateTokens(msg.content);
      console.log(`Message ${index + 1} [${msg.role}]: ${tokenInfo.estimated} tokens`);
      console.log(`  Content: "${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}"`);
    });
    console.log('═'.repeat(40));
    console.log('');

    // 3) Call Gemini API with token logging
    const llmResp = await callGemini({ 
      messages, 
      temperature, 
      top_p,
      query
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

    // Log final token summary
    console.log('📊 FINAL TOKEN SUMMARY');
    console.log('═'.repeat(40));
    console.log(`Total Input Tokens: ${llmResp.tokenAnalysis.input.totalEstimatedTokens}`);
    console.log(`Total Output Tokens: ${llmResp.tokenAnalysis.output}`);
    console.log(`Total Tokens Used: ${llmResp.tokenAnalysis.total}`);
    console.log(`Token Efficiency: ${llmResp.tokenAnalysis.efficiency.toFixed(2)}`);
    console.log(`Estimated Cost: $${llmResp.tokenAnalysis.costEstimate.toFixed(6)}`);
    console.log('═'.repeat(40));
    console.log('');

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
        tokenAnalysis: {
          input: llmResp.tokenAnalysis.input,
          output: llmResp.tokenAnalysis.output,
          total: llmResp.tokenAnalysis.total,
          efficiency: llmResp.tokenAnalysis.efficiency,
          costEstimate: llmResp.tokenAnalysis.costEstimate,
          timestamp: llmResp.tokenAnalysis.timestamp
        },
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
      
      // Estimate tokens for demo response
      const demoTokenInfo = estimateTokens(JSON.stringify(mockData));
      
      return res.json({
        ok: true,
        data: mockData,
        metadata: {
          retrievedChunks: 0,
          useCoT: false,
          temperature: 0.2,
          top_p: 1.0,
          tokens: { input: 0, output: 0 },
          tokenAnalysis: {
            input: { totalEstimatedTokens: 0, totalMessages: 0, messageBreakdown: [], contentAnalysis: { constitutional: 0, academic: 0, creative: 0, standard: 0 } },
            output: demoTokenInfo.estimated,
            total: demoTokenInfo.estimated,
            efficiency: 0,
            costEstimate: (demoTokenInfo.estimated / 1000) * 0.0005,
            timestamp: new Date().toISOString(),
            demo: true
          },
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
