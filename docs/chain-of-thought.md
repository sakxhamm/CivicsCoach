# Chain of Thought (CoT) Prompting in CivicsCoach

## What is Chain of Thought Prompting?

Chain of Thought (CoT) prompting is a technique that encourages AI models to break down complex problems into intermediate reasoning steps before arriving at a final answer. Instead of jumping directly to conclusions, the model is instructed to think through the problem step-by-step, similar to how humans solve complex problems.

### Key Concepts

**Traditional Prompting:**
- Question: "What is the Basic Structure Doctrine?"
- AI Response: Direct answer without showing reasoning

**Chain of Thought Prompting:**
- Question: "What is the Basic Structure Doctrine?"
- AI Response: 
  1. First, let me understand what the Basic Structure Doctrine is...
  2. It was established in the Kesavananda Bharati case...
  3. The doctrine holds that certain fundamental features cannot be amended...
  4. Therefore, the Basic Structure Doctrine is...

## Why Use Safe Chain of Thought?

### Benefits
1. **Improved Accuracy**: Step-by-step reasoning reduces errors in complex constitutional questions
2. **Better Citations**: CoT helps the model identify relevant constitutional provisions more accurately
3. **Educational Value**: Users can understand the reasoning process behind answers
4. **Consistency**: More reliable responses across different queries

### Safe Implementation
In CivicsCoach, we use "Safe CoT" which means:
- The AI uses internal reasoning steps
- These steps are NOT revealed to the user
- Only the final, polished answer is shown
- Stop token `</reasoning>` prevents internal thoughts from appearing

## Implementation in CivicsCoach

### System Prompt Structure
```
ROLE: You are CivicsCoach — an evidence-first debate coach for Indian Polity.
TASK: Produce a JSON object with fields: stance, counterStance, citations[], quiz[].
FORMAT: Return ONLY valid JSON (no extra commentary).
CONSTRAINTS: You MAY use internal step-by-step reasoning to improve accuracy, 
BUT DO NOT reveal the chain-of-thought. Use the provided retrieved text chunks 
as source-of-truth. Provide at least 2 citations where possible.
Stop token for internal scratchpad: </reasoning>
```

### Key Features
1. **RTFC Framework**: Role, Task, Format, Constraints
2. **One-shot Example**: Shows expected input/output format
3. **Retrieved Chunks**: Uses relevant constitutional text as evidence
4. **Stop Token**: `</reasoning>` prevents internal thoughts from appearing
5. **Citation Requirements**: Minimum 2 citations per response

## Demo: CoT ON vs CoT OFF

### Example Query
"What is the Basic Structure Doctrine and why is it important?"

### CoT Enabled Response
- More accurate constitutional references
- Better understanding of case law
- Comprehensive citations from Kesavananda Bharati case
- Detailed quiz questions with proper constitutional context

### CoT Disabled Response
- Direct answers without reasoning
- May miss important constitutional nuances
- Less comprehensive citations
- Simpler quiz questions

## Technical Implementation

### Backend Configuration
```javascript
// In debateController.js
const messages = buildChainMessages({ 
  audience: proficiency, 
  topic: query, 
  retrievedChunks, 
  minCitations: 2, 
  proficiency, 
  examples: true 
});

if (!useCoT) {
  messages[0].content = messages[0].content.replace(
    'You MAY use internal step-by-step reasoning to improve accuracy, BUT DO NOT reveal the chain-of-thought.',
    'Do NOT use internal step-by-step reasoning. Answer directly.'
  );
}
```

### Frontend Toggle
```javascript
// In Debate.jsx
const [useCoT, setUseCoT] = useState(true);

// Checkbox for user control
<input
  type="checkbox"
  checked={useCoT}
  onChange={(e) => setUseCoT(e.target.checked)}
/>
Enable Chain-of-Thought Reasoning
```

## Evaluation Metrics

### Token Usage Comparison
- **CoT Enabled**: Higher token usage due to internal reasoning
- **CoT Disabled**: Lower token usage, direct responses
- **Quality vs Cost**: Balance between accuracy and efficiency

### Citation Quality
- **CoT Enabled**: More accurate constitutional references
- **CoT Disabled**: May miss relevant constitutional provisions

### Quiz Question Quality
- **CoT Enabled**: More nuanced, constitutional context-aware questions
- **CoT Disabled**: Basic factual questions

## Best Practices

1. **Always provide retrieved chunks**: Ensures evidence-based responses
2. **Use stop tokens**: Prevents internal reasoning from appearing
3. **Validate JSON output**: Ensure structured responses
4. **Compare CoT vs No-CoT**: Evaluate quality differences
5. **Monitor token usage**: Balance accuracy with cost

## Future Enhancements

1. **Adaptive CoT**: Automatically enable/disable based on query complexity
2. **Multi-step reasoning**: More sophisticated reasoning chains
3. **Citation verification**: Cross-reference citations with constitutional text
4. **User feedback**: Learn from user preferences for CoT usage

## Conclusion

Safe Chain of Thought prompting significantly improves the quality of constitutional debate generation in CivicsCoach. By allowing the AI to use internal reasoning while keeping the final output clean and structured, we achieve better accuracy, more comprehensive citations, and more educational quiz questions.

The implementation balances the benefits of step-by-step reasoning with the need for clean, user-friendly output, making it an effective tool for constitutional education and debate generation.
