import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface AiAssistantApiProps {
  lambdaFunction: lambda.Function;
}

export class AiAssistantApi extends Construct {
  public readonly api: apigateway.RestApi;
  public readonly url: string;

  constructor(scope: Construct, id: string, props: AiAssistantApiProps) {
    super(scope, id);

    // REST API 생성
    this.api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: 'AI Assistant API',
      description: '4-Core AI Assistant API Gateway',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
      },
      endpointConfiguration: {
        types: [apigateway.EndpointType.REGIONAL],
      },
    });

    // Lambda 통합
    const lambdaIntegration = new apigateway.LambdaIntegration(props.lambdaFunction);

    // /generate 리소스 및 POST 메소드만 추가 (CORS는 defaultCorsPreflightOptions에서 자동 처리)
    const generateResource = this.api.root.addResource('generate');
    generateResource.addMethod('POST', lambdaIntegration);

    // API URL
    this.url = this.api.url;
  }
}
