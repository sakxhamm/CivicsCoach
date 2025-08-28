/**
 * Simple test for Zero-Shot Prompting System
 */

console.log("🚀 Starting Zero-Shot Test...");

try {
  const { ZeroShotPromptEngine } = require('../src/prompts/zeroShotPrompt');
  console.log("✅ ZeroShotPromptEngine imported successfully");
  
  const engine = new ZeroShotPromptEngine();
  console.log("✅ ZeroShotPromptEngine instantiated successfully");
  
  const sampleChunks = [
    {
      id: "test",
      text: "Sample text for testing"
    }
  ];
  
  console.log("✅ Sample chunks created");
  
  const result = engine.generateZeroShotPrompt(
    'debate',
    'Test query',
    'intermediate',
    sampleChunks
  );
  
  console.log("✅ Zero-shot prompt generated successfully");
  console.log("Task Type:", result.metadata.taskType);
  console.log("Prompt Length:", result.metadata.promptLength);
  console.log("Messages count:", result.messages.length);
  
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error("Stack:", error.stack);
}
