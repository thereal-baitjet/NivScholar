/**
 * NIV Scholar - Chat Interface Management
 * Handles chat UI, message display, and user interactions
 */

class ChatInterface {
    constructor() {
        this.api = new NIVScholarAPI();
        this.currentVerse = null;
        this.isTyping = false;
        this.messageContainer = null;
        this.inputElement = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.bindEvents();
        this.welcomeMessage();
    }

    setupElements() {
        this.messageContainer = document.getElementById('chat-messages');
        this.inputElement = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = document.getElementById('typing-indicator');
    }

    bindEvents() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key (but not Shift+Enter)
        this.inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.inputElement.addEventListener('input', () => {
            this.inputElement.style.height = 'auto';
            this.inputElement.style.height = this.inputElement.scrollHeight + 'px';
        });
    }

    async sendMessage() {
        const message = this.inputElement.value.trim();
        if (!message || this.isTyping) return;

        // Clear input and add user message to chat
        this.inputElement.value = '';
        this.inputElement.style.height = 'auto';
        this.addUserMessage(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get response from NIV Scholar AI
            const response = await this.api.simulateResponse(message, this.currentVerse);
            
            if (response.success) {
                // Simulate typing delay for natural feel
                await this.typeMessage(response.message);
            } else {
                this.addErrorMessage(response.error);
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.addErrorMessage('Unable to connect to NIV Scholar. Please try again.');
        } finally {
            this.hideTypingIndicator();
        }
    }

    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    async typeMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message scholar-message';
        messageDiv.innerHTML = `
            <div class="scholar-avatar">
                <img src="resources/scholar-portrait.jpg" alt="NIV Scholar" />
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="scholar-name">NIV Scholar</span>
                    <button class="save-message" title="Save this insight">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                    </button>
                </div>
                <div class="message-text"></div>
            </div>
        `;
        
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();

        const textElement = messageDiv.querySelector('.message-text');
        
        // Typewriter effect
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < message.length) {
                textElement.textContent += message[index];
                index++;
                this.scrollToBottom();
            } else {
                clearInterval(typeInterval);
                this.processMessageContent(textElement, message);
                this.addSaveFunctionality(messageDiv);
            }
        }, 20);
    }

    processMessageContent(element, message) {
        // Format biblical references as clickable links
        const bibleRefRegex = /(\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\s\d+:\d+(?:-\d+)?)/g;
        
        let formattedMessage = message;
        formattedMessage = formattedMessage.replace(bibleRefRegex, '<a href="#" class="bible-reference" onclick="chatInterface.lookUpVerse(\'$1\')">$1</a>');
        
        element.innerHTML = formattedMessage;
    }

    addSaveFunctionality(messageDiv) {
        const saveButton = messageDiv.querySelector('.save-message');
        saveButton.addEventListener('click', () => {
            const messageContent = messageDiv.querySelector('.message-text').textContent;
            this.saveInsight(messageContent);
            
            // Visual feedback
            saveButton.style.color = '#B8860B';
            saveButton.title = 'Saved to notebook';
        });
    }

    saveInsight(content) {
        const insight = {
            id: Date.now(),
            content: content,
            timestamp: new Date().toISOString(),
            verseContext: this.currentVerse,
            type: 'insight'
        };

        // Save to localStorage (in production, this would go to a database)
        const savedInsights = JSON.parse(localStorage.getItem('niv-scholar-insights') || '[]');
        savedInsights.push(insight);
        localStorage.setItem('niv-scholar-insights', JSON.stringify(savedInsights));

        // Show confirmation
        this.showNotification('Insight saved to your study notebook');
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }

    welcomeMessage() {
        const welcomeMessages = [
            "Welcome to NIV Scholar. I'm here to help you explore the depths of biblical scripture with scholarly insight and historical context. What would you like to study today?",
            "Greetings, fellow student of scripture. I'm NIV Scholar, ready to guide you through the rich tapestry of biblical text, from historical context to original languages. What questions are on your heart?",
            "Welcome to our study session. I'm here to provide scholarly perspectives on biblical passages, historical backgrounds, and theological themes. How may I assist your exploration of God's word?"
        ];

        setTimeout(() => {
            this.typeMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
        }, 1000);
    }

    setVerseContext(book, chapter, verse) {
        this.currentVerse = { book, chapter, verse };
        this.showNotification(`Now discussing ${book} ${chapter}:${verse}`);
    }

    lookUpVerse(reference) {
        // Parse reference (simplified)
        const parts = reference.split(' ');
        const book = parts.slice(0, -1).join(' ');
        const verseRef = parts[parts.length - 1];
        const [chapter, verse] = verseRef.split(':');
        
        this.setVerseContext(book, chapter, verse);
        
        // Add a contextual message
        setTimeout(() => {
            this.typeMessage(`I'd be happy to explore ${reference} with you. This passage offers rich insights when we consider its historical and cultural context.`);
        }, 500);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    scrollToBottom() {
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addErrorMessage(error) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p><strong>Sorry, I encountered an issue:</strong> ${this.escapeHtml(error)}</p>
                <p>Please try again in a moment.</p>
            </div>
        `;
        
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
}

// Initialize chat interface when DOM is loaded
let chatInterface;
document.addEventListener('DOMContentLoaded', () => {
    chatInterface = new ChatInterface();
});

// Make chatInterface globally available for verse lookup
window.chatInterface = chatInterface;