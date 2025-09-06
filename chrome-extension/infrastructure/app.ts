#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AiAssistantStack } from './ai-assistant-stack';

const app = new cdk.App();

new AiAssistantStack(app, 'AiAssistantStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  description: '4-Core AI Assistant Chrome Extension Infrastructure',
});
