/**
 * NIV Scholar - OpenAI API Integration
 * Handles communication with OpenAI API for biblical scholarly responses
 */

class NIVScholarAPI {
    constructor() {
        this.apiKey = 'sk-your-api-key-here'; // In production, this should be from secure environment
        this.model = 'gpt-4';
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.conversationHistory = [];
        
        // NIV Scholar Persona Context
        this.scholarContext = {
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
        };
    }

    async sendMessage(userMessage, verseContext = null) {
        try {
            // Add user message to conversation history
            this.conversationHistory.push({
                role: 'user',
                content: this.buildUserPrompt(userMessage, verseContext)
            });

            // Prepare the full conversation context
            const messages = [this.scholarContext, ...this.conversationHistory];

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            // Add AI response to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            return {
                success: true,
                message: assistantMessage,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('NIV Scholar API Error:', error);
            return {
                success: false,
                error: error.message,
                fallbackMessage: this.getFallbackResponse(userMessage)
            };
        }
    }

    buildUserPrompt(message, verseContext) {
        let prompt = message;
        
        if (verseContext) {
            prompt = `In the context of ${verseContext.book} ${verseContext.chapter}:${verseContext.verse}, ${message}`;
        }

        return prompt;
    }

    getFallbackResponse(userMessage) {
        const fallbacks = [
            "That's an excellent question for our study together. Let me reflect on the biblical context and historical background to provide you with a thoughtful response.",
            "I appreciate your inquiry. This is a rich area of biblical study that deserves careful consideration from both historical and theological perspectives.",
            "Your question touches on important aspects of biblical scholarship. Let me gather the relevant historical and textual information to address this thoroughly."
        ];

        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    clearConversation() {
        this.conversationHistory = [];
    }

    getConversationHistory() {
        return this.conversationHistory;
    }

    // Simulate API response for development/testing
    async simulateResponse(userMessage, verseContext = null) {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        const responses = [
            `That's a fascinating question about ${userMessage}. From a scholarly perspective, we need to consider both the historical context and the original languages. The Hebrew word used here carries rich meaning that illuminates our understanding of this passage.`,
            `I appreciate your thoughtful inquiry. This passage has been the subject of considerable scholarly discussion. The archaeological evidence from the period helps us understand the cultural background that informs this text.`,
            `Your question touches on a crucial aspect of biblical interpretation. The Greek manuscript tradition offers some interesting variations that shed light on how the early church understood this passage.`,
            `This is indeed a rich area of study. The cross-references throughout Scripture reveal a consistent pattern that helps us understand the theological significance of this passage.`,
            `You've raised an important point for consideration. The historical context of the period, combined with insights from recent archaeological discoveries, provides valuable perspective on this passage.`
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            success: true,
            message: response,
            timestamp: new Date().toISOString(),
            simulated: true
        };
    }
}

// Export for use in other modules
window.NIVScholarAPI = NIVScholarAPI;