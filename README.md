# doc-pilot 🚀

AI-powered documentation fetcher for the terminal using Google Gemini.

## Features

- 📚 Fetch library documentation directly in your terminal
- 🤖 Powered by Google Gemini AI
- 📦 Auto-detects library versions from your package.json
- ⚙️ Simple configuration management
- 🎨 Beautiful colored output

## Installation

```bash
# Clone or download the repository
cd doc-pilot

# Install dependencies
npm install
```

## Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. On first use, the tool will prompt you for your API key:
```bash
node index.js find express use
```

Or set it manually:
```bash
node index.js config --set-api-key
```

## Usage

### Find documentation
```bash
node index.js find <library> <function>
```

**Examples:**
```bash
# Get documentation for express.use()
node index.js find express use

# Get documentation for Array.map()
node index.js find Array map

# Get documentation for fs.readFile()
node index.js find fs readFile
```

### Configuration commands

```bash
# Show current configuration
node index.js config --show-config

# Set or update API key
node index.js config --set-api-key

# Reset configuration
node index.js config --reset
```

## How it works

1. You run the command with a library and function name
2. doc-pilot checks if the library is in your local package.json
3. It queries Google Gemini with version context (if available)
4. Returns formatted documentation with examples

## Configuration

Configuration is stored in `~/.doc-pilot/config.json`

## Requirements

- Node.js 18+
- Gemini API key

## Dependencies

- **@google/genai** - Google Gemini API SDK
- **chalk** - Terminal styling
- **commander** - CLI framework
- **execa** - Process execution

## License

ISC
