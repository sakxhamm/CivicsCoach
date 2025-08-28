/**
 * Dynamic Prompting Demo Script
 * Shows actual prompts generated for different scenarios
 */

const { DynamicPromptEngine } = require('../src/prompts/dynamicPrompt');

// Initialize the dynamic prompt engine
const dynamicPromptEngine = new DynamicPromptEngine();

// Sample retrieved chunks
const sampleChunks = [
  {
    id: "constitution_basic",
    text: "The Constitution of India is the supreme law of India. It lays down the framework defining fundamental political principles, establishes the structure, procedures, powers, and duties of government institutions, and sets out fundamental rights, directive principles, and the duties of citizens."
  },
  {
    id: "basic_structure_doctrine",
    text: "The Basic Structure Doctrine is a judicial innovation that propounds that certain features of the Constitution of India are beyond the scope of amendment by the Parliament of India. The doctrine was established in the landmark case of Kesavananda Bharati v. State of Kerala (1973)."
  }
];

console.log("🎭 Dynamic Prompting Demo\n");
console.log("=" .repeat(60));

// Demo 1: Simple query for beginner
console.log("\n📚 DEMO 1: Simple Query for Beginner");
console.log("-".repeat(40));
const simpleQuery = "What is the Constitution?";
const simpleResult = dynamicPromptEngine.generateDynamicPrompt(simpleQuery, "beginner", sampleChunks);

console.log(`Query: "${simpleQuery}"`);
console.log(`User Level: Beginner`);
console.log(`Complexity: ${simpleResult.metadata.complexity.level}`);
console.log(`Reasoning Depth: ${simpleResult.metadata.context.reasoningDepth}`);
console.log(`Output Format: ${simpleResult.metadata.context.outputFormat}`);

console.log("\n📋 Generated Prompt:");
console.log("=" .repeat(40));
console.log(simpleResult.messages[0].content);
console.log("=" .repeat(40));

// Demo 2: Complex query for advanced user
console.log("\n\n🎓 DEMO 2: Complex Query for Advanced User");
console.log("-".repeat(40));
const complexQuery = "Analyze the Basic Structure Doctrine and its implications for constitutional amendments in India";
const complexResult = dynamicPromptEngine.generateDynamicPrompt(complexQuery, "advanced", sampleChunks);

console.log(`Query: "${complexQuery}"`);
console.log(`User Level: Advanced`);
console.log(`Complexity: ${complexResult.metadata.complexity.level}`);
console.log(`Reasoning Depth: ${complexResult.metadata.context.reasoningDepth}`);
console.log(`Output Format: ${complexResult.metadata.context.outputFormat}`);

console.log("\n📋 Generated Prompt:");
console.log("=" .repeat(40));
console.log(complexResult.messages[0].content);
console.log("=" .repeat(40));

// Demo 3: Show the differences
console.log("\n\n🔍 KEY DIFFERENCES DEMONSTRATED:");
console.log("-".repeat(40));
console.log("1. Complexity Detection:");
console.log(`   Simple Query: ${simpleResult.metadata.complexity.score} points (${simpleResult.metadata.complexity.level})`);
console.log(`   Complex Query: ${complexResult.metadata.complexity.score} points (${complexResult.metadata.complexity.level})`);

console.log("\n2. Reasoning Depth:");
console.log(`   Simple Query: ${simpleResult.metadata.context.reasoningDepth}`);
console.log(`   Complex Query: ${complexResult.metadata.context.reasoningDepth}`);

console.log("\n3. Output Format:");
console.log(`   Simple Query: ${simpleResult.metadata.context.outputFormat}`);
console.log(`   Complex Query: ${complexResult.metadata.context.outputFormat}`);

console.log("\n4. Prompt Length:");
console.log(`   Simple Query: ${simpleResult.metadata.promptLength} characters`);
console.log(`   Complex Query: ${complexResult.metadata.promptLength} characters`);

console.log("\n5. Dynamic Features:");
console.log(`   Simple Query: ${simpleResult.metadata.dynamicFeatures.join(', ')}`);
console.log(`   Complex Query: ${complexResult.metadata.dynamicFeatures.join(', ')}`);

console.log("\n" + "=" .repeat(60));
console.log("🎯 Dynamic Prompting Successfully Demonstrates:");
console.log("• Automatic complexity analysis based on query content");
console.log("• Context-aware example and instruction selection");
console.log("• Adaptive reasoning depth based on user level");
console.log("• Dynamic output formatting for different complexity levels");
console.log("• Real-time prompt optimization without manual intervention");

console.log("\n🚀 The system automatically adapts to serve different user needs!");
