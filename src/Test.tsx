import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = '4a6c2169-01f9-4e0d-89e3-d02d44143823';

const Test: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simple request to test the API
      const response = await axios.post(
        'https://api.templated.io/v1/render',
        {
          template: "306c724a-d138-486a-a601-0b2a9ced52be", // Sample template ID
          layers: {
            'text-1': {
              text: "Testing Templated API",
              color: "#FFFFFF",
              background: "#0000FF",
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );

      setResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error('Error:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Templated API Test</h1>
      
      <button 
        onClick={testApi}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
        disabled={loading}
      >
        {loading ? 'Testing API...' : 'Test Templated API'}
      </button>
      
      {error && (
        <div style={{ 
          backgroundColor: '#FEE2E2', 
          color: '#B91C1C', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      {result && (
        <div>
          <h2>API Response:</h2>
          <pre style={{ 
            backgroundColor: '#F1F5F9', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Test; 