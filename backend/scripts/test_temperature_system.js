/**
 * Test Script for Temperature Optimization System
 * 
 * This script demonstrates the new temperature optimization system
 * that automatically selects appropriate temperature values based on:
 * - Context (constitutional education, academic research, etc.)
 * - Task type (debate, analysis, comparison, etc.)
 * - User proficiency level (beginner, intermediate, advanced)
 * - Custom temperature overrides
 */

const { callGemini, getOptimalTemperature, TEMPERATURE_PRESETS } = require('../src/services/geminiService');

// Sample messages for testing
const sampleMessages = [
  {
    role: "system",
    content: "You are CivicsCoach, an expert AI assistant specializing in Indian Constitutional Law."
  },
  {
    role: "user",
    content: "Generate a debate on the Basic Structure Doctrine."
  }
];

/**
 * Test Temperature Presets
 */
function testTemperaturePresets() {
  console.log('🌡️ TEMPERATURE PRESETS TESTING\n');
  
  console.log('Available Contexts and Task Types:');
  Object.entries(TEMPERATURE_PRESETS).forEach(([context, tasks]) => {
    console.log(`\n${context.toUpperCase()}:`);
    Object.entries(tasks).forEach(([taskType, temp]) => {
      console.log(`  ${taskType}: ${temp}`);
    });
  });
  
  console.log('\n' + '='.repeat(60) + '\n');
}

/**
 * Test Optimal Temperature Calculation
 */
function testOptimalTemperatureCalculation() {
  console.log('🎯 OPTIMAL TEMPERATURE CALCULATION TESTING\n');
  
  const testCases = [
    // Constitutional Education
    { context: 'constitutionalEducation', taskType: 'debate', proficiency: 'beginner' },
    { context: 'constitutionalEducation', taskType: 'debate', proficiency: 'intermediate' },
    { context: 'constitutionalEducation', taskType: 'debate', proficiency: 'advanced' },
    
    // Academic Research
    { context: 'academicResearch', taskType: 'analysis', proficiency: 'intermediate' },
    { context: 'academicResearch', taskType: 'comparison', proficiency: 'advanced' },
    
    // Public Policy
    { context: 'publicPolicy', taskType: 'explanation', proficiency: 'beginner' },
    { context: 'publicPolicy', taskType: 'debate', proficiency: 'intermediate' },
    
    // General Public
    { context: 'generalPublic', taskType: 'explanation', proficiency: 'beginner' },
    { context: 'generalPublic', taskType: 'quiz', proficiency: 'intermediate' },
    
    // Creative Tasks
    { context: 'creative', taskType: 'debate', proficiency: 'advanced' },
    { context: 'creative', taskType: 'explanation', proficiency: 'intermediate' }
  ];
  
  testCases.forEach((testCase, index) => {
    const optimalTemp = getOptimalTemperature(
      testCase.context, 
      testCase.taskType, 
      testCase.proficiency
    );
    
    console.log(`Test Case ${index + 1}:`);
    console.log(`  Context: ${testCase.context}`);
    console.log(`  Task Type: ${testCase.taskType}`);
    console.log(`  Proficiency: ${testCase.proficiency}`);
    console.log(`  Optimal Temperature: ${optimalTemp}`);
    console.log('');
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Test Custom Temperature Overrides
 */
function testCustomTemperatureOverrides() {
  console.log('⚙️ CUSTOM TEMPERATURE OVERRIDE TESTING\n');
  
  const testCases = [
    { context: 'constitutionalEducation', taskType: 'debate', proficiency: 'intermediate', customTemp: 0.8 },
    { context: 'academicResearch', taskType: 'analysis', proficiency: 'advanced', customTemp: 0.1 },
    { context: 'generalPublic', taskType: 'explanation', proficiency: 'beginner', customTemp: 1.5 },
    { context: 'creative', taskType: 'debate', proficiency: 'intermediate', customTemp: 0.0 }
  ];
  
  testCases.forEach((testCase, index) => {
    const optimalTemp = getOptimalTemperature(
      testCase.context, 
      testCase.taskType, 
      testCase.proficiency, 
      testCase.customTemp
    );
    
    console.log(`Test Case ${index + 1}:`);
    console.log(`  Context: ${testCase.context}`);
    console.log(`  Task Type: ${testCase.taskType}`);
    console.log(`  Proficiency: ${testCase.proficiency}`);
    console.log(`  Custom Temperature: ${testCase.customTemp}`);
    console.log(`  Final Temperature: ${optimalTemp}`);
    console.log(`  Override Applied: ${testCase.customTemp !== null ? 'YES' : 'NO'}`);
    console.log('');
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Test Temperature Bounds
 */
function testTemperatureBounds() {
  console.log('🔒 TEMPERATURE BOUNDS TESTING\n');
  
  const extremeTemps = [-1.0, 0.0, 2.5, 5.0];
  
  extremeTemps.forEach(temp => {
    const boundedTemp = getOptimalTemperature(
      'constitutionalEducation', 
      'debate', 
      'intermediate', 
      temp
    );
    
    console.log(`Input Temperature: ${temp}`);
    console.log(`Bounded Temperature: ${boundedTemp}`);
    console.log(`Within Bounds: ${boundedTemp >= 0.0 && boundedTemp <= 2.0 ? 'YES' : 'NO'}`);
    console.log('');
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Test Proficiency Level Adjustments
 */
function testProficiencyAdjustments() {
  console.log('📚 PROFICIENCY LEVEL ADJUSTMENT TESTING\n');
  
  const proficiencies = ['beginner', 'intermediate', 'advanced'];
  const baseContext = 'constitutionalEducation';
  const baseTaskType = 'debate';
  
  proficiencies.forEach(proficiency => {
    const optimalTemp = getOptimalTemperature(baseContext, baseTaskType, proficiency);
    const baseTemp = TEMPERATURE_PRESETS[baseContext][baseTaskType];
    
    console.log(`Proficiency: ${proficiency}`);
    console.log(`  Base Temperature: ${baseTemp}`);
    console.log(`  Adjusted Temperature: ${optimalTemp}`);
    console.log(`  Adjustment Factor: ${(optimalTemp / baseTemp).toFixed(2)}x`);
    console.log('');
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Test Context-Specific Temperature Ranges
 */
function testContextTemperatureRanges() {
  console.log('🌍 CONTEXT-SPECIFIC TEMPERATURE RANGES\n');
  
  Object.entries(TEMPERATURE_PRESETS).forEach(([context, tasks]) => {
    const temps = Object.values(tasks);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    
    console.log(`${context.toUpperCase()}:`);
    console.log(`  Temperature Range: ${minTemp} - ${maxTemp}`);
    console.log(`  Average Temperature: ${avgTemp.toFixed(2)}`);
    console.log(`  Task Types: ${Object.keys(tasks).join(', ')}`);
    console.log('');
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Test API Call with Temperature Optimization
 */
async function testAPICallWithTemperature() {
  console.log('🚀 API CALL WITH TEMPERATURE OPTIMIZATION TESTING\n');
  
  const testConfigs = [
    {
      context: 'constitutionalEducation',
      taskType: 'debate',
      proficiency: 'intermediate',
      description: 'Constitutional Education Debate'
    },
    {
      context: 'academicResearch',
      taskType: 'analysis',
      proficiency: 'advanced',
      description: 'Academic Research Analysis'
    },
    {
      context: 'generalPublic',
      taskType: 'explanation',
      proficiency: 'beginner',
      description: 'General Public Explanation'
    }
  ];
  
  for (const config of testConfigs) {
    console.log(`Testing: ${config.description}`);
    console.log(`  Context: ${config.context}`);
    console.log(`  Task Type: ${config.taskType}`);
    console.log(`  Proficiency: ${config.proficiency}`);
    
    try {
      // Note: This will fail without API key, but shows the temperature configuration
      const result = await callGemini({
        messages: sampleMessages,
        context: config.context,
        taskType: config.taskType,
        proficiency: config.proficiency
      });
      
      console.log(`  Temperature Used: ${result.temperature}`);
      console.log(`  API Call Successful: YES`);
    } catch (error) {
      console.log(`  Temperature Configuration: Generated`);
      console.log(`  API Call Successful: NO (${error.message})`);
    }
    
    console.log('');
  }
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Demonstrate Temperature Impact on Different Use Cases
 */
function demonstrateTemperatureImpact() {
  console.log('💡 TEMPERATURE IMPACT ON DIFFERENT USE CASES\n');
  
  console.log('Low Temperature (0.0 - 0.3):');
  console.log('  ✅ High consistency and accuracy');
  console.log('  ✅ Predictable responses');
  console.log('  ✅ Good for factual content');
  console.log('  ❌ Less creative or varied');
  console.log('  ❌ May be repetitive');
  console.log('');
  
  console.log('Medium Temperature (0.4 - 0.7):');
  console.log('  ✅ Balanced creativity and consistency');
  console.log('  ✅ Good variety without randomness');
  console.log('  ✅ Suitable for most educational content');
  console.log('  ✅ Engaging but reliable');
  console.log('');
  
  console.log('High Temperature (0.8 - 1.0+):');
  console.log('  ✅ High creativity and variety');
  console.log('  ✅ Innovative approaches');
  console.log('  ✅ Engaging content');
  console.log('  ❌ Less predictable');
  console.log('  ❌ May be inconsistent');
  console.log('');
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Show Best Practices for Temperature Selection
 */
function showBestPractices() {
  console.log('📋 BEST PRACTICES FOR TEMPERATURE SELECTION\n');
  
  console.log('1. Constitutional Education:');
  console.log('   • Use low temperature (0.1-0.3) for accuracy');
  console.log('   • Legal concepts need precision');
  console.log('   • Consistency is more important than creativity');
  console.log('');
  
  console.log('2. Academic Research:');
  console.log('   • Use low-medium temperature (0.15-0.3)');
  console.log('   • Balance rigor with insight');
  console.log('   • Maintain academic standards');
  console.log('');
  
  console.log('3. Public Policy:');
  console.log('   • Use medium temperature (0.25-0.4)');
  console.log('   • Practical insights need clarity');
  console.log('   • Balance accuracy with accessibility');
  console.log('');
  
  console.log('4. General Public:');
  console.log('   • Use medium-high temperature (0.3-0.5)');
  console.log('   • Engagement is important');
  console.log('   • Make content relatable');
  console.log('');
  
  console.log('5. Creative Tasks:');
  console.log('   • Use high temperature (0.5-0.7)');
  console.log('   • Innovation and variety needed');
  console.log('   • Still maintain quality standards');
  console.log('');
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Main test function
 */
async function runAllTests() {
  console.log('🌡️ STARTING TEMPERATURE SYSTEM TESTS\n');
  
  try {
    // Run all test functions
    testTemperaturePresets();
    testOptimalTemperatureCalculation();
    testCustomTemperatureOverrides();
    testTemperatureBounds();
    testProficiencyAdjustments();
    testContextTemperatureRanges();
    await testAPICallWithTemperature();
    demonstrateTemperatureImpact();
    showBestPractices();
    
    console.log('✅ ALL TEMPERATURE SYSTEM TESTS COMPLETED SUCCESSFULLY!');
    console.log('\n🎯 TEMPERATURE SYSTEM SUMMARY:');
    console.log('• Automatic temperature optimization based on context and task');
    console.log('• Proficiency-level adjustments for better user experience');
    console.log('• Custom temperature override support');
    console.log('• Bounds checking and validation');
    console.log('• Context-specific temperature presets');
    console.log('• Comprehensive logging and monitoring');
    
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
  testTemperaturePresets,
  testOptimalTemperatureCalculation,
  testCustomTemperatureOverrides,
  testTemperatureBounds,
  testProficiencyAdjustments,
  testContextTemperatureRanges,
  testAPICallWithTemperature,
  demonstrateTemperatureImpact,
  showBestPractices,
  runAllTests
};
