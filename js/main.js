/**
 * NIV Scholar - Main Application Controller
 * Coordinates all application functionality and UI interactions
 */

class NIVScholarApp {
    constructor() {
        this.currentPage = 'chat';
        this.verseSelector = null;
        this.topicCarousel = null;
        this.studyNotebook = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupVerseSelector();
        this.setupTopicCarousel();
        this.setupStudyNotebook();
        this.loadUserPreferences();
        this.initializeAnimations();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(page) {
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Page-specific initialization
            if (page === 'study') {
                this.togglePrimaryLayout(false);
                this.studyNotebook.loadSavedContent();
            } else if (page === 'explore') {
                this.togglePrimaryLayout(false);
                this.initializeExplorePage();
            } else {
                this.togglePrimaryLayout(true);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    togglePrimaryLayout(show) {
        const elements = document.querySelectorAll('.verse-selector, .chat-container, .study-notebook, .topic-carousel-container');
        elements.forEach((el) => {
            el.style.display = show ? '' : 'none';
        });
    }

    setupVerseSelector() {
        const bookSelect = document.getElementById('book-select');
        const chapterSelect = document.getElementById('chapter-select');
        const verseSelect = document.getElementById('verse-select');

        // Populate books of the Bible
        this.populateBooks(bookSelect);

        // Handle book selection
        bookSelect.addEventListener('change', (e) => {
            const selectedBook = e.target.value;
            if (selectedBook) {
                this.populateChapters(chapterSelect, selectedBook);
                verseSelect.innerHTML = '<option value="">Select Verse</option>';
            }
        });

        // Handle chapter selection
        chapterSelect.addEventListener('change', (e) => {
            const selectedBook = bookSelect.value;
            const selectedChapter = e.target.value;
            if (selectedBook && selectedChapter) {
                this.populateVerses(verseSelect, selectedBook, selectedChapter);
            }
        });

        // Handle verse selection
        verseSelect.addEventListener('change', (e) => {
            const selectedVerse = e.target.value;
            if (selectedVerse) {
                const book = bookSelect.value;
                const chapter = chapterSelect.value;
                const verse = selectedVerse;
                
                if (window.chatInterface) {
                    window.chatInterface.setVerseContext(book, chapter, verse);
                    
                    // Add contextual message to chat
                    setTimeout(() => {
                        const contextualMessages = [
                            `Let's explore ${book} ${chapter}:${verse} together. This passage offers profound insights when we examine its historical and cultural context.`,
                            `Excellent choice. ${book} ${chapter}:${verse} is a rich text for study. Let me share some scholarly perspectives on this passage.`,
                            `${book} ${chapter}:${verse} provides us with much to contemplate. The original language here reveals deeper layers of meaning.`
                        ];
                        
                        const randomMessage = contextualMessages[Math.floor(Math.random() * contextualMessages.length)];
                        window.chatInterface.typeMessage(randomMessage);
                    }, 500);
                }
            }
        });
    }

    populateBooks(select) {
        const books = [
            // Old Testament
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
            '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
            'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
            'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
            'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
            'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
            'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
            // New Testament
            'Matthew', 'Mark', 'Luke', 'John', 'Acts',
            'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
            'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
            '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
            '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
            'Jude', 'Revelation'
        ];

        select.innerHTML = '<option value="">Select Book</option>';
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book;
            option.textContent = book;
            select.appendChild(option);
        });
    }

    populateChapters(select, book) {
        // Simplified chapter counts (in a real app, this would be accurate)
        const chapterCounts = {
            'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
            'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28,
            'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6,
            'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, 'Psalms': 150
        };

        const count = chapterCounts[book] || 10; // Default to 10 chapters
        select.innerHTML = '<option value="">Select Chapter</option>';
        
        for (let i = 1; i <= count; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    }

    populateVerses(select, book, chapter) {
        // Simplified verse counts (in a real app, this would be accurate)
        const verseCounts = {
            'Genesis': { '1': 31, '2': 25 },
            'John': { '3': 36, '1': 51 },
            'Matthew': { '5': 48, '6': 34 }
        };

        const count = (verseCounts[book] && verseCounts[book][chapter]) || 25; // Default to 25 verses
        select.innerHTML = '<option value="">Select Verse</option>';
        
        for (let i = 1; i <= count; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }
    }

    setupTopicCarousel() {
        const topics = [
            {
                title: "Historical Context of Romans",
                description: "Explore the cultural and political background of Paul's letter to the Romans",
                icon: "🏛️"
            },
            {
                title: "Greek Word Studies",
                description: "Deep dive into the original Greek terms and their nuanced meanings",
                icon: "📜"
            },
            {
                title: "The Theme of Exile",
                description: "Understanding exile as a recurring biblical motif throughout Scripture",
                icon: "🌅"
            },
            {
                title: "Archaeological Evidence",
                description: "Recent discoveries that illuminate our understanding of biblical events",
                icon: "🏺"
            },
            {
                title: "Covenant Theology",
                description: "The development and significance of covenant relationships in Scripture",
                icon: "🤝"
            },
            {
                title: "Prophetic Literature",
                description: "Understanding the structure and message of biblical prophecy",
                icon: "🔥"
            },
            {
                title: "Wisdom Literature",
                description: "Exploring the poetic and philosophical depth of biblical wisdom",
                icon: "💎"
            },
            {
                title: "Textual Criticism",
                description: "How scholars work with ancient manuscripts to understand the original text",
                icon: "🔍"
            }
        ];

        const carousel = document.getElementById('topic-carousel');
        topics.forEach((topic, index) => {
            const topicCard = document.createElement('div');
            topicCard.className = 'topic-card';
            topicCard.innerHTML = `
                <div class="topic-icon">${topic.icon}</div>
                <h4>${topic.title}</h4>
                <p>${topic.description}</p>
            `;
            
            topicCard.addEventListener('click', () => {
                this.selectTopic(topic);
            });
            
            carousel.appendChild(topicCard);
        });

        // Initialize carousel scrolling
        this.initializeCarouselScrolling();
    }

    selectTopic(topic) {
        if (window.chatInterface) {
            const prompt = `I'm interested in "${topic.title}". ${topic.description}. Please guide me through this topic with historical context, key scriptures, and scholarly insights.`;
            window.chatInterface.sendMessage(prompt);
        }
    }

    initializeCarouselScrolling() {
        const carousel = document.getElementById('topic-carousel');
        let isScrolling = false;

        carousel.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                carousel.scrollLeft += e.deltaY;
                setTimeout(() => {
                    isScrolling = false;
                }, 50);
            }
        });
    }

    setupStudyNotebook() {
        this.studyNotebook = {
            loadSavedContent: () => {
                const savedInsights = JSON.parse(localStorage.getItem('niv-scholar-insights') || '[]');
                this.displaySavedInsights(savedInsights);
            },
            
            displaySavedInsights: (insights) => {
                const container = document.getElementById('saved-insights');
                if (!container) return;
                
                container.innerHTML = '';
                
                if (insights.length === 0) {
                    container.innerHTML = `
                        <div class="empty-notebook">
                            <p>Your study notebook is empty.</p>
                            <p>Start chatting with NIV Scholar to save insights and reflections.</p>
                        </div>
                    `;
                    return;
                }
                
                insights.forEach(insight => {
                    const insightCard = document.createElement('div');
                    insightCard.className = 'insight-card';
                    insightCard.innerHTML = `
                        <div class="insight-content">
                            <p>${insight.content}</p>
                        </div>
                        <div class="insight-meta">
                            <span class="insight-date">${new Date(insight.timestamp).toLocaleDateString()}</span>
                            ${insight.verseContext ? `<span class="insight-verse">${insight.verseContext.book} ${insight.verseContext.chapter}:${insight.verseContext.verse}</span>` : ''}
                        </div>
                    `;
                    container.appendChild(insightCard);
                });
            }
        };
    }

    displaySavedInsights(insights) {
        if (this.studyNotebook) {
            this.studyNotebook.displaySavedInsights(insights);
        }
    }

    loadUserPreferences() {
        const preferences = JSON.parse(localStorage.getItem('niv-scholar-preferences') || '{}');
        // Apply user preferences (theme, font size, etc.)
        if (preferences.fontSize) {
            document.documentElement.style.setProperty('--base-font-size', preferences.fontSize);
        }
    }

    initializeAnimations() {
        // Initialize anime.js animations
        if (typeof anime !== 'undefined') {
            // Animate page transitions
            anime({
                targets: '.page-section.active',
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                easing: 'easeOutQuart'
            });
            
            // Animate topic cards on load
            anime({
                targets: '.topic-card',
                opacity: [0, 1],
                translateY: [30, 0],
                delay: anime.stagger(100),
                duration: 600,
                easing: 'easeOutQuart'
            });
        }
    }

    initializeExplorePage() {
        // Initialize cross-reference visualization
        if (typeof echarts !== 'undefined') {
            this.initializeCrossReferenceChart();
        }
    }

    initializeCrossReferenceChart() {
        const chartContainer = document.getElementById('cross-reference-chart');
        if (!chartContainer) return;

        const chart = echarts.init(chartContainer);
        
        // Sample data for cross-references
        const nodes = [
            { name: 'John 3:16', category: 0 },
            { name: 'Romans 5:8', category: 1 },
            { name: 'Ephesians 2:8-9', category: 1 },
            { name: '1 John 4:9', category: 1 },
            { name: 'Genesis 1:1', category: 0 },
            { name: 'John 1:1', category: 1 }
        ];
        
        const links = [
            { source: 'John 3:16', target: 'Romans 5:8' },
            { source: 'John 3:16', target: 'Ephesians 2:8-9' },
            { source: 'John 3:16', target: '1 John 4:9' },
            { source: 'Genesis 1:1', target: 'John 1:1' }
        ];

        const option = {
            title: {
                text: 'Biblical Cross-References',
                textStyle: { color: '#2C3E50', fontFamily: 'Merriweather' }
            },
            tooltip: {},
            series: [{
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                categories: [
                    { name: 'Primary Verse' },
                    { name: 'Related Verse' }
                ],
                force: {
                    repulsion: 100
                }
            }]
        };

        chart.setOption(option);
    }
}

// Initialize the main application
let nivScholarApp;
document.addEventListener('DOMContentLoaded', () => {
    nivScholarApp = new NIVScholarApp();
});

// Export for global access
window.NIVScholarApp = NIVScholarApp;
