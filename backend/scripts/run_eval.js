const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

// Test prompts for evaluation
const testPrompts = [
  "What is the Basic Structure Doctrine and why is it important?",
  "How does the Indian Constitution define Money Bills?",
  "What are the emergency powers of the President under Article 352?",
  "Explain the concept of Judicial Review in the Indian Constitution.",
  "How does federalism work in India's constitutional framework?"
];

// Judge prompt for evaluation
const judgePrompt = `
You are evaluating debate responses for accuracy, completeness, and citation quality.
Rate each response on a scale of 1-5 for:
1. Accuracy of constitutional facts
2. Completeness of stance and counter-stance
3. Quality and relevance of citations
4. Educational value of the quiz question

Provide a brief justification for your rating.
`;

async function runEvaluation() {
  console.log('🧪 Starting CivicsCoach Evaluation...\n');
  console.log('='.repeat(60));

  const results = [];

  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    console.log(`\n📝 Test ${i + 1}: ${prompt}`);
    console.log('-'.repeat(40));

    try {
      // Test with CoT enabled
      console.log('🔄 Testing with Chain-of-Thought (CoT) enabled...');
      const cotResponse = await axios.post(`${API_BASE_URL}/api/debate/generate`, {
        query: prompt,
        useCoT: true,
        topK: 3,
        proficiency: 'intermediate',
        temperature: 0.2
      });

      console.log('✅ CoT Response received');
      console.log(`📊 Tokens used: ${JSON.stringify(cotResponse.data.metadata?.tokens || 'N/A')}`);
      console.log(`📚 Citations: ${cotResponse.data.data.citations.length}`);

      // Test with CoT disabled
      console.log('\n🔄 Testing with Chain-of-Thought (CoT) disabled...');
      const noCotResponse = await axios.post(`${API_BASE_URL}/api/debate/generate`, {
        query: prompt,
        useCoT: false,
        topK: 3,
        proficiency: 'intermediate',
        temperature: 0.2
      });

      console.log('✅ No-CoT Response received');
      console.log(`📊 Tokens used: ${JSON.stringify(noCotResponse.data.metadata?.tokens || 'N/A')}`);
      console.log(`📚 Citations: ${noCotResponse.data.data.citations.length}`);

      // Compare results
      const cotTokens = cotResponse.data.metadata?.tokens?.total || 0;
      const noCotTokens = noCotResponse.data.metadata?.tokens?.total || 0;
      const tokenDiff = cotTokens - noCotTokens;

      console.log(`\n📈 Comparison:`);
      console.log(`   CoT Tokens: ${cotTokens}`);
      console.log(`   No-CoT Tokens: ${noCotTokens}`);
      console.log(`   Difference: ${tokenDiff > 0 ? '+' : ''}${tokenDiff}`);

      results.push({
        prompt,
        cotResponse: cotResponse.data,
        noCotResponse: noCotResponse.data,
        tokenDiff
      });

      // Wait between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Error testing prompt ${i + 1}:`, error.response?.data || error.message);
      results.push({
        prompt,
        error: error.message
      });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 EVALUATION SUMMARY');
  console.log('='.repeat(60));

  const successfulTests = results.filter(r => !r.error);
  const totalTokens = successfulTests.reduce((sum, r) => sum + (r.cotResponse?.metadata?.tokens?.total || 0), 0);
  const avgTokens = successfulTests.length > 0 ? Math.round(totalTokens / successfulTests.length) : 0;

  console.log(`✅ Successful tests: ${successfulTests.length}/${testPrompts.length}`);
  console.log(`📊 Average tokens per response: ${avgTokens}`);
  console.log(`🔄 Total API calls made: ${successfulTests.length * 2}`);

  console.log('\n📝 Judge Prompt for Manual Evaluation:');
  console.log(judgePrompt);

  console.log('\n🎯 Next Steps:');
  console.log('1. Manually review the generated responses');
  console.log('2. Compare CoT vs No-CoT quality');
  console.log('3. Check citation accuracy against corpus');
  console.log('4. Evaluate quiz question relevance');

  return results;
}

// Run evaluation if called directly
if (require.main === module) {
  runEvaluation()
    .then(() => {
      console.log('\n✅ Evaluation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Evaluation failed:', error);
      process.exit(1);
    });
}

module.exports = { runEvaluation, testPrompts, judgePrompt };
