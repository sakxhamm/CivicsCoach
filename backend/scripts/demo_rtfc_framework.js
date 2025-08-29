/**
 * Demo Script for RTFC Framework
 * 
 * This script demonstrates the RTFC framework in action
 * by showing how it generates structured prompts and validates responses.
 */

const RTFCPromptEngine = require('../src/prompts/rtfcPrompt');

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

async function demonstrateRTFCFramework() {
  console.log('🎯 RTFC FRAMEWORK DEMONSTRATION\n');
  
  const engine = new RTFCPromptEngine();
  
  // 1. Show available components
  console.log('📚 RTFC COMPONENTS AVAILABLE:\n');
  
  console.log('ROLES:');
  const roles = Object.keys(engine.roleDefinitions);
  roles.forEach(roleKey => {
    const role = engine.roleDefinitions[roleKey];
    console.log(`• ${role.identity}: ${role.expertise}`);
  });
  
  console.log('\nTASKS:');
  const tasks = engine.getAvailableTasks();
  tasks.forEach(task => {
    console.log(`• ${task.name}: ${task.description}`);
  });
  
  console.log('\nCONTEXTS:');
  const contexts = engine.getAvailableContexts();
  contexts.forEach(context => {
    console.log(`• ${context.key}: ${context.audience}`);
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 2. Demonstrate prompt generation
  console.log('🚀 GENERATING RTFC PROMPT\n');
  
  const prompt = engine.generateRTFCPrompt('debate', {
    topic: "Should the President have veto power over constitutional amendments?",
    proficiency: 'intermediate',
    retrievedChunks: sampleChunks,
    context: 'constitutionalEducation',
    customConstraints: [
      "Focus on democratic principles and constitutional balance",
      "Consider international practices and comparative analysis"
    ]
  });
  
  console.log('PROMPT GENERATED SUCCESSFULLY!');
  console.log(`System Message: ${prompt[0].content.length} characters`);
  console.log(`User Message: ${prompt[1].content.length} characters`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 3. Show prompt structure
  console.log('📝 PROMPT STRUCTURE BREAKDOWN\n');
  
  console.log('SYSTEM MESSAGE (ROLE):');
  console.log(prompt[0].content.substring(0, 200) + '...');
  
  console.log('\nUSER MESSAGE PREVIEW:');
  const userContent = prompt[1].content;
  
  // Extract key sections
  const taskMatch = userContent.match(/TASK: ([^\n]+)/);
  const objectiveMatch = userContent.match(/OBJECTIVE: ([^\n]+)/);
  const topicMatch = userContent.match(/TOPIC: ([^\n]+)/);
  
  if (taskMatch) console.log(`Task: ${taskMatch[1]}`);
  if (objectiveMatch) console.log(`Objective: ${objectiveMatch[1]}`);
  if (topicMatch) console.log(`Topic: ${topicMatch[1]}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 4. Demonstrate specialization
  console.log('🎯 SPECIALIZATION DEMONSTRATION\n');
  
  // Academic specialization
  const academicPrompt = engine.generateSpecializedPrompt('analysis', {
    topic: "Judicial Review in Indian Constitution",
    proficiency: 'advanced',
    retrievedChunks: sampleChunks,
    context: 'academicResearch'
  }, 'academic');
  
  console.log('ACADEMIC SPECIALIZATION:');
  console.log(`Prompt Length: ${academicPrompt[1].content.length} characters`);
  console.log(`Includes Academic Requirements: ${academicPrompt[1].content.includes('ACADEMIC REQUIREMENTS') ? 'YES' : 'NO'}`);
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Beginner specialization
  const beginnerPrompt = engine.generateSpecializedPrompt('explanation', {
    topic: "Separation of Powers",
    proficiency: 'beginner',
    retrievedChunks: sampleChunks,
    context: 'generalPublic'
  }, 'beginner');
  
  console.log('BEGINNER SPECIALIZATION:');
  console.log(`Prompt Length: ${beginnerPrompt[1].content.length} characters`);
  console.log(`Includes Beginner Requirements: ${beginnerPrompt[1].content.includes('BEGINNER-FRIENDLY REQUIREMENTS') ? 'YES' : 'NO'}`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 5. Demonstrate response validation
  console.log('✅ RESPONSE VALIDATION DEMONSTRATION\n');
  
  // Valid response
  const validResponse = {
    stance: "The President should have veto power over constitutional amendments to serve as a check on Parliament's power.",
    counterStance: "Giving the President veto power could create unnecessary delays and political gridlock.",
    citations: [
      {
        id: "article368_1",
        source: "Constitution of India, Article 368",
        snippet: "Article 368 provides the procedure for amending the Constitution...",
        relevance: "Shows current amendment procedure without presidential veto"
      }
    ],
    quiz: [
      {
        question: "What majority is required for constitutional amendments?",
        options: ["Simple majority", "Two-thirds majority", "Three-fourths majority", "Unanimous"],
        answerIndex: 1,
        explanation: "Constitutional amendments require a two-thirds majority in Parliament"
      }
    ],
    keyTakeaways: [
      "Constitutional amendments currently require only parliamentary approval",
      "The President has no veto power over constitutional amendments",
      "Special majorities provide some protection against hasty changes"
    ]
  };
  
  const validation = engine.validateResponse(validResponse, 'debate');
  console.log('VALID RESPONSE VALIDATION:');
  console.log(`Is Valid: ${validation.isValid ? '✅ YES' : '❌ NO'}`);
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // Invalid response
  const invalidResponse = {
    stance: "This is a stance",
    counterStance: "This is a counter-stance"
    // Missing required fields
  };
  
  const invalidValidation = engine.validateResponse(invalidResponse, 'debate');
  console.log('INVALID RESPONSE VALIDATION:');
  console.log(`Is Valid: ${invalidValidation.isValid ? '✅ YES' : '❌ NO'}`);
  if (!invalidValidation.isValid) {
    console.log(`Error: ${invalidValidation.error}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 6. Show framework benefits
  console.log('🌟 RTFC FRAMEWORK BENEFITS\n');
  
  console.log('1. 📋 STRUCTURED APPROACH');
  console.log('   • Systematic prompt generation with clear organization');
  console.log('   • Consistent quality across all interactions');
  console.log('   • Clear flow from role definition to constraints');
  
  console.log('\n2. 🎯 QUALITY CONTROL');
  console.log('   • Built-in validation and consistent output formats');
  console.log('   • Professional standards maintenance');
  console.log('   • Error detection and reporting');
  
  console.log('\n3. 🔧 FLEXIBILITY');
  console.log('   • Multiple role definitions for different contexts');
  console.log('   • Context-specific templates and requirements');
  console.log('   • Specialization options (academic, beginner, policy)');
  console.log('   • Custom constraint support');
  
  console.log('\n4. 📚 EDUCATIONAL VALUE');
  console.log('   • Clear learning objectives for each context');
  console.log('   • Proficiency-level adaptation');
  console.log('   • Structured knowledge delivery');
  console.log('   • Assessment and validation tools');
  
  console.log('\n5. 🚀 SCALABILITY');
  console.log('   • Works across different topics and user levels');
  console.log('   • Maintains consistency at scale');
  console.log('   • Easy to extend and modify');
  console.log('   • Reusable components and templates');
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 7. Summary
  console.log('🎯 DEMONSTRATION SUMMARY\n');
  
  console.log('The RTFC Framework successfully demonstrated:');
  console.log('✅ Component definitions and organization');
  console.log('✅ Prompt generation with all five components');
  console.log('✅ Specialization options for different use cases');
  console.log('✅ Response validation and quality control');
  console.log('✅ Framework benefits and advantages');
  
  console.log('\n🎬 FRAMEWORK IN ACTION:');
  console.log('• ROLE: AI knows exactly who it is and what it can do');
  console.log('• TASK: Clear understanding of what needs to be accomplished');
  console.log('• FORMAT: Precise output structure with field requirements');
  console.log('• CONTEXT: Relevant background and audience information');
  console.log('• CONSTRAINTS: Clear boundaries and quality requirements');
  
  return {
    engine,
    prompt,
    academicPrompt,
    beginnerPrompt,
    validation,
    invalidValidation
  };
}

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateRTFCFramework().catch(console.error);
}

module.exports = {
  demonstrateRTFCFramework
};
