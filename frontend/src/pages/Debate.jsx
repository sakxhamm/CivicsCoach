import React, { useState } from 'react';
import DebateBox from '../components/DebateBox';
import '../styles.css';

const Debate = () => {
  const [query, setQuery] = useState('');
  const [proficiency, setProficiency] = useState('intermediate');
  const [topK, setTopK] = useState(4);
  const [useCoT, setUseCoT] = useState(true);
  const [useZeroShot, setUseZeroShot] = useState(false);
  const [taskType, setTaskType] = useState('debate');
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/debate/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          proficiency,
          topK: parseInt(topK),
          useCoT,
          useZeroShot,
          taskType,
          temperature: parseFloat(temperature),
          top_p: parseFloat(topP)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate debate');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="debate-page">
      <div className="container">
        <h1>🧠 CivicsCoach - AI Debate Generator</h1>
        <p className="subtitle">
          Generate evidence-based debates on Indian polity using Chain-of-Thought reasoning
        </p>

        <form onSubmit={handleSubmit} className="debate-form">
          <div className="form-group">
            <label htmlFor="query">Debate Topic / Question:</label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., What is the Basic Structure Doctrine and why is it important?"
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proficiency">Proficiency Level:</label>
              <select
                id="proficiency"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topK">Number of Citations (Top-K):</label>
              <input
                type="number"
                id="topK"
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="temperature">Temperature:</label>
              <input
                type="range"
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                min="0"
                max="2"
                step="0.1"
              />
              <span className="range-value">{temperature}</span>
            </div>

            <div className="form-group">
              <label htmlFor="topP">Top-P:</label>
              <input
                type="range"
                id="topP"
                value={topP}
                onChange={(e) => setTopP(e.target.value)}
                min="0"
                max="1"
                step="0.1"
              />
              <span className="range-value">{topP}</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useCoT}
                  onChange={(e) => setUseCoT(e.target.checked)}
                  disabled={useZeroShot}
                />
                <span className="checkmark"></span>
                Enable Chain-of-Thought Reasoning
              </label>
              <small className="help-text">
                CoT allows the AI to use internal step-by-step reasoning for better accuracy
              </small>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={useZeroShot}
                  onChange={(e) => setUseZeroShot(e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable Zero-Shot Prompting
              </label>
              <small className="help-text">
                Zero-shot prompting performs tasks without examples or training data
              </small>
            </div>
          </div>

          {useZeroShot && (
            <div className="form-group">
              <label htmlFor="taskType">Task Type:</label>
              <select
                id="taskType"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
              >
                <option value="debate">Debate Generation</option>
                <option value="analysis">Concept Analysis</option>
                <option value="comparison">Concept Comparison</option>
                <option value="explanation">Concept Explanation</option>
              </select>
              <small className="help-text">
                Select the type of task you want the AI to perform using zero-shot prompting
              </small>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? '🔄 Generating...' : '🚀 Generate Debate'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{error}</p>
            {error.includes('Rate limit') && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
                <strong>💡 Demo Mode Active:</strong> The API is currently rate limited, but you can still see how the system works. 
                Try queries like "What is the Basic Structure Doctrine?" or "How does the Indian Constitution define Money Bills?" 
                for demo responses.
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="result-section">
            <h2>📊 Generation Results</h2>
            <div className="metadata">
              <div className="metadata-item">
                <strong>Tokens Used:</strong> {result.metadata?.tokens?.total || 'N/A'}
              </div>
              <div className="metadata-item">
                <strong>Citations Retrieved:</strong> {result.metadata?.retrievedChunks || 0}
              </div>
              <div className="metadata-item">
                <strong>Prompting Strategy:</strong> {result.metadata?.promptingStrategy || 'N/A'}
              </div>
              {result.metadata?.promptingStrategy === 'zero-shot' && (
                <>
                  <div className="metadata-item">
                    <strong>Task Type:</strong> {result.metadata?.taskType || 'N/A'}
                  </div>
                  <div className="metadata-item">
                    <strong>Output Format:</strong> {result.metadata?.outputFormat || 'N/A'}
                  </div>
                </>
              )}
              {result.metadata?.promptingStrategy === 'chain-of-thought' && (
                <div className="metadata-item">
                  <strong>CoT Enabled:</strong> {result.metadata?.useCoT ? 'Yes' : 'No'}
                </div>
              )}
            </div>
            
            <DebateBox data={result.data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Debate;
