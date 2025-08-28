/**
 * Demo Script: Multi-Shot vs Zero-Shot Prompting Comparison
 * 
 * This script demonstrates the key differences between:
 * 1. Zero-shot prompting (no examples)
 * 2. Multi-shot prompting (multiple examples)
 * 
 * It shows how multi-shot prompting improves response quality and consistency.
 */

const { ZeroShotPromptEngine } = require('../src/prompts/zeroShotPrompt');
const { MultiShotPromptEngine } = require('../src/prompts/multiShotPrompt');

// Initialize both prompt engines
const zeroShotEngine = new ZeroShotPromptEngine();
const multiShotEngine = new MultiShotPromptEngine();

/**
 * Demo function comparing zero-shot vs multi-shot prompting
 */
async function demoPromptingComparison() {
  console.log('🎭 Demo: Multi-Shot vs Zero-Shot Prompting Comparison\n');
  
  const topic = "Separation of Powers in Indian Constitution";
  const proficiency = "Intermediate";
  const retrievedChunks = [
    {
      id: "article50",
      text: "Article 50 of the Indian Constitution emphasizes the separation of judiciary from executive in public services."
    },
    {
      id: "articles53_79_124",
      text: "Articles 53, 79, and 124 establish distinct roles for Executive, Legislature, and Judiciary respectively."
    }
  ];

  console.log('📋 Test Parameters:');
  console.log(`- Topic: ${topic}`);
  console.log(`- Proficiency: ${proficiency}`);
  console.log(`- Retrieved Chunks: ${retrievedChunks.length} chunks`);
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 1: Zero-Shot Prompting
  console.log('🔴 ZERO-SHOT PROMPTING (No Examples)');
  console.log('Generating debate prompt without examples...\n');
  
  const zeroShotPrompt = zeroShotEngine.generateDebatePrompt(
    topic,
    proficiency,
    retrievedChunks
  );
  
  console.log('Zero-Shot Prompt Metadata:');
  console.log(`- Task Type: ${zeroShotPrompt.metadata.taskType}`);
  console.log(`- Examples Count: 0 (by definition)`);
  console.log(`- Zero-Shot Features: ${zeroShotPrompt.metadata.zeroShotFeatures.join(', ')}`);
  console.log(`- Prompt Length: ${zeroShotPrompt.metadata.promptLength} characters`);
  
  console.log('\nZero-Shot Prompt Structure:');
  console.log('1. System message defining AI role');
  console.log('2. Task instructions with format requirements');
  console.log('3. No examples provided');
  console.log('4. Relies on AI\'s pre-trained knowledge');
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 2: Multi-Shot Prompting
  console.log('🟢 MULTI-SHOT PROMPTING (With Examples)');
  console.log('Generating debate prompt with multiple examples...\n');
  
  const multiShotPrompt = multiShotEngine.generateDebatePrompt(
    topic,
    proficiency,
    retrievedChunks
  );
  
  console.log('Multi-Shot Prompt Metadata:');
  console.log(`- Task Type: ${multiShotPrompt.metadata.taskType}`);
  console.log(`- Examples Count: ${multiShotPrompt.metadata.examplesCount}`);
  console.log(`- Multi-Shot Features: ${multiShotPrompt.metadata.multiShotFeatures.join(', ')}`);
  console.log(`- Prompt Length: ${multiShotPrompt.metadata.promptLength} characters`);
  
  console.log('\nMulti-Shot Prompt Structure:');
  console.log('1. System message defining AI role');
  console.log('2. Task instructions with format requirements');
  console.log('3. Multiple examples showing expected output');
  console.log('4. AI learns from examples for better responses');
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 3: Detailed Comparison
  console.log('📊 DETAILED COMPARISON');
  console.log('Analyzing the differences between approaches...\n');
  
  const comparison = {
    zeroShot: {
      approach: "Instruction-based learning",
      examples: "None",
      promptLength: zeroShotPrompt.metadata.promptLength,
      features: zeroShotPrompt.metadata.zeroShotFeatures,
      advantages: [
        "Faster prompt generation",
        "Smaller token usage",
        "Relies on AI's existing knowledge"
      ],
      disadvantages: [
        "Variable response quality",
        "Potential format inconsistencies",
        "Relies heavily on AI's pre-training"
      ]
    },
    multiShot: {
      approach: "Example-based learning",
      examples: multiShotPrompt.metadata.examplesCount,
      promptLength: multiShotPrompt.metadata.promptLength,
      features: multiShotPrompt.metadata.multiShotFeatures,
      advantages: [
        "Higher response quality",
        "Better format consistency",
        "Reduced ambiguity",
        "Faster learning curve for AI",
        "More predictable outputs"
      ],
      disadvantages: [
        "Longer prompts",
        "Higher token usage",
        "Requires curated examples"
      ]
    }
  };

  console.log('Zero-Shot Approach:');
  console.log(`- Learning Method: ${comparison.zeroShot.approach}`);
  console.log(`- Examples Provided: ${comparison.zeroShot.examples}`);
  console.log(`- Prompt Length: ${comparison.zeroShot.promptLength} characters`);
  console.log(`- Key Features: ${comparison.zeroShot.features.join(', ')}`);
  console.log(`- Advantages: ${comparison.zeroShot.advantages.join(', ')}`);
  console.log(`- Disadvantages: ${comparison.zeroShot.disadvantages.join(', ')}`);
  
  console.log('\nMulti-Shot Approach:');
  console.log(`- Learning Method: ${comparison.multiShot.approach}`);
  console.log(`- Examples Provided: ${comparison.multiShot.examples}`);
  console.log(`- Prompt Length: ${comparison.multiShot.promptLength} characters`);
  console.log(`- Key Features: ${comparison.multiShot.features.join(', ')}`);
  console.log(`- Advantages: ${comparison.multiShot.advantages.join(', ')}`);
  console.log(`- Disadvantages: ${comparison.multiShot.disadvantages.join(', ')}`);
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 4: Use Case Recommendations
  console.log('🎯 USE CASE RECOMMENDATIONS');
  console.log('When to use each approach:\n');
  
  console.log('🟢 Use Multi-Shot Prompting When:');
  console.log('- Complex output formats are required');
  console.log('- Consistency is critical');
  console.log('- Teaching complex concepts');
  console.log('- Quality standards must be high');
  console.log('- Format structure matters');
  console.log('- Reducing AI response variability');
  
  console.log('\n🔴 Use Zero-Shot Prompting When:');
  console.log('- Simple, straightforward tasks');
  console.log('- Token usage must be minimized');
  console.log('- Quick responses are needed');
  console.log('- AI has strong pre-trained knowledge');
  console.log('- Format is flexible');
  console.log('- Testing AI capabilities');
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Test 5: Quality Impact Analysis
  console.log('📈 QUALITY IMPACT ANALYSIS');
  console.log('How multi-shot prompting improves results:\n');
  
  const qualityMetrics = {
    formatConsistency: { zeroShot: "Good", multiShot: "Excellent" },
    responseQuality: { zeroShot: "Variable", multiShot: "High" },
    learningSpeed: { zeroShot: "Slow", multiShot: "Fast" },
    ambiguityReduction: { zeroShot: "Moderate", multiShot: "High" },
    errorPrevention: { zeroShot: "Basic", multiShot: "Advanced" }
  };
  
  console.log('Quality Metrics Comparison:');
  Object.entries(qualityMetrics).forEach(([metric, values]) => {
    console.log(`${metric}: Zero-Shot (${values.zeroShot}) vs Multi-Shot (${values.multiShot})`);
  });
  
  console.log('\n' + '='.repeat(80) + '\n');

  // Summary
  console.log('📋 SUMMARY & RECOMMENDATIONS');
  console.log('Key takeaways from the comparison:\n');
  
  console.log('✅ Multi-Shot Prompting Advantages:');
  console.log('1. Significantly better response quality and consistency');
  console.log('2. Faster learning curve for complex tasks');
  console.log('3. Reduced ambiguity and clearer expectations');
  console.log('4. Better format adherence and structure');
  console.log('5. More predictable and reliable outputs');
  
  console.log('\n⚠️ Zero-Shot Prompting Considerations:');
  console.log('1. Lower token usage and faster generation');
  console.log('2. Relies on AI\'s existing knowledge');
  console.log('3. May be sufficient for simple tasks');
  console.log('4. Less predictable output quality');
  
  console.log('\n🎯 For CivicsCoach Constitutional Law Education:');
  console.log('Multi-shot prompting is the clear winner because:');
  console.log('- Constitutional concepts require precise understanding');
  console.log('- Consistent format aids learning');
  console.log('- Quality and accuracy are paramount');
  console.log('- Examples help establish analytical patterns');
  console.log('- Students benefit from structured, consistent responses');
  
  console.log('\n🚀 Multi-shot prompting transforms AI constitutional law education!');
}

/**
 * Run the demo if this script is executed directly
 */
if (require.main === module) {
  demoPromptingComparison().catch(console.error);
}

module.exports = { demoPromptingComparison };
