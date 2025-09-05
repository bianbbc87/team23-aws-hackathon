#!/usr/bin/env node

import './server';

console.log(`
🤖 Amazon Q Screen Automation Prototype (MCP Architecture)
=========================================================

This prototype demonstrates the MCP-based architecture with:
✅ Screen Analysis MCP - AWS Rekognition + Claude 3.5 Sonnet
✅ Action Execution MCP - macOS Accessibility API integration
✅ AI Planning MCP - Intelligent workflow orchestration
✅ Voice feedback using Amazon Polly
✅ RESTful API and WebSocket support

MCP Server Architecture:
- Screen Analysis: Captures and analyzes screen content
- Action Execution: Performs precise screen interactions
- AI Planning: Creates and adapts intelligent workflows

Usage:
- HTTP API: POST /api/execute-command with {"command": "your instruction"}
- WebSocket: Connect to ws://localhost:3000 for real-time interaction
- Health check: GET /api/health

Example commands:
- "Take a screenshot"
- "Click the send button"
- "Type hello world"
- "Scroll down 3 times"

Note: AWS credentials configured with profile 'amazonq'
`);
