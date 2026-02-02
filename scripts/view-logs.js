#!/usr/bin/env node
// scripts/view-logs.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output (no external dependencies!)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const logsDir = path.join(process.cwd(), 'logs');
console.log(logsDir);

function colorize(text, color) {
  return colors[color] + text + colors.reset;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function printHeader(title) {
  console.log('\n' + colorize('═'.repeat(50), 'cyan'));
  console.log(colorize(`  ${title}`, 'bright'));
  console.log(colorize('═'.repeat(50), 'cyan'));
}

function viewLogs() {
  if (!fs.existsSync(logsDir)) {
    console.log(colorize('No logs directory found!', 'yellow'));
    console.log(colorize('Run your app first to generate logs.', 'dim'));
    return;
  }

  const files = fs.readdirSync(logsDir);

  if (files.length === 0) {
    console.log(colorize('No log files found.', 'yellow'));
    return;
  }

  printHeader('📁 LOG FILES DIRECTORY');
  console.log(colorize(`Location: ${logsDir}`, 'dim'));
  console.log();

  let totalSize = 0;

  files.forEach((file, index) => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;

    let fileColor = 'white';
    let icon = '📄';

    if (file.includes('error')) {
      fileColor = 'red';
      icon = '❌';
    } else if (file.includes('audit')) {
      fileColor = 'green';
      icon = '📊';
    } else if (file.includes('service')) {
      fileColor = 'blue';
      icon = '🔄';
    } else if (file.includes('exception')) {
      fileColor = 'magenta';
      icon = '⚠️ ';
    }

    const modified = new Date(stats.mtime).toLocaleString();
    const size = formatBytes(stats.size);

    console.log(
      `${colorize(`${index + 1}.`, 'yellow')} ${icon} ${colorize(file, fileColor)}`,
    );
    console.log(
      `   Size: ${colorize(size, 'dim')} | Modified: ${colorize(modified, 'dim')}`,
    );
    console.log();
  });

  console.log(
    colorize(
      `Total: ${files.length} files, ${formatBytes(totalSize)}`,
      'bright',
    ),
  );
  console.log();
  printHeader('COMMANDS');
  console.log(colorize('To view a file:', 'bright'));
  console.log(`  ${colorize('npm run logs:view <filename>', 'green')}`);
  console.log(`  ${colorize('npm run logs:tail <filename>', 'green')}`);
  console.log(`  ${colorize('node scripts/view-logs.js <filename>', 'green')}`);
  console.log();
  console.log(colorize('To watch logs in real-time:', 'bright'));
  console.log(`  ${colorize('npm run logs:watch', 'green')}`);
  console.log();
  console.log(colorize('To clear all logs:', 'bright'));
  console.log(`  ${colorize('npm run logs:clear', 'green')}`);
}

function viewFile(filename, tail = false, lines = 20) {
  const filePath = path.join(logsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(colorize(`File not found: ${filename}`, 'red'));
    console.log(colorize('Available files:', 'yellow'));
    viewLogs();
    return;
  }

  printHeader(`📄 ${filename}`);

  if (tail) {
    // Show last N lines
    const content = fs.readFileSync(filePath, 'utf8');
    const allLines = content.split('\n').filter((line) => line.trim());
    const start = Math.max(0, allLines.length - lines);
    const lastLines = allLines.slice(start);

    console.log(colorize(`Showing last ${lines} lines:`, 'dim'));
    console.log();

    lastLines.forEach((line, index) => {
      try {
        const json = JSON.parse(line);
        console.log(
          colorize(`[${start + index + 1}]`, 'dim'),
          JSON.stringify(json, null, 2),
        );
      } catch {
        console.log(colorize(`[${start + index + 1}]`, 'dim'), line);
      }
      console.log(colorize('─'.repeat(80), 'dim'));
    });
  } else {
    // Show entire file with pagination
    const content = fs.readFileSync(filePath, 'utf8');
    const allLines = content.split('\n').filter((line) => line.trim());

    console.log(colorize(`Total lines: ${allLines.length}`, 'dim'));
    console.log();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let currentLine = 0;
    const pageSize = 10;

    function showPage() {
      const endLine = Math.min(currentLine + pageSize, allLines.length);

      for (let i = currentLine; i < endLine; i++) {
        try {
          const json = JSON.parse(allLines[i]);
          console.log(
            colorize(`[${i + 1}]`, 'yellow'),
            JSON.stringify(json, null, 2),
          );
        } catch {
          console.log(colorize(`[${i + 1}]`, 'yellow'), allLines[i]);
        }
        console.log(colorize('─'.repeat(80), 'dim'));
      }

      if (endLine < allLines.length) {
        console.log(
          colorize(
            `\nShowing ${currentLine + 1}-${endLine} of ${allLines.length}`,
            'dim',
          ),
        );
        console.log(
          colorize('Press Enter for more, or type "q" to quit', 'dim'),
        );

        rl.question('', (answer) => {
          if (answer.toLowerCase() === 'q') {
            rl.close();
          } else {
            currentLine = endLine;
            showPage();
          }
        });
      } else {
        console.log(colorize('\nEnd of file reached.', 'dim'));
        rl.close();
      }
    }

    showPage();
  }
}

function watchFile(filename) {
  const filePath = path.join(logsDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(colorize(`File not found: ${filename}`, 'red'));
    return;
  }

  console.log(colorize(`👀 Watching ${filename} for changes...`, 'bright'));
  console.log(colorize('Press Ctrl+C to stop\n', 'dim'));

  let lastSize = fs.statSync(filePath).size;

  const watcher = fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
      const currentSize = fs.statSync(filePath).size;

      if (currentSize > lastSize) {
        const stream = fs.createReadStream(filePath, {
          start: lastSize,
          end: currentSize,
        });

        stream.on('data', (chunk) => {
          const lines = chunk
            .toString()
            .split('\n')
            .filter((line) => line.trim());
          lines.forEach((line) => {
            try {
              const json = JSON.parse(line);
              const timestamp = json.timestamp || new Date().toISOString();
              const level = json.level || 'INFO';
              const message = json.message || '';

              let levelColor = 'white';
              if (level === 'error') levelColor = 'red';
              if (level === 'warn') levelColor = 'yellow';
              if (level === 'info') levelColor = 'green';
              if (level === 'debug') levelColor = 'blue';

              console.log(
                colorize(timestamp, 'dim'),
                colorize(level.toUpperCase(), levelColor),
                colorize(message, 'white'),
              );

              if (json.context) {
                console.log(colorize(`  Context: ${json.context}`, 'dim'));
              }
              if (json.responseTime) {
                console.log(colorize(`  Time: ${json.responseTime}ms`, 'dim'));
              }
              console.log();
            } catch {
              console.log(colorize(line, 'white'));
            }
          });
        });
      }

      lastSize = currentSize;
    }
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    watcher.close();
    console.log(colorize('\nStopped watching.', 'yellow'));
    process.exit(0);
  });
}

function clearLogs() {
  if (!fs.existsSync(logsDir)) {
    console.log(colorize('No logs directory to clear.', 'yellow'));
    return;
  }

  const files = fs.readdirSync(logsDir);

  if (files.length === 0) {
    console.log(colorize('No log files to clear.', 'yellow'));
    return;
  }

  console.log(colorize('⚠️  This will delete all log files!', 'red'));
  console.log(colorize(`Files to delete: ${files.join(', ')}`, 'yellow'));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(colorize('Are you sure? (y/N): ', 'yellow'), (answer) => {
    if (answer.toLowerCase() === 'y') {
      files.forEach((file) => {
        const filePath = path.join(logsDir, file);
        fs.unlinkSync(filePath);
        console.log(colorize(`Deleted: ${file}`, 'red'));
      });
      console.log(colorize('✅ All logs cleared!', 'green'));
    } else {
      console.log(colorize('Cancelled.', 'yellow'));
    }
    rl.close();
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  viewLogs();
} else {
  const command = args[0];

  switch (command) {
    case 'view':
      if (args[1]) {
        viewFile(args[1]);
      } else {
        console.log(colorize('Please specify a filename.', 'red'));
        console.log(
          colorize(
            'Usage: node scripts/view-logs.js view <filename>',
            'yellow',
          ),
        );
      }
      break;

    case 'tail':
      if (args[1]) {
        const lines = args[2] ? parseInt(args[2]) : 20;
        viewFile(args[1], true, lines);
      } else {
        console.log(colorize('Please specify a filename.', 'red'));
        console.log(
          colorize(
            'Usage: node scripts/view-logs.js tail <filename> [lines]',
            'yellow',
          ),
        );
      }
      break;

    case 'watch':
      if (args[1]) {
        watchFile(args[1]);
      } else {
        console.log(colorize('Please specify a filename.', 'red'));
        console.log(
          colorize(
            'Usage: node scripts/view-logs.js watch <filename>',
            'yellow',
          ),
        );
      }
      break;

    case 'clear':
      clearLogs();
      break;

    default:
      // If first arg is a filename, view it
      if (fs.existsSync(path.join(logsDir, command))) {
        viewFile(command);
      } else {
        console.log(colorize(`Unknown command or file: ${command}`, 'red'));
        console.log(
          colorize('Available commands: view, tail, watch, clear', 'yellow'),
        );
      }
  }
}
