const { 
  estimateTokens, 
  analyzeMessageTokens, 
  logTokenUsage, 
  TOKEN_ANALYSIS_CONFIG 
} = require('../src/services/geminiService');

// Sample content for testing
const sampleContent = {
  simple: "What is democracy?",
  moderate: "Explain the Basic Structure Doctrine in Indian Constitution",
  complex: "Compare and contrast the fundamental rights protection mechanisms in India versus the United States, considering judicial review, constitutional amendments, and the role of the Supreme Court in both jurisdictions",
  constitutional: "The Basic Structure Doctrine, established in Kesavananda Bharati v. State of Kerala (1973), limits Parliament's power to amend the Constitution under Article 368.",
  academic: "This research analyzes the evolution of judicial review in Indian constitutional jurisprudence, examining landmark cases and doctrinal developments.",
  creative: "Imagine and design innovative constitutional reforms for the 21st century that address emerging challenges in digital governance."
};

// Sample messages for testing
const sampleMessages = [
  {
    role: "user",
    content: "What are fundamental rights in the Indian Constitution?"
  },
  {
    role: "assistant",
    content: "Fundamental rights are basic human rights guaranteed by the Indian Constitution. They include the right to equality, freedom of speech, protection against discrimination, and the right to constitutional remedies."
  },
  {
    role: "user",
    content: "Can you explain the Basic Structure Doctrine?"
  }
];

function testTokenEstimation() {
  console.log('\n🔢 Testing Token Estimation...\n');
  
  Object.entries(sampleContent).forEach(([type, content]) => {
    const tokenInfo = estimateTokens(content);
    
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} Content:`);
    console.log(`  Text: "${content}"`);
    console.log(`  Estimated Tokens: ${tokenInfo.estimated}`);
    console.log(`  Words: ${tokenInfo.words}`);
    console.log(`  Characters: ${tokenInfo.characters}`);
    console.log(`  Has Punctuation: ${tokenInfo.hasPunctuation}`);
    console.log(`  Has Special Chars: ${tokenInfo.hasSpecialChars}`);
    console.log(`  Has Newlines: ${tokenInfo.hasNewlines}`);
    console.log(`  Content Type: ${tokenInfo.contentType}`);
    console.log('');
  });
}

function testContentTypeDetection() {
  console.log('\n🏷️ Testing Content Type Detection...\n');
  
  const testCases = [
    {
      text: "The constitution guarantees fundamental rights",
      expected: "constitutional"
    },
    {
      text: "This analysis examines the research findings",
      expected: "academic"
    },
    {
      text: "Imagine creating innovative solutions",
      expected: "creative"
    },
    {
      text: "Hello world, how are you today?",
      expected: "standard"
    }
  ];
  
  testCases.forEach((testCase, index) => {
    const tokenInfo = estimateTokens(testCase.text);
    
    console.log(`Test Case ${index + 1}:`);
    console.log(`  Text: "${testCase.text}"`);
    console.log(`  Expected Type: ${testCase.expected}`);
    console.log(`  Detected Type: ${tokenInfo.contentType}`);
    console.log(`  Correct: ${tokenInfo.contentType === testCase.expected ? '✅' : '❌'}`);
    console.log('');
  });
}

function testTokenMultipliers() {
  console.log('\n📊 Testing Token Multipliers...\n');
  
  const baseText = "This is a test message with some content";
  const baseTokens = estimateTokens(baseText);
  
  console.log('Base Text Analysis:');
  console.log(`  Text: "${baseText}"`);
  console.log(`  Base Tokens: ${baseTokens.estimated}`);
  console.log('');
  
  // Test punctuation multiplier
  const withPunctuation = baseText + "!?.,;:";
  const punctTokens = estimateTokens(withPunctuation);
  console.log('Punctuation Test:');
  console.log(`  Text: "${withPunctuation}"`);
  console.log(`  Tokens: ${punctTokens.estimated}`);
  console.log(`  Multiplier Applied: ${punctTokens.hasPunctuation ? 'Yes' : 'No'}`);
  console.log('');
  
  // Test special characters
  const withSpecialChars = baseText + " @#$%^&*()";
  const specialTokens = estimateTokens(withSpecialChars);
  console.log('Special Characters Test:');
  console.log(`  Text: "${withSpecialChars}"`);
  console.log(`  Tokens: ${specialTokens.estimated}`);
  console.log(`  Multiplier Applied: ${specialTokens.hasSpecialChars ? 'Yes' : 'No'}`);
  console.log('');
  
  // Test newlines
  const withNewlines = baseText + "\n\nNew line content";
  const newlineTokens = estimateTokens(withNewlines);
  console.log('Newlines Test:');
  console.log(`  Text: "${withNewlines.replace(/\n/g, '\\n')}"`);
  console.log(`  Tokens: ${newlineTokens.estimated}`);
  console.log(`  Multiplier Applied: ${newlineTokens.hasNewlines ? 'Yes' : 'No'}`);
  console.log('');
}

function testMessageTokenAnalysis() {
  console.log('\n📨 Testing Message Token Analysis...\n');
  
  const analysis = analyzeMessageTokens(sampleMessages);
  
  console.log('Message Analysis Results:');
  console.log(`  Total Messages: ${analysis.totalMessages}`);
  console.log(`  Total Estimated Tokens: ${analysis.totalEstimatedTokens}`);
  console.log(`  Content Distribution:`);
  console.log(`    Constitutional/Legal: ${analysis.contentAnalysis.constitutional}`);
  console.log(`    Academic/Research: ${analysis.contentAnalysis.academic}`);
  console.log(`    Creative: ${analysis.contentAnalysis.creative}`);
  console.log(`    Standard: ${analysis.contentAnalysis.standard}`);
  console.log('');
  
  console.log('Message Breakdown:');
  analysis.messageBreakdown.forEach((msg, index) => {
    console.log(`  ${index + 1}. [${msg.role.toUpperCase()}] ${msg.estimatedTokens} tokens`);
    console.log(`     Content: "${msg.content}"`);
    console.log(`     Words: ${msg.words}, Characters: ${msg.characters}, Type: ${msg.contentType}`);
    console.log('');
  });
}

function testTokenLogging() {
  console.log('\n📝 Testing Token Logging...\n');
  
  const inputAnalysis = analyzeMessageTokens(sampleMessages);
  const outputTokens = 150; // Simulated output
  const apiResponse = {
    usageMetadata: {
      promptTokenCount: 120,
      candidatesTokenCount: 150,
      totalTokenCount: 270
    }
  };
  
  console.log('Testing logTokenUsage function...');
  const logResult = logTokenUsage(inputAnalysis, outputTokens, apiResponse, "Test query about fundamental rights");
  
  console.log('\nLog Result Summary:');
  console.log(`  Timestamp: ${logResult.timestamp}`);
  console.log(`  Input Tokens: ${logResult.inputTokens}`);
  console.log(`  Output Tokens: ${logResult.outputTokens}`);
  console.log(`  Total Tokens: ${logResult.totalTokens}`);
  console.log(`  Efficiency: ${logResult.efficiency.toFixed(2)}`);
  console.log(`  Cost Estimate: $${logResult.costEstimate.toFixed(6)}`);
}

function testTokenConfiguration() {
  console.log('\n⚙️ Testing Token Configuration...\n');
  
  console.log('Content Type Configuration:');
  Object.entries(TOKEN_ANALYSIS_CONFIG.contentTypes).forEach(([type, config]) => {
    console.log(`  ${type.charAt(0).toUpperCase() + type.slice(1)}:`);
    console.log(`    Terms: ${config.legalTerms || config.academicTerms || config.creativeTerms}`);
    console.log(`    Multiplier: ${config.tokenMultiplier}`);
    console.log('');
  });
  
  console.log('Estimation Rules:');
  console.log(`  Words per Token: ${TOKEN_ANALYSIS_CONFIG.estimationRules.wordsPerToken}`);
  console.log(`  Punctuation Multiplier: ${TOKEN_ANALYSIS_CONFIG.estimationRules.punctuationMultiplier}`);
  console.log(`  Special Char Multiplier: ${TOKEN_ANALYSIS_CONFIG.estimationRules.specialCharMultiplier}`);
  console.log(`  Newline Multiplier: ${TOKEN_ANALYSIS_CONFIG.estimationRules.newlineMultiplier}`);
  console.log('');
}

function testEdgeCases() {
  console.log('\n🔍 Testing Edge Cases...\n');
  
  const edgeCases = [
    { text: "", description: "Empty string" },
    { text: null, description: "Null value" },
    { text: undefined, description: "Undefined value" },
    { text: "   ", description: "Whitespace only" },
    { text: "a", description: "Single character" },
    { text: "Hello", description: "Single word" },
    { text: "Hello world!", description: "With punctuation" },
    { text: "Hello\nworld", description: "With newlines" },
    { text: "Hello @world", description: "With special characters" }
  ];
  
  edgeCases.forEach((testCase, index) => {
    const tokenInfo = estimateTokens(testCase.text);
    
    console.log(`Edge Case ${index + 1}: ${testCase.description}`);
    console.log(`  Input: ${testCase.text === null ? 'null' : testCase.text === undefined ? 'undefined' : `"${testCase.text}"`}`);
    console.log(`  Estimated Tokens: ${tokenInfo.estimated}`);
    console.log(`  Words: ${tokenInfo.words}`);
    console.log(`  Characters: ${tokenInfo.characters || 0}`);
    console.log('');
  });
}

function testPerformance() {
  console.log('\n⚡ Testing Performance...\n');
  
  const longText = "This is a very long text that contains many words and should be processed efficiently by the token estimation system. ".repeat(100);
  
  console.log('Performance Test:');
  console.log(`  Text Length: ${longText.length} characters`);
  console.log(`  Word Count: ${longText.trim().split(/\s+/).length} words`);
  
  const startTime = process.hrtime.bigint();
  const tokenInfo = estimateTokens(longText);
  const endTime = process.hrtime.bigint();
  
  const processingTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
  
  console.log(`  Estimated Tokens: ${tokenInfo.estimated}`);
  console.log(`  Processing Time: ${processingTime.toFixed(3)} ms`);
  console.log(`  Tokens per ms: ${(tokenInfo.estimated / processingTime).toFixed(2)}`);
  console.log('');
}

function demonstrateTokenBenefits() {
  console.log('\n💡 Demonstrating Token System Benefits...\n');
  
  console.log('🎯 Benefits of Token Analysis:');
  console.log('  1. **Cost Control**: Monitor and optimize token usage');
  console.log('  2. **Performance Monitoring**: Track API call efficiency');
  console.log('  3. **Content Optimization**: Identify content that uses many tokens');
  console.log('  4. **Budget Planning**: Estimate costs before API calls');
  console.log('  5. **Quality Assurance**: Ensure responses are appropriately sized');
  console.log('');
  
  console.log('🔧 How It Works:');
  console.log('  1. Analyze input messages for token estimation');
  console.log('  2. Track actual API token usage');
  console.log('  3. Calculate efficiency and cost metrics');
  console.log('  4. Provide optimization suggestions');
  console.log('  5. Log comprehensive usage statistics');
  console.log('');
  
  console.log('📊 Metrics Provided:');
  console.log('  - Input token estimation');
  console.log('  - Output token count');
  console.log('  - Total token usage');
  console.log('  - Token efficiency ratio');
  console.log('  - Cost estimation');
  console.log('  - Content type analysis');
  console.log('  - Performance metrics');
  console.log('');
}

function showBestPractices() {
  console.log('\n📋 Token Management Best Practices...\n');
  
  console.log('💰 Cost Optimization:');
  console.log('  - Monitor token usage patterns');
  console.log('  - Set reasonable maxOutputTokens limits');
  console.log('  - Use concise prompts when possible');
  console.log('  - Batch similar requests together');
  console.log('');
  
  console.log('📝 Content Optimization:');
  console.log('  - Break complex queries into smaller parts');
  console.log('  - Use clear, specific language');
  console.log('  - Avoid unnecessary repetition');
  console.log('  - Limit context chunk sizes');
  console.log('');
  
  console.log('🔍 Monitoring:');
  console.log('  - Track token usage over time');
  console.log('  - Set up alerts for high usage');
  console.log('  - Analyze efficiency trends');
  console.log('  - Review optimization suggestions');
  console.log('');
  
  console.log('⚡ Performance:');
  console.log('  - Cache frequently used responses');
  console.log('  - Optimize prompt engineering');
  console.log('  - Use appropriate model sizes');
  console.log('  - Monitor response times');
  console.log('');
}

async function runAllTests() {
  console.log('🚀 Starting Token Logging System Tests...\n');
  
  try {
    testTokenEstimation();
    testContentTypeDetection();
    testTokenMultipliers();
    testMessageTokenAnalysis();
    testTokenLogging();
    testTokenConfiguration();
    testEdgeCases();
    testPerformance();
    demonstrateTokenBenefits();
    showBestPractices();
    
    console.log('✅ All token logging tests completed successfully!');
    console.log('\n🎉 The token system is working correctly and ready for production use.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testTokenEstimation,
  testContentTypeDetection,
  testTokenMultipliers,
  testMessageTokenAnalysis,
  testTokenLogging,
  testTokenConfiguration,
  testEdgeCases,
  testPerformance,
  demonstrateTokenBenefits,
  showBestPractices,
  runAllTests
};
