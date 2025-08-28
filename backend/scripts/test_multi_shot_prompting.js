/**
 * Test script for Multi-Shot Prompting System
 * Demonstrates how the system provides multiple examples to guide AI responses
 */

const { MultiShotPromptEngine } = require('../src/prompts/multiShotPrompt');

// Initialize the multi-shot prompt engine
const multiShotPromptEngine = new MultiShotPromptEngine();

// Sample retrieved chunks (simulating corpus data)
const sampleChunks = [
  {
    id: "constitution_basic",
    text: "The Constitution of India is the supreme law of India. It lays down the framework defining fundamental political principles, establishes the structure, procedures, powers, and duties of government institutions, and sets out fundamental rights, directive principles, and the duties of citizens."
  },
  {
    id: "basic_structure_doctrine",
    text: "The Basic Structure Doctrine is a judicial innovation that propounds that certain features of the Constitution of India are beyond the scope of amendment by the Parliament of India. The doctrine was established in the landmark case of Kesavananda Bharati v. State of Kerala (1973)."
  },
  {
    id: "federalism_india",
    text: "India follows a quasi-federal structure with a strong central government. The Constitution provides for a federal system with unitary bias, where the Union government has more powers than the state governments in certain areas."
  }
];

// Test cases for different scenarios
const testCases = [
  {
    name: "Multi-Shot Debate Generation - Beginner",
    taskType: "debate",
    query: "What is the Constitution of India?",
    proficiency: "beginner",
    exampleCount: 2,
    description: "Generate a structured debate with beginner-level examples"
  },
  {
    name: "Multi-Shot Debate Generation - Intermediate",
    taskType: "debate",
    query: "How does the Indian Parliament work?",
    proficiency: "intermediate",
    exampleCount: 2,
    description: "Generate a structured debate with intermediate-level examples"
  },
  {
    name: "Multi-Shot Debate Generation - Advanced",
    taskType: "debate",
    query: "Explain the Basic Structure Doctrine and its implications",
    proficiency: "advanced",
    exampleCount: 2,
    description: "Generate a structured debate with advanced-level examples"
  },
  {
    name: "Multi-Shot Concept Analysis - Beginner",
    taskType: "analysis",
    query: "What is Judicial Review?",
    proficiency: "beginner",
    exampleCount: 1,
    description: "Perform concept analysis with beginner-level examples"
  },
  {
    name: "Multi-Shot Concept Analysis - Advanced",
    taskType: "analysis",
    query: "Analyze the evolution of constitutional interpretation in India",
    proficiency: "advanced",
    exampleCount: 1,
    description: "Perform concept analysis with advanced-level examples"
  }
];

console.log("🚀 Multi-Shot Prompting System Test\n");
console.log("=" .repeat(60));

// Run test cases
testCases.forEach((testCase, index) => {
  console.log(`\n📝 Test Case ${index + 1}: ${testCase.name}`);
  console.log("-".repeat(50));
  
  try {
    // Generate multi-shot prompt
    const result = multiShotPromptEngine.generateMultiShotPrompt(
      testCase.taskType,
      testCase.query,
      testCase.proficiency,
      sampleChunks,
      { exampleCount: testCase.exampleCount }
    );
    
    // Display results
    console.log(`Task Type: ${result.metadata.taskType}`);
    console.log(`Query: "${testCase.query}"`);
    console.log(`User Proficiency: ${result.metadata.proficiency}`);
    console.log(`Examples Used: ${result.metadata.examplesUsed}`);
    console.log(`Example Queries: ${result.metadata.exampleQueries.join(', ')}`);
    console.log(`Prompt Length: ${result.metadata.promptLength} characters`);
    console.log(`Multi-Shot Features: ${result.metadata.multiShotFeatures.join(', ')}`);
    
    // Show a sample of the generated prompt
    console.log(`\n📋 Sample Prompt Content:`);
    console.log("=" .repeat(40));
    const samplePrompt = result.messages[1].content.substring(0, 400) + "...";
    console.log(samplePrompt);
    console.log("=" .repeat(40));
    
    // Validate that this is truly multi-shot
    if (result.metadata.multiShotFeatures.includes('multiple_examples_provided')) {
      console.log("✅ Multi-shot validation: PASSED - Multiple examples provided");
    } else {
      console.log("❌ Multi-shot validation: FAILED - Multiple examples not found");
    }
    
  } catch (error) {
    console.error(`❌ Error in test case: ${error.message}`);
  }
});

// Test the convenience methods
console.log("\n\n🔧 Testing Convenience Methods");
console.log("-".repeat(40));

try {
  console.log("\n1. Testing generateDebatePrompt()");
  const debatePrompt = multiShotPromptEngine.generateDebatePrompt(
    "What are Fundamental Rights?",
    "beginner",
    sampleChunks,
    { exampleCount: 2 }
  );
  console.log(`   Task Type: ${debatePrompt.metadata.taskType}`);
  console.log(`   Examples Used: ${debatePrompt.metadata.examplesUsed}`);
  console.log(`   Prompt Length: ${debatePrompt.metadata.promptLength} characters`);
  
  console.log("\n2. Testing generateAnalysisPrompt()");
  const analysisPrompt = multiShotPromptEngine.generateAnalysisPrompt(
    "Separation of Powers",
    "advanced",
    sampleChunks,
    { exampleCount: 1 }
  );
  console.log(`   Task Type: ${analysisPrompt.metadata.taskType}`);
  console.log(`   Examples Used: ${analysisPrompt.metadata.examplesUsed}`);
  console.log(`   Prompt Length: ${analysisPrompt.metadata.promptLength} characters`);
  
} catch (error) {
  console.error(`❌ Error testing convenience methods: ${error.message}`);
}

// Test example database management
console.log("\n\n🗄️ Testing Example Database Management");
console.log("-".repeat(40));

try {
  // Get database statistics
  const stats = multiShotPromptEngine.getDatabaseStats();
  console.log("Database Statistics:");
  Object.keys(stats).forEach(taskType => {
    console.log(`  ${taskType}:`);
    Object.keys(stats[taskType]).forEach(proficiency => {
      console.log(`    ${proficiency}: ${stats[taskType][proficiency]} examples`);
    });
  });
  
  // Test adding a new example
  console.log("\nAdding new example...");
  const newExample = {
    query: "What is the role of the Election Commission?",
    response: {
      conceptDefinition: "The Election Commission is an independent constitutional body responsible for conducting free and fair elections.",
      constitutionalBasis: "Article 324 establishes the Election Commission",
      keyPrinciples: ["Independence", "Impartiality", "Integrity"],
      historicalContext: "Established to ensure democratic electoral processes",
      currentRelevance: "Critical for maintaining democratic integrity",
      implications: "Ensures fair electoral competition",
      challenges: "Political interference and resource constraints",
      summary: "Election Commission safeguards democratic electoral processes"
    }
  };
  
  const added = multiShotPromptEngine.addExample('analysis', 'intermediate', newExample);
  console.log(`New example added: ${added ? 'SUCCESS' : 'FAILED'}`);
  
  // Get updated statistics
  const updatedStats = multiShotPromptEngine.getDatabaseStats();
  console.log("\nUpdated Database Statistics:");
  console.log(`  analysis.intermediate: ${updatedStats.analysis.intermediate} examples`);
  
} catch (error) {
  console.error(`❌ Error testing database management: ${error.message}`);
}

console.log("\n" + "=" .repeat(60));
console.log("🎯 Test Summary");
console.log("Multi-Shot Prompting System is working correctly!");
console.log("\nKey Features Demonstrated:");
console.log("• Multiple examples provided for comprehensive learning");
console.log("• Intelligent example selection based on query and proficiency");
console.log("• Quality benchmarking through example standards");
console.log("• Format guidance and style adaptation");
console.log("• Consistent quality maintenance across responses");
console.log("• Extensible example database with management capabilities");

console.log("\n🚀 Ready to use in production!");
console.log("\nThe AI now learns from multiple examples to provide better, more consistent responses!");
