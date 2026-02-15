# doc-pilot 🚀

AI-powered documentation fetcher for the terminal using Google Gemini.

## Features

- 📚 Fetch library documentation directly in your terminal
- 🤖 Powered by Google Gemini AI
- 📦 Auto-detects library versions from your package.json
- ⚙️ Simple configuration management
- 🎨 Beautiful colored output

## Installation

### From npm (Recommended)
```bash
npm install -g doc-pilot
```

### From source
```bash
git clone https://github.com/Nik-09/doc-pilot.git
cd doc-pilot
npm install
npm link
```

## Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. On first use, the tool will prompt you for your API key:
```bash
doc-pilot find express use
```

Or set it manually:
```bash
doc-pilot config --set-api-key
```

## Usage

### Find documentation
```bash
doc-pilot find <library> <function>
```

**Examples:**
```bash
# Get documentation for express.use()
doc-pilot find express use

# Get documentation for Array.map()
doc-pilot find Array map

# Get documentation for lodash.debounce()
doc-pilot find lodash debounce
```

### Configuration commands

```bash
# Show current configuration
doc-pilot config --show-config

# Set or update API key
doc-pilot config --set-api-key

# Reset configuration
doc-pilot config --reset
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
