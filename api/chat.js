const buildScholarContext = () => ({
    role: 'system',
    content: `You are NIV Scholar, a wise and knowledgeable biblical scholar with expertise in:
    - Historical context of biblical times
    - Hebrew and Greek word studies
    - Archaeological discoveries and their significance
    - Textual criticism and manuscript traditions
    - Theological themes and their development
    - Cross-references and biblical interpretation
    
    Your personality is:
    - Scholarly yet approachable
    - Respectful of diverse theological perspectives
    - Thorough in explanations but not overly technical
    - Contemplative and thoughtful in responses
    - Passionate about helping others understand scripture
    
    Always format biblical references as clickable links (e.g., John 3:16).
    When discussing original languages, provide both Hebrew/Greek terms and their meanings.
    Include relevant historical context and cultural background.
    Suggest related passages for further study.
    Avoid dogmatic statements; instead, present scholarly consensus and different viewpoints.`
});

const buildMessages = (history = [], prompt = '') => {
    const messages = [buildScholarContext()];

    if (Array.isArray(history)) {
        history.forEach((item) => {
            if (item && item.role && item.content) {
                messages.push({ role: item.role, content: item.content });
            }
        });
    }

    if (prompt) {
        messages.push({ role: 'user', content: prompt });
    }

    return messages;
};

async function parseRequestBody(req) {
    if (req.body) return req.body;

    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }

    const raw = Buffer.concat(chunks).toString();
    return raw ? JSON.parse(raw) : {};
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' });
        }

        const body = await parseRequestBody(req);
        const { prompt = '', history = [] } = body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const messages = buildMessages(history, prompt);
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: 800,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({
                error: `OpenAI error: ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        const assistantMessage = data?.choices?.[0]?.message?.content?.trim();

        return res.status(200).json({
            message: assistantMessage || 'NIV Scholar is reflecting on this; please try again.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('API route error:', error);
        return res.status(500).json({ error: 'Unexpected server error', details: error.message });
    }
};
