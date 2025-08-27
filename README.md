CivicsCoach: Debate & Fact-Check Studio 🇮🇳

Interactive Debate Coach & Fact-Checker for Indian Polity (UPSC / UGC-NET / Civics learners)

CivicsCoach is a GenAI-powered project that helps learners debate, fact-check, and understand Indian Polity better. It combines LLM prompting techniques, embeddings, similarity search, and structured outputs to generate arguments, counter-arguments, and verified facts from constitutional articles, case law, and standard references.

Features

Embeddings + Vector DB

Embeds Constitution articles, SC judgments summaries, and Polity notes.

Stores in a vector database for retrieval.

Similarity Search Trio

Cosine, Dot Product, and L2 Distance implemented.

UI toggle to compare retrieval quality.

Adjustable Top-K slider for context size.

Dynamic Debate Coaching

Input: Any polity question or statement.

Output: stance + counter-stance + citations.

Adjusts depth & style (Beginner ↔ Advanced) with dynamic prompting.

Function Calling

get_article(article_no) → fetch Constitution article.

fetch_case_law(case_id) → retrieve case summary.

make_quiz(topic) → auto-generate practice quiz.

Structured Output (JSON)

{
  "stance": "...",
  "counterStance": "...",
  "citations": ["Article 110", "Kihoto Hollohan vs Zachillhu"],
  "quiz": [
    {"q": "What is Article 110 about?", "a": "Money Bills"}
  ]
}


Prompting Techniques Used

Zero-shot prompting: “Explain Article 110 with examples.”

One-shot prompting: Example of a good debate answer.

Multi-shot prompting: Multiple annotated examples.

Chain-of-thought prompting (safe): Internal reasoning, only bullet-point outputs.

Dynamic prompting: Adapts based on user level, exam type, or time limit.

System/User prompts (RTFC framework): Role, Task, Format, Constraints.

LLM Parameters

Temperature / Top-P / Top-K sliders in UI.

Token usage logging after each AI call.

Evaluation Pipeline

Dataset of ≥5 test prompts (e.g., “Money Bill test”).

Judge prompt compares LLM answers against expected points + citations.

Automated testing framework runs all test cases.

Stop Sequences

Stop at </reasoning> to hide scratchpad reasoning.

Tech Stack

Backend: Node.js + Express

Frontend: React + TailwindCSS + Framer Motion

Database: PostgreSQL / MySQL (metadata), Vector DB (Pinecone / Weaviate / FAISS)

LLM Integration: OpenAI API (GPT models)

Embeddings: text-embedding-ada-002 (or equivalent open-source model)

Future Scope

Multilingual support (Hindi + English).

Advanced UI with real-time debate scoring.

Add speech-to-text input for live debates.

Plug-in architecture for other subjects (History, Economics).

Video Submission Guidelines

When recording video demo, explain:

What is cosine similarity, dot product, L2 distance and how they affect retrieval.

How embeddings are generated & stored in vector DB.

How prompting strategies (zero/one/multi/dynamic/CoT) improve answer quality.

Show live toggling of similarity metrics + temperature/top-p sliders.

Show token usage logs and evaluation pipeline.

Contribution

Fork repo, create feature branch, commit, and PR.

Run evaluation pipeline before submitting.

License

MIT License © 2025 CivicsCoach
