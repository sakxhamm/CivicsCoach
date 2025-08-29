/**
 * Demo Script for One-Shot Prompting System
 * 
 * This script demonstrates the one-shot prompting system in action
 * by showing how it generates prompts and validates responses.
 */

const OneShotPromptEngine = require('../src/prompts/oneShotPrompt');

// Sample retrieved chunks for demonstration
const sampleChunks = [
  {
    id: "basic_structure_1",
    source: "Kesavananda Bharati Case (1973)",
    content: "The Basic Structure Doctrine was established by the Supreme Court in Kesavananda Bharati v. State of Kerala (1973). It holds that while Parliament has the power to amend the Constitution under Article 368, it cannot alter the 'basic structure' or fundamental features of the Constitution."
  },
  {
    id: "article368_1", 
    source: "Constitution of India, Article 368",
    content: "Article 368 provides the procedure for amending the Constitution. Constitutional amendments require a two-thirds majority of members present and voting in each house of Parliament."
  }
];

async function demonstrateOneShotPrompting() {
  console.log('🎯 ONE-SHOT PROMPTING DEMONSTRATION\n');
  
  const engine = new OneShotPromptEngine();
  
  // 1. Show what examples are available
  console.log('📚 AVAILABLE TASK TYPES:');
  const taskTypes = Object.keys(engine.taskDefinitions);
  taskTypes.forEach(type => {
    const def = engine.taskDefinitions[type];
    console.log(`• ${type.toUpperCase()}: ${def.description}`);
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 2. Demonstrate debate generation
  console.log('🗣️  DEBATE GENERATION EXAMPLE\n');
  
  const debateExample = engine.getExample('debate');
  console.log('EXAMPLE PROVIDED TO AI:');
  console.log(`Topic: "${debateExample.topic}"`);
  console.log(`Proficiency: ${debateExample.proficiency}`);
  console.log(`Structure: ${Object.keys(debateExample.example).join(', ')}`);
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Generate prompt for new debate topic
  const newDebateTopic = "Should the Supreme Court have the power to review constitutional amendments?";
  const debatePrompt = engine.generatePrompt('debate', {
    topic: newDebateTopic,
    proficiency: 'intermediate',
    retrievedChunks: sampleChunks
  });
  
  console.log('GENERATED PROMPT FOR NEW TOPIC:');
  console.log(`Topic: "${newDebateTopic}"`);
  console.log(`System Message: ${debatePrompt[0].content.length} characters`);
  console.log(`User Message: ${debatePrompt[1].content.length} characters`);
  console.log(`Includes Example: ${debatePrompt[1].content.includes('EXAMPLE TOPIC:') ? 'YES' : 'NO'}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 3. Demonstrate analysis
  console.log('🔍 CONCEPT ANALYSIS EXAMPLE\n');
  
  const analysisExample = engine.getExample('analysis');
  console.log('EXAMPLE PROVIDED TO AI:');
  console.log(`Topic: "${analysisExample.topic}"`);
  console.log(`Structure: ${Object.keys(analysisExample.example).join(', ')}`);
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  const newAnalysisTopic = "Judicial Review in Indian Constitution";
  const analysisPrompt = engine.generatePrompt('analysis', {
    topic: newAnalysisTopic,
    proficiency: 'advanced',
    retrievedChunks: sampleChunks
  });
  
  console.log('GENERATED PROMPT FOR NEW CONCEPT:');
  console.log(`Topic: "${newAnalysisTopic}"`);
  console.log(`Prompt Length: ${analysisPrompt[1].content.length} characters`);
  console.log(`Includes Example: ${analysisPrompt[1].content.includes('EXAMPLE TOPIC:') ? 'YES' : 'NO'}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 4. Show response validation
  console.log('✅ RESPONSE VALIDATION EXAMPLE\n');
  
  // Valid response
  const validResponse = {
    stance: "The Supreme Court should have the power to review constitutional amendments to ensure they don't violate the basic structure doctrine.",
    counterStance: "Giving the Supreme Court power to review amendments could create judicial overreach and undermine parliamentary sovereignty.",
    citations: [
      {
        id: "basic_structure_1",
        source: "Kesavananda Bharati Case (1973)",
        snippet: "The Basic Structure Doctrine was established...",
        relevance: "Establishes the principle that constitutional amendments cannot alter basic structure"
      }
    ],
    quiz: [
      {
        question: "Which case established the Basic Structure Doctrine?",
        options: ["Kesavananda Bharati", "Golak Nath", "Minerva Mills", "SR Bommai"],
        answerIndex: 0,
        explanation: "Kesavananda Bharati v. State of Kerala (1973) established this doctrine"
      }
    ],
    keyTakeaways: [
      "Basic Structure Doctrine limits Parliament's amending power",
      "Supreme Court acts as guardian of Constitution",
      "Balance between parliamentary sovereignty and constitutional protection"
    ]
  };
  
  const validationResult = engine.validateResponse(validResponse, 'debate');
  console.log('VALID RESPONSE VALIDATION:');
  console.log(`Is Valid: ${validationResult.isValid ? '✅ YES' : '❌ NO'}`);
  if (!validationResult.isValid) {
    console.log(`Error: ${validationResult.error}`);
  }
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Invalid response (missing fields)
  const invalidResponse = {
    stance: "This is a stance",
    counterStance: "This is a counter-stance"
    // Missing citations, quiz, keyTakeaways
  };
  
  const invalidValidationResult = engine.validateResponse(invalidResponse, 'debate');
  console.log('INVALID RESPONSE VALIDATION:');
  console.log(`Is Valid: ${invalidValidationResult.isValid ? '✅ YES' : '❌ NO'}`);
  if (!invalidValidationResult.isValid) {
    console.log(`Error: ${invalidValidationResult.error}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 5. Summary and key benefits
  console.log('🎯 KEY BENEFITS OF ONE-SHOT PROMPTING\n');
  
  console.log('1. 📋 CONSISTENCY');
  console.log('   • Every response follows the same structure');
  console.log('   • Predictable output format for UI rendering');
  console.log('   • Uniform quality across different topics');
  
  console.log('\n2. 🎯 RELIABILITY');
  console.log('   • AI learns exact format from example');
  console.log('   • Reduces ambiguity about desired output');
  console.log('   • Higher success rate than zero-shot approaches');
  
  console.log('\n3. ⚡ EFFICIENCY');
  console.log('   • Only one example needed (vs. multiple in few-shot)');
  console.log('   • Balanced token usage');
  console.log('   • Fast prompt generation');
  
  console.log('\n4. 🔧 FLEXIBILITY');
  console.log('   • Support for multiple task types');
  console.log('   • Custom examples for specific use cases');
  console.log('   • Adaptable to different proficiency levels');
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 6. Show prompt structure
  console.log('📝 PROMPT STRUCTURE BREAKDOWN\n');
  
  console.log('SYSTEM MESSAGE:');
  console.log(`• Defines AI role as CivicsCoach`);
  console.log(`• Explains capabilities and approach`);
  console.log(`• Sets context for one-shot learning`);
  console.log(`• Length: ${debatePrompt[0].content.length} characters`);
  
  console.log('\nUSER MESSAGE:');
  console.log(`• Contains specific task and topic`);
  console.log(`• Includes complete example for AI to learn from`);
  console.log(`• Provides clear instructions and constraints`);
  console.log(`• Length: ${debatePrompt[1].content.length} characters`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  console.log('🚀 DEMONSTRATION COMPLETE!');
  console.log('\nThe one-shot prompting system successfully:');
  console.log('✅ Generated prompts with examples');
  console.log('✅ Validated response formats');
  console.log('✅ Demonstrated multiple task types');
  console.log('✅ Showed consistency and reliability benefits');
  
  return {
    engine,
    debatePrompt,
    analysisPrompt,
    validationResult,
    invalidValidationResult
  };
}

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateOneShotPrompting().catch(console.error);
}

module.exports = {
  demonstrateOneShotPrompting
};
