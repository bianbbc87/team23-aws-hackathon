import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AiAssistantApi } from './constructs/ai-assistant-api';
import { AiAssistantLambda } from './constructs/ai-assistant-lambda';

export class AiAssistantStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda 함수 생성
    const aiLambda = new AiAssistantLambda(this, 'AiAssistantLambda');

    // API Gateway 생성
    const api = new AiAssistantApi(this, 'AiAssistantApi', {
      lambdaFunction: aiLambda.function,
    });

    // 출력
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'AI Assistant API URL',
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: aiLambda.function.functionName,
      description: 'Lambda Function Name',
    });
  }
}
