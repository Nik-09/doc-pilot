# doc-pilot - Copilot Instructions

## Overview

doc-pilot is a CLI tool that fetches library documentation using Google Gemini AI. It takes a library name and function/method name, optionally detects the version from local package.json, and queries Gemini AI for documentation and usage examples.

## Architecture

- **Single-file CLI**: `index.js` is the entire application
- **Commander.js**: Handles CLI argument parsing with `find` and `config` commands
- **Google Generative AI**: Uses Gemini API for documentation fetching
- **Config management**: Stores API key in `~/.doc-pilot/config.json`
- **Version detection**: Reads local `package.json` to include version context in queries

## Commands

### Find documentation
```bash
node index.js find <library> <func>
# Example: node index.js find express use
```

### Configure API key
```bash
node index.js config --set-api-key      # Set Gemini API key
node index.js config --show-config      # Show current configuration
node index.js config --reset            # Reset all configuration
```

No test suite, build, or lint commands are currently configured.

## Key Conventions

- **Shebang**: `index.js` starts with `#!/usr/bin/env node` for direct execution
- **Version context**: Automatically reads `dependencies` and `devDependencies` from local package.json to enhance query accuracy
- **Config storage**: API key stored in `~/.doc-pilot/config.json` (automatically created)
- **First-run setup**: Prompts for Gemini API key on first use if not configured
- **Error handling**: Validates API key and prompts for re-entry on authentication failures
- **Chalk colors**: Blue for status messages, green for success, red for errors, yellow for warnings

## Dependencies

- **@google/genai**: Google Gemini API SDK (latest)
- **chalk ^5.6.2**: Terminal styling (ESM package, requires Node.js 18+)
- **commander ^13.1.0**: CLI framework
- **execa ^9.6.1**: Process execution (ESM package) - still included but not used

Note: Chalk is an ESM-only package imported with dynamic `import()` within async functions for CommonJS compatibility.

## External Requirements

- Gemini API key from https://makersuite.google.com/app/apikey
- Node.js 18+ (for ESM package support)
