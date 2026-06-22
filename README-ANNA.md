# SciForge AI - Anna App

An AI-powered STEM Workbench that turns learning into interactive scientific exploration.

## Anna App Format

This is the Anna App version of SciForge AI, converted to run on the Anna platform using the Anna Host API.

## Project Structure

```
sci-forge-ai/
├── anna-app.json            # Anna App manifest
├── src/
│   ├── app/                 # Anna App UI (iframe content)
│   │   ├── index.html       # Entry point
│   │   ├── app.js           # Main UI logic with Anna API calls
│   │   └── style.css        # All styles
│   └── executa/             # Executa tools (backend functions)
│       └── chat.tool.ts     # Groq API integration
├── package.json
└── public/
```

## Features

- **Core Intelligence Console** - AI-powered chat mentor
- **Scribble Analysis Lab** - Analyze equations and problems
- **Quiz Generator** - Generate practice quizzes
- **Notes Generator** - Create comprehensive lecture notes
- **Quantum Research Engine** - Deep STEM analysis
- **Concept Dependency Map** - Visualize learning paths
- **Dark/Light mode toggle**
- **Dyslexia-friendly font option**
- **Custom pen cursor**

## Anna API Integration

The app uses Anna's Host APIs:

```javascript
// Chat with LLM
const response = await Anna.llm.complete({
  messages: [{ role: 'system', content: '...' }, { role: 'user', content: '...' }],
  temperature: 0.7,
  maxTokens: 2000
});

// Set window title
Anna.window.setTitle('SciForge AI - STEM Workbench');

// Store data
Anna.storage.set('key', value);
```

## Groq API Configuration (Optional)

While the app uses Anna's LLM API by default, you can also use Groq API directly via the Executa tool:

1. Get a Groq API key from [console.groq.com](https://console.groq.com)
2. Create a `.env.local` file:
   ```
   VITE_GROQ_API_KEY=your_api_key_here
   ```

## Development

### Prerequisites

- Node.js 18+ installed
- Anna CLI installed (`npm install -g @anna/cli`)

### Local Development

```bash
# Install dependencies
npm install

# Run the original Vite dev server
npm run dev

# Or use Anna CLI for development
npm run anna:dev
```

### Validate the App

```bash
npm run anna:validate
```

## Publishing to Anna Platform

### Step 1: Push to Anna Platform

```bash
npm run anna:push
```

This command:
1. Validates the app structure
2. Uploads the app to Anna platform
3. Auto-generates tool IDs in `src/app/anna-tool-ids.js`

### Step 2: Create Release

```bash
npm run anna:cut
```

Follow the prompts to specify the version number (e.g., `0.1.0`).

### Step 3: Submit

Submit the release on the Anna AI-Native App Hackathon platform before the deadline.

## Quick Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run anna:validate` | Validate Anna App structure |
| `npm run anna:push` | Push app to Anna platform |
| `npm run anna:cut` | Create release version |

## Tech Stack

- **UI**: Vanilla JavaScript, CSS3
- **AI**: Anna Host API (LLM)
- **Optional API**: Groq API (Llama 3.3 70B)
- **Styling**: Custom CSS with CSS Variables

## Author

Muhammad Mujtaba

## License

MIT