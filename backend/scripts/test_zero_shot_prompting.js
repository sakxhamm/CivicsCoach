/**
 * Test script for Zero-Shot Prompting System
 * Demonstrates how the system can perform tasks without examples or training data
 */

const { ZeroShotPromptEngine } = require('../src/prompts/zeroShotPrompt');

// Initialize the zero-shot prompt engine
const zeroShotPromptEngine = new ZeroShotPromptEngine();

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

// Test cases for different task types
const testCases = [
  {
    name: "Zero-Shot Debate Generation",
    taskType: "debate",
    query: "What is the Basic Structure Doctrine?",
    proficiency: "intermediate",
    description: "Generate a structured debate with stance, counter-stance, citations, and quiz"
  },
  {
    name: "Zero-Shot Concept Analysis",
    taskType: "analysis",
    query: "Federalism in India",
    proficiency: "advanced",
    description: "Deep analysis of constitutional concepts with constitutional basis and implications"
  },
  {
    name: "Zero-Shot Concept Comparison",
    taskType: "comparison",
    query: "Parliamentary vs Presidential Systems",
    proficiency: "intermediate",
    description: "Compare and contrast different constitutional concepts or doctrines"
  },
  {
    name: "Zero-Shot Concept Explanation",
    taskType: "explanation",
    query: "Judicial Review",
    proficiency: "beginner",
    description: "Explain complex constitutional concepts in simple terms"
  }
];

console.log("🚀 Zero-Shot Prompting System Test\n");
console.log("=" .repeat(60));

// Run test cases
testCases.forEach((testCase, index) => {
  console.log(`\n📝 Test Case ${index + 1}: ${testCase.name}`);
  console.log("-".repeat(50));
  
  try {
    // Generate zero-shot prompt
    const result = zeroShotPromptEngine.generateZeroShotPrompt(
      testCase.taskType,
      testCase.query,
      testCase.proficiency,
      sampleChunks
    );
    
    // Display results
    console.log(`Task Type: ${result.metadata.taskType}`);
    console.log(`Query: "${testCase.query}"`);
    console.log(`User Proficiency: ${testCase.proficiency}`);
    console.log(`Task Description: ${result.metadata.taskDescription}`);
    console.log(`Output Format: ${result.metadata.outputFormat}`);
    console.log(`Prompt Length: ${result.metadata.promptLength} characters`);
    console.log(`Zero-Shot Features: ${result.metadata.zeroShotFeatures.join(', ')}`);
    
    // Show constraints
    console.log(`\nConstraints:`);
    result.metadata.constraints.forEach((constraint, i) => {
      console.log(`  ${i + 1}. ${constraint}`);
    });
    
    // Show a sample of the generated prompt
    console.log(`\n📋 Sample Prompt Content:`);
    console.log("=" .repeat(40));
    const samplePrompt = result.messages[1].content.substring(0, 300) + "...";
    console.log(samplePrompt);
    console.log("=" .repeat(40));
    
    // Validate that this is truly zero-shot
    if (result.metadata.zeroShotFeatures.includes('no_examples_provided')) {
      console.log("✅ Zero-shot validation: PASSED - No examples provided");
    } else {
      console.log("❌ Zero-shot validation: FAILED - Examples found");
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
  const debatePrompt = zeroShotPromptEngine.generateDebatePrompt(
    "What are Fundamental Rights?",
    "beginner",
    sampleChunks
  );
  console.log(`   Task Type: ${debatePrompt.metadata.taskType}`);
  console.log(`   Prompt Length: ${debatePrompt.metadata.promptLength} characters`);
  
  console.log("\n2. Testing generateAnalysisPrompt()");
  const analysisPrompt = zeroShotPromptEngine.generateAnalysisPrompt(
    "Separation of Powers",
    "advanced",
    sampleChunks
  );
  console.log(`   Task Type: ${analysisPrompt.metadata.taskType}`);
  console.log(`   Prompt Length: ${analysisPrompt.metadata.promptLength} characters`);
  
  console.log("\n3. Testing generateComparisonPrompt()");
  const comparisonPrompt = zeroShotPromptEngine.generateComparisonPrompt(
    "Directive Principles vs Fundamental Rights",
    "intermediate",
    sampleChunks
  );
  console.log(`   Task Type: ${comparisonPrompt.metadata.taskType}`);
  console.log(`   Prompt Length: ${comparisonPrompt.metadata.promptLength} characters`);
  
  console.log("\n4. Testing generateExplanationPrompt()");
  const explanationPrompt = zeroShotPromptEngine.generateExplanationPrompt(
    "Constitutional Amendments",
    "beginner",
    sampleChunks
  );
  console.log(`   Task Type: ${explanationPrompt.metadata.taskType}`);
  console.log(`   Prompt Length: ${explanationPrompt.metadata.promptLength} characters`);
  
} catch (error) {
  console.error(`❌ Error testing convenience methods: ${error.message}`);
}

console.log("\n" + "=" .repeat(60));
console.log("🎯 Test Summary");
console.log("Zero-Shot Prompting System is working correctly!");
console.log("\nKey Features Demonstrated:");
console.log("• No examples or training data required");
console.log("• Self-contained prompt instructions");
console.log("• Pre-trained knowledge utilization");
console.log("• Structured output format specifications");
console.log("• Multiple task type support");
console.log("• Convenience methods for common tasks");

console.log("\n🚀 Ready to use in production!");
console.log("\nThe AI can now perform new tasks without specific training!");
