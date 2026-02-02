<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

# Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# 📊 Winston Logger Service

A comprehensive logging solution for your Service Manager application using Winston with daily rotation, structured logging, and HTTP request/response tracking.

## 🚀 Features

- ✅ **Structured JSON logging** with timestamps and metadata
- ✅ **Daily log rotation** with compression and retention policies
- ✅ **Multiple log levels** (error, warn, info, debug, verbose)
- ✅ **HTTP request/response interceptor** for API tracking
- ✅ **Sensitive data redaction** (tokens, passwords, etc.)
- ✅ **Performance monitoring** with slow request detection
- ✅ **Multiple output destinations** (console, files, audit logs)
- ✅ **Request tracing** with unique IDs for debugging
- ✅ **Log viewing utilities** with colorized output

## 📁 Directory Structure

project/
├── logs/ # Log files directory
│ ├── service-2024-01-15.log
│ ├── error-2024-01-15.log
│ ├── audit-2024-01-15.log
│ ├── exceptions-2024-01-15.log
│ └── rejections-2024-01-15.log
├── src/
│ ├── config/
│ │ └── winston.config.ts # Logger configuration
│ ├── common/
│ │ ├── logger/
│ │ │ ├── custom-logger.service.ts
│ │ │ └── logger.module.ts
│ │ └── interceptors/
│ │ ├── logging.interceptor.ts
│ │ └── winston-logging.interceptor.ts
│ └── main.ts # App bootstrap with logger
└── scripts/
└── view-logs.js # Log viewing utility

## 🔧 Installation

```bash
# Install required packages
npm install winston nest-winston winston-daily-rotate-file
npm install -D @types/winston
```

## ⚙️ Configuration

1. Winston Configuration (src/config/winston.config.ts)
   Configure log levels, transports, and rotation policies:

```typescript
// See src/config/winston.config.ts for complete configuration
// Customize: log levels, file sizes, retention periods, formats 2. Environment Variables
```

2. Environment Variables
   Add to your .env file:

.env

# Logging

LOG_LEVEL=info # error, warn, info, debug, verbose
LOG_RETENTION_DAYS=14 # Keep logs for 14 days
LOG_MAX_SIZE=20m # Max file size 20MB
NODE_ENV=development # Affects log verbosity

## 🚦 Usage

Basic Logging in Services

```typescript
import { Injectable } from '@nestjs/common';
import { CustomLogger } from './common/logger/custom-logger.service';

@Injectable()
export class YourService {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext('YourService');
  }

  async someMethod() {
    // Different log levels
    this.logger.log('Information message');
    this.logger.debug('Debug information');
    this.logger.warn('Warning message');
    this.logger.error('Error occurred', error.stack);

    // With metadata
    this.logger.log('User action', {
      userId: 123,
      action: 'login',
      ip: '192.168.1.1',
    });

    // Service-specific methods
    this.logger.serviceAction('START_SERVICE', 'nginx', {
      pid: 12345,
      command: 'systemctl start nginx',
    });
  }
}
```

# HTTP Request/Response Logging

The interceptor automatically logs all HTTP requests and responses:

```typescript
// Request logged automatically:
// 📥 GET /api/services - IP: 192.168.1.100 - Agent: curl/7.68.0

// Response logged automatically:
// 📤 GET /api/services 200 - 45ms

// Slow requests trigger warnings:
// ⚠️ Slow request: GET /api/reports took 1200ms

// Errors are logged with stack traces:
// ❌ POST /api/users 500 - Internal Server Error
```

## 📋 Available npm Scripts

Add these to your package.json:

```json
{
  "scripts": {
    "logs:view": "node scripts/view-logs.js",
    "logs:tail": "node scripts/view-logs.js tail",
    "logs:watch": "node scripts/view-logs.js watch",
    "logs:clear": "node scripts/view-logs.js clear",
    "logs:stats": "node scripts/view-logs.js stats"
  }
}
```

## 🖥️ Log Management Commands

View Available Logs

```bash

# List all log files with details

npm run logs:view

# Direct script execution

node scripts/view-logs.js
```

Output:

text
📁 LOG FILES DIRECTORY
══════════════════════════════════════════════════════════
Available Log Files
══════════════════════════════════════════════════════════

1. 🔄 service-2024-01-15.log
   Size: 45.2 KB | Modified: 2024-01-15 10:30:25

2. ❌ error-2024-01-15.log
   Size: 2.1 KB | Modified: 2024-01-15 10:31:15

3. 📊 audit-2024-01-15.log
   Size: 8.7 KB | Modified: 2024-01-15 10:32:45

Total: 3 files, 56.0 KB

# View Specific Log File

```bash
# View entire file with pagination
npm run logs:view service-2024-01-15.log

# View last 20 lines
npm run logs:tail service-2024-01-15.log

# View last 50 lines
npm run logs:tail service-2024-01-15.log 50
```

# Real-time Log Monitoring

```bash

# Watch a log file for new entries

npm run logs:watch service-2024-01-15.log
```

Output (real-time):

```text
👀 Watching service-2024-01-15.log for changes...
Press Ctrl+C to stop

2024-01-15T10:45:23.456Z INFO GET /api/services - 200 OK - 32ms
Context: HTTP
Time: 32ms

2024-01-15T10:45:24.123Z ERROR Database connection timeout
Context: DatabaseService
```

# Clear Logs

```bash

# Remove all log files (with confirmation)

npm run logs:clear
```

## 📊 Log File Types

```table
| File Pattern          |  Purpose                     | Retention|  | Max Size |
service-%DATE%.log      |  General application logs    |  14 days |  |   20MB   |
error-%DATE%.log        |  Error logs only             |  30 days |  |   20MB   |
audit-%DATE%.log        |  Service management actions  |  90 days |  |   10MB   |
exceptions-%DATE%.log   |  Uncaught exceptions         |  30 days |  |   20MB   |
rejections-%DATE%.log   |  Promise rejections          |  30 days |  |   20MB   |
```

## 🔍 Log Format Examples

# Console Output (Development)

```bash
text
[Nest] 12345  - 01/15/2024, 10:30:25 AM   LOG [HTTP] GET /api/services - 200 OK - 45ms
[Nest] 12345  - 01/15/2024, 10:30:26 AM   ERROR [DatabaseService] Connection failed - timeout
```

# File Output (JSON - Production)

```json
{
  "level": "info",
  "message": "GET /api/services - 200 OK",
  "timestamp": "2024-01-15T10:30:25.123Z",
  "context": "HTTP",
  "requestId": "1705307425123-abc123def",
  "method": "GET",
  "url": "/api/services",
  "statusCode": 200,
  "responseTime": 45,
  "ip": "192.168.1.100"
}
```

## ⚡ Performance Monitoring

- The logger automatically monitors request performance:

- Slow Request Threshold: 500ms (configurable)

- Memory Usage: Logs high memory usage warnings

- Error Rate: Tracks error frequency

Example warning:

```json
{
  "level": "warn",
  "message": "Slow API Response",
  "requestId": "1705307425123-abc123def",
  "responseTime": 1200,
  "threshold": 500,
  "url": "/api/reports/generate"
}
```

## 🔒 Security Features

Sensitive Data Redaction
The following fields are automatically redacted from logs:

- Passwords (password, passwd, pwd)

- Tokens (token, access_token, refresh_token)

- API Keys (api_key, apikey, secret)

- Authorization headers

- Credit card numbers

- Personal identification

Example:

```json
// Before redaction:
{
  "password": "mySecret123",
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// After redaction:
{
  "password": "***REDACTED***",
  "authorization": "***REDACTED***"
}
```

## 🐛 Debugging with Request IDs

Each HTTP request gets a unique ID for tracing:

```bash

# Search for specific request in logs

grep "1705307425123-abc123def" logs/service-2024-01-15.log
```

Output shows complete request lifecycle:

```json
{"requestId":"1705307425123-abc123def","type":"REQUEST_IN","method":"POST","url":"/api/services/start"}
{"requestId":"1705307425123-abc123def","type":"RESPONSE_OUT","statusCode":200,"responseTime":150}
```

## 📈 Monitoring Scripts

Get Log Statistics

```bash
# Create a stats script (scripts/log-stats.js)
node scripts/log-stats.js
```

Example output:

📊 LOG STATISTICS
══════════════════════════════════════════════════════════
Total Files: 5
Total Size: 128.4 MB
Oldest Log: 2024-01-01
Newest Log: 2024-01-15

📈 Error Trends:
• Last 24h: 12 errors
• Last 7d: 45 errors
• Peak hour: 14:00-15:00

🐌 Slow Requests:
• >500ms: 23 requests
• >1000ms: 5 requests
• Slowest: 2450ms (GET /api/reports)

## 🔄 Log Rotation

- Logs are automatically rotated:

- Daily: New file each day at midnight

- Size-based: New file when reaching max size

- Compressed: Old logs are gzipped

- Cleanup: Old files automatically deleted based on retention policy

## 🛠️ Customization

- Adjust Log Levels by Environment

```typescript
// In winston.config.ts
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
```

- Add Custom Transports

```typescript
// Send logs to external services
transports: [
  // Console
  new winston.transports.Console(),

  // File
  new winston.transports.File(),

  // External: Elasticsearch, Datadog, Slack, etc.
  // new ElasticsearchTransport({ node: 'http://localhost:9200' }),
  // new SlackWebhookTransport({ webhookUrl: process.env.SLACK_WEBHOOK }),
];
```

- Modify Retention Policies

```typescript
new DailyRotateFile({
  filename: 'logs/service-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d', // Keep for 30 days
  maxSize: '50m', // 50MB per file
  zippedArchive: true, // Compress old logs
});
```

## 🚨 Troubleshooting

Common Issues & Solutions
No logs directory

```bash
mkdir -p logs
npm run start:dev
```

Logs not appearing

- Check LOG_LEVEL environment variable

- Verify Winston is configured in main.ts

- Ensure interceptor is registered in AppModule

Large log files

```bash

# Adjust rotation settings in winston.config.ts

maxSize: '20m', # Reduce from 50MB
maxFiles: '7d', # Keep only 7 days
```

Missing request IDs

- Ensure WinstonLoggingInterceptor is applied globally

- Check that the interceptor is generating IDs

## 📚 Best Practices

1. Use appropriate log levels:

- error: System failures, unrecoverable errors

- warn: Unexpected but handled situations

- info: Normal operations, user actions

- debug: Detailed information for troubleshooting

- verbose: Trace-level information

2. Include context in logs:

```typescript
// Good
this.logger.log('User logged in', { userId: 123, ip: '192.168.1.1' });

// Better
this.logger.log('User action: login', {
  context: 'AuthService',
  userId: 123,
  ip: '192.168.1.1',
  userAgent: request.headers['user-agent'],
});
```

Monitor log growth:

```bash

# Check log sizes weekly

du -sh logs/

# Set up alerts for rapid log growth

# (log size increases > 100MB in 24h)
```

## 🔗 Related Components

- CustomLogger: Enhanced logger service with additional methods

- WinstonLoggingInterceptor: HTTP request/response logger

- LoggingInterceptor: Basic HTTP logger (fallback)

- LoggerModule: Global logger module setup

- view-logs.js: Log management utility script
