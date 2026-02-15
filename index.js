#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const CONFIG_DIR = path.join(os.homedir(), '.doc-pilot');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Ensure config directory exists
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

// Load config
function loadConfig() {
  ensureConfigDir();
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }
  return {};
}

// Save config
function saveConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Prompt user for input
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Fetch using Gemini API
async function fetchWithGemini(library, func, versionContext, apiKey, chalk) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Explain the usage of the '${func}' function in the '${library}' library ${versionContext}. Provide a function signature and a concise code example.`;

  console.log(chalk.blue('\n📚 Fetching documentation using Gemini AI...\n'));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    console.log(chalk.white(response.text));
    console.log(chalk.green('\n✓ Documentation fetched successfully!\n'));
  } catch (error) {
    throw error;
  }
}

program
  .name('doc-pilot')
  .description('AI-powered documentation fetcher for the terminal')
  .version('1.0.0');

program
  .command('find')
  .argument('<library>', 'Library name')
  .argument('<func>', 'Function or Method name')
  .action(async (library, func) => {
    const chalk = (await import('chalk')).default;
    
    console.log(chalk.blue(`🚀 Fetching docs for ${library} > ${func}...`));

    // Optional: Detect local version from package.json
    let versionContext = "";
    if (fs.existsSync('package.json')) {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const version = pkg.dependencies?.[library] || pkg.devDependencies?.[library];
      if (version) versionContext = `version ${version}`;
    }

    // Check for Gemini API key
    let config = loadConfig();
    
    if (!config.geminiApiKey) {
      console.log(chalk.yellow('\nNo Gemini API key found.'));
      console.log(chalk.white('Please enter your Gemini API key (get one from https://makersuite.google.com/app/apikey):'));
      const apiKey = await promptUser(chalk.cyan('API Key: '));
      
      if (!apiKey) {
        console.error(chalk.red('\n✗ No API key provided. Exiting.\n'));
        process.exit(1);
      }
      
      config.geminiApiKey = apiKey;
      saveConfig(config);
      console.log(chalk.green('\n✓ API key saved successfully!\n'));
    }

    try {
      await fetchWithGemini(library, func, versionContext, config.geminiApiKey, chalk);
    } catch (error) {
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        console.error(chalk.red('\n✗ Invalid API key. Please check your Gemini API key.'));
        console.log(chalk.yellow('Run the command again to re-enter your API key.\n'));
        // Delete the invalid API key
        config = loadConfig();
        delete config.geminiApiKey;
        saveConfig(config);
      } else {
        console.error(chalk.red('\n✗ Error fetching from Gemini:'), error.message);
      }
    }
  });

program
  .command('config')
  .description('Configure doc-pilot settings')
  .option('--set-api-key', 'Set Gemini API key')
  .option('--show-config', 'Show current configuration')
  .option('--reset', 'Reset all configuration')
  .action(async (options) => {
    const chalk = (await import('chalk')).default;
    
    if (options.setApiKey) {
      const apiKey = await promptUser(chalk.cyan('Enter your Gemini API key: '));
      if (apiKey) {
        const config = loadConfig();
        config.geminiApiKey = apiKey;
        saveConfig(config);
        console.log(chalk.green('\n✓ API key saved successfully!\n'));
      } else {
        console.error(chalk.red('\n✗ No API key provided.\n'));
      }
    } else if (options.showConfig) {
      const config = loadConfig();
      console.log(chalk.blue('\nCurrent configuration:'));
      console.log(chalk.white(`Config file: ${CONFIG_FILE}`));
      if (config.geminiApiKey) {
        console.log(chalk.green('✓ Gemini API Key: configured'));
      } else {
        console.log(chalk.yellow('✗ Gemini API Key: not configured'));
      }
      console.log();
    } else if (options.reset) {
      if (fs.existsSync(CONFIG_FILE)) {
        fs.unlinkSync(CONFIG_FILE);
        console.log(chalk.green('\n✓ Configuration reset successfully!\n'));
      } else {
        console.log(chalk.yellow('\nNo configuration found.\n'));
      }
    } else {
      console.log(chalk.yellow('\nPlease specify an option. Use --help for more information.\n'));
    }
  });

program.parse();