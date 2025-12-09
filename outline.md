# NIV Scholar - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── .env                          # OpenAI API key configuration
├── index.html                    # Main chat interface
├── study.html                    # Study notebook and saved insights
├── explore.html                  # Biblical exploration and cross-references
├── resources/                    # Local assets and media
│   ├── hero-ancient-scrolls.jpg  # Hero image for academic atmosphere
│   ├── parchment-texture.jpg     # Background texture
│   ├── manuscript-illumination.jpg # Decorative elements
│   └── scholar-portrait.jpg      # AI scholar avatar
├── js/
│   ├── main.js                   # Core application logic
│   ├── chat.js                   # Chat interface and AI integration
│   ├── notebook.js               # Study notebook functionality
│   └── api.js                    # OpenAI API integration
└── css/
    └── styles.css                # Compiled styles (embedded in HTML)
```

## Page Architecture

### 1. index.html - Main Chat Interface
**Purpose**: Primary scholarly chat experience with AI Bible Scholar
**Key Sections**:
- **Header**: Navigation, search, user profile with academic styling
- **Chat Window**: Central conversation area with parchment background
- **Verse Selector**: Left sidebar for biblical book/chapter navigation
- **Topic Carousel**: Bottom panel with scholarly discussion topics
- **Quick Actions**: Save, share, and export conversation options

**Interactive Components**:
- Real-time chat with NIV Scholar AI personality
- Verse reference lookup and display
- Topic suggestion carousel with smooth transitions
- Bookmark and save functionality

### 2. study.html - Personal Study Notebook
**Purpose**: Organized collection of saved insights and study materials
**Key Sections**:
- **Notebook Dashboard**: Overview of saved content and study progress
- **Saved Conversations**: Complete chat threads organized by topic
- **Verse Collections**: Personal compilations with custom notes
- **Study Tags**: Custom categorization and search system
- **Export Tools**: Options to download study materials

**Interactive Components**:
- Search and filter saved content
- Add personal notes and reflections
- Organize materials with custom tags
- Share study collections with others

### 3. explore.html - Biblical Exploration Hub
**Purpose**: Deep dive into biblical content with scholarly resources
**Key Sections**:
- **Cross-Reference Explorer**: Interactive network of biblical connections
- **Historical Context**: Timeline and cultural background information
- **Language Studies**: Hebrew and Greek word exploration
- **Manuscript Insights**: Textual criticism and variant readings
- **Archaeological Discoveries**: Recent findings and their implications

**Interactive Components**:
- Visual network of biblical cross-references
- Interactive timeline of biblical events
- Word study tools with original language lookup
- Comparison of different manuscript traditions

## Technical Implementation

### OpenAI Integration (.env configuration)
```
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4
PERSONA_CONTEXT=NIV Scholar biblical academic expert
```

### Core JavaScript Modules
**main.js**: Application initialization and global state management
**chat.js**: Chat interface, message handling, and AI communication
**notebook.js**: Study notebook functionality and data persistence
**api.js**: OpenAI API integration with NIV Scholar personality

### Data Structure
**Chat Sessions**: Timestamped conversations with metadata
**Saved Insights**: Individual messages, verses, and explanations
**Study Collections**: User-organized groupings of related content
**User Preferences**: Settings, bookmarks, and personalization data

### Visual Effects Integration
- **Anime.js**: Smooth message transitions and UI animations
- **Typed.js**: Typewriter effects for AI responses
- **Splitting.js**: Character-level animations for verse references
- **ECharts.js**: Data visualization for biblical cross-references
- **p5.js**: Ambient background effects and manuscript textures

## Content Strategy

### NIV Scholar AI Personality
- **Tone**: Scholarly, respectful, contemplative, and educational
- **Expertise**: Biblical studies, historical context, language analysis
- **Approach**: Progressive revelation of information based on user interest
- **Style**: Academic yet accessible, avoiding overly technical jargon

### Biblical Content Organization
- **Complete Canon**: All 66 biblical books with chapter/verse structure
- **Scholarly Topics**: Historical, cultural, linguistic, and theological themes
- **Cross-References**: Comprehensive network of biblical connections
- **Study Resources**: Maps, timelines, and archaeological context

### User Experience Flow
1. **Welcome**: Gentle introduction to AI scholar and interface
2. **Exploration**: Natural conversation about biblical topics
3. **Discovery**: Revelation of deeper insights and connections
4. **Collection**: Saving meaningful content to personal notebook
5. **Return**: Continued study with context from previous sessions

## Development Priorities
1. **Core Chat**: Functional AI conversation with biblical expertise
2. **Verse Navigation**: Smooth book/chapter selection and display
3. **Study Notebook**: Basic save/retrieve functionality
4. **Visual Polish**: Academic styling with smooth animations
5. **Advanced Features**: Cross-references, word studies, and exploration tools

This structure creates a comprehensive biblical study platform that combines modern AI capabilities with scholarly rigor, providing users with an immersive educational experience that honors both the sacred nature of the content and the academic standards of biblical studies.