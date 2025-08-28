
function safeParseJSONMaybe(text) {

    try {
      return { ok:true, data: JSON.parse(text) };
    } catch (e) {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return { ok:true, data: JSON.parse(m[0]) };
        } catch(err2) {
          return { ok:false, error: 'Could not parse JSON from model output' };
        }
      }
      return { ok:false, error: 'No JSON found in model output' };
    }
  }
  
  function validateDebateSchema(obj) {
    if (typeof obj !== 'object') return { ok:false, error:'Not an object' };
    const has = k => obj[k] !== undefined;
    if (!has('stance') || !has('counterStance') || !has('citations')) return { ok:false, error: 'Missing keys' };
    return { ok:true };
  }
  
  module.exports = { safeParseJSONMaybe, validateDebateSchema };
  