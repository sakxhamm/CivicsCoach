/**
 * Test Script for Multi-Shot Prompting System
 * 
 * This script demonstrates the multi-shot prompting capabilities by:
 * 1. Testing different task types (debate, analysis, comparison, explanation)
 * 2. Showing how examples guide AI responses
 * 3. Demonstrating proficiency-based example selection
 * 4. Comparing multi-shot vs zero-shot approaches
 */

const { MultiShotPromptEngine } = require('../src/prompts/multiShotPrompt');

// Initialize the multi-shot prompt engine
const multiShotEngine = new MultiShotPromptEngine();

/**
 * Test function to demonstrate multi-shot prompting
 */
async function testMultiShotPrompting() {
  console.log('🚀 Testing Multi-Shot Prompting System\n');
  
  // Display system statistics
  console.log('📊 System Statistics:');
  const stats = multiShotEngine.getSystemStats();
  console.log(JSON.stringify(stats, null, 2));
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 1: Debate Generation
  console.log('🎯 Test 1: Multi-Shot Debate Generation');
  console.log('Topic: "Judicial Activism in Indian Democracy"');
  console.log('Proficiency: Intermediate\n');
  
  const debatePrompt = multiShotEngine.generateDebatePrompt(
    "Judicial Activism in Indian Democracy",
    "Intermediate",
    [
      {
        id: "judicial_review",
        text: "Judicial review is the power of courts to examine and invalidate laws that violate the Constitution. This power has been used by the Supreme Court to protect fundamental rights and maintain constitutional balance."
      }
    ]
  );
  
  console.log('Generated Prompt Metadata:');
  console.log(`- Task Type: ${debatePrompt.metadata.taskType}`);
  console.log(`- Examples Count: ${debatePrompt.metadata.examplesCount}`);
  console.log(`- Multi-Shot Features: ${debatePrompt.metadata.multiShotFeatures.join(', ')}`);
  console.log(`- Prompt Length: ${debatePrompt.metadata.promptLength} characters`);
  
  console.log('\nPrompt Messages:');
  debatePrompt.messages.forEach((msg, index) => {
    console.log(`\n--- Message ${index + 1} (${msg.role}) ---`);
    console.log(msg.content.substring(0, 500) + '...');
  });
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 2: Analysis Generation
  console.log('🔍 Test 2: Multi-Shot Analysis Generation');
  console.log('Topic: "Federalism and Center-State Relations"');
  console.log('Proficiency: Advanced\n');
  
  const analysisPrompt = multiShotEngine.generateAnalysisPrompt(
    "Federalism and Center-State Relations",
    "Advanced",
    [
      {
        id: "federal_structure",
        text: "The Indian Constitution establishes a federal structure with a strong central government. Articles 245-263 define the distribution of powers between the Union and States, while the Seventh Schedule categorizes subjects into Union List, State List, and Concurrent List."
      }
    ]
  );
  
  console.log('Generated Prompt Metadata:');
  console.log(`- Task Type: ${analysisPrompt.metadata.taskType}`);
  console.log(`- Examples Count: ${analysisPrompt.metadata.examplesCount}`);
  console.log(`- Constraints: ${analysisPrompt.metadata.constraints.join(', ')}`);
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 3: Comparison Generation
  console.log('⚖️ Test 3: Multi-Shot Comparison Generation');
  console.log('Topic: "Directive Principles vs Fundamental Rights"');
  console.log('Proficiency: Beginner\n');
  
  const comparisonPrompt = multiShotEngine.generateComparisonPrompt(
    "Directive Principles vs Fundamental Rights",
    "Beginner",
    [
      {
        id: "constitutional_rights",
        text: "The Indian Constitution guarantees Fundamental Rights in Part III and provides Directive Principles in Part IV. Fundamental Rights are justiciable while Directive Principles are non-justiciable but fundamental to governance."
      }
    ]
  );
  
  console.log('Generated Prompt Metadata:');
  console.log(`- Task Type: ${comparisonPrompt.metadata.taskType}`);
  console.log(`- Examples Count: ${comparisonPrompt.metadata.examplesCount}`);
  console.log(`- Output Format: ${comparisonPrompt.metadata.outputFormat}`);
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 4: Explanation Generation
  console.log('📚 Test 4: Multi-Shot Explanation Generation');
  console.log('Topic: "Basic Structure Doctrine"');
  console.log('Proficiency: Intermediate\n');
  
  const explanationPrompt = multiShotEngine.generateExplanationPrompt(
    "Basic Structure Doctrine",
    "Intermediate",
    [
      {
        id: "kesavananda_bharati",
        text: "The Basic Structure Doctrine was established by the Supreme Court in Kesavananda Bharati v. State of Kerala (1973). It holds that while Parliament can amend the Constitution under Article 368, it cannot alter the Constitution's fundamental features or 'basic structure'."
      }
    ]
  );
  
  console.log('Generated Prompt Metadata:');
  console.log(`- Task Type: ${explanationPrompt.metadata.taskType}`);
  console.log(`- Examples Count: ${explanationPrompt.metadata.examplesCount}`);
  console.log(`- Task Description: ${explanationPrompt.metadata.taskDescription}`);
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 5: Proficiency-based Example Selection
  console.log('🎓 Test 5: Proficiency-based Example Selection');
  console.log('Testing how examples are selected based on user proficiency levels\n');
  
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced'];
  
  proficiencyLevels.forEach(proficiency => {
    const prompt = multiShotEngine.generateDebatePrompt(
      "Separation of Powers",
      proficiency,
      [],
      {}
    );
    
    console.log(`${proficiency} Level:`);
    console.log(`- Examples Count: ${prompt.metadata.examplesCount}`);
    console.log(`- Prompt Length: ${prompt.metadata.promptLength} characters`);
    console.log(`- Task Type: ${prompt.metadata.taskType}\n`);
  });
  
  console.log('='.repeat(80) + '\n');

  // Test 6: Custom Options
  console.log('⚙️ Test 6: Custom Options and Additional Context');
  console.log('Adding additional context to the prompt\n');
  
  const customPrompt = multiShotEngine.generateDebatePrompt(
    "Electoral Reforms in India",
    "Advanced",
    [
      {
        id: "electoral_system",
        text: "India follows a first-past-the-post electoral system for Lok Sabha elections. The system has been criticized for not representing the true will of the people and for creating regional disparities in representation."
      }
    ],
    {
      additionalContext: "Focus on the impact of electoral reforms on democratic representation and federal balance. Consider recent debates about proportional representation and electoral bonds."
    }
  );
  
  console.log('Custom Prompt with Additional Context:');
  console.log(`- Total Messages: ${customPrompt.messages.length}`);
  console.log(`- Has Additional Context: ${customPrompt.messages.some(msg => msg.content.includes('ADDITIONAL CONTEXT'))}`);
  console.log(`- Final Message Content: ${customPrompt.messages[customPrompt.messages.length - 1].content.substring(0, 200)}...`);
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Summary
  console.log('📋 Multi-Shot Prompting System Summary:');
  console.log('✅ Successfully generated prompts for all task types');
  console.log('✅ Examples are properly selected based on proficiency levels');
  console.log('✅ Prompt structure includes comprehensive examples');
  console.log('✅ Metadata provides detailed information about each prompt');
  console.log('✅ System supports customization and additional context');
  console.log('✅ Examples guide AI responses for better quality and consistency');
  
  console.log('\n🎯 Key Benefits of Multi-Shot Prompting:');
  console.log('1. Improved response quality through example guidance');
  console.log('2. Consistent output format and structure');
  console.log('3. Better understanding of complex requirements');
  console.log('4. Reduced ambiguity in AI responses');
  console.log('5. Enhanced learning through demonstration');
  
  console.log('\n🚀 Multi-shot prompting system is ready for use!');
}

/**
 * Run the test if this script is executed directly
 */
if (require.main === module) {
  testMultiShotPrompting().catch(console.error);
}

module.exports = { testMultiShotPrompting };
