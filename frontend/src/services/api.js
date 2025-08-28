// frontend/src/services/api.js
export async function generateDebate(body) {
    const resp = await fetch('/api/debate/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return resp.json();
  }
  