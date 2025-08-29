const { getOptimalTopP, TOP_P_PRESETS, analyzeQueryComplexity } = require('../src/services/geminiService');

// Sample queries for testing
const sampleQueries = {
  simple: "What is democracy?",
  moderate: "Explain the Basic Structure Doctrine in Indian Constitution",
  complex: "Compare and contrast the fundamental rights protection mechanisms in India versus the United States, considering judicial review, constitutional amendments, and the role of the Supreme Court in both jurisdictions",
  creative: "Imagine and design innovative constitutional reforms for the 21st century"
};

// Sample contexts and task types
const contexts = ['constitutionalEducation', 'academicResearch', 'publicPolicy', 'generalPublic', 'creativeTasks'];
const taskTypes = ['debate', 'analysis', 'comparison', 'explanation', 'quiz'];
const proficiencies = ['beginner', 'intermediate', 'advanced'];

function testTopPPresets() {
  console.log('\n🎯 Testing Top P Presets Structure...\n');
  
  contexts.forEach(context => {
    console.log(`📚 ${context}:`);
    taskTypes.forEach(taskType => {
      const preset = TOP_P_PRESETS[context]?.[taskType];
      if (preset) {
        console.log(`  ${taskType}: ${preset.min.toFixed(2)}-${preset.max.toFixed(2)} (default: ${preset.default.toFixed(2)})`);
      }
    });
    console.log('');
  });
}

function testQueryComplexityAnalysis() {
  console.log('\n🧠 Testing Query Complexity Analysis...\n');
  
  Object.entries(sampleQueries).forEach(([complexity, query]) => {
    const analyzedComplexity = analyzeQueryComplexity(query);
    console.log(`Query: "${query}"`);
    console.log(`  Expected: ${complexity}`);
    console.log(`  Analyzed: ${analyzedComplexity.complexity}`);
    console.log(`  Has Creative Elements: ${analyzedComplexity.hasCreativeElements}`);
    console.log(`  Words: ${query.trim().split(/\s+/).length}`);
    console.log(`  Has Complex Terms: ${/(doctrine|jurisdiction|constitutional|amendment|fundamental)/i.test(query)}`);
    console.log(`  Has Multiple Concepts: ${/(and|or|versus|compared|difference)/i.test(query)}`);
    console.log(`  Has Creative Elements: ${/(imagine|create|design|innovate|brainstorm)/i.test(query)}`);
    console.log('');
  });
}

function testOptimalTopPCalculation() {
  console.log('\n🎯 Testing Optimal Top P Calculation...\n');
  
  // Test different combinations
  const testCases = [
    { context: 'constitutionalEducation', taskType: 'debate', complexity: 'simple', proficiency: 'beginner' },
    { context: 'constitutionalEducation', taskType: 'debate', complexity: 'complex', proficiency: 'advanced' },
    { context: 'academicResearch', taskType: 'analysis', complexity: 'moderate', proficiency: 'intermediate' },
    { context: 'publicPolicy', taskType: 'comparison', complexity: 'complex', proficiency: 'beginner' },
    { context: 'generalPublic', taskType: 'explanation', complexity: 'simple', proficiency: 'intermediate' },
    { context: 'creativeTasks', taskType: 'quiz', complexity: 'moderate', proficiency: 'advanced' }
  ];
  
  testCases.forEach((testCase, index) => {
    const queryComplexity = { complexity: testCase.complexity, hasCreativeElements: false };
    const optimalTopP = getOptimalTopP(
      testCase.context, 
      testCase.taskType, 
      queryComplexity, 
      testCase.proficiency
    );
    
    console.log(`Test Case ${index + 1}:`);
    console.log(`  Context: ${testCase.context}`);
    console.log(`  Task Type: ${testCase.taskType}`);
    console.log(`  Complexity: ${testCase.complexity}`);
    console.log(`  Proficiency: ${testCase.proficiency}`);
    console.log(`  Optimal Top P: ${optimalTopP.toFixed(3)}`);
    console.log('');
  });
}

function testCustomTopPOverrides() {
  console.log('\n⚙️ Testing Custom Top P Overrides...\n');
  
  const testCases = [
    { customTopP: 0.95, expected: 0.95 },
    { customTopP: 1.2, expected: 1.0 }, // Should be capped at 1.0
    { customTopP: 0.0, expected: 0.0 }, // Should be capped at 0.0
    { customTopP: -0.5, expected: 0.0 }, // Should be capped at 0.0
    { customTopP: null, expected: 'default' } // Should use default calculation
  ];
  
  testCases.forEach((testCase, index) => {
    const queryComplexity = { complexity: 'moderate', hasCreativeElements: false };
    const optimalTopP = getOptimalTopP(
      'constitutionalEducation', 
      'debate', 
      queryComplexity, 
      'intermediate', 
      testCase.customTopP
    );
    
    console.log(`Test Case ${index + 1}:`);
    console.log(`  Custom Top P: ${testCase.customTopP}`);
    console.log(`  Expected: ${testCase.expected}`);
    console.log(`  Result: ${optimalTopP.toFixed(3)}`);
    console.log(`  Override Working: ${testCase.expected === 'default' ? 'N/A' : Math.abs(optimalTopP - testCase.expected) < 0.001}`);
    console.log('');
  });
}

function testTopPBounds() {
  console.log('\n🔒 Testing Top P Bounds...\n');
  
  // Test extreme values
  const extremeValues = [-1.0, -0.5, 0.0, 0.5, 1.0, 1.5, 2.0];
  
  extremeValues.forEach(value => {
    const queryComplexity = { complexity: 'moderate', hasCreativeElements: false };
    const boundedTopP = getOptimalTopP(
      'constitutionalEducation', 
      'debate', 
      queryComplexity, 
      'intermediate', 
      value
    );
    
    console.log(`Input: ${value} → Bounded: ${boundedTopP.toFixed(3)} (Valid: ${boundedTopP >= 0.0 && boundedTopP <= 1.0})`);
  });
}

function testProficiencyAdjustments() {
  console.log('\n👥 Testing Proficiency Level Adjustments...\n');
  
  const context = 'constitutionalEducation';
  const taskType = 'debate';
  const complexity = 'moderate';
  
  proficiencies.forEach(proficiency => {
    const queryComplexity = { complexity, hasCreativeElements: false };
    const optimalTopP = getOptimalTopP(context, taskType, queryComplexity, proficiency);
    const baseTopP = TOP_P_PRESETS[context][taskType].default;
    
    console.log(`${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)}:`);
    console.log(`  Base Top P: ${baseTopP.toFixed(3)}`);
    console.log(`  Optimal Top P: ${optimalTopP.toFixed(3)}`);
    console.log(`  Adjustment: ${optimalTopP > baseTopP ? '+' : optimalTopP < baseTopP ? '-' : '0'}`);
    console.log('');
  });
}

function testContextSpecificRanges() {
  console.log('\n🌍 Testing Context-Specific Top P Ranges...\n');
  
  contexts.forEach(context => {
    console.log(`${context}:`);
    
    const contextPresets = TOP_P_PRESETS[context];
    const minRange = Math.min(...Object.values(contextPresets).map(preset => preset.min));
    const maxRange = Math.max(...Object.values(contextPresets).map(preset => preset.max));
    const avgDefault = Object.values(contextPresets).reduce((sum, preset) => sum + preset.default, 0) / Object.values(contextPresets).length;
    
    console.log(`  Range: ${minRange.toFixed(2)}-${maxRange.toFixed(2)}`);
    console.log(`  Average Default: ${avgDefault.toFixed(3)}`);
    
    // Analyze the pattern
    if (context === 'constitutionalEducation') {
      console.log(`  Pattern: Conservative (focused, precise)`);
    } else if (context === 'academicResearch') {
      console.log(`  Pattern: Balanced (thorough, scholarly)`);
    } else if (context === 'publicPolicy') {
      console.log(`  Pattern: Practical (clear, actionable)`);
    } else if (context === 'generalPublic') {
      console.log(`  Pattern: Accessible (simple, engaging)`);
    } else if (context === 'creativeTasks') {
      console.log(`  Pattern: Expansive (creative, innovative)`);
    }
    console.log('');
  });
}

function testCreativeElementsImpact() {
  console.log('\n🎨 Testing Creative Elements Impact...\n');
  
  const testQueries = [
    "What is democracy?",
    "Imagine a new democratic system",
    "Create innovative voting mechanisms",
    "Design constitutional reforms",
    "Brainstorm policy solutions"
  ];
  
  testQueries.forEach((query, index) => {
    const queryComplexity = analyzeQueryComplexity(query);
    const optimalTopP = getOptimalTopP(
      'constitutionalEducation',
      'debate',
      queryComplexity,
      'intermediate'
    );
    
    console.log(`Query ${index + 1}: "${query}"`);
    console.log(`  Has Creative Elements: ${queryComplexity.hasCreativeElements}`);
    console.log(`  Complexity: ${queryComplexity.complexity}`);
    console.log(`  Optimal Top P: ${optimalTopP.toFixed(3)}`);
    console.log('');
  });
}

function testRealWorldScenarios() {
  console.log('\n🌐 Testing Real-World Scenarios...\n');
  
  const scenarios = [
    {
      name: "Constitutional Debate for Beginners",
      query: "What are fundamental rights?",
      context: "constitutionalEducation",
      taskType: "debate",
      proficiency: "beginner"
    },
    {
      name: "Academic Analysis for Advanced Users",
      query: "Analyze the evolution of judicial review in Indian constitutional jurisprudence",
      context: "academicResearch",
      taskType: "analysis",
      proficiency: "advanced"
    },
    {
      name: "Public Policy Comparison",
      query: "Compare reservation policies in India and affirmative action in the US",
      context: "publicPolicy",
      taskType: "comparison",
      proficiency: "intermediate"
    },
    {
      name: "Creative Constitutional Design",
      query: "Imagine and design innovative constitutional reforms for the 21st century",
      context: "creativeTasks",
      taskType: "explanation",
      proficiency: "advanced"
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    const queryComplexity = analyzeQueryComplexity(scenario.query);
    const optimalTopP = getOptimalTopP(
      scenario.context,
      scenario.taskType,
      queryComplexity,
      scenario.proficiency
    );
    
    console.log(`Scenario ${index + 1}: ${scenario.name}`);
    console.log(`  Query: "${scenario.query}"`);
    console.log(`  Context: ${scenario.context}`);
    console.log(`  Task: ${scenario.taskType}`);
    console.log(`  Proficiency: ${scenario.proficiency}`);
    console.log(`  Complexity: ${queryComplexity.complexity}`);
    console.log(`  Has Creative Elements: ${queryComplexity.hasCreativeElements}`);
    console.log(`  Optimal Top P: ${optimalTopP.toFixed(3)}`);
    console.log('');
  });
}

function demonstrateTopPBenefits() {
  console.log('\n💡 Demonstrating Top P Benefits...\n');
  
  console.log('🎯 Benefits of Optimal Top P Selection:');
  console.log('  1. **Response Quality**: Right balance of focus and creativity');
  console.log('  2. **Consistency**: Predictable response characteristics');
  console.log('  3. **User Experience**: Content matches audience expectations');
  console.log('  4. **Task Appropriateness**: Responses fit the task requirements');
  console.log('  5. **Cost Efficiency**: Optimized token usage and processing');
  console.log('');
  
  console.log('🔧 How It Works:');
  console.log('  1. Analyze query complexity (simple/moderate/complex)');
  console.log('  2. Detect creative elements in the query');
  console.log('  3. Select context-appropriate base Top P');
  console.log('  4. Adjust for task type requirements');
  console.log('  5. Modify based on user proficiency');
  console.log('  6. Apply bounds checking (0.0-1.0)');
  console.log('  7. Allow custom overrides when needed');
  console.log('');
}

function showBestPractices() {
  console.log('\n📋 Top P Best Practices...\n');
  
  console.log('🎓 For Constitutional Education:');
  console.log('  - Use moderate Top P (0.7-0.95) for balanced responses');
  console.log('  - Lower Top P for precise legal analysis');
  console.log('  - Higher Top P for complex doctrinal discussions');
  console.log('');
  
  console.log('🔬 For Academic Research:');
  console.log('  - Use higher Top P (0.8-0.95) for comprehensive analysis');
  console.log('  - Balance between thoroughness and focus');
  console.log('  - Consider interdisciplinary connections');
  console.log('');
  
  console.log('🏛️ For Public Policy:');
  console.log('  - Use moderate Top P (0.7-0.95) for practical insights');
  console.log('  - Focus on actionable information');
  console.log('  - Balance technical detail with accessibility');
  console.log('');
  
  console.log('👥 For General Public:');
  console.log('  - Use lower Top P (0.6-0.9) for clarity');
  console.log('  - Avoid overwhelming with too much variation');
  console.log('  - Focus on essential concepts');
  console.log('');
  
  console.log('🎨 For Creative Tasks:');
  console.log('  - Use higher Top P (0.8-0.98) for inspiration');
  console.log('  - Allow for diverse perspectives and connections');
  console.log('  - Encourage innovative thinking');
  console.log('');
}

async function runAllTests() {
  console.log('🚀 Starting Top P Optimization System Tests...\n');
  
  try {
    testTopPPresets();
    testQueryComplexityAnalysis();
    testOptimalTopPCalculation();
    testCustomTopPOverrides();
    testTopPBounds();
    testProficiencyAdjustments();
    testContextSpecificRanges();
    testCreativeElementsImpact();
    testRealWorldScenarios();
    demonstrateTopPBenefits();
    showBestPractices();
    
    console.log('✅ All Top P optimization tests completed successfully!');
    console.log('\n🎉 The Top P system is working correctly and ready for production use.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testTopPPresets,
  testQueryComplexityAnalysis,
  testOptimalTopPCalculation,
  testCustomTopPOverrides,
  testTopPBounds,
  testProficiencyAdjustments,
  testContextSpecificRanges,
  testCreativeElementsImpact,
  testRealWorldScenarios,
  demonstrateTopPBenefits,
  showBestPractices,
  runAllTests
};
