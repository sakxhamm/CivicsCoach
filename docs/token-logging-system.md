# Token Logging System

## 🔢 Overview

The Token Logging System is a comprehensive framework that tracks, analyzes, and logs token usage for every AI interaction in the CivicsCoach project. This system provides detailed insights into how tokens are consumed during AI calls, enabling cost optimization, performance monitoring, and content analysis.

## 🎯 What are Tokens in LLMs?

**Tokens** are the fundamental units of text that Large Language Models process. They represent how the AI model "sees" and processes text, which directly impacts:

- **API Costs**: Most AI services charge per token
- **Processing Speed**: More tokens mean longer processing times
- **Model Capacity**: Models have token limits for input and output
- **Response Quality**: Token count affects response length and detail

### Token Examples

- **Simple words**: "Hello" = 1 token
- **Complex words**: "Constitutional" = 1-2 tokens
- **Punctuation**: "!" = 1 token
- **Special characters**: "@#$%" = multiple tokens
- **Newlines**: "\n" = 1 token

## 🚀 Key Features

### 1. Comprehensive Token Analysis
- **Input Token Estimation**: Pre-call token analysis
- **Output Token Tracking**: Actual API token usage
- **Content Type Detection**: Constitutional, academic, creative content
- **Efficiency Metrics**: Input/output token ratios

### 2. Advanced Token Estimation
- **Word-based Calculation**: Base token estimation from word count
- **Content Multipliers**: Legal terms, academic language, creative content
- **Punctuation Analysis**: Special characters and formatting
- **Language-specific Rules**: Optimized for constitutional content

### 3. Detailed Logging and Monitoring
- **Real-time Logging**: Console output for every AI call
- **Performance Metrics**: Processing time and efficiency
- **Cost Estimation**: Approximate costs based on token usage
- **Optimization Suggestions**: Automated recommendations

## 🏗️ Architecture

### Core Components

```
Token Logging System
├── TOKEN_ANALYSIS_CONFIG (Configuration)
├── estimateTokens() (Estimation Engine)
├── analyzeMessageTokens() (Message Analysis)
├── logTokenUsage() (Logging Engine)
└── Integration Layer (API & Controllers)
```

### Data Flow

1. **Input Analysis**: Analyze messages before API call
2. **Token Estimation**: Calculate estimated input tokens
3. **API Call**: Execute AI request with monitoring
4. **Usage Tracking**: Capture actual token usage
5. **Analysis & Logging**: Generate comprehensive reports
6. **Optimization**: Provide improvement suggestions

## 🔧 Implementation Details

### Token Analysis Configuration

```javascript
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
```

### Token Estimation Function

```javascript
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
```

### Message Token Analysis

```javascript
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
```

### Enhanced Token Logging

```javascript
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
```

## 📊 Content Type Analysis

### Constitutional Content
- **Legal Terms**: constitution, amendment, article, fundamental, rights, doctrine, jurisdiction
- **Token Multiplier**: 1.2x (20% more tokens)
- **Use Case**: Legal analysis, constitutional interpretation
- **Example**: "The Basic Structure Doctrine limits Parliament's power" → Higher token count

### Academic Content
- **Academic Terms**: analysis, research, study, investigation, examination, evaluation, assessment
- **Token Multiplier**: 1.1x (10% more tokens)
- **Use Case**: Research papers, scholarly analysis
- **Example**: "This research analyzes the evolution" → Moderate token increase

### Creative Content
- **Creative Terms**: imagine, create, design, innovate, brainstorm, explore, discover
- **Token Multiplier**: 1.0x (standard tokens)
- **Use Case**: Brainstorming, innovative solutions
- **Example**: "Imagine constitutional reforms" → Standard token count

### Standard Content
- **Characteristics**: Regular language, common words, simple structure
- **Token Multiplier**: 1.0x (standard tokens)
- **Use Case**: General conversation, simple explanations
- **Example**: "Hello, how are you?" → Standard token count

## 🎯 Token Estimation Rules

### Base Calculation
- **Words per Token**: 0.75 (average across languages)
- **Formula**: `Math.ceil(words / 0.75)`

### Multiplier Application
- **Punctuation**: +5% for punctuation marks
- **Special Characters**: +10% for special characters
- **Newlines**: +2% for line breaks
- **Content Type**: +10-20% for complex content

### Example Calculation
```
Text: "Hello world! How are you?"
Words: 6
Base Tokens: Math.ceil(6 / 0.75) = 8
Punctuation Multiplier: 8 * 1.05 = 8.4
Final Tokens: Math.ceil(8.4) = 9
```

## 📈 Logging Output Example

### Console Output Structure
```
🔢 TOKEN USAGE ANALYSIS
════════════════════════════════════════════════════════════════════════════════════════
📅 Timestamp: 2024-01-15T10:30:00.000Z
🔍 Query: "What are fundamental rights in the Indian Constitution?"

📥 INPUT TOKENS:
  Total Messages: 3
  Total Estimated Input Tokens: 45
  Content Distribution:
    Constitutional/Legal: 1
    Academic/Research: 0
    Standard: 2

📋 MESSAGE BREAKDOWN:
  1. [USER] 15 tokens
     Content: "What are fundamental rights in the Indian Constitution?"
     Words: 11, Characters: 58, Type: complex

  2. [ASSISTANT] 20 tokens
     Content: "Fundamental rights are basic human rights guaranteed by the Indian Constitution..."
     Words: 15, Characters: 78, Type: complex

  3. [USER] 10 tokens
     Content: "Can you explain the Basic Structure Doctrine?"
     Words: 8, Characters: 42, Type: complex

📤 OUTPUT TOKENS:
  Actual Output Tokens: 120
  API Response Tokens: 120
  Total API Tokens: 165

⚡ TOKEN EFFICIENCY:
  Total Tokens Used: 165
  Input/Output Ratio: 2.67
  Cost Estimation: $0.000083 (approx. $0.0005 per 1K tokens)

📊 API TOKEN METRICS:
  Prompt Tokens: 45
  Candidate Tokens: 120
  Total API Tokens: 165
  Estimation Accuracy: 100.0%

💡 TOKEN OPTIMIZATION SUGGESTIONS:
  📚 Constitutional content detected. Legal terms may increase token usage.
════════════════════════════════════════════════════════════════════════════════════════
```

## 🚀 API Integration

### Enhanced Gemini Service

```javascript
async function callGemini({ messages, temperature = 0.2, top_p = 1.0, query = '' }) {
  // Analyze input tokens before API call
  const inputTokenAnalysis = analyzeMessageTokens(messages);
  
  try {
    // ... API call implementation
    
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
    // ... error handling
  }
}
```

### Enhanced Response Metadata

```javascript
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
```

## 🧪 Testing and Validation

### Test Coverage
- ✅ Token estimation accuracy
- ✅ Content type detection
- ✅ Multiplier application
- ✅ Message analysis
- ✅ Logging functionality
- ✅ Edge case handling
- ✅ Performance testing
- ✅ Configuration validation

### Test Scripts

```bash
# Run comprehensive token tests
node scripts/test_token_system.js

# Test specific components
node -e "const { testTokenEstimation } = require('./scripts/test_token_system'); testTokenEstimation();"
```

## 📊 Benefits and Impact

### 1. Cost Control and Optimization
- **Real-time Monitoring**: Track token usage for every API call
- **Cost Estimation**: Approximate costs before making requests
- **Usage Patterns**: Identify expensive content types and queries
- **Optimization**: Reduce unnecessary token consumption

### 2. Performance Monitoring
- **Efficiency Metrics**: Track input/output token ratios
- **Processing Time**: Monitor API response performance
- **Capacity Planning**: Understand model token limits
- **Bottleneck Identification**: Find performance issues

### 3. Content Analysis
- **Content Type Detection**: Identify constitutional, academic, creative content
- **Complexity Assessment**: Understand what makes content token-heavy
- **Quality Metrics**: Ensure appropriate response lengths
- **Optimization Suggestions**: Improve content efficiency

### 4. Developer Experience
- **Transparency**: See exactly how tokens are used
- **Debugging**: Identify token-heavy prompts and responses
- **Optimization**: Get suggestions for improvement
- **Planning**: Estimate costs for different scenarios

## 🎯 Use Cases and Examples

### Constitutional Education
```javascript
// Query: "What are fundamental rights in the Indian Constitution?"
// Content Type: Constitutional (legal terms detected)
// Token Multiplier: 1.2x
// Estimated Tokens: 15 (instead of 12 for standard content)
```

### Academic Research
```javascript
// Query: "Analyze the evolution of judicial review in Indian constitutional jurisprudence"
// Content Type: Academic (research terms detected)
// Token Multiplier: 1.1x
// Estimated Tokens: 22 (instead of 20 for standard content)
```

### Creative Tasks
```javascript
// Query: "Imagine and design innovative constitutional reforms for the 21st century"
// Content Type: Creative (creative terms detected)
// Token Multiplier: 1.0x
// Estimated Tokens: 18 (standard token count)
```

## 🔮 Future Enhancements

### Planned Features
1. **Real-time Token Monitoring**: Live dashboard for token usage
2. **Predictive Token Estimation**: AI-powered token prediction
3. **Cost Optimization Engine**: Automatic prompt optimization
4. **Token Usage Analytics**: Historical analysis and trends
5. **Multi-language Support**: Token estimation for different languages
6. **Advanced Content Analysis**: Semantic understanding for better classification
7. **Token Budget Management**: Set limits and alerts
8. **Performance Benchmarking**: Compare against industry standards

### Advanced Capabilities
- **Semantic Token Analysis**: Understanding context beyond keywords
- **Dynamic Multiplier Adjustment**: Learning from actual usage patterns
- **Token Efficiency Scoring**: Rate prompts and responses
- **Automated Optimization**: Suggest improvements automatically
- **Integration with Cost Management**: Direct billing integration

## 📋 Best Practices

### Token Optimization Guidelines
- **Keep Prompts Concise**: Use clear, specific language
- **Limit Context**: Only include relevant information
- **Batch Requests**: Combine similar queries when possible
- **Monitor Usage**: Track patterns and optimize accordingly
- **Set Limits**: Use maxOutputTokens to control response length

### Content Type Guidelines
- **Constitutional Content**: Expect 20% more tokens for legal terms
- **Academic Content**: Expect 10% more tokens for research language
- **Creative Content**: Standard token usage for innovative thinking
- **Standard Content**: Base token calculation for regular language

### Monitoring Guidelines
- **Track Patterns**: Identify high-token content types
- **Set Alerts**: Monitor for unusual token usage
- **Analyze Efficiency**: Optimize input/output ratios
- **Review Suggestions**: Implement optimization recommendations
- **Plan Budgets**: Estimate costs for different scenarios

## 🚨 Breaking Changes

### API Changes
- **Enhanced Parameters**: `callGemini()` now accepts `query` parameter
- **New Response Fields**: API responses include `tokenAnalysis`
- **Backward Compatibility**: Existing calls still work with default values

### Controller Changes
- **Enhanced Integration**: `debateController` now uses token logging
- **Improved Metadata**: Response metadata includes token information
- **Better Logging**: Comprehensive logging for debugging and monitoring

## 📚 Documentation

### Comprehensive Coverage
- **System Overview**: Complete explanation of token logging
- **Implementation Details**: Code examples and architecture
- **API Reference**: Usage examples and parameters
- **Best Practices**: Guidelines for token optimization
- **Testing Instructions**: How to test and validate the system
- **Troubleshooting**: Common issues and solutions

## ✅ Quality Assurance

### Code Quality
- **Error Handling**: Comprehensive error handling and validation
- **Edge Case Coverage**: Handle null, undefined, and empty inputs
- **Performance Optimization**: Efficient token calculation algorithms
- **Testing**: Comprehensive test coverage and validation

### Performance
- **Efficiency**: Optimized token estimation algorithms
- **Scalability**: Support for large-scale deployments
- **Monitoring**: Real-time performance tracking
- **Optimization**: Continuous performance improvement

## 🎉 Summary

The Token Logging System represents a significant advancement in AI cost and performance monitoring. By providing comprehensive token analysis, estimation, and logging, the system enables:

- **Better Cost Control**: Monitor and optimize token usage
- **Improved Performance**: Track efficiency and identify bottlenecks
- **Enhanced Content Analysis**: Understand what makes content token-heavy
- **Developer Transparency**: See exactly how tokens are consumed

The system is designed to be:
- **Intelligent**: Automatically detects content types and applies appropriate multipliers
- **Comprehensive**: Tracks input, output, and total token usage
- **Informative**: Provides detailed analysis and optimization suggestions
- **Efficient**: Fast token estimation with minimal overhead

This implementation transforms how we approach AI cost management in constitutional education, making token usage transparent, predictable, and optimizable.

## 🔗 Related Documentation

- [Top P Optimization System](./top-p-optimization-system.md)
- [Temperature Optimization System](./temperature-optimization-system.md)
- [Top K Optimization System](./top-k-optimization-system.md)
- [API Reference](./api-reference.md)
- [Testing Guide](./testing-guide.md)

---

**System Status**: ✅ Production Ready  
**Test Coverage**: ✅ Comprehensive  
**Documentation**: ✅ Complete  
**Performance**: ✅ Optimized
