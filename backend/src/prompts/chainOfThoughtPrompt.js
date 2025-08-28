
function buildChainMessages({ audience='intermediate', topic, retrievedChunks = [], minCitations = 2, proficiency='intermediate', examples = true }) {

    const system = `
  ROLE: You are CivicsCoach — an evidence-first debate coach for Indian Polity.
  TASK: Produce a JSON object with fields: stance, counterStance, citations[], quiz[].
  FORMAT: Return ONLY valid JSON (no extra commentary).
  CONSTRAINTS: You MAY use internal step-by-step reasoning to improve accuracy, BUT DO NOT reveal the chain-of-thought. Use the provided retrieved text chunks as source-of-truth. Provide at least ${minCitations} citations where possible.
  Stop token for internal scratchpad: </reasoning>
    `.trim();
  

    const exampleUser = `EXAMPLE_INPUT: "Are Money Bills defined by the Constitution or by the Speaker?"`;
    const exampleAssistant = `EXAMPLE_OUTPUT:
  {
    "stance":"Money bills are defined by Article 110 and interpreted by Parliament's Speaker...",
    "counterStance":"There have been controversies over acceptance by Parliament and role of Speaker...",
    "citations":[{"id":"Article110","source":"Constitution","snippet":"Article 110 defines money bills"}],
    "quiz":[{"q":"Which article defines Money Bills?","options":["Article 110","Article 112"],"answerIndex":0}],
    "rationale_1line":"Based on Article 110 and SC interpretations."
  }`;
  

    const chunkText = retrievedChunks.map((c,i)=> `${i+1}) [${c.id || 'chunk'+i}] ${c.text.slice(0,500)}`).join("\n\n");
  
    const user = `
  AUDIENCE: ${audience}
  TOPIC: ${topic}
  
  RETRIEVED_CHUNKS:
  ${chunkText}
  
  INSTRUCTIONS:
  - Produce JSON with keys: stance, counterStance, citations (array with metadata like {id,source,snippet}), quiz (1 item).
  - Keep stance & counterStance concise (max ~150 words each).
  - Use only the retrieved chunks as facts; if claims are not supported, mark citation as "unsourced": true.
  - Return ONLY JSON. Do not reveal the chain-of-thought. End with a newline.
    `.trim();
  
    const messages = [
      { role: "system", content: system }
    ];
  
    if (examples) {
      messages.push({ role: "user", content: exampleUser });
      messages.push({ role: "assistant", content: exampleAssistant });
    }
  
    messages.push({ role: "user", content: user });
  
    return messages;
  }
  
  module.exports = { buildChainMessages };
  