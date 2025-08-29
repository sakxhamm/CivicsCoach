/**
 * Test Script for RTFC Framework Prompting System
 * 
 * This script demonstrates the RTFC framework implementation:
 * - ROLE: Defines the AI's identity and capabilities
 * - TASK: Specifies what needs to be accomplished
 * - FORMAT: Defines the expected output structure
 * - CONTEXT: Provides relevant background and information
 * - CONSTRAINTS: Sets boundaries and requirements
 */

const RTFCPromptEngine = require('../src/prompts/rtfcPrompt');

// Sample retrieved chunks for testing
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
  },
  {
    id: "fundamental_rights_1",
    source: "Constitution of India, Part III",
    content: "Fundamental Rights are enshrined in Part III (Articles 12-35) of the Constitution. These rights are justiciable and enforceable in courts, protecting individual liberties and freedoms."
  }
];

/**
 * Test RTFC Framework Components
 */
async function testRTFCComponents() {
  console.log('🔧 TESTING RTFC FRAMEWORK COMPONENTS\n');
  
  const engine = new RTFCPromptEngine();
  
  // 1. Test Role Definitions
  console.log('👤 ROLE DEFINITIONS:');
  const roles = Object.keys(engine.roleDefinitions);
  roles.forEach(roleKey => {
    const role = engine.roleDefinitions[roleKey];
    console.log(`\n${role.identity.toUpperCase()}:`);
    console.log(`  Expertise: ${role.expertise}`);
    console.log(`  Qualifications: ${role.qualifications.length} items`);
    console.log(`  Capabilities: ${role.capabilities.length} items`);
    console.log(`  Personality: ${role.personality.length} traits`);
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 2. Test Task Definitions
  console.log('📋 TASK DEFINITIONS:');
  const tasks = engine.getAvailableTasks();
  tasks.forEach(task => {
    console.log(`\n${task.name.toUpperCase()}:`);
    console.log(`  Description: ${task.description}`);
    console.log(`  Complexity: ${task.complexity}`);
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 3. Test Context Templates
  console.log('🌍 CONTEXT TEMPLATES:');
  const contexts = engine.getAvailableContexts();
  contexts.forEach(context => {
    console.log(`\n${context.key.toUpperCase()}:`);
    console.log(`  Audience: ${context.audience}`);
    console.log(`  Background: ${context.background}`);
    console.log(`  Objectives: ${context.objectives ? context.objectives.length : 0} items`);
  });
  
  return engine;
}

/**
 * Test RTFC Prompt Generation
 */
async function testRTFCPromptGeneration(engine) {
  console.log('\n🚀 TESTING RTFC PROMPT GENERATION\n');
  
  // 1. Test Debate Generation
  console.log('🗣️  DEBATE GENERATION PROMPT:');
  const debatePrompt = engine.generateRTFCPrompt('debate', {
    topic: "Should the Supreme Court have the power to review constitutional amendments?",
    proficiency: 'intermediate',
    retrievedChunks: sampleChunks,
    context: 'constitutionalEducation'
  });
  
  console.log('Generated Prompt Structure:');
  console.log(`System Message: ${debatePrompt[0].content.length} characters`);
  console.log(`User Message: ${debatePrompt[1].content.length} characters`);
  
  console.log('\nSystem Message Preview:');
  console.log(debatePrompt[0].content.substring(0, 200) + '...');
  
  console.log('\nUser Message Preview:');
  console.log(debatePrompt[1].content.substring(0, 300) + '...');
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 2. Test Analysis Generation
  console.log('🔍 ANALYSIS GENERATION PROMPT:');
  const analysisPrompt = engine.generateRTFCPrompt('analysis', {
    topic: "Fundamental Rights in Indian Constitution",
    proficiency: 'advanced',
    retrievedChunks: sampleChunks,
    context: 'academicResearch'
  });
  
  console.log('Generated Prompt Structure:');
  console.log(`System Message: ${analysisPrompt[0].content.length} characters`);
  console.log(`User Message: ${analysisPrompt[1].content.length} characters`);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // 3. Test Comparison Generation
  console.log('⚖️  COMPARISON GENERATION PROMPT:');
  const comparisonPrompt = engine.generateRTFCPrompt('comparison', {
    topic: "Fundamental Rights vs Directive Principles",
    proficiency: 'intermediate',
    retrievedChunks: sampleChunks,
    context: 'publicPolicy'
  });
  
  console.log('Generated Prompt Structure:');
  console.log(`System Message: ${comparisonPrompt[0].content.length} characters`);
  console.log(`User Message: ${comparisonPrompt[1].content.length} characters`);
  
  return { debatePrompt, analysisPrompt, comparisonPrompt };
}

/**
 * Test Specialized Prompts
 */
async function testSpecializedPrompts(engine) {
  console.log('\n🎯 TESTING SPECIALIZED PROMPTS\n');
  
  // 1. Academic Specialization
  console.log('📚 ACADEMIC SPECIALIZATION:');
  const academicPrompt = engine.generateSpecializedPrompt('analysis', {
    topic: "Judicial Review in Indian Constitution",
    proficiency: 'advanced',
    retrievedChunks: sampleChunks,
    context: 'academicResearch'
  }, 'academic');
  
  console.log('Academic Prompt Length:', academicPrompt[1].content.length, 'characters');
  console.log('Includes Academic Requirements:', academicPrompt[1].content.includes('ACADEMIC REQUIREMENTS'));
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 2. Beginner Specialization
  console.log('🌱 BEGINNER SPECIALIZATION:');
  const beginnerPrompt = engine.generateSpecializedPrompt('explanation', {
    topic: "Separation of Powers",
    proficiency: 'beginner',
    retrievedChunks: sampleChunks,
    context: 'generalPublic'
  }, 'beginner');
  
  console.log('Beginner Prompt Length:', beginnerPrompt[1].content.length, 'characters');
  console.log('Includes Beginner Requirements:', beginnerPrompt[1].content.includes('BEGINNER-FRIENDLY REQUIREMENTS'));
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 3. Policy Specialization
  console.log('🏛️  POLICY SPECIALIZATION:');
  const policyPrompt = engine.generateSpecializedPrompt('comparison', {
    topic: "Parliamentary vs Presidential Systems",
    proficiency: 'intermediate',
    retrievedChunks: sampleChunks,
    context: 'publicPolicy'
  }, 'policy');
  
  console.log('Policy Prompt Length:', policyPrompt[1].content.length, 'characters');
  console.log('Includes Policy Requirements:', policyPrompt[1].content.includes('POLICY FOCUS REQUIREMENTS'));
  
  return { academicPrompt, beginnerPrompt, policyPrompt };
}

/**
 * Test Response Validation
 */
async function testResponseValidation(engine) {
  console.log('\n✅ TESTING RESPONSE VALIDATION\n');
  
  // 1. Test Valid Debate Response
  console.log('✅ VALID DEBATE RESPONSE:');
  const validDebateResponse = {
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
  
  const debateValidation = engine.validateResponse(validDebateResponse, 'debate');
  console.log('Debate Response Valid:', debateValidation.isValid ? '✅ YES' : '❌ NO');
  if (!debateValidation.isValid) {
    console.log('Error:', debateValidation.error);
  }
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 2. Test Invalid Response (Missing Fields)
  console.log('❌ INVALID RESPONSE (MISSING FIELDS):');
  const invalidResponse = {
    stance: "This is a stance",
    counterStance: "This is a counter-stance"
    // Missing citations, quiz, keyTakeaways
  };
  
  const invalidValidation = engine.validateResponse(invalidResponse, 'debate');
  console.log('Invalid Response Valid:', invalidValidation.isValid ? '✅ YES' : '❌ NO');
  if (!invalidValidation.isValid) {
    console.log('Error:', invalidValidation.error);
  }
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 3. Test Analysis Response Validation
  console.log('✅ VALID ANALYSIS RESPONSE:');
  const validAnalysisResponse = {
    conceptDefinition: "Fundamental Rights are justiciable constitutional guarantees that protect individual liberties.",
    constitutionalBasis: "Fundamental Rights are enshrined in Part III (Articles 12-35) of the Constitution.",
    keyPrinciples: [
      "Fundamental Rights are enforceable in courts",
      "They protect individual liberties and freedoms",
      "They are subject to reasonable restrictions"
    ],
    historicalContext: "The Fundamental Rights were inspired by the Bill of Rights and reflect democratic values.",
    currentRelevance: "They continue to protect citizens' rights and freedoms in contemporary India.",
    implications: "They ensure individual liberty and provide legal remedies for rights violations.",
    challenges: "Balancing individual rights with collective welfare remains a challenge.",
    summary: "Fundamental Rights are essential constitutional protections for individual liberties."
  };
  
  const analysisValidation = engine.validateResponse(validAnalysisResponse, 'analysis');
  console.log('Analysis Response Valid:', analysisValidation.isValid ? '✅ YES' : '❌ NO');
  if (!analysisValidation.isValid) {
    console.log('Error:', analysisValidation.error);
  }
  
  return { debateValidation, invalidValidation, analysisValidation };
}

/**
 * Test RTFC Framework Benefits
 */
async function testRTFCBenefits(engine) {
  console.log('\n🌟 RTFC FRAMEWORK BENEFITS\n');
  
  // 1. Structure and Clarity
  console.log('📋 STRUCTURE AND CLARITY:');
  console.log('• ROLE: Clearly defines AI identity and capabilities');
  console.log('• TASK: Specifies exact requirements and objectives');
  console.log('• FORMAT: Defines precise output structure');
  console.log('• CONTEXT: Provides relevant background and audience info');
  console.log('• CONSTRAINTS: Sets clear boundaries and limitations');
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 2. Consistency and Quality
  console.log('🎯 CONSISTENCY AND QUALITY:');
  console.log('• Standardized prompt structure across all task types');
  console.log('• Consistent output format for UI rendering');
  console.log('• Quality control through clear requirements');
  console.log('• Validation against expected formats');
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 3. Flexibility and Specialization
  console.log('🔧 FLEXIBILITY AND SPECIALIZATION:');
  console.log('• Multiple role definitions for different contexts');
  console.log('• Context-specific templates and requirements');
  console.log('• Specialization options (academic, beginner, policy)');
  console.log('• Custom constraint support');
  
  console.log('\n' + '-'.repeat(40) + '\n');
  
  // 4. Educational Value
  console.log('📚 EDUCATIONAL VALUE:');
  console.log('• Clear learning objectives for each context');
  console.log('• Proficiency-level adaptation');
  console.log('• Structured knowledge delivery');
  console.log('• Assessment and validation tools');
}

/**
 * Demonstrate RTFC Framework in Action
 */
async function demonstrateRTFCAction(engine) {
  console.log('\n🎬 RTFC FRAMEWORK IN ACTION\n');
  
  // Generate a complete prompt for demonstration
  const demoPrompt = engine.generateRTFCPrompt('debate', {
    topic: "Should there be term limits for Supreme Court judges?",
    proficiency: 'intermediate',
    retrievedChunks: sampleChunks,
    context: 'constitutionalEducation',
    customConstraints: [
      "Focus on democratic principles and judicial independence",
      "Consider international practices and comparative analysis"
    ]
  });
  
  console.log('DEMONSTRATION PROMPT GENERATED:');
  console.log('Topic: "Should there be term limits for Supreme Court judges?"');
  console.log('Context: Constitutional Education');
  console.log('Proficiency: Intermediate');
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  console.log('SYSTEM MESSAGE (ROLE):');
  console.log(demoPrompt[0].content);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  console.log('USER MESSAGE (TASK + FORMAT + CONTEXT + CONSTRAINTS):');
  console.log(demoPrompt[1].content);
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Show how the framework ensures quality
  console.log('🎯 HOW RTFC ENSURES QUALITY:');
  console.log('1. ROLE: AI knows exactly who it is and what it can do');
  console.log('2. TASK: Clear understanding of what needs to be accomplished');
  console.log('3. FORMAT: Precise output structure with field requirements');
  console.log('4. CONTEXT: Relevant background and audience information');
  console.log('5. CONSTRAINTS: Clear boundaries and quality requirements');
  
  return demoPrompt;
}

/**
 * Main test function
 */
async function runAllTests() {
  console.log('🚀 STARTING RTFC FRAMEWORK TESTS\n');
  
  try {
    // Test all components
    const engine = await testRTFCComponents();
    const prompts = await testRTFCPromptGeneration(engine);
    const specializedPrompts = await testSpecializedPrompts(engine);
    const validations = await testResponseValidation(engine);
    await testRTFCBenefits(engine);
    const demoPrompt = await demonstrateRTFCAction(engine);
    
    console.log('\n✅ ALL RTFC FRAMEWORK TESTS COMPLETED SUCCESSFULLY!');
    console.log('\n📚 RTFC FRAMEWORK SUMMARY:');
    console.log('• ROLE: Defines AI identity and capabilities');
    console.log('• TASK: Specifies requirements and objectives');
    console.log('• FORMAT: Defines output structure and validation');
    console.log('• CONTEXT: Provides background and audience information');
    console.log('• CONSTRAINTS: Sets boundaries and quality requirements');
    
    console.log('\n🎯 KEY BENEFITS:');
    console.log('• Structured and clear prompt generation');
    console.log('• Consistent output quality and format');
    console.log('• Flexible specialization options');
    console.log('• Comprehensive validation and quality control');
    console.log('• Educational value and learning objectives');
    
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
  testRTFCComponents,
  testRTFCPromptGeneration,
  testSpecializedPrompts,
  testResponseValidation,
  testRTFCBenefits,
  demonstrateRTFCAction,
  runAllTests
};
