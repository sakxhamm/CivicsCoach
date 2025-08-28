// frontend/src/components/DebateBox.jsx
import React, { useState } from 'react';

const DebateBox = ({ data }) => {
  const [activeTab, setActiveTab] = useState('stance');

  if (!data) return null;

  const { stance, counterStance, citations, quiz } = data;

  return (
    <div className="debate-box">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'stance' ? 'active' : ''}`}
          onClick={() => setActiveTab('stance')}
        >
          📝 Stance
        </button>
        <button
          className={`tab ${activeTab === 'counter' ? 'active' : ''}`}
          onClick={() => setActiveTab('counter')}
        >
          🔄 Counter-Stance
        </button>
        <button
          className={`tab ${activeTab === 'citations' ? 'active' : ''}`}
          onClick={() => setActiveTab('citations')}
        >
          📚 Citations ({citations?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🧠 Quiz
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'stance' && (
          <div className="content-section">
            <h3>Main Stance</h3>
            <div className="stance-content">
              <p>{stance}</p>
            </div>
          </div>
        )}

        {activeTab === 'counter' && (
          <div className="content-section">
            <h3>Counter-Stance</h3>
            <div className="counter-stance-content">
              <p>{counterStance}</p>
            </div>
          </div>
        )}

        {activeTab === 'citations' && (
          <div className="content-section">
            <h3>Evidence & Citations</h3>
            <div className="citations-list">
              {citations && citations.length > 0 ? (
                citations.map((citation, index) => (
                  <div key={index} className="citation-item">
                    <div className="citation-header">
                      <span className="citation-id">{citation.id || `Citation ${index + 1}`}</span>
                      <span className="citation-source">{citation.source}</span>
                    </div>
                    <div className="citation-snippet">
                      "{citation.snippet}"
                    </div>
                    {citation.unsourced && (
                      <span className="unsourced-badge">⚠️ Unverified</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-citations">No citations provided</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="content-section">
            <h3>Knowledge Check</h3>
            <div className="quiz-section">
              {quiz && quiz.length > 0 ? (
                quiz.map((question, index) => (
                  <div key={index} className="quiz-item">
                    <h4>Question {index + 1}:</h4>
                    <p className="question-text">{question.q}</p>
                    
                    <div className="options-list">
                      {question.options && question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`option ${optIndex === question.answerIndex ? 'correct' : ''}`}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          <span className="option-text">{option}</span>
                          {optIndex === question.answerIndex && (
                            <span className="correct-badge">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-quiz">No quiz questions provided</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebateBox;
