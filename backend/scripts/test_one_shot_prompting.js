/**
 * Test Script for One-Shot Prompting System
 * 
 * This script demonstrates how one-shot prompting works by:
 * 1. Showing the example provided to the AI
 * 2. Demonstrating the AI's ability to replicate the format
 * 3. Comparing one-shot vs zero-shot approaches
 * 4. Testing different task types
 */

const OneShotPromptEngine = require('../src/prompts/oneShotPrompt');
const ZeroShotPromptEngine = require('../src/prompts/zeroShotPrompt');

// Mock retrieved chunks for testing
const mockRetrievedChunks = [
  {
    id: "basic_structure_1",
    source: "Kesavananda Bharati Case",
    content: "The Basic Structure Doctrine was established by the Supreme Court in Kesavananda Bharati v. State of Kerala (1973). It holds that while Parliament has the power to amend the Constitution under Article 368, it cannot alter the 'basic structure' or fundamental features of the Constitution."
  },
  {
    id: "article368_1",
    source: "Constitution of India, Article 368",
    content: "Article 368 provides the procedure for amending the Constitution. Constitutional amendments require a two-thirds majority of members present and voting in each house of Parliament."
  }
];

/**
 * Test One-Shot Prompting for Debate Generation
 */
async function testOneShotDebate() {
  console.log('\n=== TESTING ONE-SHOT DEBATE GENERATION ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  
  // Get the example that will be shown to the AI
  const debateExample = oneShotEngine.getExample('debate');
  console.log('EXAMPLE PROVIDED TO AI:');
  console.log('Topic:', debateExample.topic);
  console.log('Proficiency:', debateExample.proficiency);
  console.log('Example Structure:', Object.keys(debateExample.example));
  console.log('\nExample Output Preview:');
  console.log('Stance length:', debateExample.example.stance.length, 'characters');
  console.log('Counter-stance length:', debateExample.example.counterStance.length, 'characters');
  console.log('Citations count:', debateExample.example.citations.length);
  console.log('Quiz questions count:', debateExample.example.quiz.length);
  console.log('Key takeaways count:', debateExample.example.keyTakeaways.length);
  
  // Generate prompt for a new topic
  const newTopic = "Should the Supreme Court have the power to review constitutional amendments?";
  const prompt = oneShotEngine.generatePrompt('debate', {
    topic: newTopic,
    proficiency: 'intermediate',
    retrievedChunks: mockRetrievedChunks
  });
  
  console.log('\nGENERATED PROMPT FOR NEW TOPIC:');
  console.log('System Message Length:', prompt[0].content.length, 'characters');
  console.log('User Message Length:', prompt[1].content.length, 'characters');
  console.log('\nPrompt includes example:', prompt[1].content.includes('EXAMPLE TOPIC:'));
  console.log('Prompt includes new topic:', prompt[1].content.includes(newTopic));
  
  return { engine: oneShotEngine, prompt };
}

/**
 * Test One-Shot Prompting for Analysis
 */
async function testOneShotAnalysis() {
  console.log('\n=== TESTING ONE-SHOT ANALYSIS ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  
  // Get the analysis example
  const analysisExample = oneShotEngine.getExample('analysis');
  console.log('ANALYSIS EXAMPLE PROVIDED TO AI:');
  console.log('Topic:', analysisExample.topic);
  console.log('Example Structure:', Object.keys(analysisExample.example));
  
  // Generate prompt for analysis
  const newConcept = "Judicial Review in Indian Constitution";
  const prompt = oneShotEngine.generatePrompt('analysis', {
    topic: newConcept,
    proficiency: 'advanced',
    retrievedChunks: mockRetrievedChunks
  });
  
  console.log('\nANALYSIS PROMPT GENERATED:');
  console.log('Prompt length:', prompt[1].content.length, 'characters');
  console.log('Includes example:', prompt[1].content.includes('EXAMPLE TOPIC:'));
  
  return { engine: oneShotEngine, prompt };
}

/**
 * Test One-Shot Prompting for Comparison
 */
async function testOneShotComparison() {
  console.log('\n=== TESTING ONE-SHOT COMPARISON ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  
  // Get the comparison example
  const comparisonExample = oneShotEngine.getExample('comparison');
  console.log('COMPARISON EXAMPLE PROVIDED TO AI:');
  console.log('Topic:', comparisonExample.topic);
  console.log('Example Structure:', Object.keys(comparisonExample.example));
  
  // Generate prompt for comparison
  const newComparison = "Directive Principles vs Fundamental Rights";
  const prompt = oneShotEngine.generatePrompt('comparison', {
    topic: newComparison,
    proficiency: 'intermediate',
    retrievedChunks: mockRetrievedChunks
  });
  
  console.log('\nCOMPARISON PROMPT GENERATED:');
  console.log('Prompt length:', prompt[1].content.length, 'characters');
  console.log('Includes example:', prompt[1].content.includes('EXAMPLE TOPIC:'));
  
  return { engine: oneShotEngine, prompt };
}

/**
 * Test One-Shot Prompting for Explanation
 */
async function testOneShotExplanation() {
  console.log('\n=== TESTING ONE-SHOT EXPLANATION ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  
  // Get the explanation example
  const explanationExample = oneShotEngine.getExample('explanation');
  console.log('EXPLANATION EXAMPLE PROVIDED TO AI:');
  console.log('Topic:', explanationExample.topic);
  console.log('Proficiency:', explanationExample.proficiency);
  console.log('Example Structure:', Object.keys(explanationExample.example));
  
  // Generate prompt for explanation
  const newConcept = "Federalism in Indian Constitution";
  const prompt = oneShotEngine.generatePrompt('explanation', {
    topic: newConcept,
    proficiency: 'beginner',
    retrievedChunks: mockRetrievedChunks
  });
  
  console.log('\nEXPLANATION PROMPT GENERATED:');
  console.log('Prompt length:', prompt[1].content.length, 'characters');
  console.log('Includes example:', prompt[1].content.includes('EXAMPLE TOPIC:'));
  
  return { engine: oneShotEngine, prompt };
}

/**
 * Compare One-Shot vs Zero-Shot Approaches
 */
async function compareApproaches() {
  console.log('\n=== COMPARING ONE-SHOT VS ZERO-SHOT APPROACHES ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  const zeroShotEngine = new ZeroShotPromptEngine();
  
  const topic = "Should the President have absolute veto power?";
  const parameters = {
    topic,
    proficiency: 'intermediate',
    retrievedChunks: mockRetrievedChunks
  };
  
  // Generate one-shot prompt
  const oneShotPrompt = oneShotEngine.generatePrompt('debate', parameters);
  const oneShotExample = oneShotEngine.getExample('debate');
  
  // Generate zero-shot prompt
  const zeroShotPrompt = zeroShotEngine.generatePrompt('debate', parameters);
  
  console.log('ONE-SHOT APPROACH:');
  console.log('- Provides 1 example to guide AI response');
  console.log('- Example topic:', oneShotExample.topic);
  console.log('- Example structure:', Object.keys(oneShotExample.example));
  console.log('- Total prompt length:', oneShotPrompt[1].content.length, 'characters');
  console.log('- Includes specific format demonstration: YES');
  
  console.log('\nZERO-SHOT APPROACH:');
  console.log('- No examples provided');
  console.log('- Relies on AI\'s pre-trained knowledge');
  console.log('- Total prompt length:', zeroShotPrompt[1].content.length, 'characters');
  console.log('- Includes specific format demonstration: NO');
  
  console.log('\nKEY DIFFERENCES:');
  console.log('1. One-shot provides concrete example of expected output');
  console.log('2. One-shot ensures consistent format and structure');
  console.log('3. One-shot reduces ambiguity about desired response');
  console.log('4. Zero-shot relies more on AI\'s inherent understanding');
  console.log('5. One-shot is more predictable but requires example creation');
  
  return { oneShot: oneShotPrompt, zeroShot: zeroShotPrompt };
}

/**
 * Test Custom Example Generation
 */
async function testCustomExample() {
  console.log('\n=== TESTING CUSTOM EXAMPLE GENERATION ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  
  // Create a custom example
  const customExample = {
    topic: "Custom Debate Example",
    example: {
      stance: "This is a custom stance example that shows the expected format.",
      counterStance: "This is a custom counter-stance example.",
      citations: [
        {
          id: "custom_1",
          source: "Custom Source",
          snippet: "Custom snippet text",
          relevance: "Custom relevance explanation"
        }
      ],
      quiz: [
        {
          question: "Custom question?",
          options: ["A", "B", "C", "D"],
          answerIndex: 0,
          explanation: "Custom explanation"
        }
      ],
      keyTakeaways: ["Custom takeaway 1", "Custom takeaway 2"]
    }
  };
  
  // Generate prompt with custom example
  const prompt = oneShotEngine.generateCustomPrompt('debate', {
    topic: "Should there be term limits for Supreme Court judges?",
    proficiency: 'advanced',
    retrievedChunks: mockRetrievedChunks
  }, customExample);
  
  console.log('CUSTOM EXAMPLE PROMPT GENERATED:');
  console.log('Prompt length:', prompt[1].content.length, 'characters');
  console.log('Includes custom topic:', prompt[1].content.includes('Custom Debate Example'));
  console.log('Includes custom stance:', prompt[1].content.includes('Custom stance example'));
  
  return { engine: oneShotEngine, prompt };
}

/**
 * Test Response Validation
 */
async function testResponseValidation() {
  console.log('\n=== TESTING RESPONSE VALIDATION ===\n');
  
  const oneShotEngine = new OneShotPromptEngine();
  
  // Test valid response
  const validResponse = {
    stance: "Valid stance text",
    counterStance: "Valid counter-stance text",
    citations: [{ id: "1", source: "Source", snippet: "Text", relevance: "Relevance" }],
    quiz: [{ question: "Q?", options: ["A", "B", "C", "D"], answerIndex: 0, explanation: "Exp" }],
    keyTakeaways: ["Takeaway 1", "Takeaway 2"]
  };
  
  const validationResult = oneShotEngine.validateResponse(validResponse, 'debate');
  console.log('VALID RESPONSE VALIDATION:');
  console.log('Is valid:', validationResult.isValid);
  console.log('Error:', validationResult.error || 'None');
  
  // Test invalid response (missing key)
  const invalidResponse = {
    stance: "Valid stance text",
    counterStance: "Valid counter-stance text",
    // Missing citations, quiz, keyTakeaways
  };
  
  const invalidValidationResult = oneShotEngine.validateResponse(invalidResponse, 'debate');
  console.log('\nINVALID RESPONSE VALIDATION:');
  console.log('Is valid:', invalidValidationResult.isValid);
  console.log('Error:', invalidValidationResult.error);
  
  return { valid: validationResult, invalid: invalidValidationResult };
}

/**
 * Main test function
 */
async function runAllTests() {
  console.log('🚀 STARTING ONE-SHOT PROMPTING TESTS\n');
  
  try {
    // Test all one-shot prompting types
    await testOneShotDebate();
    await testOneShotAnalysis();
    await testOneShotComparison();
    await testOneShotExplanation();
    
    // Compare approaches
    await compareApproaches();
    
    // Test advanced features
    await testCustomExample();
    await testResponseValidation();
    
    console.log('\n✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('\n📚 ONE-SHOT PROMPTING SUMMARY:');
    console.log('• Provides single example to guide AI response');
    console.log('• Ensures consistent output format and structure');
    console.log('• Reduces ambiguity about desired response');
    console.log('• More predictable than zero-shot approaches');
    console.log('• Requires example creation but improves consistency');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error(error.stack);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testOneShotDebate,
  testOneShotAnalysis,
  testOneShotComparison,
  testOneShotExplanation,
  compareApproaches,
  testCustomExample,
  testResponseValidation,
  runAllTests
};
