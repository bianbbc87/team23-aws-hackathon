"""
4-Core AI Assistant Lambda Function
Clean Architecture Implementation
"""

import json
import logging
from typing import Dict, Any, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

# Domain Layer
@dataclass
class GenerationRequest:
    action: str
    content: str
    task_type: str

@dataclass
class GenerationResponse:
    success: bool
    result: Optional[str] = None
    error: Optional[str] = None

# Repository Interface
class BedrockRepository(ABC):
    @abstractmethod
    def generate_content(self, prompt: str) -> str:
        pass

# Use Case
class ContentGenerationUseCase:
    def __init__(self, bedrock_repo: BedrockRepository):
        self.bedrock_repo = bedrock_repo
        
    def execute(self, request: GenerationRequest) -> GenerationResponse:
        try:
            prompt = self._build_prompt(request.content, request.task_type)
            result = self.bedrock_repo.generate_content(prompt)
            return GenerationResponse(success=True, result=result)
        except Exception as e:
            logging.error(f"Content generation failed: {e}")
            return GenerationResponse(success=False, error=str(e))
    
    def _build_prompt(self, content: str, task_type: str) -> str:
        prompts = {
            'summary': f"""다음 내용을 핵심 포인트 위주로 간결하고 명확하게 요약해주세요.

요약할 내용:
{content}

요약 형식:
• 핵심 포인트 1
• 핵심 포인트 2
• 핵심 포인트 3""",

            'email': f"""다음 내용을 바탕으로 전문적인 이메일을 작성해주세요. 불필요한 설명 없이 이메일 내용만 작성하세요.

기반 내용:
{content}

작성 규칙:
- 제목 라인 포함
- 간결하고 명확한 본문
- 정중한 톤앤매너
- 실무에서 바로 사용 가능한 형태

이메일:""",

            'idea': f"""다음 주제에 대해 창의적이고 실용적인 아이디어를 5-7개 생성해주세요.

주제:
{content}

아이디어 형식:
💡 아이디어 1: [제목]
   - 설명: [구체적인 설명]
   - 장점: [주요 장점]""",

            'report': f"""다음 정보를 바탕으로 체계적이고 전문적인 보고서를 작성해주세요.

보고서 정보:
{content}

보고서 형식:
📊 [보고서 제목]

1. 개요
2. 주요 내용
3. 결론 및 제안"""
        }
        
        return prompts.get(task_type, f"다음 내용을 바탕으로 적절한 문서를 작성해주세요:\n\n{content}")

# Infrastructure Layer
class AWSBedrockRepository(BedrockRepository):
    def __init__(self):
        import boto3
        self.client = boto3.client('bedrock-runtime', region_name='us-east-1')
        self.model_id = 'amazon.nova-micro-v1:0'
    
    def generate_content(self, prompt: str) -> str:
        request_body = {
            "messages": [
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ],
            "inferenceConfig": {
                "maxTokens": 3000,
                "temperature": 0.7
            }
        }
        
        response = self.client.invoke_model(
            modelId=self.model_id,
            body=json.dumps(request_body)
        )
        
        response_body = json.loads(response['body'].read())
        return response_body['output']['message']['content'][0]['text']

# Presentation Layer
class LambdaHandler:
    def __init__(self):
        self.use_case = ContentGenerationUseCase(AWSBedrockRepository())
        self.logger = logging.getLogger()
        self.logger.setLevel(logging.INFO)
    
    def handle(self, event: Dict[str, Any], context: Any) -> Dict[str, Any]:
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Content-Type': 'application/json'
        }
        
        try:
            # OPTIONS 요청 처리
            if event.get('httpMethod') == 'OPTIONS':
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'CORS OK'})
                }
            
            # 요청 파싱
            body = json.loads(event.get('body', '{}'))
            request = GenerationRequest(
                action=body.get('action', ''),
                content=body.get('content', ''),
                task_type=body.get('taskType', 'summary')
            )
            
            # 유효성 검사
            if request.action != 'generateContent':
                return self._error_response(headers, 'Invalid action', 400)
            
            if not request.content.strip():
                return self._error_response(headers, 'Content is required', 400)
            
            # 비즈니스 로직 실행
            response = self.use_case.execute(request)
            
            if response.success:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'success': True,
                        'result': response.result
                    })
                }
            else:
                return self._error_response(headers, response.error, 500)
                
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            return self._error_response(headers, 'Internal server error', 500)
    
    def _error_response(self, headers: Dict[str, str], message: str, status_code: int) -> Dict[str, Any]:
        return {
            'statusCode': status_code,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'error': message
            })
        }

# Lambda Entry Point
handler = LambdaHandler()

def lambda_handler(event, context):
    return handler.handle(event, context)
