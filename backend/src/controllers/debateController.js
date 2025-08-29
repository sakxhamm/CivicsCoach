// backend/src/controllers/debateController.js
const { callGemini } = require('../services/geminiService');
const { retrieveChunks } = require('../services/similarityService');
const { buildChainMessages } = require('../prompts/chainOfThoughtPrompt');
const { ZeroShotPromptEngine } = require('../prompts/zeroShotPrompt');
const { DynamicPromptEngine } = require('../prompts/dynamicPrompt');
const { safeParseJSONMaybe } = require('../utils/jsonValidator');

// Initialize prompting engines
const zeroShotPromptEngine = new ZeroShotPromptEngine();
const dynamicPromptEngine = new DynamicPromptEngine();

/**
 * Generate a debate using the specified prompting strategy
 */
async function generateDebate(req, res) {
  try {
    const { 
      query, 
      topK = 4, 
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

    // 3) Call Gemini API with optimized temperature
    const llmResp = await callGemini({ 
      messages, 
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
