
export default async function handler(req, res) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { inputText } = req.body;

  if (!inputText || !inputText.trim()) {
    return res.status(400).json({ error: 'Input text is required' });
  }

  // Get API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert content humanizer. Your task is to transform AI-generated text into natural, human-like content while preserving the original meaning and key information. 

Guidelines:
- Add natural conversational elements and human touches
- Vary sentence structure and length
- Include subtle imperfections that humans naturally have
- Use more casual, relatable language where appropriate
- Add personal touches like "I think", "in my experience", etc.
- Make the tone warmer and more engaging
- Use more easy english words
- Ensure the content sounds like it was written by a real person
- Maintain the core message and facts
- Don't make it overly casual if the original was formal - just more human`
          },
          {
            role: 'user',
            content: `Please humanize this AI-generated content:\n\n${inputText}`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 401) {
        return res.status(500).json({ error: 'Invalid API key configuration' });
      }
      return res.status(500).json({ error: `OpenAI API error: ${response.status}` });
    }

    const data = await response.json();
    const result = data.choices[0]?.message?.content || '';
    
    return res.status(200).json({ humanizedText: result });
  } catch (error) {
    console.error('Error humanizing content:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to humanize content' 
    });
  }
}
